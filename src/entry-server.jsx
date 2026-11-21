import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { BASE } from './lib/base.js';
import { allRoutes, blogs, primeItems } from './lib/content.js';
import { projects } from './data/portfolio.js';
import { fallbackJobs } from './data/cmsFallback.js';

primeItems(import.meta.glob('./data/generated/items/*.json', { eager: true, import: 'default' }));

export const routes = [...allRoutes(projects), ...fallbackJobs.map((j) => `/career/${j.slug}`)];

/** Pages managed in the admin panel. Their prerendered HTML is only a fallback snapshot:
 *  on the live server api/render.php serves them with fresh database content. */
export const cmsRoutes = new Set([
  '/blog', '/portfolio', '/career',
  ...blogs.map((b) => `/${b.slug}`),
  ...projects.map((p) => `/portfolio/${p.slug}`),
  ...fallbackJobs.map((j) => `/career/${j.slug}`),
]);

export function render(url) {
  const helmetContext = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={BASE + url} basename={BASE || undefined}>
        <App />
      </StaticRouter>
    </HelmetProvider>,
  );
  const { helmet } = helmetContext;
  const head = [helmet.title, helmet.priority, helmet.meta, helmet.link, helmet.script].map((h) => h.toString()).join('\n    ');
  return { html, head };
}
