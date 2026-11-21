import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL, company } from '../data/site.js';

const DEFAULT_IMAGE = `${SITE_URL}/IMG/umt-logo.png`;

const typesOf = (d) => [].concat(d?.['@type'] || []);

/**
 * Page <head> tags.
 * `legacy` = the original <head> data of the page on the old static site. When given,
 * its title, description, keywords, robots, Open Graph text and JSON-LD are used
 * unchanged so the existing SEO carries over. `title`/`description`/`jsonLd` fill gaps
 * and add new structured data (e.g. breadcrumbs) that does not duplicate the legacy types.
 */
export default function Seo({ legacy, title, description, image, jsonLd = [], noindex = false, type = 'website' }) {
  const { pathname } = useLocation();
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
  const fullTitle = legacy?.title || title || `${company.short} | Website, App & Software Development Company in Indore`;
  const desc = legacy?.description || description;
  const robots = noindex ? 'noindex, follow' : legacy?.robots || 'index, follow';
  const imageSrc = legacy?.ogImage || image;
  const img = imageSrc ? (imageSrc.startsWith('http') ? imageSrc : `${SITE_URL}${encodeURI(imageSrc)}`) : DEFAULT_IMAGE;

  const legacyLd = legacy?.jsonLd || [];
  const legacyTypes = new Set(legacyLd.flatMap(typesOf));
  const businessCovered = ['LocalBusiness', 'Organization'].some((t) => legacyTypes.has(t));
  const extraLd = jsonLd.filter(Boolean).filter((d) => {
    const t = typesOf(d);
    if (t.some((x) => legacyTypes.has(x))) return false; // legacy already has this type
    if (businessCovered && t.some((x) => x === 'LocalBusiness' || x === 'Organization')) return false;
    return true;
  });

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {desc && <meta name="description" content={desc} />}
      {legacy?.keywords && <meta name="keywords" content={legacy.keywords} />}
      <link rel="canonical" href={url} />
      <meta name="robots" content={robots} />
      <meta property="og:type" content={legacy?.ogType || type} />
      <meta property="og:site_name" content={company.short} />
      <meta property="og:title" content={legacy?.ogTitle || fullTitle} />
      {(legacy?.ogDescription || desc) && <meta property="og:description" content={legacy?.ogDescription || desc} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      {[...legacyLd, ...extraLd].map((data, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(data)}</script>
      ))}
    </Helmet>
  );
}

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: company.name,
  url: `${SITE_URL}/`,
  logo: DEFAULT_IMAGE,
  image: DEFAULT_IMAGE,
  telephone: '+91-8640089400',
  email: company.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '565, Sapna Sangeeta Rd, nearby Axis Bank, Snehnagar',
    addressLocality: 'Indore',
    addressRegion: 'Madhya Pradesh',
    postalCode: '452001',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: '22.7196', longitude: '75.8577' },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:00',
    closes: '19:00',
  },
  sameAs: company.social.filter((s) => s.href.startsWith('https://www.')).map((s) => s.href),
};

export const faqLd = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
  })),
});

export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: `${SITE_URL}${path}`,
  })),
});
