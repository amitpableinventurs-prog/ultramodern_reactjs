import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------ Icon */
export function Icon({ name, className = '' }) {
  if (!name) return null;
  if (name.startsWith('emoji:')) return <span className={`emoji-icon ${className}`} aria-hidden="true">{name.slice(6)}</span>;
  return <i className={`${name} ${className}`} aria-hidden="true" />;
}

/* ------------------------------------------------------------ Reveal on scroll */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { setShown(true); return undefined; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={delay ? { ...style, transitionDelay: `${Math.min(delay, 8) * 70}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------ Smart link */
export function SmartLink({ href, children, ...rest }) {
  if (!href) return <span {...rest}>{children}</span>;
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const ext = href.startsWith('http');
    return <a href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>{children}</a>;
  }
  if (href.startsWith('#')) return <a href={href} {...rest}>{children}</a>;
  return <Link to={href} {...rest}>{children}</Link>;
}

/* ------------------------------------------------------------ Section heading */
export function SectionHead({ eyebrow, title, titleHtml, lead, center = false, light = false }) {
  return (
    <Reveal className={`section-head ${center ? 'center' : ''} ${light ? 'light' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {titleHtml ? <h2 dangerouslySetInnerHTML={{ __html: titleHtml }} /> : title && <h2>{title}</h2>}
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}

/* ------------------------------------------------------------ Breadcrumbs */
export function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map(([label, to], i) => (
        <span key={label}>
          {i < items.length - 1 ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}
          {i < items.length - 1 && <i className="fa-solid fa-chevron-right" aria-hidden="true" />}
        </span>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------ Page hero (inner pages) */
export function PageHero({ eyebrow, title, titleHtml, lead, crumbs, actions, aside, compact = false }) {
  return (
    <section className={`page-hero ${compact ? 'compact' : ''}`}>
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          {crumbs && <Breadcrumbs items={crumbs} />}
          {eyebrow && <span className="eyebrow light">{eyebrow}</span>}
          {titleHtml ? <h1 dangerouslySetInnerHTML={{ __html: titleHtml }} /> : <h1>{title}</h1>}
          {lead && <p className="lead">{lead}</p>}
          {actions && <div className="btn-row">{actions}</div>}
        </div>
        {aside && <div className="page-hero-aside">{aside}</div>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ FAQ accordion */
export function Faq({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="faq">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.q} delay={i % 4} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <h3>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span>{f.q}</span>
                <i className="fa-solid fa-plus" aria-hidden="true" />
              </button>
            </h3>
            <div className="faq-answer" hidden={!isOpen}>
              {/<p|<ul|<ol/.test(f.a)
                ? <div className="rich" dangerouslySetInnerHTML={{ __html: f.a }} />
                : <div className="rich"><p dangerouslySetInnerHTML={{ __html: f.a }} /></div>}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ Animated counter */
export function Counter({ value, suffix = '', duration = 1400 }) {
  const ref = useRef(null);
  const [n, setN] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    setN(0);
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        setN(Math.round(value * (1 - (1 - p) ** 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* ------------------------------------------------------------ Call-to-action band */
export function CtaBand({ title = 'Have a project in mind?', text = 'Tell us what you need. We reply within one business day with a clear plan, timeline, and quote.', primary = ['Get a free consultation', '/contact'], secondary = ['Call +91 86400 89400', 'tel:+918640089400'] }) {
  return (
    <section className="cta-band-wrap">
      <div className="container">
        <Reveal className="cta-band">
          <div className="cta-band-glow" aria-hidden="true" />
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="btn-row">
            <SmartLink href={primary[1]} className="btn btn-light">{primary[0]} <i className="fa-solid fa-arrow-right" /></SmartLink>
            {secondary && <SmartLink href={secondary[1]} className="btn btn-ghost-light"><i className="fa-solid fa-phone" /> {secondary[0]}</SmartLink>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export const stripTags = (s = '') => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
