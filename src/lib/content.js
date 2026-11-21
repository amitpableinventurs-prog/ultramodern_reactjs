import { useEffect, useState } from 'react';
import index from '../data/generated/index.json';
import { products } from '../data/products.js';

/**
 * Content access.
 *  - `index.json` (small) lists every service, job opening and blog post for menus and listings.
 *  - Full page content lives in one JSON chunk per page (data/generated/items/<slug>.json),
 *    loaded on demand so visitors only download the page they open.
 *    The prerender step primes every item synchronously (see entry-server.jsx).
 */
export const services = index.services;
export const jobs = index.jobs;
export const blogs = index.blogs;

const loaders = import.meta.glob('../data/generated/items/*.json', { import: 'default' });
const byName = new Map(Object.entries(loaders).map(([path, load]) => [path.split('/').pop(), load]));
const cache = new Map();
const fileOf = (slug) => `${String(slug).toLowerCase()}.json`;

/** Used by the server entry to make all content available synchronously. */
export function primeItems(modules) {
  for (const [path, data] of Object.entries(modules)) cache.set(path.split('/').pop(), data);
}

export const hasItem = (slug) => byName.has(fileOf(slug));
export const getItem = (slug) => cache.get(fileOf(slug)) || null;

export async function loadItem(slug) {
  const file = fileOf(slug);
  if (cache.has(file)) return cache.get(file);
  const load = byName.get(file);
  if (!load) return null;
  const data = await load();
  cache.set(file, data);
  return data;
}

/** Returns the page content, loading it first when navigating client-side. */
export function useItem(slug) {
  const [, rerender] = useState(0);
  useEffect(() => {
    let alive = true;
    if (!getItem(slug)) loadItem(slug).then(() => { if (alive) rerender((n) => n + 1); });
    return () => { alive = false; };
  }, [slug]);
  return getItem(slug);
}

const routeIndex = new Map();
services.forEach((s) => routeIndex.set(s.slug.toLowerCase(), { type: 'service', slug: s.slug }));
jobs.forEach((j) => routeIndex.set(j.slug.toLowerCase(), { type: 'job', slug: j.slug }));
blogs.forEach((b) => routeIndex.set(b.slug.toLowerCase(), { type: 'blog', slug: b.slug }));
const legacy = new Map(index.redirects.map((r) => [r.from.toLowerCase(), r.to]));

/** Resolve a root-level slug (service, job opening or blog post). */
export function resolveSlug(raw) {
  let slug = raw || '';
  try { slug = decodeURIComponent(slug); } catch { /* keep raw */ }
  slug = slug.replace(/\.html?$/i, '').replace(/\/+$/, '');
  const hit = routeIndex.get(slug.toLowerCase());
  if (hit) return { type: hit.type, canonicalSlug: hit.slug };
  const moved = legacy.get(slug.toLowerCase());
  if (moved) return { type: 'redirect', to: `/${moved}` };
  return null;
}

/** Short marketing description for a service card. */
export function serviceBlurb(slug, max = 150) {
  const d = services.find((s) => s.slug.toLowerCase() === slug.toLowerCase())?.description || '';
  return d.length > max ? `${d.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : d;
}

export const jobTitle = (job) => (job.title || job.hero?.title || '').replace(/\s+in Indore$/i, '');

/** Every route that should be prerendered to static HTML. */
export function allRoutes(projects) {
  return [
    '/', '/about', '/services', '/products', ...products.map((p) => `/products/${p.slug}`), '/portfolio', '/clients', '/career', '/blog', '/contact', '/privacy-policy',
    ...services.map((s) => `/${s.slug}`),
    ...jobs.map((j) => `/${j.slug}`),
    ...blogs.map((b) => `/${b.slug}`),
    ...projects.map((p) => `/portfolio/${p.slug}`),
  ];
}
