import { Link } from 'react-router-dom';
import Seo, { breadcrumbLd, faqLd } from '../components/Seo.jsx';
import { ContactForm } from '../components/Forms.jsx';
import { DeviceStage, ScreenGallery } from '../components/Projects.jsx';
import { CtaBand, Faq, PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { company } from '../data/site.js';
import { getProduct, products } from '../data/products.js';
import { productLd, productsCollectionLd } from '../lib/schema.js';
import NotFound from './NotFound.jsx';

const productNames = products.map((p) => p.name);

/** "Book a demo" block: contact details on the left, the enquiry form (product preselected) on the right. */
function DemoSection({ product }) {
  return (
    <section className="section contact-home demo-section" id="demo">
      <div className="container split">
        <Reveal>
          <span className="eyebrow">Free demo</span>
          <h2>{product ? `See ${product.short} in action` : 'Book a free product demo'}</h2>
          <p className="lead">We’ll walk you through the product live, using a workflow like yours, and answer your questions.</p>
          <ul className="ticks">
            <li>A live walkthrough of the modules you need</li>
            <li>Plans for your number of users, branches or installations</li>
            <li>Setup, data import and training timeline</li>
          </ul>
          <div className="contact-list">
            <a href={company.phoneHref}><span><i className="fa-solid fa-phone" /></span><div><small>Call</small>{company.phone}</div></a>
            <a href={company.whatsapp} target="_blank" rel="noopener noreferrer"><span><i className="fa-brands fa-whatsapp" /></span><div><small>WhatsApp</small>Chat with our team</div></a>
          </div>
        </Reveal>
        <Reveal className="form-card" delay={2}>
          <ContactForm
            key={product?.slug || 'all'}
            source={product ? `product demo: ${product.name}` : 'products page'}
            services={productNames}
            defaultService={product?.name || ''}
            serviceLabel="Product"
            messageLabel="Your requirement"
            messagePlaceholder="Organisation name, number of users or branches, and what you want to manage"
            submitLabel="Request a demo"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Highlights({ product, light = false }) {
  return (
    <ul className={`product-highlights ${light ? 'light' : ''}`}>
      {product.highlights.map(([icon, title, text]) => (
        <li key={title}>
          <i className={icon} aria-hidden="true" />
          <span><strong>{title}</strong>{text}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------ /products */
const HUB_TITLE = 'Software Products: School, Hospital, Transport & Gym ERP, AI CRM | UltraModern Technologies';
const HUB_DESC = 'Ready-to-use software from UltraModern Technologies: Smart Campus ERP, MediCare Hospital ERP, Smart AI CRM, Transport Management ERP and Gym Management Software.';

export function ProductsHub() {
  return (
    <>
      <Seo
        title={HUB_TITLE}
        description={HUB_DESC}
        image={products[0].screenshots[0].src}
        jsonLd={[breadcrumbLd([['Home', '/'], ['Products', '/products']]), productsCollectionLd(products, { name: HUB_TITLE, description: HUB_DESC })]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Products', '/products']]}
        eyebrow="Our products"
        titleHtml="Software products <span>built to run your business</span>"
        lead="Proven products for education, healthcare, sales, transport and fitness businesses. Start quickly with a ready product, and let the team that built it tailor it to the way you work."
        actions={<><a href="#demo" className="btn btn-light">Book a free demo <i className="fa-solid fa-arrow-right" /></a><a href="#products" className="btn btn-ghost-light">Explore products</a></>}
        aside={
          <div className="product-jump">
            {products.map((p) => (
              <Link key={p.slug} to={`/products/${p.slug}`} style={{ '--accent': p.accent }}>
                <span className="pj-icon"><i className={p.icon} /></span>
                <span><strong>{p.name}</strong>{p.category}</span>
                <i className="fa-solid fa-arrow-right" />
              </Link>
            ))}
          </div>
        }
      />

      <section className="section" id="products">
        <div className="container">
          <SectionHead eyebrow="Products" title={`${products.length} products, one team behind them`} lead="Each product runs in the browser on any device, with a separate panel for every role." />
          <div className="spotlight-list">
            {products.map((p, i) => (
              <Reveal key={p.slug} className={`spotlight product-spot ${i % 2 ? 'flip' : ''}`} style={{ '--accent': p.accent }}>
                <Link to={`/products/${p.slug}`} className="spotlight-media" aria-label={`${p.name} details`}>
                  <DeviceStage project={p} size="large" eager={i === 0} />
                </Link>
                <div className="spotlight-copy">
                  <span className="project-industry">{p.category}</span>
                  <h2 className="h3"><Link to={`/products/${p.slug}`}>{p.name}</Link></h2>
                  <p className="spot-tagline">{p.tagline}</p>
                  <p>{p.summary}</p>
                  <Highlights product={p} />
                  <div className="btn-row">
                    <Link to={`/products/${p.slug}`} className="btn btn-primary">Explore {p.short} <i className="fa-solid fa-arrow-right" /></Link>
                    <a href="#demo" className="btn btn-outline">Book a demo</a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <SectionHead center eyebrow="Why our products" title="Ready today, shaped to you" />
          <div className="card-grid cols-4">
            {[
              ['fa-solid fa-code', 'Built in-house', 'Designed, built and supported by our own engineering team in Indore.'],
              ['fa-solid fa-sliders', 'Tailored to you', 'Need a report, module or integration? The team that built it adds it.'],
              ['fa-solid fa-laptop-code', 'Web, mobile and desktop', 'Works in the browser on any device. Our ERP and CRM products also run as Windows desktop apps.'],
              ['fa-solid fa-user-shield', 'Secure by role', 'Every user sees only what their role allows, checked on the server.'],
            ].map(([icon, title, text], i) => (
              <Reveal key={title} delay={i} className="service-card static">
                <span className="card-icon"><i className={icon} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <DemoSection />
      <CtaBand title="Need something custom instead?" text="We also build software from scratch. Tell us about your idea and get a free consultation with a clear plan and estimate." />
    </>
  );
}

/* ------------------------------------------------------------ /products/:slug */
export function ProductPage({ slug }) {
  const p = getProduct(slug);
  if (!p) return <NotFound />;
  const crumbs = [['Home', '/'], ['Products', '/products'], [p.name, `/products/${p.slug}`]];
  const others = products.filter((x) => x.slug !== p.slug);

  return (
    <div style={{ '--accent': p.accent }} className="product-page">
      <Seo
        title={p.seo.title}
        description={p.seo.description}
        image={p.screenshots[0].src}
        jsonLd={[breadcrumbLd(crumbs), productLd(p), faqLd(p.faqs)]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={p.category}
        title={p.name}
        lead={p.tagline}
        actions={<><a href="#demo" className="btn btn-light">Book a free demo <i className="fa-solid fa-arrow-right" /></a><a href="#gallery" className="btn btn-ghost-light"><i className="fa-regular fa-images" /> See the screens</a></>}
        aside={<Highlights product={p} light />}
      />

      <section className="section project-top" id="gallery">
        <div className="container">
          <ScreenGallery item={p} mobileTitle="On the phone" />
        </div>
      </section>

      <section className="section">
        <div className="container split product-intro">
          <Reveal>
            <span className="eyebrow">Overview</span>
            <h2>What is {p.name}?</h2>
            <p className="lead">{p.summary}</p>
          </Reveal>
          <Reveal className="built-for" delay={1}>
            <h3>Built for</h3>
            <ul className="chip-list">{p.audience.map((a) => <li key={a}><i className="fa-solid fa-check" /> {a}</li>)}</ul>
          </Reveal>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <SectionHead center eyebrow="Modules" title={`Everything in ${p.short}`} lead="Switch on the modules you need. Each user only sees what their role allows." />
          <div className="card-grid module-grid">
            {p.modules.map((m, i) => (
              <Reveal key={m.title} delay={i % 3} className="module-card">
                <h3><span className="card-icon"><i className={m.icon} /></span>{m.title}</h3>
                <ul className="ticks">{m.items.map((x) => <li key={x}>{x}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Users & portals" title="A panel for every role" />
          <div className={`role-grid n${p.portals.length}`}>
            {p.portals.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i} className="role-card">
                <span className="role-icon"><i className={icon} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark platform-band">
        <div className="container">
          <SectionHead center light eyebrow="Platform" title="Deployment, access and security" />
          <div className="card-grid cols-4">
            {p.platform.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i} className="platform-card">
                <i className={icon} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <SectionHead center eyebrow="FAQ" title={`${p.short}: common questions`} />
          <Faq items={p.faqs} />
        </div>
      </section>

      <DemoSection product={p} />

      <section className="section tint">
        <div className="container">
          <SectionHead center eyebrow="More products" title="Explore our other products" />
          <div className="card-grid cols-2 other-products">
            {others.map((o) => (
              <Reveal key={o.slug} as={Link} to={`/products/${o.slug}`} className="other-product" style={{ '--accent': o.accent }}>
                <span className="pj-icon"><i className={o.icon} /></span>
                <span>
                  <small>{o.category}</small>
                  <strong>{o.name}</strong>
                  {o.tagline}
                </span>
                <i className="fa-solid fa-arrow-right" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
