/**
 * Writes public/api/seed.json: the site's current portfolio, blog posts and job
 * openings. The CMS imports it automatically the first time its database is created,
 * so nothing has to be re-entered by hand. (Existing database content is never overwritten.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/portfolio.js';
import { careerRoles } from '../src/data/site.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gen = path.join(root, 'src', 'data', 'generated');
const index = JSON.parse(fs.readFileSync(path.join(gen, 'index.json'), 'utf8'));
const slugify = (s) => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const seed = {
  projects: projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    isNew: !!p.isNew,
    category: p.category || [],
    industry: p.industry || '',
    accent: p.accent || '#0a6fd1',
    tagline: p.tagline || '',
    summary: p.summary || '',
    challenge: p.challenge || '',
    solution: p.solution || '',
    features: p.features || [],
    tech: p.tech || [],
    platforms: p.platforms || [],
    thumb: p.thumb || '',
    liveUrl: p.liveUrl || '',
    screenshots: p.screenshots || [],
    meta: {},
  })),
  posts: index.blogs.map((b) => {
    const item = JSON.parse(fs.readFileSync(path.join(gen, 'items', `${b.slug.toLowerCase()}.json`), 'utf8'));
    return {
      slug: item.slug,
      title: item.title,
      date: item.date,
      author: item.author,
      cover: item.cover,
      excerpt: item.excerpt,
      readingMinutes: item.readingMinutes,
      content: item.content,
      meta: item.meta || {}, // original title/description/keywords/OG/JSON-LD from the old site
    };
  }),
  jobs: careerRoles.map((r) => ({
    slug: slugify(r.title),
    title: r.title,
    department: '',
    location: (r.type.split('·')[1] || 'Indore').trim(),
    type: (r.type.split('·')[0] || 'Full-time').trim(),
    exp: r.exp || '',
    salary: '',
    icon: r.icon || 'fa-solid fa-briefcase',
    desc: r.desc || '',
    description: '',
    skills: [],
    href: r.href || '',
    meta: {},
  })),
  // root-level URLs already used by static pages; new blog posts must not take them
  reservedSlugs: [...index.services.map((s) => s.slug), ...index.jobs.map((j) => j.slug)],
};

fs.writeFileSync(path.join(root, 'public', 'api', 'seed.json'), JSON.stringify(seed));
console.log(`CMS seed: ${seed.projects.length} projects, ${seed.posts.length} posts, ${seed.jobs.length} jobs`);
