import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const siteOrigin = 'https://dastan.aitzhanov.com';
const failures = [];

const locales = {
  ru: {
    ogLocale: 'ru_RU',
    forbidden: [
      'Back to reference',
      'An audit log is not a control',
      'An agent should have its own identity',
      'Capacity is not consent',
      'Open source the layer people need to trust',
      'интеллектуальные леса',
      '>О мне<',
      'обучения пограничной модели',
    ],
  },
  tr: {
    ogLocale: 'tr_TR',
    forbidden: ['Back to reference'],
  },
};

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

function fail(message) {
  failures.push(message);
}

for (const [lang, rules] of Object.entries(locales)) {
  const localeRoot = join(dist, lang);
  const files = (await walk(localeRoot)).filter((file) => file.endsWith('.html'));
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const label = relative(dist, file);
    const doc = parse(html);
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
    const ogLocale = doc.querySelector('meta[property="og:locale"]')?.getAttribute('content') ?? '';
    if (doc.querySelector('html')?.getAttribute('lang') !== lang) fail(`${label}: incorrect html lang`);
    if (!canonical.startsWith(`${siteOrigin}/${lang}/`)) fail(`${label}: incorrect localized canonical`);
    if (ogLocale !== rules.ogLocale) fail(`${label}: incorrect Open Graph locale`);
    if (!doc.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)) fail(`${label}: missing self hreflang`);

    for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const value = JSON.parse(script.innerHTML);
        const stack = [value];
        while (stack.length) {
          const item = stack.pop();
          if (Array.isArray(item)) stack.push(...item);
          else if (item && typeof item === 'object') {
            if ('inLanguage' in item && item.inLanguage !== lang) fail(`${label}: JSON-LD inLanguage is ${item.inLanguage}`);
            stack.push(...Object.values(item));
          }
        }
      } catch {
        fail(`${label}: malformed JSON-LD`);
      }
    }

    const body = doc.querySelector('body')?.innerHTML ?? '';
    for (const phrase of rules.forbidden) {
      if (body.includes(phrase)) fail(`${label}: contains untranslated or rejected copy: ${phrase}`);
    }
  }
}

if (failures.length) {
  console.error(`\n${failures.length} locale check(s) failed:\n`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log('Checked localized routes, metadata, structured data, and known translation regressions.');
