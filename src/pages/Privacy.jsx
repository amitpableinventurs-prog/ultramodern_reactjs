import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import { PageHero } from '../components/ui.jsx';
import { useItem } from '../lib/content.js';

export default function Privacy() {
  const privacy = useItem('privacy-policy');
  if (!privacy) return <PageHero compact title="Privacy policy" />;
  return (
    <>
      <Seo
        legacy={privacy.meta}
        title="Privacy Policy | UltraModern Technologies"
        description="How UltraModern Technologies collects, uses, and protects your personal information."
        jsonLd={[breadcrumbLd([['Home', '/'], ['Privacy policy', '/privacy-policy']])]}
      />
      <PageHero
        compact
        crumbs={[['Home', '/'], ['Privacy policy', '/privacy-policy']]}
        eyebrow="Effective date: June 10, 2026"
        title="Privacy policy"
        lead="We take your privacy seriously. This policy explains what we collect, why we collect it, who can see it, and what you can do about it."
      />
      <section className="section">
        <div className="container policy-layout">
          <nav className="policy-toc" aria-label="On this page">
            <strong>On this page</strong>
            <ol>
              {privacy.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title.replace(/^UltraModern Technologies Pvt\. Ltd\. — /, '')}</a></li>)}
            </ol>
          </nav>
          <div className="policy-body">
            {privacy.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="policy-section">
                {s.tag && <span className="eyebrow">{String(i).padStart(2, '0')} · {s.tag}</span>}
                <h2>{s.title}</h2>
                <div className="rich prose" dangerouslySetInnerHTML={{ __html: s.html }} />
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
