/**
 * schema.org JSON-LD builders for CMS content (portfolio projects, blog posts, job openings).
 *
 * KEEP IN SYNC with public/api/render.php, which serves the same pages to crawlers
 * straight from the database. When React takes over in the browser (and in Google's
 * rendering pass) react-helmet replaces the server's tags with these, so both sides
 * must produce the same structured data.
 */
import { SITE_URL, company } from '../data/site.js';

export const LOGO = `${SITE_URL}/IMG/umt-logo.png`;
export const absUrl = (u) => (!u ? LOGO : /^https?:\/\//.test(u) ? u : `${SITE_URL}${encodeURI(u)}`);

export const orgRef = {
  '@type': 'Organization',
  name: company.name,
  url: `${SITE_URL}/`,
  logo: LOGO,
};

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
/** "10 July 2026" / "July 10, 2026" / "2026-07-10" → "2026-07-10" (or undefined). */
export function isoDate(s) {
  if (!s) return undefined;
  const str = String(s).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const d = str.match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/i) || str.match(/([a-z]+)\s+(\d{1,2}),?\s+(\d{4})/i);
  if (!d) return undefined;
  const [day, mon] = /^\d/.test(d[1]) ? [d[1], d[2]] : [d[2], d[1]];
  const m = MONTHS.findIndex((x) => x.startsWith(mon.toLowerCase().slice(0, 3)));
  return m < 0 ? undefined : `${d[3]}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)));

/** /portfolio: the page is a collection whose main entity is the list of case studies. */
export function portfolioCollectionLd(projects, { name, description }) {
  const url = `${SITE_URL}/portfolio`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    name,
    description,
    url,
    inLanguage: 'en-IN',
    publisher: orgRef,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/portfolio/${p.slug}`, name: p.name })),
    },
  };
}

/** /portfolio/:slug: a case study. Only real screenshots are listed as images. */
export function projectLd(p) {
  const url = `${SITE_URL}/portfolio/${p.slug}`;
  const shots = (p.screenshots || []).filter((s) => !s.illustrative);
  return clean({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    name: p.name,
    headline: p.tagline || p.name,
    description: p.summary,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en-IN',
    image: shots.map((s) => ({ '@type': 'ImageObject', url: absUrl(s.src), caption: s.caption || p.name })),
    creator: orgRef,
    about: p.industry || undefined,
    genre: (p.category || []).join(', ') || undefined,
    keywords: [...(p.tech || []), ...(p.platforms || [])].join(', ') || undefined,
    isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/portfolio#page`, url: `${SITE_URL}/portfolio` },
  });
}

/** Blog post. */
export function blogPostingLd(post) {
  const url = `${SITE_URL}/${post.slug}`;
  const published = isoDate(post.date);
  return clean({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta?.description || post.excerpt,
    image: absUrl(post.cover),
    datePublished: published,
    dateModified: isoDate(post.updatedAt) || published,
    author: { '@type': 'Organization', name: company.name, url: `${SITE_URL}/` },
    publisher: { '@type': 'Organization', name: company.name, logo: { '@type': 'ImageObject', url: LOGO } },
    mainEntityOfPage: url,
    inLanguage: 'en-IN',
  });
}

/** Office address used for a job's location. */
export function jobAddress(location = '') {
  const blr = /bengaluru|bangalore/i.test(location);
  return blr
    ? { '@type': 'PostalAddress', streetAddress: 'Aviator Building, Whitefield Main Rd, Pattandur Agrahara, Whitefield', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', postalCode: '560066', addressCountry: 'IN' }
    : { '@type': 'PostalAddress', streetAddress: '565, Sapna Sangeeta Rd, near Axis Bank, Snehnagar', addressLocality: 'Indore', addressRegion: 'Madhya Pradesh', postalCode: '452001', addressCountry: 'IN' };
}

export const employmentType = (type = '') => (/part/i.test(type) ? 'PART_TIME' : /intern/i.test(type) ? 'INTERN' : /contract|freelance/i.test(type) ? 'CONTRACTOR' : 'FULL_TIME');

/** Job opening managed in the admin panel (/career/:slug). Null until the posting date is known (datePosted is required). */
export function jobPostingLd(job) {
  if (!isoDate(job.createdAt)) return null;
  const remote = /remote/i.test(job.location || '');
  return clean({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || `<p>${job.desc || ''}</p>`,
    datePosted: isoDate(job.createdAt),
    employmentType: employmentType(job.type),
    hiringOrganization: { '@type': 'Organization', name: company.name, sameAs: `${SITE_URL}/`, logo: LOGO },
    jobLocation: { '@type': 'Place', address: jobAddress(job.location) },
    jobLocationType: remote ? 'TELECOMMUTE' : undefined,
    applicantLocationRequirements: remote ? { '@type': 'Country', name: 'India' } : undefined,
    skills: (job.skills || []).join(', ') || undefined,
    occupationalCategory: job.department || undefined,
    directApply: !job.href,
    url: `${SITE_URL}/career/${job.slug}`,
  });
}

/**
 * /products: our own software products. Marked up as a Service offered by the company,
 * because SoftwareApplication / Product rich results require a price or rating we don't publish.
 */
export function productsCollectionLd(products, { name, description }) {
  const url = `${SITE_URL}/products`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    name,
    description,
    url,
    inLanguage: 'en-IN',
    publisher: orgRef,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/products/${p.slug}`, name: p.name })),
    },
  };
}

export function productLd(p) {
  const url = `${SITE_URL}/products/${p.slug}`;
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: p.name,
    alternateName: p.short !== p.name ? p.short : undefined,
    serviceType: p.category,
    description: p.summary,
    url,
    image: (p.screenshots || []).map((s) => absUrl(s.src)),
    provider: orgRef,
    brand: { '@type': 'Brand', name: p.name },
    areaServed: { '@type': 'Country', name: 'India' },
    audience: { '@type': 'BusinessAudience', audienceType: (p.audience || []).join(', ') },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${p.name} modules`,
      itemListElement: (p.modules || []).map((m) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: m.title, description: m.items.join('; ') } })),
    },
  });
}

/** Site name for Google (home page). */
export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: company.short,
  alternateName: company.name,
  url: `${SITE_URL}/`,
  inLanguage: 'en-IN',
  publisher: orgRef,
};
