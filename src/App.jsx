import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Clients from './pages/Clients.jsx';
import NotFound from './pages/NotFound.jsx';
import { ServicePage, ServicesHub } from './pages/Services.jsx';
import { Career, JobOpening, JobPage } from './pages/Career.jsx';
import { Blog, BlogPost } from './pages/Blog.jsx';
import { Portfolio, ProjectDetail } from './pages/Portfolio.jsx';
import { ProductPage, ProductsHub } from './pages/Products.jsx';
import { hasItem, resolveSlug, useItem } from './lib/content.js';
import { useCmsItem } from './lib/cms.js';

// The admin panel is a separate bundle, downloaded only when someone opens /admin.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

function PageLoading() {
  return (
    <section className="page-hero"><div className="container page-hero-inner"><div className="page-hero-copy">
      <div className="skeleton w40" /><div className="skeleton h1" /><div className="skeleton w70" />
    </div></div></section>
  );
}

/** Service and job-track pages: content bundled with the site. */
function ItemPage({ slug, type }) {
  const item = useItem(slug);
  if (!item) return <PageLoading />;
  if (type === 'service') return <ServicePage service={item} />;
  return <JobPage job={item} />;
}

/** Blog posts: managed in the admin panel (bundled copy used as a fallback). */
function PostPage({ slug }) {
  const bundled = useItem(hasItem(slug) ? slug : '__none__');
  const { item, status } = useCmsItem('posts', 'post', slug, bundled && bundled.type === 'blog' ? bundled : null);
  if (status === 'loading') return <PageLoading />;
  if (!item) return <NotFound />;
  return <BlogPost post={item} />;
}

const STATIC_ALIASES = {
  index: '/', 'index.html': '/', 'about.html': '/about', 'contact.html': '/contact', 'career.html': '/career',
  'blog.html': '/blog', 'blog2': '/services', 'blog2.html': '/services', 'privacy-policy.html': '/privacy-policy',
  'clinte.html': '/clients',
};

/** Root-level slugs: services, job-track pages, blog posts, and legacy .html URLs. */
function SlugPage() {
  const { slug } = useParams();
  const alias = STATIC_ALIASES[slug.toLowerCase()];
  if (alias) return <Navigate to={alias} replace />;
  const hit = resolveSlug(slug);
  if (hit?.type === 'redirect') return <Navigate to={hit.to} replace />;
  if (hit && hit.canonicalSlug !== slug) return <Navigate to={`/${hit.canonicalSlug}`} replace />;
  if (hit && hit.type !== 'blog') return <ItemPage key={hit.canonicalSlug} slug={hit.canonicalSlug} type={hit.type} />;
  // a bundled blog post, or a post published later from the admin panel
  return <PostPage key={slug} slug={slug} />;
}

function ProjectRoute() {
  const { slug } = useParams();
  return <ProjectDetail key={slug} slug={slug} />;
}

function ProductRoute() {
  const { slug } = useParams();
  return <ProductPage key={slug} slug={slug} />;
}

function JobRoute() {
  const { slug } = useParams();
  return <JobOpening key={slug} slug={slug} />;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="admin/*"
        element={<Suspense fallback={<div className="admin-boot">Loading admin…</div>}><AdminApp /></Suspense>}
      />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<ServicesHub />} />
        <Route path="products" element={<ProductsHub />} />
        <Route path="products/:slug" element={<ProductRoute />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/:slug" element={<ProjectRoute />} />
        <Route path="career" element={<Career />} />
        <Route path="career/:slug" element={<JobRoute />} />
        <Route path="blog" element={<Blog />} />
        <Route path="clients" element={<Clients />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<Privacy />} />
        <Route path=":slug" element={<SlugPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
