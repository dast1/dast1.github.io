// Post-build translation.
//
// Reads the English pages in dist/, translates the human-visible text, and writes
// a copy of the site under dist/<lang>/ for each language below. Translations are
// cached in translations/<lang>.json, keyed by a hash of the English fragment, so
// only new or changed text is ever sent to the API. Edit a cached entry by hand to
// correct a translation; it stays until the English source changes.
//
// With no API credential, untranslated fragments fall back to English and the
// script prints a warning. Pass --strict to fail instead (npm run translate).

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { parse } from 'node-html-parser';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const cacheDir = join(here, '..', 'translations');
const siteOrigin = 'https://dast1.github.io';
const MODEL = 'claude-opus-5';
const strict = process.argv.includes('--strict');

// The languages the author reads and can review.
const LANGS = {
  ru: { name: 'Russian', htmlLang: 'ru', label: 'Русский', locale: 'ru_RU' },
  tr: { name: 'Turkish', htmlLang: 'tr', label: 'Türkçe', locale: 'tr_TR' },
};
const LANG_CODES = Object.keys(LANGS);

// Elements whose inner HTML is translated as one unit, so sentences with inline
// links stay whole. An element counts only if it has no block descendant.
const BLOCK = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'dt', 'dd', 'figcaption',
  'blockquote', 'td', 'th', 'caption', 'summary', 'label', 'button', 'title', 'legend',
];
const BLOCK_SELECTOR = BLOCK.join(',');
const SKIP = new Set(['script', 'style', 'pre', 'code', 'kbd', 'samp', 'svg', 'math', 'noscript', 'template']);
const ATTRS = [
  ['meta[name="description"]', 'content'],
  ['meta[property="og:title"]', 'content'],
  ['meta[property="og:description"]', 'content'],
  ['meta[property="og:image:alt"]', 'content'],
  ['meta[name="twitter:title"]', 'content'],
  ['meta[name="twitter:description"]', 'content'],
  ['img[alt]', 'alt'],
  ['[aria-label]', 'aria-label'],
  ['a[title], abbr[title], button[title]', 'title'],
  ['[placeholder]', 'placeholder'],
];

const SYSTEM = `You translate fragments of a personal website from English into the language named in the request. The author writes in a plain, precise, first-person voice about AI systems, governance, and ownership. Keep that register: short sentences, no marketing tone, nothing added, nothing summarized.

Rules:
1. Return exactly one translation per input item, in the same order, as JSON: {"translations": [...]}.
2. Items may contain inline HTML tags and entities. Reproduce every tag and every attribute exactly as given, in the same order. Translate only the human-readable text between and around tags. Never add, remove, reorder, or alter tags, attribute values, URLs, or entities such as &amp;.
3. Leave untouched: code, file paths, URLs, email addresses, numbers, and product or model names (for example Laya, Jev, Llama, Databricks, Amazon Web Services, GitHub, MetaVi Labs, Astro). Transliterate the author's name, Dastan Aitzhanov, only where that is the convention for the target language; otherwise keep it in Latin script.
4. Write dates in the target language's usual format.
5. Prefer commas, colons, and separate sentences over em dashes.
6. Keep each translation close to the source in length and structure.`;

const hasCredential = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
// CI sets TRANSLATE_SPEND to "false" on pull-request builds so only master pays.
const maySpend = process.env.TRANSLATE_SPEND !== 'false';
// Two retries per request is plenty; a billing or auth failure should surface in seconds, not minutes.
const client = hasCredential && maySpend ? new Anthropic({ maxRetries: 1 }) : null;
// Set on the first fatal API error so the rest of the run falls back to English instead of
// failing the build. A deploy must never depend on the translation service being available.
let apiFailure = null;
let consecutiveFailures = 0;
console.log(`translate: credential ${hasCredential ? 'present' : 'absent'}, spending ${client ? 'enabled' : 'disabled'}`);

const hash = (lang, text) => createHash('sha256').update(`${lang}\n${text}`).digest('hex').slice(0, 16);
const tagSequence = (s) => (s.match(/<[^>]+>/g) ?? []).join('');
const hasLetters = (s) => /\p{L}/u.test(s);
const isOpaque = (s) => /^\S+@\S+\.\S+$/.test(s) || /^https?:\/\/\S+$/.test(s);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function loadCache(lang) {
  const file = join(cacheDir, `${lang}.json`);
  if (!existsSync(file)) return {};
  return JSON.parse(await readFile(file, 'utf8'));
}

