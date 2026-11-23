import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { company, jobLinks, serviceGroups } from '../data/site.js';
import { ConsultationPanel } from './Forms.jsx';
import Chatbot from './Chatbot.jsx';

const NAV = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services', 'mega'],
  ['Products', '/products'],
  ['Portfolio', '/portfolio'],
  ['Career', '/career'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
];

/* ------------------------------------------------------------ Services mega menu */
function MegaMenu({ pathname, onFocus, onBlur, onNavigate }) {
  const current = serviceGroups.findIndex((g) => g.items.some(([, s]) => pathname.toLowerCase() === `/${s.toLowerCase()}`));
  const [active, setActive] = useState(current < 0 ? 0 : current);
  useEffect(() => { if (current >= 0) setActive(current); }, [current]);
  const group = serviceGroups[active];

  return (
    <div className="mega" onFocus={onFocus} onBlur={onBlur}>
      <div className="mega-tabs" role="tablist" aria-label="Service categories">
        {serviceGroups.map((g, i) => (
          <button
            key={g.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`mega-tab ${i === active ? 'active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <span className="mt-icon"><i className={g.icon} /></span>
            <span className="mt-text">{g.title}<small>{g.items.length} services</small></span>
            <i className="fa-solid fa-chevron-right mt-arrow" />
          </button>
        ))}
      </div>

      <div className="mega-panel" role="tabpanel" key={group.title}>
        <div className="mega-panel-head">
          <h4>{group.title}</h4>
          <p>{group.blurb}</p>
        </div>
        <ul className="mega-links">
          {group.items.map(([name, slug]) => {
            const isCurrent = pathname.toLowerCase() === `/${slug.toLowerCase()}`;
            return (
              <li key={slug}>
                <Link to={`/${slug}`} className={isCurrent ? 'current' : ''} onClick={onNavigate}>
                  <i className="fa-solid fa-arrow-right" />
                  <span>{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mega-panel-foot">
          <span><i className="fa-solid fa-award" /> 10+ years</span>
          <span><i className="fa-solid fa-briefcase" /> 100+ projects</span>
          <span><i className="fa-solid fa-location-dot" /> Indore &amp; Bengaluru</span>
          <Link to={`/services#${group.title.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}`} onClick={onNavigate}>
            Explore {group.title} <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>

      <div className="mega-promo">
        <span className="eyebrow light">Free consultation</span>
        <strong>Not sure which service you need?</strong>
        <p>Tell us your goal. We’ll recommend the right solution and a clear estimate.</p>
        <div className="expert-chip">
          <span className="expert-avatar" aria-hidden="true"><i className="fa-solid fa-headset" /></span>
          <span><small>Free consultation</small>Talk to our Sales Advisor</span>
        </div>
        <Link to="/contact" className="btn btn-light btn-sm btn-block" onClick={onNavigate}>Talk to Sales Advisor</Link>
        <Link to="/services" className="mega-all" onClick={onNavigate}>View all 37 services <i className="fa-solid fa-arrow-right" /></Link>
        <a href={company.phoneHref} className="mega-phone"><i className="fa-solid fa-phone" /> {company.phone}</a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Social icons (brand-colour logos, as on the legacy site) */
export function SocialIcons({ className = '', size = 18 }) {
  return (
    <div className={`social-icons ${className}`}>
      {company.social.map((s) => (
        <a key={s.label} href={s.href} {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label={s.label} title={s.label}>
          <img src={s.img} alt="" width={size} height={size} loading="lazy" />
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ Header */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [mega, setMega] = useState(false);
  const [openGroup, setOpenGroup] = useState(-1);
  const { pathname } = useLocation();
  const closeTimer = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setDrawer(false); setMega(false); }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', drawer);
    const onKey = (e) => e.key === 'Escape' && (setDrawer(false), setMega(false));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer]);

  const openMega = () => { clearTimeout(closeTimer.current); setMega(true); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMega(false), 140); };
  const isServicePath = pathname === '/services' || serviceGroups.some((g) => g.items.some(([, s]) => pathname.toLowerCase() === `/${s.toLowerCase()}`));

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-info">
            <a href={company.offices[0].map} target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-location-dot" /> 565, Sapna Sangeeta Rd, near Axis Bank, Snehnagar, Indore</a>
            <a href={company.offices[0].map} target="_blank" rel="noopener noreferrer" className="hide-md"><i className="fa-solid fa-map-location-dot" /> View map</a>
          </div>
          <SocialIcons className="topbar-social" />
        </div>
      </div>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={`${company.short} home`}>
            <img src="/IMG/umt-logo.png" alt={company.name} width="197" height="40" />
          </Link>

          <nav className="main-nav" aria-label="Main">
            {NAV.map(([label, to, kind]) =>
              kind === 'mega' ? (
                <div key={to} className={`nav-item has-mega ${mega ? 'open' : ''}`} onMouseEnter={openMega} onMouseLeave={closeMega}>
                  <Link to={to} className={`nav-link ${isServicePath ? 'active' : ''}`} aria-haspopup="true" aria-expanded={mega} onFocus={openMega}>
                    {label} <i className="fa-solid fa-chevron-down" />
                  </Link>
                  <MegaMenu pathname={pathname} onFocus={openMega} onBlur={closeMega} onNavigate={() => setMega(false)} />
                </div>
              ) : (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive || (to !== '/' && pathname.startsWith(`${to}/`)) ? 'active' : ''}`}>
                  {label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="header-cta">
            <a href={company.phoneHref} className="call-now hide-sm">Call now</a>
            <button type="button" className={`burger ${drawer ? 'open' : ''}`} aria-label={drawer ? 'Close menu' : 'Open menu'} aria-expanded={drawer} onClick={() => setDrawer((d) => !d)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop ${drawer ? 'show' : ''}`} onClick={() => setDrawer(false)} aria-hidden="true" />
      <aside className={`drawer ${drawer ? 'open' : ''}`} aria-hidden={!drawer} aria-label="Mobile menu">
        <div className="drawer-head">
          <img src="/IMG/umt-logo.png" alt="" width="162" height="33" />
          <button type="button" className="icon-btn" aria-label="Close menu" onClick={() => setDrawer(false)}><i className="fa-solid fa-xmark" /></button>
        </div>
        <nav className="drawer-nav">
          {NAV.filter(([, , k]) => k !== 'mega').slice(0, 2).map(([l, to]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}
          <div className="drawer-group">
            <Link to="/services" className="drawer-group-title">Services</Link>
            {serviceGroups.map((g, i) => (
              <div key={g.title} className={`drawer-acc ${openGroup === i ? 'open' : ''}`}>
                <button type="button" onClick={() => setOpenGroup(openGroup === i ? -1 : i)} aria-expanded={openGroup === i}>
                  <span><i className={g.icon} /> {g.title}</span><i className="fa-solid fa-chevron-down" />
                </button>
                {openGroup === i && (
                  <ul>{g.items.map(([name, slug]) => <li key={slug}><Link to={`/${slug}`}>{name}</Link></li>)}</ul>
                )}
              </div>
            ))}
          </div>
          {NAV.slice(3).map(([l, to]) => <NavLink key={to} to={to}>{l}</NavLink>)}
        </nav>
        <div className="drawer-foot">
          <a className="btn btn-primary btn-block" href={company.phoneHref}><i className="fa-solid fa-phone" /> {company.phone}</a>
          <a className="btn btn-soft btn-block" href={company.whatsapp} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp" /> WhatsApp us</a>
          <SocialIcons className="drawer-social" size={24} />
        </div>
      </aside>
    </>
  );
}

/* ------------------------------------------------------------ Footer */
function Footer() {
  const year = new Date().getFullYear();
  const cols = [
    ['Marketing', serviceGroups[0].items],
    ['Development', [...serviceGroups[1].items.slice(0, 3), ...serviceGroups[2].items.slice(0, 2), serviceGroups[1].items[8]]],
    ['Software & QA', [...serviceGroups[4].items.slice(0, 4), ...serviceGroups[5].items.slice(0, 2)]],
  ];
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <span className="footer-logo"><img src="/IMG/umt-logo.png" alt={company.name} width="216" height="44" loading="lazy" /></span>
          <p>We help businesses grow online with modern website design, custom software, mobile apps, SEO, digital marketing, and AI-powered solutions, serving clients across India and internationally.</p>
          <div className="footer-contact">
            <a href={company.phoneHref}><i className="fa-solid fa-phone" /> {company.phone}</a>
            <a href={company.phone2Href}><i className="fa-solid fa-phone" /> {company.phone2}</a>
            <a href={`mailto:${company.salesEmail}`}><i className="fa-solid fa-envelope" /> {company.salesEmail}</a>
          </div>
          <SocialIcons className="footer-social" size={20} />
        </div>
        {cols.map(([title, items]) => (
          <div key={title} className="footer-col">
            <h3>{title}</h3>
            <ul>{items.map(([name, slug]) => <li key={slug}><Link to={`/${slug}`}>{name}</Link></li>)}</ul>
          </div>
        ))}
        <div className="footer-col">
          <h3>Jobs</h3>
          <ul>{jobLinks.map(([name, slug]) => <li key={slug}><Link to={`/${slug}`}>{name}</Link></li>)}</ul>
        </div>
        <div className="footer-col">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/clients">Our clients</Link></li>
            <li><Link to="/services">All services</Link></li>
            <li><Link to="/career">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy-policy">Privacy policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-offices">
        {company.offices.map((o) => (
          <a key={o.address} href={o.map} target="_blank" rel="noopener noreferrer" className="office">
            <i className="fa-solid fa-location-dot" />
            <span><strong>{o.name}, {o.city}</strong>{o.address}</span>
          </a>
        ))}
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {year} {company.name.replace(/\.$/, '')}. All rights reserved.</span>
          <SocialIcons size={20} />
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------ Enquiry modal */
function QuoteModal({ open, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('no-scroll');
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    ref.current?.querySelector('input')?.focus();
    return () => { document.body.classList.remove('no-scroll'); window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal consult" role="dialog" aria-modal="true" aria-labelledby="quote-title" ref={ref}>
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        <ConsultationPanel source="quote popup" headingId="quote-title" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Layout */
export default function Layout() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(false);
  const [showTop, setShowTop] = useState(false);

  // scroll to top (or to hash) on route change
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  // Analytics: the first page load is counted by GTM itself; in-app navigations push a
  // `virtual_page_view` event so GTM/GA4 can record them like the old full-page loads.
  const lastTracked = useRef(null);
  useEffect(() => {
    if (lastTracked.current === null || lastTracked.current === pathname) {
      lastTracked.current = pathname; // initial load (or a repeated effect run): GTM already counted it
      return undefined;
    }
    lastTracked.current = pathname;
    const t = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'virtual_page_view',
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 50); // let react-helmet update document.title first
    return () => clearTimeout(t);
  }, [pathname]);

  // route internal links inside extracted rich HTML through the router
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('.rich a[href^="/"]');
      if (!a || a.target === '_blank') return;
      e.preventDefault();
      navigate(a.getAttribute('href'));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  // gentle one-time enquiry prompt: desktop only (no mobile interstitials), once per session, not on contact pages
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    let t;
    try {
      if (window.innerWidth >= 1024 && !sessionStorage.getItem('umt-quote-shown') && !/contact|career/.test(pathname)) {
        t = setTimeout(() => {
          setQuote(true);
          try { sessionStorage.setItem('umt-quote-shown', '1'); } catch { /* ignore */ }
        }, 25000);
      }
    } catch { /* storage blocked */ }
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main"><Outlet context={{ openQuote: () => setQuote(true) }} /></main>
      <Footer />
      <button type="button" className="side-tab" onClick={() => setQuote(true)}>Get in touch</button>
      <Chatbot />
      <div className="floating">
        <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="float-btn float-wa" aria-label="Chat on WhatsApp"><i className="fa-brands fa-whatsapp" /></a>
        <a href={company.phoneHref} className="float-btn float-call" aria-label="Call us"><i className="fa-solid fa-phone" /></a>
        <button type="button" className={`float-btn float-top ${showTop ? 'show' : ''}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><i className="fa-solid fa-arrow-up" /></button>
      </div>
      <QuoteModal open={quote} onClose={() => setQuote(false)} />
    </>
  );
}
