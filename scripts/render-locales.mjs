// Post-build locale renderer.
//
// Reads English pages in dist/, applies human-approved text from
// translations/<lang>.json, and writes localized copies under dist/<lang>/.
// It never calls a translation service and never writes to the translation files.
// Missing entries fail the build so English cannot silently leak into a locale.

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const cacheDir = join(here, '..', 'translations');
const siteOrigin = 'https://dastan.aitzhanov.com';
// The languages the author reads and can review.
const LANGS = {
  ru: { name: 'Russian', htmlLang: 'ru', label: 'Русский', locale: 'ru_RU', languageLabel: 'Язык' },
  tr: { name: 'Turkish', htmlLang: 'tr', label: 'Türkçe', locale: 'tr_TR', languageLabel: 'Dil' },
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

console.log('locales: rendering approved translations (network and AI disabled)');

const hash = (lang, text) => createHash('sha256').update(`${lang}\n${text}`).digest('hex').slice(0, 16);
const ALLOWED_UNCHANGED = new Set([
  '<!DOCTYPE html>',
  '<a href="/rss.xml">RSS</a>',
  '<a href="https://github.com/dast1" rel="me">GitHub</a>',
  '<a href="mailto:dastan.aitzhanov@gmail.com">dastan.aitzhanov@gmail.com</a>',
  'Dastan Aitzhanov',
  '© 2026 Dastan Aitzhanov',
]);
// Word order changes across languages, so inline links may legitimately swap places.
// Compare the tags as a sorted multiset: added, removed, or altered tags still fail.
const tagSequence = (s) => (s.match(/<[^>]+>/g) ?? []).sort().join('');
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

function inspectTranslations(lang, cache, units, stats, path) {
  for (const source of new Set(units.map((unit) => unit.source))) {
    const entry = cache[hash(lang, source)];
    if (!entry) {
      stats.missing.add(`${path}: ${source.slice(0, 120)}`);
      continue;
    }
    if (entry.en !== source) stats.invalid.add(`${path}: source mismatch for ${source.slice(0, 80)}`);
    if (!entry.t || (entry.t === source && !ALLOWED_UNCHANGED.has(source))) {
      stats.invalid.add(`${path}: unapproved translation for ${source.slice(0, 80)}`);
    }
    if (tagSequence(entry.t) !== tagSequence(source)) stats.invalid.add(`${path}: markup mismatch for ${source.slice(0, 80)}`);
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

function localizeJsonLd(root, lang, path, cache) {
  const localizedUrl = `${siteOrigin}/${lang}${path}`;
  const visit = (value, key = '') => {
    if (Array.isArray(value)) return value.map((item) => visit(item));
    if (value && typeof value === 'object') {
      for (const [childKey, childValue] of Object.entries(value)) value[childKey] = visit(childValue, childKey);
      return value;
    }
    if (typeof value !== 'string') return value;
    if (key === 'inLanguage') return LANGS[lang].htmlLang;
    if ((key === 'url' || key === '@id' || key === 'mainEntityOfPage') && value === `${siteOrigin}${path}`) {
      return localizedUrl;
    }
    const entry = cache[hash(lang, value)];
    return entry?.t ?? value;
  };
  for (const script of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(script.innerHTML);
      script.set_content(JSON.stringify(visit(data)));
    } catch {
      // The build validator reports malformed structured data separately.
    }
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
    nav.querySelector('summary')?.setAttribute(
      'aria-label',
      lang === 'en' ? 'Language: English' : `${LANGS[lang].languageLabel}: ${LANGS[lang].label}`,
    );
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
  const stats = Object.fromEntries(LANG_CODES.map((code) => [code, { missing: new Set(), invalid: new Set(), pages: 0 }]));

  await Promise.all(
    LANG_CODES.map(async (lang) => {
      const cache = await loadCache(lang);
      const generated = new Set(paths.filter((path) => !handWritten[lang].has(path)));
      const queue = sources.filter((file) => generated.has(pagePath(file)));
      const translatePage = async (file) => {
        const path = pagePath(file);
        const root = parse(await readFile(file, 'utf8'), { comment: true });
        const units = collectUnits(root);
        inspectTranslations(lang, cache, units, stats[lang], path);
        apply(lang, cache, units);
        // Translating a block replaces its inline descendants. Re-collect attributes
        // afterward so accessibility labels inside translated links are applied to
        // the new nodes rather than to the detached English originals.
        apply(lang, cache, collectUnits(root).filter((unit) => unit.kind === 'attr'));
        localizeJsonLd(root, lang, path, cache);
        decorate(root, lang, path);
        const target = join(dist, lang, relative(dist, file));
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, root.toString());
        stats[lang].pages += 1;
      };
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
    console.log(`${lang}: ${s.pages} pages, ${s.missing.size} missing, ${s.invalid.size} invalid`);
    for (const message of [...s.missing, ...s.invalid].slice(0, 20)) console.error(`  - ${message}`);
    if (s.missing.size + s.invalid.size > 20) console.error(`  - …and ${s.missing.size + s.invalid.size - 20} more`);
  }
  const failures = LANG_CODES.reduce((n, lang) => n + stats[lang].missing.size + stats[lang].invalid.size, 0);
  if (failures) throw new Error(`${failures} locale entries need human review; localized pages were not approved for publication`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