async function saveCache(lang, cache) {
  await mkdir(cacheDir, { recursive: true });
  const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(join(cacheDir, `${lang}.json`), `${JSON.stringify(sorted, null, 2)}\n`);
}

function isSkipped(node) {
  for (let n = node; n; n = n.parentNode) {
    if (n.nodeType !== 1) continue;
    const tag = n.rawTagName?.toLowerCase();
    if (SKIP.has(tag)) return true;
    if (n.getAttribute?.('translate') === 'no') return true;
    if (n.classList?.contains('notranslate')) return true;
  }
  return false;
}

// Collect translation units from a parsed page, in document order.
// Each unit is { kind, node, attr?, source }.
function collectUnits(root) {
  const units = [];
  const leaves = new Set();
  for (const el of root.querySelectorAll(BLOCK_SELECTOR)) {
    if (isSkipped(el)) continue;
    if (el.querySelector(BLOCK_SELECTOR)) continue;
    const source = el.innerHTML.trim();
    if (!source || !hasLetters(source) || isOpaque(source)) continue;
    leaves.add(el);
    units.push({ kind: 'html', node: el, source });
  }
  const insideLeaf = (node) => {
    for (let n = node.parentNode; n; n = n.parentNode) if (leaves.has(n)) return true;
    return false;
  };
  const visit = (node) => {
    if (node.nodeType === 3) {
      const source = node.rawText.trim();
      if (source && hasLetters(source) && !isOpaque(source) && !insideLeaf(node) && !isSkipped(node)) {
        units.push({ kind: 'text', node, source });
      }
      return;
    }
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(root);
  for (const [selector, attr] of ATTRS) {
    for (const el of root.querySelectorAll(selector)) {
      const source = (el.getAttribute(attr) ?? '').trim();
      if (!source || !hasLetters(source) || isOpaque(source)) continue;
      units.push({ kind: 'attr', node: el, attr, source });
    }
  }
  return units;
}

async function requestTranslations(lang, items) {
  const body = {
    model: MODEL,
    max_tokens: 32000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [
      {
        role: 'user',
        content: JSON.stringify({ target_language: LANGS[lang].name, items }),
      },
    ],
  };
  const schema = {
    type: 'object',
    properties: { translations: { type: 'array', items: { type: 'string' } } },
    required: ['translations'],
    additionalProperties: false,
  };
  let message;
  try {
    message = await client.messages
      .stream({ ...body, output_config: { format: { type: 'json_schema', schema } } })
      .finalMessage();
  } catch (error) {
    // If this account or model rejects structured output, fall back to plain JSON.
    if (!(error instanceof Anthropic.BadRequestError)) throw error;
    message = await client.messages.stream(body).finalMessage();
  }
  if (message.stop_reason === 'refusal') {
    throw new Error(`translation refused (${message.stop_details?.category ?? 'unknown'})`);
  }
  if (message.stop_reason === 'max_tokens') {
    throw new Error('translation truncated: raise max_tokens or lower the batch size');
  }
  const text = message.content.find((block) => block.type === 'text')?.text ?? '';
  const json = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const parsed = JSON.parse(json);
  const out = parsed.translations;
  if (!Array.isArray(out) || out.length !== items.length) {
    throw new Error(`expected ${items.length} translations, received ${out?.length ?? 'none'}`);
  }
  return out;
}

function chunk(items, maxItems = 40, maxChars = 12000) {
  const batches = [];
  let current = [];
  let size = 0;
  for (const item of items) {
    if (current.length && (current.length >= maxItems || size + item.length > maxChars)) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(item);
    size += item.length;
  }
  if (current.length) batches.push(current);
  return batches;
}

// Fill the cache for every unit on the page. Returns counts for the report.
async function ensureTranslated(lang, cache, units, stats) {
  const missing = [...new Set(units.map((u) => u.source).filter((s) => !cache[hash(lang, s)]))];
  if (!missing.length) return;
  if (!client || apiFailure) {
    stats.untranslated += missing.length;
    return;
  }
  for (const batch of chunk(missing)) {
    if (apiFailure) {
      stats.untranslated += batch.length;
      continue;
    }
    let translated;
    try {
      translated = await requestTranslations(lang, batch);
      consecutiveFailures = 0;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      consecutiveFailures += 1;
      // Auth, billing, and permission errors will not fix themselves mid-run, and neither will
      // an API that fails several times in a row: stop calling and keep the build moving.
      const fatal =
        error instanceof Anthropic.AuthenticationError ||
        error instanceof Anthropic.PermissionDeniedError ||
        /credit balance|billing/i.test(message) ||
        consecutiveFailures >= 5;
      if (fatal && !apiFailure) {
        apiFailure = message;
        console.warn(`warning: translation API unavailable, the rest of this build stays English: ${message}`);
      } else if (!fatal) {
        console.warn(`warning: [${lang}] a batch failed and stays English: ${message}`);
      }
      stats.untranslated += batch.length;
      stats.errors += 1;
      continue;
    }
    batch.forEach((source, i) => {
      const out = translated[i];
      if (tagSequence(out) !== tagSequence(source)) {
        stats.mismatched += 1;
        console.warn(`warning: [${lang}] markup changed in translation, kept English: ${source.slice(0, 80)}`);
        return;
      }
      cache[hash(lang, source)] = { en: source, t: out };
      stats.translated += 1;
    });
    await saveCache(lang, cache);
  }
}

function apply(lang, cache, units) {
  for (const unit of units) {
    const entry = cache[hash(lang, unit.source)];
    if (!entry) continue;
    if (unit.kind === 'html') unit.node.set_content(entry.t);
    else if (unit.kind === 'text') unit.node.rawText = unit.node.rawText.replace(unit.source, entry.t);
    else unit.node.setAttribute(unit.attr, entry.t);
  }
}

const pagePath = (file) => `/${relative(dist, dirname(file)).split('\\').join('/')}/`.replace(/^\/\.\//, '/').replace('//', '/');

// Pages available per language once the run completes: hand-written translations
// found before generation, plus everything this run generates.
const available = Object.fromEntries(LANG_CODES.map((code) => [code, new Set()]));
const pageExists = (lang, path) => lang === 'en' || available[lang].has(path);

function isInternalPage(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  const clean = href.split('#')[0].split('?')[0];
  if (/\.[a-z0-9]+$/i.test(clean)) return false; // files: rss.xml, images, css
  return true;
}

// Language links, hreflang, canonical, and internal links for one page.
function decorate(root, lang, path) {
  const head = root.querySelector('head');
  const html = root.querySelector('html');
  if (lang !== 'en') {
    html?.setAttribute('lang', LANGS[lang].htmlLang);
    root.querySelector('meta[property="og:locale"]')?.setAttribute('content', LANGS[lang].locale);
    const url = `${siteOrigin}/${lang}${path}`;
    root.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    root.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
    for (const a of root.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (!isInternalPage(href) || href.startsWith(`/${lang}/`)) continue;
      const clean = href.split('#')[0].split('?')[0];
      if (pageExists(lang, clean)) a.setAttribute('href', `/${lang}${href}`);
    }
  }
  for (const link of root.querySelectorAll('link[rel="alternate"][hreflang]')) link.remove();
  const langsHere = ['en', ...LANG_CODES.filter((code) => pageExists(code, path))];
  const alternates = langsHere
    .map((code) => {
      const href = code === 'en' ? `${siteOrigin}${path}` : `${siteOrigin}/${code}${path}`;
      const hreflang = code === 'en' ? 'en' : LANGS[code].htmlLang;
      return `<link rel="alternate" hreflang="${hreflang}" href="${href}">`;
    })
    .concat(`<link rel="alternate" hreflang="x-default" href="${siteOrigin}${path}">`)
    .join('\n    ');
  head?.insertAdjacentHTML('beforeend', `\n    ${alternates}\n  `);
  const nav = root.querySelector('[data-lang-nav]');
  if (nav) {
    const items = langsHere
      .map((code) => {
        const href = code === 'en' ? path : `/${code}${path}`;
        const label = code === 'en' ? 'English' : LANGS[code].label;
        const current = code === lang ? ' aria-current="page"' : '';
        const hreflang = code === 'en' ? 'en' : LANGS[code].htmlLang;
        return `<li><a href="${href}" lang="${hreflang}" hreflang="${hreflang}" data-lang="${code}"${current}>${label}</a></li>`;
      })
      .join('');
    nav.querySelector('ul')?.set_content(items);
    nav.querySelector('[data-lang-current]')?.set_content(lang === 'en' ? 'English' : LANGS[lang].label);
  }
}

async function main() {
  if (!existsSync(dist)) throw new Error('dist/ not found; run astro build first');
  const files = (await walk(dist)).filter((file) => file.endsWith('index.html'));
  const sources = files.filter((file) => {
    const rel = relative(dist, file).split('\\').join('/');
    if (rel.includes('projects/')) return false; // legacy routes, kept out of the sitemap
    return !LANG_CODES.some((code) => rel.startsWith(`${code}/`));
  });
  const preexisting = files.filter((file) => !sources.includes(file));
  const paths = sources.map(pagePath);
  const handWritten = Object.fromEntries(LANG_CODES.map((code) => [code, new Set()]));
  for (const file of preexisting) {
    const rel = relative(dist, file).split('\\').join('/');
    const lang = LANG_CODES.find((code) => rel.startsWith(`${code}/`));
    if (!lang) continue;
    const path = `/${rel.slice(lang.length + 1).replace(/index\.html$/, '')}`;
    handWritten[lang].add(path);
    available[lang].add(path);
  }
  for (const lang of LANG_CODES) for (const path of paths) available[lang].add(path);
  const stats = Object.fromEntries(LANG_CODES.map((code) => [code, { translated: 0, untranslated: 0, mismatched: 0, errors: 0, pages: 0 }]));

  await Promise.all(
    LANG_CODES.map(async (lang) => {
      const cache = await loadCache(lang);
      const generated = new Set(paths.filter((path) => !handWritten[lang].has(path)));
      const queue = sources.filter((file) => generated.has(pagePath(file)));
      const translatePage = async (file) => {
        const path = pagePath(file);
        const root = parse(await readFile(file, 'utf8'), { comment: true });
        const units = collectUnits(root);
        await ensureTranslated(lang, cache, units, stats[lang]);
        apply(lang, cache, units);
        decorate(root, lang, path);
        const target = join(dist, lang, relative(dist, file));
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, root.toString());
        stats[lang].pages += 1;
      };
      // A few pages in flight per language keeps a first run to minutes, not an hour.
      const workers = Array.from({ length: 3 }, async () => {
        while (queue.length) await translatePage(queue.shift());
      });
      await Promise.all(workers);
    }),
  );

  // English pages and hand-written translations get language links and hreflang.
  for (const file of sources) {
    const root = parse(await readFile(file, 'utf8'), { comment: true });
    decorate(root, 'en', pagePath(file));
    await writeFile(file, root.toString());
  }
  for (const file of preexisting) {
    const rel = relative(dist, file).split('\\').join('/');
    const lang = LANG_CODES.find((code) => rel.startsWith(`${code}/`));
    if (!lang) continue;
    const path = `/${rel.slice(lang.length + 1).replace(/index\.html$/, '')}`;
    const root = parse(await readFile(file, 'utf8'), { comment: true });
    decorate(root, lang, path);
    await writeFile(file, root.toString());
  }

  // Sitemap: add the translated URLs.
  for (const file of await walk(dist)) {
    if (!/sitemap-\d+\.xml$/.test(file)) continue;
    let xml = await readFile(file, 'utf8');
    const extra = [];
    for (const lang of LANG_CODES) {
      for (const path of paths) {
        const loc = `${siteOrigin}/${lang}${path}`;
        if (pageExists(lang, path) && !xml.includes(`<loc>${loc}</loc>`)) extra.push(`<url><loc>${loc}</loc></url>`);
      }
    }
    xml = xml.replace('</urlset>', `${extra.join('')}</urlset>`);
    await writeFile(file, xml);
  }

  for (const lang of LANG_CODES) {
    const s = stats[lang];
    console.log(`${lang}: ${s.pages} pages, ${s.translated} new translations, ${s.untranslated} left in English, ${s.mismatched} markup mismatches, ${s.errors} failed batches`);
  }
  const untranslated = LANG_CODES.reduce((n, lang) => n + stats[lang].untranslated, 0);
  if (untranslated) {
    const why = apiFailure
      ? `the translation API failed: ${apiFailure}`
      : !hasCredential
        ? 'no ANTHROPIC_API_KEY is set'
        : !maySpend
          ? 'spending is disabled on this build'
          : 'some batches failed';
    console.warn(`warning: ${untranslated} fragments left in English because ${why}`);
    if (strict) process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
