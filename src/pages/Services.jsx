import { Link } from 'react-router-dom';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import { Sections } from '../components/Blocks.jsx';
import { ContactForm } from '../components/Forms.jsx';
import { CtaBand, Icon, PageHero, Reveal, SectionHead, stripTags } from '../components/ui.jsx';
import { serviceBlurb } from '../lib/content.js';
import { company, serviceGroupOf, serviceGroups, serviceLabel } from '../data/site.js';

/* ------------------------------------------------------------ /services hub */
export function ServicesHub() {
  return (
    <>
      <Seo
        title="IT Services in Indore: Web, App, Software & Digital Marketing | UltraModern Technologies"
        description="Explore every UltraModern Technologies service: website and software development, mobile apps, SEO and digital marketing, AI, business software, design, IT consulting, and testing."
        jsonLd={[breadcrumbLd([['Home', '/'], ['Services', '/services']])]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Services', '/services']]}
        eyebrow="37 services · 6 practices"
        title="Everything you need to build and grow online"
        lead="Strategy, design, engineering, and marketing under one roof, so you work with one accountable team from idea to growth."
        actions={<><Link to="/contact" className="btn btn-light">Get a free consultation</Link><a href="#marketing" className="btn btn-ghost-light">Browse services</a></>}
      />
      <nav className="jump-nav" aria-label="Service categories">
        <div className="container">
          {serviceGroups.map((g) => (
            <a key={g.title} href={`#${g.title.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}`}><Icon name={g.icon} /> {g.title}</a>
          ))}
        </div>
      </nav>
      {serviceGroups.map((g, gi) => (
        <section key={g.title} id={g.title.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')} className={`section ${gi % 2 ? 'tint' : ''}`}>
          <div className="container">
            <SectionHead eyebrow={`0${gi + 1} · Practice`} title={g.title} />
            <div className="card-grid cols-3">
              {g.items.map(([name, slug], i) => (
                <Reveal key={slug} delay={i} as={Link} to={`/${slug}`} className="service-card compact">
                  <span className="card-icon"><Icon name={g.icon} /></span>
                  <h3>{name}</h3>
                  <p>{serviceBlurb(slug, 130)}</p>
                  <span className="card-link">Explore <i className="fa-solid fa-arrow-right" /></span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
      <CtaBand />
    </>
  );
}

/* ------------------------------------------------------------ single service page */
export function ServicePage({ service }) {
  const label = serviceLabel(service.slug) || service.hero.title;
  const group = serviceGroupOf(service.slug);
  const related = group ? group.items.filter(([, s]) => s !== service.slug).slice(0, 6) : [];
  const crumbs = [['Home', '/'], ['Services', '/services'], [label, `/${service.slug}`]];
  const faqSection = service.sections.find((s) => s.kind === 'faq');

  return (
    <>
      <Seo
        legacy={service.meta}
        image={service.hero.image}
        jsonLd={[breadcrumbLd(crumbs)]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={group ? group.title : 'Our services'}
        title={service.hero.title}
        lead={service.meta.description}
        actions={
          <>
            <a href="#enquire" className="btn btn-light">Get a free quote <i className="fa-solid fa-arrow-right" /></a>
            <a href={company.phoneHref} className="btn btn-ghost-light"><i className="fa-solid fa-phone" /> {company.phone}</a>
          </>
        }
        aside={service.hero.image && (
          <div className="hero-art">
            <img src={service.hero.image} alt={stripTags(service.hero.title)} />
          </div>
        )}
      />
      <div className="trust-strip">
        <div className="container">
          <span><i className="fa-solid fa-award" /> 10+ years experience</span>
          <span><i className="fa-solid fa-briefcase" /> 100+ projects delivered</span>
          <span><i className="fa-solid fa-location-dot" /> Indore &amp; Bengaluru teams</span>
          <span><i className="fa-solid fa-headset" /> Dedicated support</span>
        </div>
      </div>

      <Sections sections={service.sections.filter((s) => s !== faqSection)} />
      {faqSection && <Sections sections={[faqSection]} />}

      {related.length > 0 && (
        <section className="section tint">
          <div className="container">
            <SectionHead eyebrow="Related services" title={`More in ${group.title}`} />
            <div className="related-grid">
              {related.map(([name, slug]) => (
                <Link key={slug} to={`/${slug}`} className="related-link">
                  <Icon name={group.icon} /> <span>{name}</span> <i className="fa-solid fa-arrow-right" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section enquire" id="enquire">
        <div className="container split">
          <Reveal>
            <span className="eyebrow">Free consultation</span>
            <h2>Talk to our {label} team</h2>
            <p className="lead">Tell us about your goals. We’ll reply within one business day with recommendations, a timeline, and a transparent quote.</p>
            <ul className="ticks">
              <li>Free requirement analysis and strategy call</li>
              <li>Fixed-scope proposals with clear milestones</li>
              <li>NDA available on request</li>
            </ul>
          </Reveal>
          <Reveal className="form-card" delay={2}>
            <ContactForm source={`service: ${label}`} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
