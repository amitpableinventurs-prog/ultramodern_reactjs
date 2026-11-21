import { useState } from 'react';
import Seo, { breadcrumbLd, organizationLd } from '../components/Seo.jsx';
import staticMeta from '../data/generated/static-meta.json';
import { ContactForm } from '../components/Forms.jsx';
import { PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { company } from '../data/site.js';

export default function Contact() {
  const [office, setOffice] = useState(0);
  const o = company.offices[office];
  return (
    <>
      <Seo
        legacy={staticMeta['/contact']}
        jsonLd={[organizationLd, breadcrumbLd([['Home', '/'], ['Contact', '/contact']])]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Contact', '/contact']]}
        eyebrow="Our team responds within 24 hours"
        titleHtml="Get in touch with <span>UltraModern Technologies</span>"
        lead="Have a project in mind, need a consultation, or want to know if we’re the right fit? We’re happy to talk. Our team is available Monday to Saturday."
      />

      <section className="section contact-cards-wrap">
        <div className="container">
          <div className="contact-cards">
            {[
              ['fa-solid fa-phone', 'Call us', company.phone, company.phoneHref],
              ['fa-brands fa-whatsapp', 'WhatsApp', 'Chat with our team', company.whatsapp],
              ['fa-solid fa-envelope', 'Email', company.salesEmail, `mailto:${company.salesEmail}`],
              ['fa-regular fa-clock', 'Working hours', company.hours, null],
            ].map(([icon, label, value, href], i) => {
              const inner = <><span className="cc-icon"><i className={icon} /></span><small>{label}</small><strong>{value}</strong></>;
              return href
                ? <Reveal key={label} delay={i} as="a" href={href} className="contact-card" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</Reveal>
                : <Reveal key={label} delay={i} className="contact-card">{inner}</Reveal>;
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split contact-split">
          <Reveal className="form-card">
            <span className="eyebrow">Business enquiry</span>
            <h2>How can we help you?</h2>
            <p className="muted">Tell us about your industry, what you need built, and when you’d like to start. We’ll take it from there.</p>
            <ContactForm source="contact page" />
          </Reveal>
          <div>
            <SectionHead eyebrow="Our offices" title="Visit us in Indore" lead="Our offices are open Monday to Saturday. You’re welcome to walk in for a consultation." />
            <div className="office-tabs" role="tablist" aria-label="Offices">
              {company.offices.map((x, i) => (
                <button key={x.address} type="button" role="tab" aria-selected={office === i} className={`office-tab ${office === i ? 'active' : ''}`} onClick={() => setOffice(i)}>
                  <strong>{x.name} · {x.city}</strong>
                  <span>{x.address}</span>
                </button>
              ))}
            </div>
            <div className="map-frame">
              <iframe key={o.embed} title={`Map: ${o.name}, ${o.city}`} src={o.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
            <a href={o.map} target="_blank" rel="noopener noreferrer" className="card-link"><i className="fa-solid fa-diamond-turn-right" /> Get directions to {o.name}, {o.city}</a>
          </div>
        </div>
      </section>
    </>
  );
}
