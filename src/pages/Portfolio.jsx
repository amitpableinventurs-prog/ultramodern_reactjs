import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import { DeviceStage, DeviceTags, ProjectCard, ScreenGallery } from '../components/Projects.jsx';
import { CtaBand, PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { categories, coverOf, getProject, projects as bundledProjects, splitShots } from '../data/portfolio.js';
import { useCmsItem, useCmsList } from '../lib/cms.js';
import { portfolioCollectionLd, projectLd } from '../lib/schema.js';
import NotFound from './NotFound.jsx';

const PORTFOLIO_TITLE = 'Portfolio: Apps, Platforms & Websites We’ve Built | UltraModern Technologies';
const PORTFOLIO_DESC = 'Case studies from UltraModern Technologies: Grovio quick-commerce, AnZ Cabs ride & transport, Bhumi Bazar real estate, Khushi Transport goods delivery, and more, with screenshots.';

/* ------------------------------------------------------------ /portfolio */
export function Portfolio() {
  const projects = useCmsList('projects', bundledProjects);
  const [cat, setCat] = useState('All');
  const list = useMemo(() => (cat === 'All' ? projects : projects.filter((p) => (p.category || []).includes(cat))), [cat, projects]);
  const spotlight = projects.filter((p) => p.isNew);

  return (
    <>
      <Seo
        title={PORTFOLIO_TITLE}
        description={PORTFOLIO_DESC}
        image={projects[0] ? coverOf(projects[0]).src : undefined}
        jsonLd={[breadcrumbLd([['Home', '/'], ['Portfolio', '/portfolio']]), portfolioCollectionLd(projects, { name: PORTFOLIO_TITLE, description: PORTFOLIO_DESC })]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Portfolio', '/portfolio']]}
        eyebrow="Our work"
        titleHtml="Products we’ve designed, built &amp; <span>launched</span>"
        lead="From multi-vendor quick-commerce and ride-hailing platforms to business websites: a look at the real products we’ve shipped for our clients."
        aside={
          <div className="hero-stats">
            <div><strong>{projects.length}+</strong><span>Featured projects</span></div>
            <div><strong>100+</strong><span>Websites &amp; apps delivered</span></div>
            <div><strong>8</strong><span>Industries served</span></div>
            <div><strong>98%</strong><span>Client satisfaction</span></div>
          </div>
        }
      />

      {spotlight.length > 0 && <section className="section">
        <div className="container">
          <SectionHead eyebrow="Latest launches" title="Spotlight projects" lead="Our most recent platforms, shown with screenshots of the delivered product." />
          <div className="spotlight-list">
            {spotlight.map((p, i) => (
              <Reveal key={p.slug} className={`spotlight ${i % 2 ? 'flip' : ''}`} style={{ '--accent': p.accent }}>
                <Link to={`/portfolio/${p.slug}`} className="spotlight-media" aria-label={`${p.name} case study`}>
                  <DeviceStage project={p} size="large" eager={i === 0} />
                </Link>
                <div className="spotlight-copy">
                  <span className="project-industry">{p.industry}</span>
                  <h3><Link to={`/portfolio/${p.slug}`}>{p.name}</Link></h3>
                  <p className="spot-tagline">{p.tagline}</p>
                  <p>{p.summary}</p>
                  <DeviceTags project={p} />
                  <ul className="ticks">{(p.features || []).slice(0, 3).map((f) => <li key={f}>{f}</li>)}</ul>
                  <div className="tag-row">{(p.tech || []).slice(0, 6).map((t) => <span key={t} className="tag">{t}</span>)}</div>
                  <Link to={`/portfolio/${p.slug}`} className="btn btn-primary">View case study <i className="fa-solid fa-arrow-right" /></Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>}

      <section className="section tint" id="all-projects">
        <div className="container">
          <SectionHead center eyebrow="All projects" title="Browse the full portfolio" />
          <div className="filters" role="tablist" aria-label="Filter projects">
            {categories.map((c) => {
              const count = c === 'All' ? projects.length : projects.filter((p) => (p.category || []).includes(c)).length;
              if (!count && c !== 'All') return null;
              return (
                <button key={c} type="button" role="tab" aria-selected={cat === c} className={`filter ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                  {c} <span>{count}</span>
                </button>
              );
            })}
          </div>
          <div className="project-grid" key={cat}>
            {list.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
          </div>
        </div>
      </section>

      <CtaBand title="Let’s build your next product" text="Have an app, platform, or website in mind? Share your idea and get a free consultation with a clear plan and estimate." />
    </>
  );
}

/* ------------------------------------------------------------ /portfolio/:slug */
export function ProjectDetail({ slug }) {
  const projects = useCmsList('projects', bundledProjects);
  const { item: project, status } = useCmsItem('projects', 'project', slug, getProject(slug));
  if (status === 'loading') return <PageHero compact title=" " lead="Loading project…" />;
  if (!project) return <NotFound />;
  const idx = Math.max(0, projects.findIndex((p) => p.slug.toLowerCase() === project.slug.toLowerCase()));
  const prev = projects[(idx - 1 + projects.length) % projects.length] || project;
  const next = projects[(idx + 1) % projects.length] || project;
  const { web, mobile } = splitShots(project);
  const shots = [...web, ...mobile]; // lightbox order: web screens first, then mobile screens
  const crumbs = [['Home', '/'], ['Portfolio', '/portfolio'], [project.name, `/portfolio/${project.slug}`]];
  const realCount = shots.filter((s) => !s.illustrative).length;
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

  return (
    <div style={{ '--accent': project.accent }}>
      <Seo
        legacy={project.meta}
        title={`${project.name}${project.tagline ? `: ${project.tagline}` : ''} | UltraModern Portfolio`}
        description={project.summary}
        image={shots[0].src}
        type="article"
        jsonLd={[breadcrumbLd(crumbs), projectLd(project)]}
      />
      <PageHero
        compact
        crumbs={crumbs}
        eyebrow={project.industry}
        title={project.name}
        lead={project.tagline}
        actions={<>{web.length > 0 && <a href="#gallery" className="btn btn-light"><i className="fa-solid fa-display" /> Web app</a>}{mobile.length > 0 && <a href="#mobile-screens" className={`btn ${web.length ? 'btn-ghost-light' : 'btn-light'}`}><i className="fa-solid fa-mobile-screen-button" /> Mobile view</a>}{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light"><i className="fa-solid fa-arrow-up-right-from-square" /> Visit live site</a> : <Link to="/contact" className="btn btn-ghost-light">Build something similar</Link>}</>}
      />

      <section className="section project-top" id="gallery">
        <div className="container">
          <ScreenGallery item={project} />
        </div>
      </section>

      <section className="section">
        <div className="container project-layout">
          <article className="project-story">
            <Reveal>
              <span className="eyebrow">Overview</span>
              <h2>About the project</h2>
              <p className="lead">{project.summary}</p>
            </Reveal>
            {(project.challenge || project.solution) && (
              <div className="story-grid">
                {project.challenge && (
                  <Reveal className="story-block">
                    <h3><i className="fa-solid fa-triangle-exclamation" /> The challenge</h3>
                    <p>{project.challenge}</p>
                  </Reveal>
                )}
                {project.solution && (
                  <Reveal className="story-block" delay={1}>
                    <h3><i className="fa-solid fa-lightbulb" /> Our solution</h3>
                    <p>{project.solution}</p>
                  </Reveal>
                )}
              </div>
            )}
            {project.features?.length > 0 && <Reveal>
              <h2 className="h-sm">Key features</h2>
              <ul className="feature-list">
                {(project.features || []).map((f) => <li key={f}><i className="fa-solid fa-check" /> {f}</li>)}
              </ul>
            </Reveal>}
          </article>
          <aside className="project-facts">
            <Reveal className="facts-card">
              <dl>
                <div><dt>Industry</dt><dd>{project.industry}</dd></div>
                {project.category?.length > 0 && <div><dt>Category</dt><dd>{project.category.join(', ')}</dd></div>}
                {project.platforms?.length > 0 && <div><dt>Platforms</dt><dd>{project.platforms.join(' · ')}</dd></div>}
                <div><dt>Delivered as</dt><dd><DeviceTags project={project} /></dd></div>
                <div><dt>Screenshots</dt><dd>{[web.length && plural(web.length, 'web screen'), mobile.length && plural(mobile.length, 'mobile screen')].filter(Boolean).join(' · ')}<small className="facts-note">{realCount === shots.length ? 'All real captures' : realCount ? `${realCount} real, ${shots.length - realCount} illustrative` : 'Illustrative previews'}</small></dd></div>
              </dl>
              {project.tech?.length > 0 && (
                <>
                  <h3>Tech stack</h3>
                  <div className="tag-row">{project.tech.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                </>
              )}
              <Link to="/contact" className="btn btn-primary btn-block">Start a similar project</Link>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section tint">
        <div className="container project-nav">
          <Link to={`/portfolio/${prev.slug}`} className="pn prev"><i className="fa-solid fa-arrow-left" /><span><small>Previous project</small>{prev.name}</span></Link>
          <Link to="/portfolio" className="pn all" aria-label="All projects"><i className="fa-solid fa-grip" /></Link>
          <Link to={`/portfolio/${next.slug}`} className="pn next"><span><small>Next project</small>{next.name}</span><i className="fa-solid fa-arrow-right" /></Link>
        </div>
      </section>

      <CtaBand title={`Want a product like ${project.name.split(' (')[0]}?`} text="We’ve done it before and can do it for your business: faster, with fewer surprises. Let’s talk about your idea." />
    </div>
  );
}
