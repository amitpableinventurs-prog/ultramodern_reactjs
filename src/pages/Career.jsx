import { Link } from 'react-router-dom';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import staticMeta from '../data/generated/static-meta.json';
import { Sections } from '../components/Blocks.jsx';
import { CareerForm } from '../components/Forms.jsx';
import { Icon, PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { jobs, jobTitle } from '../lib/content.js';
import { company } from '../data/site.js';
import { useCmsItem, useCmsList } from '../lib/cms.js';
import { fallbackJobs } from '../data/cmsFallback.js';
import { jobPostingLd } from '../lib/schema.js';
import NotFound from './NotFound.jsx';

const PERKS = [
  ['fa-solid fa-laptop-house', 'Flexible work', 'Hybrid and remote options depending on the project.'],
  ['fa-solid fa-chart-line', 'Clear growth path', 'Skill-based promotions, mentoring, and certifications.'],
  ['fa-solid fa-globe', 'Real projects', 'Ship products used by real businesses in India and abroad.'],
  ['fa-solid fa-heart-pulse', 'Health first', 'Medical coverage and a sustainable pace of work.'],
  ['fa-solid fa-chalkboard-user', 'Learning culture', 'Weekly tech talks, code reviews, and knowledge sharing.'],
  ['fa-solid fa-champagne-glasses', 'Fun events', 'Hackathons, celebrations, and team outings.'],
];

export function Career() {
  const openings = useCmsList('jobs', fallbackJobs);
  return (
    <>
      <Seo
        legacy={staticMeta['/career']}
        jsonLd={[breadcrumbLd([['Home', '/'], ['Career', '/career']])]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Career', '/career']]}
        eyebrow="We’re hiring"
        titleHtml="Shape tomorrow with <span>UltraModern</span>"
        lead="We don’t just build products, we build careers. Work on modern technology, learn from experienced engineers, and grow faster."
        actions={<><a href="#roles" className="btn btn-light">Explore roles</a><a href="#apply" className="btn btn-ghost-light">Apply now</a></>}
        aside={<div className="hero-photo"><img src="/IMG/popup (1).jpeg" alt="Life at UltraModern Technologies" /></div>}
      />

      <section className="section" id="roles">
        <div className="container">
          <SectionHead center eyebrow="Current opportunities" title="Open positions" lead="Full-time roles at our Indore office, plus hiring tracks with detailed role pages." />
          {openings.length === 0 && <p className="lead center">No open positions right now. Send us your resume below and we’ll reach out when a role opens up.</p>}
          <div className="card-grid cols-3">
            {openings.map((r, i) => (
              <Reveal key={r.slug} delay={i} className="role-card">
                <span className="card-icon"><Icon name={r.icon || 'fa-solid fa-briefcase'} /></span>
                <h3><Link to={`/career/${r.slug}`}>{r.title}</Link></h3>
                <p className="job-meta">
                  <span><i className="fa-solid fa-briefcase" /> {[r.type, r.location].filter(Boolean).join(' · ')}</span>
                  {r.exp && <span><i className="fa-solid fa-user-clock" /> {r.exp}</span>}
                </p>
                <p>{r.desc}</p>
                <div className="role-actions">
                  <Link to={`/career/${r.slug}#apply`} className="btn btn-sm btn-primary">Apply</Link>
                  <Link to={r.href || `/career/${r.slug}`} className="card-link">Role details <i className="fa-solid fa-arrow-right" /></Link>
                </div>
              </Reveal>
            ))}
          </div>
          <h3 className="sub-h center">Hiring tracks</h3>
          <div className="related-grid">
            {jobs.map((j) => (
              <Link key={j.slug} to={`/${j.slug}`} className="related-link">
                <i className="fa-solid fa-user-plus" /> <span>{jobTitle(j)}</span> <i className="fa-solid fa-arrow-right" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <SectionHead center eyebrow="Why join us" title="Perks &amp; culture" />
          <div className="card-grid cols-3">
            {PERKS.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i} className="info-card">
                <span className="card-icon"><Icon name={icon} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ApplySection roles={openings.map((o) => o.title)} />
    </>
  );
}

function ApplySection({ title = 'Send your application', roles, defaultRole = '' }) {
  return (
    <section className="section" id="apply">
      <div className="container split">
        <Reveal>
          <span className="eyebrow">Start your journey</span>
          <h2>{title}</h2>
          <p className="lead">Upload your resume and pick a role. Our hiring team reviews every application and responds within a week.</p>
          <div className="contact-list">
            <a href={company.phoneHref}><span><i className="fa-solid fa-phone" /></span><div><small>HR desk</small>{company.phone}</div></a>
            <a href={`mailto:${company.salesEmail}`}><span><i className="fa-solid fa-envelope" /></span><div><small>Email</small>{company.salesEmail}</div></a>
            <a href={company.offices[1].map} target="_blank" rel="noopener noreferrer"><span><i className="fa-solid fa-location-dot" /></span><div><small>Office</small>Crystal IT Park, Indore</div></a>
          </div>
        </Reveal>
        <Reveal className="form-card" delay={2}><CareerForm roles={roles} defaultRole={defaultRole} /></Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ job opening page */
export function JobPage({ job }) {
  const title = job.hero.title;
  const crumbs = [['Home', '/'], ['Career', '/career'], [jobTitle(job), `/${job.slug}`]];
  return (
    <>
      <Seo legacy={job.meta} jsonLd={[breadcrumbLd(crumbs)]} />
      <PageHero
        crumbs={crumbs}
        eyebrow={job.hero.badge || 'Now hiring'}
        title={title}
        lead={job.hero.text[0] ? job.hero.text[0].replace(/<[^>]+>/g, '') : job.meta.description}
        actions={<><a href="#apply" className="btn btn-light">Apply now <i className="fa-solid fa-arrow-right" /></a><Link to="/career" className="btn btn-ghost-light">All openings</Link></>}
      />
      <Sections sections={job.sections} />
      <ApplySection title={`Apply: ${jobTitle(job)}`} />
    </>
  );
}

/* ------------------------------------------------------------ job opening (managed in admin) */
export function JobOpening({ slug }) {
  const openings = useCmsList('jobs', fallbackJobs);
  const fallback = fallbackJobs.find((j) => j.slug === slug) || null;
  const { item: job, status } = useCmsItem('jobs', 'job', slug, fallback);
  if (status === 'loading') return <PageHero compact title=" " lead="Loading position…" />;
  if (!job) return <NotFound />;
  const crumbs = [['Home', '/'], ['Career', '/career'], [job.title, `/career/${job.slug}`]];
  const facts = [
    ['fa-solid fa-briefcase', 'Employment', job.type],
    ['fa-solid fa-location-dot', 'Location', job.location],
    ['fa-solid fa-user-clock', 'Experience', job.exp],
    ['fa-solid fa-indian-rupee-sign', 'Salary', job.salary],
    ['fa-solid fa-sitemap', 'Department', job.department],
  ].filter(([, , v]) => v);
  return (
    <>
      <Seo
        legacy={job.meta}
        title={`${job.title} Job in Indore | Careers at UltraModern Technologies`}
        description={job.desc}
        jsonLd={[breadcrumbLd(crumbs), jobPostingLd(job)]}
      />
      <PageHero
        compact
        crumbs={crumbs}
        eyebrow="Open position"
        title={job.title}
        lead={job.desc}
        actions={<><a href="#apply" className="btn btn-light">Apply now <i className="fa-solid fa-arrow-right" /></a><Link to="/career" className="btn btn-ghost-light">All openings</Link></>}
      />
      <section className="section">
        <div className="container project-layout">
          <article>
            {job.description
              ? <div className="rich prose" dangerouslySetInnerHTML={{ __html: job.description }} />
              : <p className="lead">{job.desc}</p>}
            {job.skills?.length > 0 && (
              <>
                <h2 className="h-sm">Skills we’re looking for</h2>
                <ul className="chip-list">{job.skills.map((sk) => <li key={sk}><i className="fa-solid fa-circle-check" /> {sk}</li>)}</ul>
              </>
            )}
            {job.href && <p><Link to={job.href} className="card-link">Read the full role guide <i className="fa-solid fa-arrow-right" /></Link></p>}
          </article>
          <aside className="project-facts">
            <div className="facts-card">
              <dl>{facts.map(([icon, label, v]) => <div key={label}><dt><i className={icon} /> {label}</dt><dd>{v}</dd></div>)}</dl>
              <a href="#apply" className="btn btn-primary btn-block">Apply for this role</a>
            </div>
          </aside>
        </div>
      </section>
      <ApplySection title={`Apply: ${job.title}`} roles={openings.map((o) => o.title)} defaultRole={job.title} />
    </>
  );
}
