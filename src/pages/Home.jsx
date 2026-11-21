import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import Seo, { faqLd, organizationLd } from '../components/Seo.jsx';
import { websiteLd } from '../lib/schema.js';
import staticMeta from '../data/generated/static-meta.json';
import { ContactForm } from '../components/Forms.jsx';
import { DeviceStage, ProjectCard } from '../components/Projects.jsx';
import { products } from '../data/products.js';
import { Counter, Faq, Icon, Reveal, SectionHead } from '../components/ui.jsx';
import { useCmsList } from '../lib/cms.js';
import { fallbackPosts, fallbackProjects } from '../data/cmsFallback.js';
import {
  CLIENTS_ON_HOME, SITE_URL, clients, company, featuredServices, homeFaqs, industries, milestones, serviceGroups, techStack, testimonials,
} from '../data/site.js';

const ROTATE = ['Website Development', 'Mobile App Development', 'Software Development', 'Digital Marketing', 'SEO Services'];

function Hero() {
  const { openQuote } = useOutletContext();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % ROTATE.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="home-hero">
      <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/IMG/industries-back.jpg" aria-hidden="true">
        <source src="/video/Video Project 5.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="pill"><span className="dot" /> 10+ years · 100+ projects delivered</span>
          <h1>
            Best <span className="rotator" key={i}>{ROTATE[i]}</span>
            <br />Company in Indore
          </h1>
          <p className="hero-lead">
            UltraModern Technologies designs, builds, and grows digital products: fast websites, mobile apps,
            custom software, and marketing that brings in real leads for startups and growing businesses.
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary btn-lg" onClick={openQuote}>Get a free consultation <i className="fa-solid fa-arrow-right" /></button>
            <Link to="/portfolio" className="btn btn-ghost-light btn-lg"><i className="fa-regular fa-folder-open" /> View our work</Link>
          </div>
          <ul className="hero-proof">
            <li><i className="fa-solid fa-star" /> 5.0 client rating</li>
            <li><i className="fa-solid fa-location-dot" /> Indore &amp; Bengaluru</li>
            <li><i className="fa-solid fa-shield-halved" /> NDA-friendly delivery</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ClientsMarquee() {
  return (
    <section className="clients">
      <div className="container">
        <p className="clients-title">Trusted by growing businesses across India</p>
        <ul className="client-grid" aria-label="Our clients">
          {clients.slice(0, CLIENTS_ON_HOME).map((c) => (
            <li className="client-logo" key={c.name}>
              <img src={c.logo} alt={c.name} title={c.name} loading="lazy" />
            </li>
          ))}
          <li className="client-logo client-more">
            <Link to="/clients">
              <strong>+{clients.length - CLIENTS_ON_HOME} more</strong>
              <span>& many more · View all <i className="fa-solid fa-arrow-right" /></span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="section">
      <div className="container split intro">
        <Reveal>
          <span className="eyebrow">Web design &amp; development service in Indore</span>
          <h2>A technology partner that builds for <em>results</em>, not just launch day</h2>
          <p className="lead">
            As a trusted <strong>website development company in Indore</strong>, we help businesses build a strong online
            presence with modern, responsive, performance-focused websites for startups, brands, and growing companies
            across India.
          </p>
          <p>
            Our team covers custom website development, UI/UX design, e-commerce, business portals, and SEO-friendly web
            solutions, plus Google Ads, SEO, and social media marketing to help you grow faster. From custom software to
            mobile apps, we deliver as a <strong>software development company</strong> and <strong>app development company in Indore</strong> for
            businesses across industries.
          </p>
          <ul className="ticks two-col">
            <li>Dedicated project manager</li>
            <li>Transparent weekly updates</li>
            <li>SEO-ready from day one</li>
            <li>Post-launch support</li>
          </ul>
          <div className="btn-row"><Link to="/about" className="btn btn-outline">More about us <i className="fa-solid fa-arrow-right" /></Link></div>
        </Reveal>
        <Reveal className="intro-media" delay={2}>
          <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=900" alt="UltraModern team planning a digital strategy" loading="lazy" />
          <div className="float-stat">
            <strong><Counter value={98} suffix="%" /></strong>
            <span>Client satisfaction</span>
          </div>
          <div className="float-badge"><i className="fa-solid fa-rocket" /> Fast, scalable, conversion-driven</div>
        </Reveal>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section tint">
      <div className="container">
        <SectionHead center eyebrow="What we do" title="Services that move your business forward" lead="One accountable team for strategy, design, engineering, and growth." />
        <div className="card-grid cols-4">
          {featuredServices.map((s, i) => (
            <Reveal key={s.slug} delay={i} as={Link} to={`/${s.slug}`} className="service-card">
              <span className="card-icon"><Icon name={s.icon} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="card-link">Learn more <i className="fa-solid fa-arrow-right" /></span>
            </Reveal>
          ))}
        </div>
        <div className="center-row"><Link to="/services" className="btn btn-primary">View all services</Link></div>
      </div>
    </section>
  );
}

function HomeProducts() {
  return (
    <section className="section home-products">
      <div className="container">
        <div className="head-row">
          <SectionHead eyebrow="Our products" title="Software products built to run your business" lead="Proven ERP and CRM products you can start using quickly, tailored by the team that built them." />
          <Link to="/products" className="btn btn-outline hide-sm">All products <i className="fa-solid fa-arrow-right" /></Link>
        </div>
        <div className="card-grid">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i} as={Link} to={`/products/${p.slug}`} className="product-tile" style={{ '--accent': p.accent }}>
              <span className="tile-media"><DeviceStage project={p} /></span>
              <small>{p.category}</small>
              <h3>{p.name}</h3>
              <p>{p.tagline}</p>
              <span className="card-link">Explore {p.short} <i className="fa-solid fa-arrow-right" /></span>
            </Reveal>
          ))}
        </div>
        <div className="center-row show-sm"><Link to="/products" className="btn btn-outline">All products</Link></div>
      </div>
    </section>
  );
}

