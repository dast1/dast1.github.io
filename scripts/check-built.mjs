import { access, readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const dist = join(root, 'dist');
const failures = [];

function fail(message) {
  failures.push(message);
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

const required = [
  'index.html',
  'about/index.html',
  'writing/index.html',
  'writing/context-is-the-product/index.html',
  'writing/the-computer-should-be-personal/index.html',
  'writing/what-owners-notice/index.html',
  'writing/tags/index.html',
  'writing/tags/context/index.html',
  'writing/tags/systems/index.html',
  'writing/tags/computing/index.html',
  'writing/tags/investing/index.html',
  'writing/tags/organizations/index.html',
  'ideas/index.html',
  'ideas/an-agent-needs-a-job/index.html',
  'ideas/routing-is-a-product-decision/index.html',
  'ideas/buy-the-decision/index.html',
  'projects/index.html',
  'projects/detecting-healthcare-fraud/index.html',
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml',
  'og.png',
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
  '404.html',
];

if (!(await exists(dist))) {
  console.error('dist/ is missing. Run npm run build first.');
  process.exit(1);
}

for (const file of required) {
  if (!(await exists(join(dist, file)))) fail(`missing ${file}`);
}

if (await exists(join(dist, 'writing/unpublished-note/index.html'))) {
  fail('draft essay was published');
}

const forbidden = [
  '949-9228',
  'ellegant',
  'lorem ipsum',
  'under construction',
  'particles.js',
  'bootstrap',
  'jquery',
  'data scientist',
  'coming soon',
  'solomon',
  'styleshout',
  'austin',
];

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const siteOrigin = 'https://dast1.github.io';

function resolveInternal(href) {
  const clean = href.split('#')[0]?.split('?')[0] ?? '';
  if (!clean.startsWith('/')) return null;
  if (/\.(xml|txt|png|svg|ico|webp|jpg|jpeg|css|js|woff2?)$/i.test(clean)) {
    return join(dist, clean.slice(1));
  }
  const rel = clean.replace(/^\//, '').replace(/\/$/, '');
  if (!rel) return join(dist, 'index.html');
  return join(dist, rel, 'index.html');
}

const external = new Set();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const label = relative(dist, file);
  const lowered = html.toLowerCase();
  for (const phrase of forbidden) {
    if (lowered.includes(phrase)) fail(`${label} contains forbidden text: ${phrase}`);
  }
  if (!/<html[^>]*\slang="en"/i.test(html)) fail(`${label} missing lang="en"`);
  if (!html.includes('id="content"')) fail(`${label} missing main landmark`);
  if (!html.includes('Skip to content')) fail(`${label} missing skip link`);
  const headings = html.match(/<h1[\s>]/g) ?? [];
  if (headings.length !== 1) fail(`${label} has ${headings.length} h1 elements`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${label} missing title`);
  if (!html.includes('name="description"')) fail(`${label} missing description`);
  if (!html.includes('rel="canonical"')) fail(`${label} missing canonical`);
  if (!html.includes('property="og:title"')) fail(`${label} missing og:title`);
  if (!html.includes('property="og:image"')) fail(`${label} missing og:image`);
  if (!html.includes('name="twitter:card"')) fail(`${label} missing twitter card`);
  if (!html.includes(`${siteOrigin}/og.png`)) fail(`${label} og image is not absolute`);
  if (label === '404.html') {
    if (!html.includes('noindex')) fail('404 is indexable');
  } else if (!html.includes(`href="${siteOrigin}/`) && !html.includes(`content="${siteOrigin}/`)) {
    fail(`${label} missing absolute site URL`);
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1] ?? '';
    if (href.startsWith('mailto:') || href.startsWith('#')) continue;
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!href.startsWith(siteOrigin)) external.add(href);
      continue;
    }
    const target = resolveInternal(href);
    if (target && !(await exists(target))) fail(`${label} broken link ${href}`);
  }
}

const home = await readFile(join(dist, 'index.html'), 'utf8');
for (const phrase of ['Databricks', 'Texas', 'Amazon Web Services']) {
  if (!home.includes(phrase)) fail(`home is missing ${phrase}`);
}
if (!home.includes('Dastan Aitzhanov — Technologist, Investor, Builder')) {
  fail('home title is not the site title');
}

const essay = await readFile(join(dist, 'writing/context-is-the-product/index.html'), 'utf8');
if (!essay.includes('footnotes') && !essay.includes('data-footnotes')) {
  fail('context essay is missing footnotes');
}
if (!essay.includes('min read')) fail('context essay is missing reading time');

const codeEssay = await readFile(
  join(dist, 'writing/the-computer-should-be-personal/index.html'),
  'utf8',
);
if (!codeEssay.includes('astro-code')) fail('code sample is not syntax highlighted');

const about = await readFile(join(dist, 'about/index.html'), 'utf8');
if (!about.includes('dastan.aitzhanov@gmail.com')) fail('about page is missing the email');

const rss = await readFile(join(dist, 'rss.xml'), 'utf8');
if (!rss.includes('<item>')) fail('rss has no items');
if (!rss.includes('/writing/context-is-the-product/')) fail('rss missing an essay');
if (rss.includes('unpublished-note')) fail('rss includes the draft');

const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${siteOrigin}/sitemap-index.xml`)) {
  fail('robots.txt missing sitemap');
}

const sitemap = await readFile(join(dist, 'sitemap-index.xml'), 'utf8');
if (!sitemap.includes('sitemap')) fail('sitemap index looks empty');
const sitemapFiles = files.filter((file) => file.endsWith('.xml') && file.includes('sitemap'));
const sitemapText = (
  await Promise.all(sitemapFiles.map(async (file) => readFile(file, 'utf8')))
).join('\n');
for (const path of ['/writing/', '/ideas/', '/projects/', '/about/']) {
  if (!sitemapText.includes(`${siteOrigin}${path}`)) fail(`sitemap missing ${path}`);
}
if (sitemapText.includes('unpublished-note')) fail('sitemap includes the draft');
if (sitemapText.includes('/404')) fail('sitemap includes the 404');

for (const url of external) {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    if (response.status >= 400) fail(`external ${url} returned ${response.status}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'request failed';
    fail(`external ${url} failed: ${message}`);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed:\n`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} pages, ${external.size} external links, feeds, and metadata.`);
