/**
 * Content extractor (one-time import tool): reads the pages of the old static HTML site
 * and converts them into structured JSON that the React templates render.
 *
 * The old HTML site has been removed from this project; its files are kept in
 * ../UltraModern-legacy-html-backup.zip. To re-import, unzip it somewhere and run:
 *
 *   npm run extract -- <path-to-unzipped-legacy-site>
 *
 * Output: src/data/generated/ (overwrites the JSON there, including manual edits).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGACY_DIR = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!LEGACY_DIR || !fs.existsSync(LEGACY_DIR) || !fs.readdirSync(LEGACY_DIR).some((f) => f.endsWith('.html'))) {
  console.error('Usage: npm run extract -- <folder with the legacy *.html pages>');
  process.exit(1);
}
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'data', 'generated');

const STATIC_PAGES = new Set([
  'index', 'about', 'contact', 'career', 'blog', 'blog2', 'privacy-policy',
]);
const CONTENT_PAGES = ['about', 'contact', 'career'];

/* ------------------------------------------------------------------ slugs */

function slugify(name) {
  return name
    .replace(/['’]/g, '')
    .replace(/\.+$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/** Keep the legacy URL when it is already URL-safe so indexed links keep working. */
function slugForFile(file) {
  const base = file.replace(/\.html$/i, '');
  if (/^[A-Za-z0-9-]+$/.test(base)) return base;
  return slugify(base);
}

const htmlFiles = fs.readdirSync(LEGACY_DIR).filter((f) => f.toLowerCase().endsWith('.html'));

// legacy href (lower-cased, decoded, no .html) -> new route
const linkMap = new Map();
for (const f of htmlFiles) {
  const base = f.replace(/\.html$/i, '');
  const route = base === 'index' ? '/' : base === 'blog2' ? '/services' : `/${slugForFile(f)}`;
  linkMap.set(base.toLowerCase(), route);
}
linkMap.set('clinte', '/clients');

function mapHref(href) {
  if (!href) return null;
  href = href.trim();
  if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(href)) return href;
  let decoded = href;
  try { decoded = decodeURIComponent(href); } catch { /* keep raw */ }
  const [pathPart, hash] = decoded.split('#');
  const base = pathPart.replace(/^\.?\//, '').replace(/\.html?$/i, '').trim().toLowerCase();
  if (!base) return hash ? `#${hash}` : '/';
  const mapped = linkMap.get(base);
  if (mapped) return mapped + (hash ? `#${hash}` : '');
  return `/${pathPart.replace(/^\.?\//, '')}`;
}

function mapSrc(src) {
  if (!src) return null;
  src = src.trim();
  if (/^(https?:|data:|\/\/)/i.test(src)) return src;
  let decoded = src;
  try { decoded = decodeURIComponent(src); } catch { /* keep raw */ }
  return '/' + decoded.replace(/^(\.\.\/|\.\/|\/)+/, '');
}

/* --------------------------------------------------------------- helpers */

const clean = (s) => (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

const INLINE_OK = new Set(['a', 'strong', 'b', 'em', 'u', 'br', 'code', 'sup', 'sub']);
const BLOCK_OK = new Set([
  'p', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'img', 'figure', 'figcaption', 'hr',
]);

/** Serialise a node's children keeping only safe, semantic markup. */
function sanitize($, node, { block = false } = {}) {
  let out = '';
  $(node).contents().each((_, child) => {
    if (child.type === 'text') {
      out += child.data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return;
    }
    if (child.type !== 'tag') return;
    const tag = child.tagName.toLowerCase();
    if (['script', 'style', 'i', 'svg', 'button', 'input', 'select', 'textarea', 'form', 'iframe'].includes(tag)) return;
    if (tag === 'br') { out += '<br>'; return; }
    if (tag === 'b') { out += `<strong>${sanitize($, child, { block })}</strong>`; return; }
    if (tag === 'a') {
      const href = mapHref($(child).attr('href'));
      const inner = sanitize($, child, { block });
      if (!href || href === '#') { out += inner; return; }
      const ext = /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
      out += `<a href="${href.replace(/"/g, '&quot;')}"${ext}>${inner}</a>`;
      return;
    }
    if (block && tag === 'img') {
      const src = mapSrc($(child).attr('src'));
      if (src) out += `<img src="${src}" alt="${clean($(child).attr('alt') || '').replace(/"/g, '&quot;')}" loading="lazy">`;
      return;
    }
    if (INLINE_OK.has(tag) || (block && BLOCK_OK.has(tag))) {
      out += `<${tag}>${sanitize($, child, { block })}</${tag}>`;
      return;
    }
    if (block && tag === 'div') {
      const cls = $(child).attr('class') || '';
      const inner = sanitize($, child, { block });
      if (/highlight|callout|note|tip|info|box/i.test(cls) && clean($(child).text())) {
        out += `<aside class="callout">${inner}</aside>`;
      } else {
        out += inner;
      }
      return;
    }
    if (block && /^h[1-6]$/.test(tag)) {
      out += `<h3>${sanitize($, child)}</h3>`;
      return;
    }
    out += sanitize($, child, { block });
  });
  return out;
}

const inlineHtml = ($, node) => clean(sanitize($, node));
const textOf = ($, node) => clean($(node).text());

function iconOf($, node) {
  const i = $(node).find('i[class*="fa"]').first();
  if (i.length) {
    return clean(i.attr('class')).split(' ').filter((c) => /^fa/.test(c)).join(' ');
  }
  const emoji = $(node).find('[class*="icon"]').first();
  const t = emoji.length ? textOf($, emoji) : '';
  if (t && t.length <= 4) return `emoji:${t}`;
  return null;
}

function readMeta($) {
  const meta = {
    title: clean($('title').first().text()),
    description: clean($('meta[name="description"]').attr('content')),
    keywords: clean($('meta[name="keywords"]').attr('content')) || undefined,
    robots: clean($('meta[name="robots"]').attr('content')) || undefined,
    canonical: clean($('link[rel="canonical"]').attr('href')) || undefined,
    ogTitle: clean($('meta[property="og:title"]').attr('content')) || undefined,
    ogDescription: clean($('meta[property="og:description"]').attr('content')) || undefined,
    ogType: clean($('meta[property="og:type"]').attr('content')) || undefined,
    ogImage: clean($('meta[property="og:image"]').attr('content')) || undefined,
  };
  const jsonLd = [];
  $('script[type="application/ld+json"]').each((_, s) => {
    const raw = $(s).html();
    try {
      jsonLd.push(JSON.parse(raw));
    } catch {
      // Repair the two typo patterns found on the old site (a line break inside a URL,
      // a missing comma at the end of a line). Anything else is reported and skipped.
      const repaired = raw
        .replace(/(https?:\/\/[^"\s]+)\s*\n\s*"/g, '$1"')
        .replace(/"[ \t]*\n(\s*)"/g, '",\n$1"');
      try {
        jsonLd.push(JSON.parse(repaired));
        repairedLd.push(clean($('title').first().text()).slice(0, 60));
      } catch {
        invalidLd.push(clean($('title').first().text()).slice(0, 60));
      }
    }
  });
  if (jsonLd.length) meta.jsonLd = jsonLd;
  return meta;
}
const invalidLd = [];
const repairedLd = [];

function stripChrome($) {
  $('script, style, noscript, link, nav, header.site-header, footer, .top-bar, .popup-overlay, [class*="chatbot"], [id*="chatbot"], .get-in-touch-btn, .floating-shapes, [class*="particle"], .blob1, .blob2, [class*="deco-circle"], .cta-dots').remove();
  $('*').contents().filter((_, n) => n.type === 'comment').remove();
}

/* -------------------------------------------------- generic block parser */

const RX = {
  faq: /(^|[-_ ])(faq-item|accordion-item)\b|faq-item|accordion-item/i,
  job: /job-card/i,
  stat: /stat-item|stat-box|stat-card|counter-item|milestone-item|stats-item/i,
  chip: /tech-item|growth-level|benefit-item|Our-service-item|chip|pill|tag-item|feature-tag|skill-tag|industry-tag/i,
  badge: /badge|label|eyebrow|subtitle-tag|section-tag/i,
  btn: /btn|cta-primary|cta-secondary|button/i,
};

const cls = ($, n) => $(n).attr('class') || '';

function cardContainer($, heading, blockRoot) {
  let node = heading.parent;
  if (!node || node === blockRoot) return heading;
  const pCount = (n) => $(n).find('p, li').length;
  // climb while the parent still holds only this one heading and no extra copy
  while (
    node.parent && node.parent !== blockRoot &&
    $(node.parent).find('h3, h4').length === 1 &&
    !$(node.parent).find('h2').length &&
    pCount(node.parent) === pCount(node)
  ) {
    node = node.parent;
  }
  if ($(node).find('h3, h4').length !== 1 || $(node).find('h2').length) return heading;
  if ($(node).find('[class*="stat-item"], [class*="stat-box"], [class*="counter"]').length) return heading;
  // a block holding a whole chip grid is a sub-section, not a card
  if ($(node).find('*').filter((_, x) => RX.chip.test(cls($, x))).length >= 3) return heading;
  const others = $(node).clone();
  others.find('h3, h4').remove();
  if (!clean(others.text())) return heading; // heading only -> it is a sub-heading
  return node;
}

function parseCard($, node) {
  const h = $(node).find('h3, h4').first();
  const card = {
    icon: iconOf($, node),
    title: inlineHtml($, h),
    text: [],
    list: [],
  };
  const num = $(node).find('[class*="number"], [class*="step-num"], [class*="count"]').first();
  if (num.length && /^\d{1,2}$/.test(textOf($, num))) card.step = textOf($, num);
  $(node).find('p').each((_, p) => { const t = inlineHtml($, p); if (t) card.text.push(t); });
  $(node).find('li').each((_, li) => { const t = inlineHtml($, li); if (t) card.list.push(t); });
  if (!card.text.length && !card.list.length) {
    // text sitting directly in spans / divs
    const c = $(node).clone();
    c.find('h3, h4, i, [class*="number"], [class*="icon"]').remove();
    const t = clean(c.text());
    if (t) card.text.push(t);
  }
  const img = $(node).find('img').first();
  if (img.length && !card.icon) card.image = mapSrc(img.attr('src'));
  const link = $(node).is('a') ? $(node) : $(node).find('a').last();
  if (link.length && /more|explore|learn|view/i.test(textOf($, link))) card.href = mapHref(link.attr('href'));
  if (!card.list.length) delete card.list;
  return card;
}

function parseFaq($, node) {
  const qEl = $(node).find('[class*="question"], [class*="header"], h3, h4, button').first();
  const q = clean(qEl.clone().find('i, [class*="icon"]').remove().end().text());
  const aEl = $(node).find('[class*="answer"], [class*="content"], [class*="body"]').first();
  let a = '';
  if (aEl.length) a = clean(sanitize($, aEl, { block: true }));
  else {
    const c = $(node).clone();
    c.find('[class*="question"], [class*="header"], h3, h4, button').remove();
    a = clean(sanitize($, c, { block: true }));
  }
  return { q, a };
}

function parseStat($, node) {
  const numEl = $(node).find('[class*="number"], [class*="count"], [class*="value"], strong, h3, h4').first();
  let n = numEl.attr('data-target') ? numEl.attr('data-target') + '+' : textOf($, numEl);
  const label = textOf($, $(node).find('[class*="label"], [class*="text"], p, span').not(numEl).last());
  if (/^0\+?$/.test(n) && numEl.attr('data-target')) n = numEl.attr('data-target') + '+';
  return { value: n, label };
}

function parseJob($, node) {
  const title = textOf($, $(node).find('[class*="job-title"]').first()) || textOf($, $(node).find('h3').first());
  const meta = [];
  $(node).find('[class*="meta-item"], [class*="job-meta"] span').each((_, m) => { const t = textOf($, m); if (t && !meta.includes(t)) meta.push(t); });
  const tags = [];
  $(node).find('[class*="tag"]').filter((_, m) => !$(m).find('[class*="tag"]').length).each((_, m) => { const t = textOf($, m); if (t && !tags.includes(t)) tags.push(t); });
  const salary = textOf($, $(node).find('[class*="salary"]').first());
  const level = textOf($, $(node).find('[class*="company-details"] h4').first());
  const featured = $(node).find('[class*="featured"]').length > 0;
  const desc = textOf($, $(node).find('p').first());
  return { title, level, meta, tags, salary, featured, desc: desc || undefined };
}

function parseBlock($, root) {
  const consumed = new Set();
  const parts = [];
  let title = null;
  let badge = null;

  // pre-compute card containers
  const cardNodes = new Set();
  $(root).find('h3, h4').each((_, h) => {
    if ($(h).closest('[class*="faq"], [class*="accordion"], [class*="job-card"]').length) return;
    const c = cardContainer($, h, root);
    if (c !== h) cardNodes.add(c);
  });

  const push = (type, parent, item) => {
    const last = parts[parts.length - 1];
    if (last && last.type === type && last._parent === parent) last.items.push(item);
    else parts.push({ type, _parent: parent, items: [item] });
  };

  function walk(node) {
    if (node.type !== 'tag' || consumed.has(node)) return;
    const $n = $(node);
    const c = cls($, node);
    const tag = node.tagName.toLowerCase();

    if (tag === 'h1') return;
    if (tag === 'h2') {
      if (!title) title = inlineHtml($, node);
      else push('subheading', 'h', inlineHtml($, node));
      return;
    }
    if (!title && RX.badge.test(c) && !$n.find('h2, h3, p').length && textOf($, node).length < 70) {
      badge = textOf($, node);
      return;
    }
    if (RX.faq.test(c)) { const f = parseFaq($, node); if (f.q) push('faq', node.parent, f); return; }
    if (RX.job.test(c)) { push('jobs', node.parent, parseJob($, node)); return; }
    if (RX.stat.test(c) && textOf($, node).length < 80) {
      const s = parseStat($, node); if (s.value) push('stats', node.parent, s); return;
    }
    if (cardNodes.has(node)) { push('cards', node.parent, parseCard($, node)); return; }
    if (RX.chip.test(c) && !$n.find('h3, h4, p').length && !$n.find('*').filter((_, x) => RX.chip.test(cls($, x))).length) {
      const t = textOf($, node); if (t) push('chips', node.parent, { icon: iconOf($, node), text: t }); return;
    }
    if (tag === 'p') { const t = inlineHtml($, node); if (t) push('text', 'p', t); return; }
    if (tag === 'ul' || tag === 'ol') {
      const items = [];
      $n.children('li').each((_, li) => { const t = inlineHtml($, li); if (t) items.push(t); });
      if (items.length) parts.push({ type: 'list', items });
      return;
    }
    if (tag === 'h3' || tag === 'h4' || tag === 'h5') { const t = inlineHtml($, node); if (t) push('subheading', 'h', t); return; }
    if (tag === 'a' && RX.btn.test(c)) {
      const t = textOf($, node); if (t) push('buttons', node.parent, { text: t, href: mapHref($n.attr('href')) }); return;
    }
    if (tag === 'img') {
      const src = mapSrc($n.attr('src'));
      if (src) parts.push({ type: 'image', items: [{ src, alt: clean($n.attr('alt')) }] });
      return;
    }
    // loose text directly inside a container (e.g. <div class="faq-answer">text</div>)
    $n.contents().each((_, ch) => {
      if (ch.type === 'text') {
        const t = clean(ch.data);
        if (t.length > 40) push('text', 'p', t.replace(/</g, '&lt;'));
      } else walk(ch);
    });
  }

  $(root).contents().each((_, ch) => walk(ch));
  parts.forEach((p) => delete p._parent);
  return { title, badge, parts };
}

function sectionKind(className, block) {
  const c = className.toLowerCase();
  if (/cta/.test(c)) return 'cta';
  if (/faq/.test(c) || block.parts.some((p) => p.type === 'faq')) return 'faq';
  if (/process|how-it-works|how-apply|steps|hiring/.test(c)) return 'process';
  if (/stats-bar/.test(c)) return 'stats';
  if (/jobs/.test(c)) return 'jobs';
  return 'default';
}

function parseHero($) {
  const hero = $('[class*="hero"]').filter((_, n) => $(n).find('h1').length > 0).first();
  const h1 = hero.length ? hero.find('h1').first() : $('h1').first();
  const out = {
    title: clean(h1.text().replace(/\s+/g, ' ')),
    image: null,
    badge: null,
    text: [],
  };
  if (hero.length) {
    const img = hero.find('img').first();
    if (img.length) out.image = mapSrc(img.attr('src'));
    const b = hero.find('[class*="badge"]').first();
    if (b.length) out.badge = textOf($, b);
    hero.find('p').each((_, p) => { const t = inlineHtml($, p); if (t) out.text.push(t); });
  }
  return { hero: hero.length ? hero : null, data: out };
}

function parseGenericPage(file) {
  const html = fs.readFileSync(path.join(LEGACY_DIR, file), 'utf8');
  const $ = cheerio.load(html);
  const meta = readMeta($);
  stripChrome($);
  const { hero, data: heroData } = parseHero($);
  if (hero) hero.remove();

  // drop the repeated "OUR SERVICE" tag cloud + generic get-in-touch block
  $('section, div').filter((_, n) => {
    const h = clean($(n).children('.container').children('.section-title').text() || $(n).children('.section-title').text());
    return /^OUR SERVICES?$|^COMPLETE SERVICE OFFERINGS$/i.test(h);
  }).remove();
  $('.Our-services-section, .get-in-touch-section').remove();

  const candidates = $('section, [class*="stats-bar"], [class*="jobs-container"], [class*="jobs-section"]').toArray();
  const roots = candidates.filter((n) => !candidates.some((o) => o !== n && $(o).find(n).length));

  const sections = [];
  for (const root of roots) {
    const className = cls($, root);
    const block = parseBlock($, root);
    if (!block.title && !block.parts.length) continue;
    sections.push({ kind: sectionKind(className, block), title: block.title, badge: block.badge, parts: block.parts });
  }
  return { meta, hero: heroData, sections };
}

/** Some legacy posts have <li> items without a <ul>; wrap each run of them in a proper list. */
function wrapOrphanListItems(html) {
  const $ = cheerio.load(`<div id="x">${html}</div>`, null, false);
  $('li').each((_, li) => {
    const parent = li.parent && li.parent.tagName ? li.parent.tagName.toLowerCase() : '';
    if (parent === 'ul' || parent === 'ol' || $(li).parent().is('[data-wrapped]')) return;
    const run = [li];
    let next = li.next;
    while (next && (next.type === 'text' ? !next.data.trim() : next.tagName === 'li')) {
      if (next.type !== 'text') run.push(next);
      next = next.next;
    }
    const ul = $('<ul data-wrapped></ul>');
    $(li).before(ul);
    run.forEach((n) => ul.append($(n)));
  });
  $('[data-wrapped]').removeAttr('data-wrapped');
  return $('#x').html();
}

/* ------------------------------------------------------------------ blogs */

function parseBlog(file) {
  const html = fs.readFileSync(path.join(LEGACY_DIR, file), 'utf8');
  const $ = cheerio.load(html);
  const meta = readMeta($);
  stripChrome($);
  const title = clean($('.UMT-blog-title').first().text());
  const metaSpans = $('.UMT-blog-meta span').toArray().map((s) => textOf($, s).replace(/^[^\w]+/u, '').trim());
  const cover = mapSrc($('.UMT-header-image').first().attr('src'));
  const contentEl = $('.UMT-blog-content').first();
  contentEl.find('[class*="social"], [class*="share"], .author-box, [class*="author-card"]').remove();
  const content = wrapOrphanListItems(sanitize($, contentEl, { block: true })
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim());
  const firstP = clean(contentEl.find('p').first().text());
  const words = clean(contentEl.text()).split(' ').length;
  return {
    meta,
    title,
    date: metaSpans[0] || '',
    author: metaSpans[1] || 'UltraModern Team',
    cover,
    excerpt: firstP.length > 220 ? firstP.slice(0, 217).replace(/\s+\S*$/, '') + '…' : firstP,
    readingMinutes: Math.max(2, Math.round(words / 220)),
    content,
  };
}

/* ------------------------------------------------------------------- run */

const services = [];
const jobs = [];
const blogs = [];
const redirects = [];

for (const file of htmlFiles) {
  const base = file.replace(/\.html$/i, '');
  if (STATIC_PAGES.has(base)) continue;
  const html = fs.readFileSync(path.join(LEGACY_DIR, file), 'utf8');
  const slug = slugForFile(file);
  if (slug !== base) redirects.push({ from: base, to: slug });

  if (html.includes('UMT-blog-title')) {
    blogs.push({ slug, ...parseBlog(file) });
  } else if (/jobs?$/i.test(base)) {
    jobs.push({ slug, ...parseGenericPage(file) });
  } else {
    services.push({ slug, ...parseGenericPage(file) });
  }
}

// newest blog posts first (dates are free-form, fall back to file order)
const ts = (d) => { const t = Date.parse(d.replace(/(\d+)(st|nd|rd|th)/, '$1')); return Number.isNaN(t) ? 0 : t; };
blogs.sort((a, b) => ts(b.date) - ts(a.date));

/* --------------------------------------------------------- privacy policy */
function parsePrivacy() {
  const $ = cheerio.load(fs.readFileSync(path.join(LEGACY_DIR, 'privacy-policy.html'), 'utf8'));
  const meta = readMeta($);
  stripChrome($);
  const sections = [];
  $('.terms-card').each((_, card) => {
    const $c = $(card);
    const title = clean($c.find('h2').first().text());
    const tag = clean($c.find('.section-tag').first().text());
    $c.find('.section-header').remove();
    const html = sanitize($, card, { block: true }).replace(/<p>\s*<\/p>/g, '').replace(/\s{2,}/g, ' ').trim();
    if (title) sections.push({ id: slugify(title), title, tag, html });
  });
  return { meta, sections };
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const write = (name, data) => fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data, null, 1));
write('privacy.json', parsePrivacy());

// Original <head> SEO data of the hand-built pages, so titles, descriptions, keywords,
// Open Graph tags and JSON-LD stay exactly as they were on the old site.
const STATIC_META = { '/': 'index', '/about': 'about', '/contact': 'contact', '/career': 'career', '/blog': 'blog' };
write('static-meta.json', Object.fromEntries(Object.entries(STATIC_META).map(([route, file]) => [
  route,
  readMeta(cheerio.load(fs.readFileSync(path.join(LEGACY_DIR, `${file}.html`), 'utf8'))),
])));
write('static-pages.json', CONTENT_PAGES.map((slug) => ({
  slug,
  ...parseGenericPage(`${slug}.html`),
})));
write('services.json', services);
write('jobs.json', jobs);
write('blogs.json', blogs);
write('redirects.json', redirects);

// Per-page content chunks (loaded on demand by the client) + a small index for listings.
const ITEMS_DIR = path.join(OUT_DIR, 'items');
fs.rmSync(ITEMS_DIR, { recursive: true, force: true });
fs.mkdirSync(ITEMS_DIR, { recursive: true });
const itemFile = (slug) => `${slug.toLowerCase()}.json`;
for (const [type, list] of [['service', services], ['job', jobs], ['blog', blogs]]) {
  for (const item of list) fs.writeFileSync(path.join(ITEMS_DIR, itemFile(item.slug)), JSON.stringify({ type, ...item }));
}
fs.writeFileSync(path.join(ITEMS_DIR, 'privacy-policy.json'), JSON.stringify({ type: 'privacy', ...parsePrivacy() }));
write('index.json', {
  services: services.map((s) => ({ slug: s.slug, title: s.hero.title, description: s.meta.description })),
  jobs: jobs.map((j) => ({ slug: j.slug, title: j.hero.title, description: j.meta.description })),
  blogs: blogs.map(({ slug, title, date, author, cover, excerpt, readingMinutes, meta }) => ({ slug, title, date, author, cover, excerpt, readingMinutes, description: meta.description })),
  redirects,
});

// coverage report so missing content is easy to spot
for (const s of [...services, ...jobs]) {
  const counts = s.sections.map((x) => `${x.kind[0]}${x.parts.length}`).join(' ');
  console.log(`${s.slug.padEnd(62)} ${String(s.sections.length).padStart(2)} sections  ${counts}`);
}
console.log(`\nservices: ${services.length}, jobs: ${jobs.length}, blogs: ${blogs.length}, redirects: ${redirects.length}`);
if (repairedLd.length) console.log(`Repaired malformed legacy JSON-LD on: ${[...new Set(repairedLd)].join(' | ')}`);
if (invalidLd.length) console.log(`Skipped unrepairable legacy JSON-LD on: ${[...new Set(invalidLd)].join(' | ')}`);
