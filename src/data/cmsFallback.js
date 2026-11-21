/**
 * Build-time copies of the CMS content. Used for prerendering and as a safety net
 * when the API is unreachable. The live site reads the admin-managed versions via /api.
 */
import { projects } from './portfolio.js';
import { careerRoles } from './site.js';
import { blogs } from '../lib/content.js';

const slugify = (s) => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const fallbackProjects = projects;
export const fallbackPosts = blogs;
export const fallbackJobs = careerRoles.map((r) => ({
  slug: slugify(r.title),
  title: r.title,
  type: (r.type.split('·')[0] || 'Full-time').trim(),
  location: (r.type.split('·')[1] || 'Indore').trim(),
  exp: r.exp,
  icon: r.icon,
  desc: r.desc,
  href: r.href || '',
  description: '',
  skills: [],
}));
