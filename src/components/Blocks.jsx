import { Link } from 'react-router-dom';
import { Faq, Icon, Reveal, SmartLink, stripTags } from './ui.jsx';

const Html = ({ as: Tag = 'p', html, className }) => <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;

/* ------------------------------------------------------------ part renderers */

function Cards({ items, steps = false }) {
  const cols = items.length === 4 || items.length === 8 ? 'cols-4' : items.length === 2 ? 'cols-2' : items.length === 5 ? 'cols-5' : 'cols-3';
  return (
    <div className={`card-grid ${cols} ${steps ? 'steps' : ''}`}>
      {items.map((c, i) => (
        <Reveal key={`${c.title}-${i}`} delay={i} className={`info-card ${steps ? 'step-card' : ''}`}>
          {steps ? (
            <span className="step-num">{String(c.step || i + 1).padStart(2, '0')}</span>
          ) : (
            (c.icon || c.image) && (
              <span className="card-icon">
                {c.icon ? <Icon name={c.icon} /> : <img src={c.image} alt="" loading="lazy" />}
              </span>
            )
          )}
          <Html as="h3" html={c.title} />
          {c.text?.map((t, j) => <Html key={j} html={t} className="rich-inline" />)}
          {c.list && <ul className="ticks">{c.list.map((l, j) => <Html as="li" key={j} html={l} />)}</ul>}
          {c.href && <Link className="card-link" to={c.href}>Learn more <i className="fa-solid fa-arrow-right" /></Link>}
        </Reveal>
      ))}
    </div>
  );
}

function Stats({ items, dark }) {
  return (
    <div className={`stat-row ${dark ? 'dark' : ''}`}>
      {items.map((s, i) => (
        <Reveal key={i} delay={i} className="stat">
          <strong>{s.value}</strong>
          <span>{s.label}</span>
        </Reveal>
      ))}
    </div>
  );
}

function Chips({ items }) {
  return (
    <ul className="chip-list">
      {items.map((c, i) => (
        <li key={i}><Icon name={c.icon || 'fa-solid fa-circle-check'} /> {c.text}</li>
      ))}
    </ul>
  );
}

