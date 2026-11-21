/**
 * SEO parity audit: compares the <head> SEO tags of every page of the old HTML site with
 * the prerendered page in dist/. Run after `npm run build`:
 *   node scripts/seo-audit.mjs
 *
 * The old site's tags are stored in scripts/seo-baseline.json (captured from the legacy
 * *.html pages before they were removed), so the audit no longer needs the old files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baselineFile = path.join(root, 'scripts', 'seo-baseline.json');
const dist = path.join(root, 'dist');

const slugify = (n) => n.replace(/['’]/g, '').replace(/\.+$/, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
const routeFile = (base) => {
  if (base === 'index') return 'index.html';
  const slug = /^[A-Za-z0-9-]+$/.test(base) ? base : slugify(base);
  return `${slug}.html`;
};
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

function head(html) {
  const $ = cheerio.load(html);
  const meta = (sel) => norm($(sel).attr('content'));
  const ld = [];
  $('script[type="application/ld+json"]').each((_, s) => {
    try {
      const d = JSON.parse($(s).html());
      (Array.isArray(d) ? d : [d]).forEach((x) => ld.push(JSON.stringify(x)));
    } catch { ld.push('INVALID'); }
  });
  return {
    title: norm($('title').first().text()),
    description: meta('meta[name="description"]'),
    keywords: meta('meta[name="keywords"]'),
    robots: meta('meta[name="robots"]'),
    canonical: norm($('link[rel="canonical"]').attr('href')),
    ogTitle: meta('meta[property="og:title"]'),
    ogDescription: meta('meta[property="og:description"]'),
    ogType: meta('meta[property="og:type"]'),
    gtm: /GTM-PZQ6K54T/.test($.html()),
    ld: ld.sort(),
  };
}

const rows = [];
const issues = { title: [], description: [], keywords: [], robots: [], ogTitle: [], ogDescription: [], ogType: [], gtm: [], ld: [], missing: [] };
let ldCount = 0;
// Optional: audit a running server instead of the build, e.g. `npm run seo:check -- http://127.0.0.1:8088`
const live = process.argv[2] && /^https?:\/\//.test(process.argv[2]) ? process.argv[2].replace(/\/$/, '') : null;
if (live) console.log(`Auditing live server: ${live}`);

// { "about.html": <head tags>, ... }. Recreate from a folder of legacy pages with:
//   node scripts/seo-audit.mjs --baseline <folder>
const bi = process.argv.indexOf('--baseline');
if (bi > -1) {
  const dir = path.resolve(process.argv[bi + 1] || '..');
  const out = {};
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html')).sort()) out[f] = head(fs.readFileSync(path.join(dir, f), 'utf8'));
  fs.writeFileSync(baselineFile, `${JSON.stringify(out, null, 1)}\n`);
  console.log(`Saved SEO baseline for ${Object.keys(out).length} legacy pages -> ${path.relative(root, baselineFile)}`);
  process.exit(0);
}
const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));

for (const f of Object.keys(baseline)) {
  const base = f.replace(/\.html$/, '');
  if (base === 'blog2') continue; // retired page, 301 to /services
  let html = null;
  if (live) {
    const url = base === 'index' ? '/' : `/${routeFile(base).replace(/\.html$/, '')}`;
    const res = await fetch(live + encodeURI(url), { redirect: 'follow' });
    if (res.ok) html = await res.text();
  } else {
    // static pages sit in dist/; CMS pages (blog) are snapshots served via api/render.php
    const target = [path.join(dist, routeFile(base)), path.join(dist, '_snapshots', routeFile(base))].find((p) => fs.existsSync(p));
    if (target) html = fs.readFileSync(target, 'utf8');
  }
  if (!html) { issues.missing.push(f); continue; }
  const a = baseline[f];
  const b = head(html);
  if (a.title && a.title !== b.title) issues.title.push(`${base}\n      old: ${a.title}\n      new: ${b.title}`);
  if (a.description && a.description !== b.description) issues.description.push(`${base}\n      old: ${a.description}\n      new: ${b.description}`);
  if (a.keywords && a.keywords !== b.keywords) issues.keywords.push(base);
  if (a.robots && a.robots !== b.robots) issues.robots.push(`${base} (old: ${a.robots} / new: ${b.robots})`);
  if (a.ogTitle && a.ogTitle !== b.ogTitle) issues.ogTitle.push(`${base} (old og:title: ${a.ogTitle} / new: ${b.ogTitle})`);
  if (a.ogDescription && a.ogDescription !== b.ogDescription) issues.ogDescription.push(base);
  if (a.ogType && a.ogType !== b.ogType) issues.ogType.push(base);
  if (!b.gtm) issues.gtm.push(base);
  const valid = a.ld.filter((t) => t !== 'INVALID');
  ldCount += valid.length;
  const lost = valid.filter((t) => !b.ld.includes(t));
  if (lost.length) issues.ld.push(`${base}: ${lost.length} legacy JSON-LD block(s) not carried over unchanged: ${lost.map((x) => JSON.parse(x)['@type']).join(', ')}`);
  rows.push(base);
}

console.log(`Compared ${rows.length} legacy pages with the new build (${ldCount} valid legacy JSON-LD blocks checked for exact match).\n`);
for (const [k, v] of Object.entries(issues)) {
  console.log(`${k.padEnd(12)} ${v.length ? `${v.length} differ` : 'OK'}`);
  v.slice(0, 60).forEach((x) => console.log('   - ' + x));
}
