/**
 * Renders every route to static HTML so search engines (and users on slow
 * connections) get full content immediately; React then hydrates in the browser.
 *
 * Output (dist/):
 *   about.html, seo-company-in-indore.html, …   static pages served directly by Apache
 *   _snapshots/blog.html, _snapshots/portfolio/grovio.html, …
 *                                                CMS pages: api/render.php serves them with fresh
 *                                                database content and falls back to these snapshots
 *   _template.html                               empty app shell used by api/render.php
 *   _admin.html                                  shell for /admin (noindex)
 *   _routes.json                                 static routes, merged into the live sitemap
 *   404.html, sitemap.xml (static fallback)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const { render, routes, cmsRoutes } = await import(pathToFileURL(path.join(root, 'dist-server', 'entry-server.js')).href);
const SITE = 'https://www.ultramoderntechnologies.com';

// Replacer functions insert the markup literally (a string replacement would treat "$$", "$&" etc. specially).
const fill = ({ html, head }) => template.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => html);
const write = (rel, content) => {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

fs.rmSync(path.join(dist, '_snapshots'), { recursive: true, force: true });
const staticRoutes = [];
for (const route of routes) {
  const name = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  if (cmsRoutes.has(route)) {
    write(path.join('_snapshots', name), fill(render(route)));
  } else {
    write(name, fill(render(route)));
    staticRoutes.push(route);
  }
}

// 404 + app shells: rendered from scratch in the browser (data-csr), never hydrated
const csr = (html) => html.replace('<div id="root">', '<div id="root" data-csr="1">');
write('404.html', csr(fill(render('/__not-found__'))));
write('_template.html', template.replace('<!--app-head-->', '').replace('<!--app-html-->', ''));
write('_admin.html', csr(template
  .replace('<!--app-head-->', '<title>Admin | UltraModern Technologies</title>\n    <meta name="robots" content="noindex, nofollow" />')
  .replace('<!--app-html-->', '')));
write('_routes.json', JSON.stringify(staticRoutes));

// Static sitemap (fallback; the live one at /sitemap.xml comes from api/sitemap.php and includes CMS content)
const today = new Date().toISOString().slice(0, 10);
const prio = (r) => (r === '/' ? '1.0' : /^\/(services|products|portfolio|about|contact|blog|career)$/.test(r) ? '0.9' : r.includes('-in-indore') || r.includes('software') || r.startsWith('/products/') ? '0.8' : '0.6');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map((r) => `  <url><loc>${SITE}${r === '/' ? '/' : encodeURI(r)}</loc><lastmod>${today}</lastmod><priority>${prio(r)}</priority></url>`)
  .join('\n')}\n</urlset>\n`;
write('sitemap.xml', xml);

// local development artefacts that must never ship
fs.rmSync(path.join(dist, 'api', 'dev-router.php'), { force: true });
for (const entry of fs.readdirSync(path.join(dist, 'uploads'), { withFileTypes: true })) {
  if (entry.name !== '.htaccess') fs.rmSync(path.join(dist, 'uploads', entry.name), { recursive: true, force: true });
}

fs.rmSync(path.join(root, 'dist-server'), { recursive: true, force: true });
console.log(`Prerendered ${staticRoutes.length} static pages + ${routes.length - staticRoutes.length} CMS snapshots, 404, app shells and sitemap`);
