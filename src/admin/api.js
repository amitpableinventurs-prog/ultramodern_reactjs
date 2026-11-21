/** Admin API client: same-origin session cookie + the X-UMT-Request header the API requires. */
export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

export async function api(path, { method = 'GET', body, form } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: {
      'X-UMT-Request': '1',
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: form || (body !== undefined ? JSON.stringify(body) : undefined),
  });
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON (e.g. PHP not running) */ }
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/auth/')) onUnauthorized();
    const msg = data?.error || (res.status === 404 && !data ? 'The CMS API is not reachable. Is PHP running?' : `Request failed (${res.status})`);
    throw new ApiError(msg, res.status, data?.fields);
  }
  if (!data) throw new ApiError('The CMS API is not reachable. Is PHP running?', res.status);
  return data;
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append('file', file);
  const { url } = await api('/admin/upload', { method: 'POST', form });
  return url;
}

export const CATEGORY_OPTIONS = ['Mobile Apps', 'Web Platforms', 'E-Commerce', 'Business Websites'];
export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Hybrid'];
export const JOB_ICONS = [
  ['fa-solid fa-code', 'Development'], ['fa-solid fa-mobile-screen', 'Mobile'], ['fa-solid fa-palette', 'Design'],
  ['fa-solid fa-chart-simple', 'Marketing'], ['fa-solid fa-brain', 'AI / Data'], ['fa-solid fa-bug', 'Testing / QA'],
  ['fa-solid fa-server', 'Backend / DevOps'], ['fa-solid fa-headset', 'Support'], ['fa-solid fa-user-tie', 'Sales / Management'],
  ['fa-solid fa-graduation-cap', 'Internship'], ['fa-solid fa-pen-nib', 'Content'], ['fa-solid fa-briefcase', 'Other'],
];

/** What each content type looks like in the admin. */
export const RESOURCES = {
  projects: {
    label: 'Portfolio',
    singular: 'project',
    icon: 'fa-solid fa-briefcase',
    titleKey: 'name',
    viewUrl: (i) => `/portfolio/${i.slug}`,
    urlPrefix: '/portfolio/',
    subtitle: (i) => [i.industry, (i.platforms || []).slice(0, 3).join(', ')].filter(Boolean).join(' · '),
    image: (i) => i.screenshots?.[0]?.src || i.thumb,
    defaults: { name: '', tagline: '', industry: '', accent: '#0a6fd1', summary: '', challenge: '', solution: '', features: [], tech: [], platforms: [], category: [], isNew: true, thumb: '', liveUrl: '', screenshots: [], meta: {}, published: false },
    sections: [
      ['Project', [
        { key: 'name', label: 'Project name', type: 'text', required: true, placeholder: 'e.g. Grovio' },
        { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'One line that says what it is' },
        { key: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g. Grocery & Quick Commerce', half: true },
        { key: 'accent', label: 'Brand colour', type: 'color', half: true, help: 'Used for highlights on the project page.' },
        { key: 'category', label: 'Portfolio filters', type: 'checks', options: CATEGORY_OPTIONS },
        { key: 'isNew', label: 'Show in “Spotlight” and mark as New', type: 'toggle' },
      ]],
      ['Screenshots', [
        { key: 'screenshots', label: 'Screenshots', type: 'shots', help: 'The first screenshot is the cover image. Recommended: 1440px wide.' },
      ]],
      ['Case study', [
        { key: 'summary', label: 'Summary', type: 'textarea', required: true, rows: 3, help: 'Shown on cards and as the search-engine description.' },
        { key: 'challenge', label: 'The challenge', type: 'textarea', rows: 4 },
        { key: 'solution', label: 'Our solution', type: 'textarea', rows: 4 },
        { key: 'features', label: 'Key features', type: 'list', help: 'One feature per line.' },
        { key: 'tech', label: 'Tech stack', type: 'list', half: true, help: 'One per line.' },
        { key: 'platforms', label: 'Platforms', type: 'list', half: true, help: 'e.g. Android, iOS, Web, Admin Panel' },
        { key: 'liveUrl', label: 'Live website / app link (optional)', type: 'text', placeholder: 'https://…' },
      ]],
    ],
  },
  posts: {
    label: 'Blog',
    singular: 'post',
    icon: 'fa-solid fa-newspaper',
    titleKey: 'title',
    viewUrl: (i) => `/${i.slug}`,
    urlPrefix: '/',
    subtitle: (i) => [i.date, i.author].filter(Boolean).join(' · '),
    image: (i) => i.cover,
    defaults: { title: '', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), author: 'UltraModern Team', cover: '', excerpt: '', content: '', readingMinutes: 0, meta: {}, published: false },
    sections: [
      ['Article', [
        { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'A clear, specific headline' },
        { key: 'date', label: 'Date shown on the post', type: 'text', half: true },
        { key: 'author', label: 'Author', type: 'text', half: true },
        { key: 'cover', label: 'Cover image', type: 'image' },
        { key: 'content', label: 'Content', type: 'rich', required: true },
        { key: 'excerpt', label: 'Excerpt (optional)', type: 'textarea', rows: 3, help: 'Shown on blog cards. Leave empty to use the first lines of the article.' },
      ]],
    ],
  },
  jobs: {
    label: 'Careers',
    singular: 'job opening',
    icon: 'fa-solid fa-user-plus',
    titleKey: 'title',
    viewUrl: (i) => `/career/${i.slug}`,
    urlPrefix: '/career/',
    subtitle: (i) => [i.type, i.location, i.exp].filter(Boolean).join(' · '),
    image: () => null,
    defaults: { title: '', department: '', location: 'Indore', type: 'Full-time', exp: '', salary: '', icon: 'fa-solid fa-code', desc: '', description: '', skills: [], href: '', meta: {}, published: false },
    sections: [
      ['Position', [
        { key: 'title', label: 'Job title', type: 'text', required: true, placeholder: 'e.g. Senior React Developer' },
        { key: 'type', label: 'Employment type', type: 'select', options: JOB_TYPES, half: true },
        { key: 'location', label: 'Location', type: 'text', half: true },
        { key: 'exp', label: 'Experience', type: 'text', placeholder: 'e.g. 2–4 yrs', half: true },
        { key: 'salary', label: 'Salary (optional)', type: 'text', placeholder: 'e.g. ₹6L – ₹10L /year', half: true },
        { key: 'department', label: 'Department (optional)', type: 'text', half: true },
        { key: 'icon', label: 'Card icon', type: 'icon', options: JOB_ICONS, half: true },
      ]],
      ['Description', [
        { key: 'desc', label: 'Short description', type: 'textarea', required: true, rows: 2, help: 'One or two lines shown on the Careers page card.' },
        { key: 'description', label: 'Full job description', type: 'rich', help: 'Responsibilities, requirements, perks…' },
        { key: 'skills', label: 'Skills', type: 'list', help: 'One skill per line.' },
        { key: 'href', label: 'Link to a detailed role guide (optional)', type: 'text', placeholder: '/Android-Developer-Jobs' },
      ]],
    ],
  },
};
