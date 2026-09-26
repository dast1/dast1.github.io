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
  'writing/capacity-is-not-consent/index.html',
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
  'work/index.html',
  'work/graph-rag-smaller-model/index.html',
  'work/local-ai-intelligent-scaffolding/index.html',
  'work/industrial-predictive-maintenance-review/index.html',
  'work/industrial-asset-monitoring/index.html',
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

const unpublished = [
  'writing/unpublished-note/index.html',
  'writing/can-distributed-ai-still-be-governed/index.html',
];

for (const draftPath of unpublished) {
  if (await exists(join(dist, draftPath))) fail(`draft essay was published: ${draftPath}`);
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
  if (!html.includes(`property="og:image" content="${siteOrigin}/`)) {
    fail(`${label} og image is not absolute`);
  }
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
for (const phrase of ['Texas', 'who decides, who carries the risk']) {
  if (!home.includes(phrase)) fail(`home is missing ${phrase}`);
}
if (!home.includes('Dastan Aitzhanov | AI Systems, Governance, and Ownership')) {
  fail('home title is not the site title');
}
if (!home.includes('how should that authority be granted, bounded, verified, and revoked?')) {
  fail('home is missing the lead question');
}
for (const phrase of ['Selected work', 'Research threads', 'Delegated authority']) {
  if (!home.includes(phrase)) fail(`home is missing ${phrase}`);
}

const essay = await readFile(join(dist, 'writing/context-is-the-product/index.html'), 'utf8');
if (!essay.includes('footnotes') && !essay.includes('data-footnotes')) {
  fail('context essay is missing footnotes');
}
if (!essay.includes('min read')) fail('context essay is missing reading time');

const writingIndex = await readFile(join(dist, 'writing/index.html'), 'utf8');
if (!writingIndex.includes('Capacity is not consent')) {
  fail('writing index is missing the approved governance essay');
}
for (const id of [
  'delegated-authority',
  'personal-ai',
  'distributed-governance',
  'ownership-incentives',
]) {
  if (!writingIndex.includes(`id="${id}"`)) fail(`writing index is missing thread ${id}`);
}

const workIndex = await readFile(join(dist, 'work/index.html'), 'utf8');
for (const phrase of ['Independent investigations', 'Public technical work']) {
  if (!workIndex.includes(phrase)) fail(`work index is missing ${phrase}`);
}
if (!workIndex.includes('Co-authored technical work at AWS')) {
  fail('work index is missing public technical attribution');
}

const legacyProjects = await readFile(join(dist, 'projects/index.html'), 'utf8');
if (!legacyProjects.includes('noindex,follow')) fail('legacy projects index is indexable');
if (!legacyProjects.includes('href="https://dast1.github.io/work/"')) {
  fail('legacy projects index does not canonicalize to work');
}

const governanceEssay = await readFile(
  join(dist, 'writing/capacity-is-not-consent/index.html'),
  'utf8',
);
if (!governanceEssay.includes('A workload crosses more than one boundary')) {
  fail('governance essay is missing its diagram');
}

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
for (const slug of [
  'unpublished-note',
  'can-distributed-ai-still-be-governed',
]) {
  if (rss.includes(slug)) fail(`rss includes the draft: ${slug}`);
}

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
for (const path of ['/writing/', '/ideas/', '/work/', '/about/']) {
  if (!sitemapText.includes(`${siteOrigin}${path}`)) fail(`sitemap missing ${path}`);
}
for (const slug of [
  'unpublished-note',
  'can-distributed-ai-still-be-governed',
]) {
  if (sitemapText.includes(slug)) fail(`sitemap includes the draft: ${slug}`);
}
if (sitemapText.includes('/projects/')) fail('sitemap includes legacy projects routes');
if (sitemapText.includes('/404')) fail('sitemap includes the 404');

// 403 and 429 mean the host refused an automated request, not that the link is dead.
// Report them, but do not block a deploy on another site's bot policy.
const tolerated = new Set([403, 429]);
for (const url of external) {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    if (tolerated.has(response.status)) {
      console.warn(`warning: external ${url} returned ${response.status} (not treated as a failure)`);
    } else if (response.status >= 400) {
      fail(`external ${url} returned ${response.status}`);
    }
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
