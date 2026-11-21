import { useEffect, useState } from 'react';

/**
 * Live content from the CMS API (/api), with build-time fallbacks.
 *
 * Order of preference for the first render:
 *   1. window.__UMT_DATA__  – injected by the server renderer (api/render.php) for this exact URL
 *   2. the fallback passed in (content bundled at build time; also used for prerendering)
 * After mounting, the component refreshes from the API unless (1) was used.
 * If the API is unreachable the fallback simply stays on screen.
 */
export const API_BASE = '/api';
const isBrowser = typeof window !== 'undefined';

function pageData(kind, slug) {
  if (!isBrowser) return null;
  const d = window.__UMT_DATA__;
  if (!d || d.kind !== kind) return null;
  if (d.path && d.path.toLowerCase() !== decodeURIComponent(window.location.pathname).replace(/\/+$/, '').toLowerCase()) return null;
  if (slug && d.slug && d.slug.toLowerCase() !== String(slug).toLowerCase()) return null;
  return d;
}

const cache = new Map();

async function getJson(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
  const isJson = (res.headers.get('content-type') || '').includes('json');
  // only the CMS's own JSON 404 means "deleted"; an HTML 404 means there is no API here (static host)
  if (res.status === 404 && isJson) return { notFound: true };
  if (!res.ok || !isJson) throw new Error(`API ${res.status}`);
  const data = await res.json();
  cache.set(path, data);
  return data;
}

/** List of published items: 'projects' | 'posts' | 'jobs'. */
export function useCmsList(type, fallback) {
  const injected = pageData(type);
  const [items, setItems] = useState(injected ? injected.items : fallback);
  useEffect(() => {
    if (injected) return undefined;
    let alive = true;
    getJson(`/${type}`)
      .then((d) => { if (alive && Array.isArray(d.items)) setItems(d.items); })
      .catch(() => { /* keep fallback */ });
    return () => { alive = false; };
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps
  return items;
}

/**
 * One item by slug. status: 'ok' | 'loading' | 'missing'.
 * `fallback` may be null (e.g. a post created after the last build).
 */
export function useCmsItem(type, kind, slug, fallback) {
  const injected = pageData(kind, slug);
  const [state, setState] = useState(() => {
    if (injected) return { item: injected.item, status: 'ok', slug };
    if (fallback) return { item: fallback, status: 'ok', slug };
    return { item: null, status: isBrowser ? 'loading' : 'missing', slug };
  });

  // a different slug (client-side navigation): start from its fallback again
  const current = state.slug === slug ? state : { item: fallback || null, status: fallback ? 'ok' : 'loading', slug };

  useEffect(() => {
    if (injected) return undefined;
    let alive = true;
    getJson(`/${type}/${encodeURIComponent(slug)}`)
      .then((d) => {
        if (!alive) return;
        if (d.notFound) setState({ item: null, status: 'missing', slug });
        else if (d.item) setState({ item: d.item, status: 'ok', slug });
      })
      .catch(() => {
        if (alive) setState((s) => (s.slug === slug && s.item ? s : { item: fallback || null, status: fallback ? 'ok' : 'missing', slug }));
      });
    return () => { alive = false; };
  }, [type, slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep a late-arriving fallback (bundled chunk) while the API is still loading
  if (current.status === 'loading' && fallback) return { item: fallback, status: 'ok' };
  return current;
}