function Jobs({ items }) {
  return (
    <div className="job-grid">
      {items.map((j, i) => (
        <Reveal key={i} delay={i} className={`job-card ${j.featured ? 'featured' : ''}`}>
          <div className="job-top">
            <span className="job-logo">UM</span>
            {j.featured && <span className="badge">Featured</span>}
          </div>
          <h3>{j.title}</h3>
          {j.meta?.length > 0 && <p className="job-meta">{j.meta.map((m) => <span key={m}><i className="fa-solid fa-circle" /> {m}</span>)}</p>}
          {j.tags?.length > 0 && <div className="tag-row">{j.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}
          <div className="job-foot">
            {j.salary && <span className="salary">{j.salary}</span>}
            <Link to="/career#apply" className="btn btn-sm btn-primary">Apply</Link>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Groups consecutive [subheading, list] pairs into side-by-side panels. */
function groupParts(parts) {
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const next = parts[i + 1];
    if (p.type === 'subheading' && p.items.length === 1 && next && (next.type === 'list' || next.type === 'chips')) {
      const panel = { title: p.items[0], body: next };
      const last = out[out.length - 1];
      if (last && last.type === 'panels') last.items.push(panel);
      else out.push({ type: 'panels', items: [panel] });
      i++;
    } else out.push(p);
  }
  return out;
}

function Part({ part, kind }) {
  switch (part.type) {
    case 'text':
      return <div className="rich">{part.items.map((t, i) => <Html key={i} html={t} />)}</div>;
    case 'list':
      return <ul className="ticks rich">{part.items.map((t, i) => <Html as="li" key={i} html={t} />)}</ul>;
    case 'subheading':
      return part.items.map((t, i) => <Html as="h3" key={i} html={t} className="sub-h" />);
    case 'cards':
      return <Cards items={part.items} steps={kind === 'process'} />;
    case 'stats':
      return <Stats items={part.items} />;
    case 'chips':
      return <Chips items={part.items} />;
    case 'faq':
      return <Faq items={part.items} />;
    case 'jobs':
      return <Jobs items={part.items} />;
    case 'buttons':
      return (
        <div className="btn-row">
          {part.items.map((b, i) => (
            <SmartLink key={i} href={b.href} className={`btn ${i ? 'btn-outline' : 'btn-primary'}`}>{b.text}</SmartLink>
          ))}
        </div>
      );
    case 'image':
      return <img className="block-img" src={part.items[0].src} alt={part.items[0].alt || ''} loading="lazy" />;
    case 'panels':
      return (
        <div className={`panel-grid ${part.items.length === 2 ? 'compare' : ''}`}>
          {part.items.map((p, i) => (
            <Reveal key={i} delay={i} className={`panel ${i === 1 && part.items.length === 2 ? 'positive' : ''}`}>
              <Html as="h3" html={p.title} />
              {p.body.type === 'list'
                ? <ul className="ticks">{p.body.items.map((t, j) => <Html as="li" key={j} html={t} />)}</ul>
                : <Chips items={p.body.items} />}
            </Reveal>
          ))}
        </div>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------ section */

function CtaSection({ section }) {
  const text = section.parts.filter((p) => p.type === 'text').flatMap((p) => p.items);
  const buttons = section.parts.find((p) => p.type === 'buttons')?.items || [];
  const chips = section.parts.find((p) => p.type === 'chips')?.items || [];
  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta-band">
          <div className="cta-band-glow" aria-hidden="true" />
          <div className="rich light">
            {section.title && <Html as="h2" html={section.title} />}
            {text.slice(0, 2).map((t, i) => <Html key={i} html={t} />)}
            {chips.length > 0 && <p className="cta-chips">{chips.map((c) => c.text).join(' · ')}</p>}
          </div>
          <div className="btn-row">
            {(buttons.length ? buttons : [{ text: 'Get a free consultation', href: '/contact' }]).slice(0, 2).map((b, i) => (
              <SmartLink key={i} href={b.href} className={`btn ${i ? 'btn-ghost-light' : 'btn-light'}`}>{b.text}</SmartLink>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Section({ section, index }) {
  if (section.kind === 'cta') return <CtaSection section={section} />;
  const parts = groupParts(section.parts);
  const hasStats = parts.some((p) => p.type === 'stats');
  const hasCards = parts.some((p) => p.type === 'cards' || p.type === 'jobs' || p.type === 'faq');

  if (section.kind === 'stats' && !section.title) {
    return (
      <section className="section stats-strip">
        <div className="container"><Stats items={parts.find((p) => p.type === 'stats').items} dark /></div>
      </section>
    );
  }

  // Intro-style section: copy on the left, highlight card (subheading + stats) on the right.
  let main = parts;
  let aside = null;
  if (hasStats && !hasCards) {
    const cut = parts.findIndex((p) => p.type === 'subheading' || p.type === 'stats');
    main = parts.slice(0, cut);
    aside = parts.slice(cut);
  }

  const lead = main[0]?.type === 'text' && hasCards && main[0].items.length <= 2 ? main[0] : null;
  const body = lead ? main.slice(1) : main;
  const tone = index % 2 === 1 ? 'tint' : '';
  const textOnly = !aside && !hasCards && section.title && body.length > 0 &&
    body.every((p) => ['text', 'list', 'chips', 'subheading', 'buttons', 'panels'].includes(p.type)) &&
    !body.some((p) => p.type === 'panels');
  const isFaq = section.kind === 'faq';

  return (
    <section className={`section ${tone} kind-${section.kind}`} id={section.title ? stripTags(section.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60) : undefined}>
      <div className={`container ${isFaq ? 'narrow' : ''}`}>
        <div className={aside ? 'split' : textOnly ? 'split-text' : ''}>
          <div className={textOnly ? 'split-text-inner' : undefined}>
            {(section.title || section.badge) && (
              <Reveal className={`section-head ${!aside && !textOnly && (hasCards || isFaq) ? 'center' : ''}`}>
                {section.badge && <span className="eyebrow">{section.badge}</span>}
                {section.title && <Html as="h2" html={section.title} />}
                {lead && lead.items.map((t, i) => <Html key={i} html={t} className="lead" />)}
              </Reveal>
            )}
            <div className="section-body">
              {body.map((p, i) => <Part key={i} part={p} kind={section.kind} />)}
            </div>
          </div>
          {aside && (
            <Reveal className="highlight-card" delay={2}>
              {aside.map((p, i) => <Part key={i} part={p} kind={section.kind} />)}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

export function Sections({ sections }) {
  let n = 0;
  return sections.map((s, i) => <Section key={i} section={s} index={s.kind === 'cta' ? 0 : n++} />);
}