function Work() {
  const featured = useCmsList('projects', fallbackProjects).slice(0, 6);
  return (
    <section className="section">
      <div className="container">
        <div className="head-row">
          <SectionHead eyebrow="Portfolio" title="Recent work we’re proud of" lead="Apps, platforms, and websites built for real businesses, from quick-commerce to ride-hailing." />
          <Link to="/portfolio" className="btn btn-outline hide-sm">See all projects <i className="fa-solid fa-arrow-right" /></Link>
        </div>
        <div className="project-grid">
          {featured.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
        </div>
        <div className="center-row show-sm"><Link to="/portfolio" className="btn btn-outline">See all projects</Link></div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="section dark industries">
      <div className="container">
        <SectionHead center light eyebrow="Industries" title="Industries we serve" lead="Domain experience that shortens discovery and avoids costly mistakes." />
        <div className="industry-grid">
          {industries.map((d, i) => (
            <Reveal key={d.title} delay={i} className="industry">
              <Icon name={d.icon} />
              <span>{d.title}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tech() {
  const [tab, setTab] = useState(techStack[0].key);
  const active = techStack.find((t) => t.key === tab);
  return (
    <section className="section">
      <div className="container">
        <SectionHead center eyebrow="Technologies" title="A modern, proven tech stack" lead="From front-end frameworks to DevOps pipelines: we build, scale, and optimise with industry-leading tools." />
        <div className="tabs" role="tablist" aria-label="Technology categories">
          {techStack.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              <Icon name={t.icon} /> {t.label}
            </button>
          ))}
        </div>
        <div className="tech-grid" role="tabpanel" key={tab}>
          {active.items.map(([name, icon]) => (
            <div key={name} className="tech">
              <img src={icon} alt="" loading="lazy" width="40" height="40" />
              <span>{name}</span>
            </div>
          ))}
        </div>
        <p className="tech-note"><i className="fa-regular fa-circle-check" /> {active.blurb} · 50+ production-ready technologies</p>
      </div>
    </section>
  );
}

function Milestones() {
  return (
    <section className="section milestones">
      <div className="container">
        <div className="milestone-grid">
          {milestones.map((m, i) => (
            <Reveal key={m.label} delay={i} className="milestone">
              <strong><Counter value={m.value} suffix={m.suffix} /></strong>
              <span>{m.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [paused]);
  return (
    <section className="section testimonials-band" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container">
        <SectionHead center light eyebrow="Testimonials" title="What our clients say" />
        <div className="testimonials">
          <div className="t-track" style={{ transform: `translateX(-${i * 100}%)` }}>
            {testimonials.map((t) => (
              <figure key={t.name} className="testimonial">
                <div className="stars" aria-label="5 out of 5 stars">{'★★★★★'}</div>
                <blockquote>“{t.text}”</blockquote>
                <figcaption>
                  <img src={t.avatar} alt="" loading="lazy" width="52" height="52" className={t.logo ? 'is-logo' : undefined} />
                  <span><strong>{t.name}</strong>{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="t-controls">
            <button type="button" className="icon-btn" aria-label="Previous testimonial" onClick={() => setI((i - 1 + testimonials.length) % testimonials.length)}><i className="fa-solid fa-arrow-left" /></button>
            <div className="dots">
              {testimonials.map((t, n) => <button key={t.name} type="button" className={n === i ? 'active' : ''} aria-label={`Show testimonial ${n + 1}`} onClick={() => setI(n)} />)}
            </div>
            <button type="button" className="icon-btn" aria-label="Next testimonial" onClick={() => setI((i + 1) % testimonials.length)}><i className="fa-solid fa-arrow-right" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Insights() {
  const posts = useCmsList('posts', fallbackPosts);
  return (
    <section className="section">
      <div className="container">
        <div className="head-row">
          <SectionHead eyebrow="Insights" title="Digital marketing &amp; technology insights" />
          <Link to="/blog" className="btn btn-outline hide-sm">All articles <i className="fa-solid fa-arrow-right" /></Link>
        </div>
        <div className="card-grid cols-3">
          {posts.slice(0, 3).map((b, i) => <BlogCard key={b.slug} post={b} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/** Share row under each blog card (brand-colour icons, like the legacy blog cards). */
function ShareIcons({ url, title }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    ['Share on Facebook', '/social/facebook.png', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ['Share on LinkedIn', '/social/linkedin.png', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['Follow us on Instagram', '/social/instagram.png', company.social.find((s) => s.label === 'Instagram').href],
    ['Share on WhatsApp', '/social/whatsapp.png', `https://wa.me/?text=${t}%20${u}`],
  ];
  return (
    <div className="social-icons share-icons">
      {links.map(([label, img, href]) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
          <img src={img} alt="" width="18" height="18" loading="lazy" />
        </a>
      ))}
    </div>
  );
}

export function BlogCard({ post, index = 0 }) {
  return (
    <Reveal delay={index % 3} as="article" className="blog-card">
      <Link to={`/${post.slug}`} className="blog-media" tabIndex={-1} aria-hidden="true">
        {post.cover ? <img src={post.cover} alt="" loading="lazy" /> : <span className="media-ph" />}
      </Link>
      <div className="blog-body">
        <p className="blog-meta"><span><i className="fa-regular fa-calendar" /> {post.date}</span><span><i className="fa-regular fa-clock" /> {post.readingMinutes} min read</span></p>
        <h3><Link to={`/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <ShareIcons url={`${SITE_URL}/${post.slug}`} title={post.title} />
        <Link to={`/${post.slug}`} className="card-link">Read article <i className="fa-solid fa-arrow-right" /></Link>
      </div>
    </Reveal>
  );
}

function HomeFaq() {
  return (
    <section className="section tint">
      <div className="container split faq-split">
        <div>
          <SectionHead eyebrow="FAQ" title="Answers to your questions" lead="Everything you need to know about working with UltraModern Technologies, from process to results." />
          <Reveal className="faq-aside">
            <i className="fa-solid fa-headset" />
            <div>
              <strong>Still have questions?</strong>
              <p>Talk to our <b>Sales Advisor</b>, free of charge.</p>
              <a href={company.phoneHref} className="btn btn-primary btn-sm"><i className="fa-solid fa-phone" /> {company.phone}</a>
            </div>
          </Reveal>
        </div>
        <Faq items={homeFaqs} />
      </div>
    </section>
  );
}

/** "Complete service offerings" tag cloud from the legacy home page: every service page, one click away. */
function ServiceOfferings() {
  const all = serviceGroups.flatMap((g) => g.items);
  return (
    <section className="section offerings">
      <div className="container">
        <SectionHead center eyebrow="All services" title="Complete service offerings" />
        <Reveal className="offer-tags">
          {all.map(([name, slug]) => <Link key={slug} to={`/${slug}`} className="offer-tag">{name}</Link>)}
        </Reveal>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="section contact-home" id="contact">
      <div className="container split">
        <Reveal>
          <span className="eyebrow">Get in touch</span>
          <h2>Get a free consultation</h2>
          <p className="lead">Share a few details and we’ll get back with ideas, a timeline, and a transparent estimate, usually within one business day.</p>
          <div className="contact-list">
            <a href={company.phoneHref}><span><i className="fa-solid fa-phone" /></span><div><small>Call</small>{company.phone}</div></a>
            <a href={`mailto:${company.salesEmail}`}><span><i className="fa-solid fa-envelope" /></span><div><small>Email</small>{company.salesEmail}</div></a>
            <a href={company.whatsapp} target="_blank" rel="noopener noreferrer"><span><i className="fa-brands fa-whatsapp" /></span><div><small>WhatsApp</small>Chat with our team</div></a>
          </div>
        </Reveal>
        <Reveal className="form-card" delay={2}>
          <ContactForm source="home page" />
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        legacy={staticMeta['/']}
        jsonLd={[websiteLd, organizationLd, faqLd(homeFaqs)]}
      />
      <Hero />
      <ClientsMarquee />
      <Intro />
      <Services />
      <HomeProducts />
      <Work />
      <Industries />
      <Tech />
      <Milestones />
      <Testimonials />
      <Insights />
      <HomeFaq />
      <ContactSection />
      <ServiceOfferings />
    </>
  );
}
