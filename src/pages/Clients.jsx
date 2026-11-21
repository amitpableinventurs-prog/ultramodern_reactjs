import { Link, useOutletContext } from 'react-router-dom';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import { PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { clients, testimonials } from '../data/site.js';

const quoteFor = (name) => testimonials.find((t) => t.name === name);

export default function Clients() {
  const { openQuote } = useOutletContext();
  return (
    <>
      <Seo
        title="Our Clients | UltraModern Technologies, Indore"
        description="Businesses that trust UltraModern Technologies: hospitals, quick-commerce and transport platforms, EV brands, schools, and growing companies across India."
        jsonLd={[breadcrumbLd([['Home', '/'], ['Clients', '/clients']])]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Clients', '/clients']]}
        eyebrow="Our clients"
        title="Businesses that trust us"
        lead={`From hospitals and EV brands to quick-commerce and transport platforms: ${clients.length} businesses across India have built their websites, apps, and software with UltraModern Technologies.`}
      />
      <section className="section">
        <div className="container">
          <ul className="clients-wall">
            {clients.map((c) => {
              const quote = quoteFor(c.name);
              const body = (
                <>
                  <span className="clients-wall-logo"><img src={c.logo} alt={c.name} loading="lazy" /></span>
                  <strong>{c.name}</strong>
                  <small>{c.industry}</small>
                  {quote && <q>{quote.text.split('. ')[0].replace(/\.$/, '')}.</q>}
                  {c.project && <span className="clients-wall-link">View case study <i className="fa-solid fa-arrow-right" /></span>}
                </>
              );
              return (
                <Reveal as="li" key={c.name} className="clients-wall-item">
                  {c.project ? <Link to={`/portfolio/${c.project}`}>{body}</Link> : <div>{body}</div>}
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="section tint">
        <div className="container center">
          <SectionHead center eyebrow="Your business next" title="Let’s build something together" lead="Tell us about your project and we’ll come back with the right solution and a clear estimate." />
          <div className="btn-row center">
            <button type="button" className="btn btn-primary btn-lg" onClick={openQuote}>Get a free consultation <i className="fa-solid fa-arrow-right" /></button>
            <Link to="/portfolio" className="btn btn-outline btn-lg"><i className="fa-regular fa-folder-open" /> View our work</Link>
          </div>
        </div>
      </section>
    </>
  );
}
