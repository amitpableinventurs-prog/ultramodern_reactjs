import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { BASE } from './lib/base.js';
import { hasItem, loadItem } from './lib/content.js';
import './styles/global.css';

const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={BASE || undefined}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

const root = document.getElementById('root');

(async () => {
  // Fetch this page's content chunk first so the first client render matches the prerendered HTML.
  let slug = window.location.pathname.slice(BASE.length).replace(/^\/+|\/+$/g, '');
  try { slug = decodeURIComponent(slug); } catch { /* keep raw */ }
  if (slug && !slug.includes('/') && hasItem(slug)) await loadItem(slug).catch(() => null);
  // Prerendered pages already contain matching markup: hydrate them.
  // Pages from the server renderer (api/render.php, marked data-csr) carry crawler-friendly
  // markup plus fresh CMS data, so React renders them from scratch instead.
  if (root.firstElementChild && !root.hasAttribute('data-csr')) hydrateRoot(root, tree);
  else createRoot(root).render(tree);
})();
