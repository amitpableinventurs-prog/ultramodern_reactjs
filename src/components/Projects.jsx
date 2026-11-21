import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deviceKinds, splitShots } from '../data/portfolio.js';
import { Reveal } from './ui.jsx';

/** A screenshot shown inside a browser frame (web / admin) or a phone frame (mobile app). */
export function Shot({ shot, title, eager = false, onClick, className = '' }) {
  const mobile = shot.type === 'mobile';
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      className={`shot ${mobile ? 'shot-phone' : 'shot-browser'} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      aria-label={onClick ? `Enlarge screenshot: ${shot.caption}` : undefined}
    >
      {mobile
        ? <span className="shot-notch" aria-hidden="true" />
        : <span className="shot-bar" aria-hidden="true"><i /><i /><i /><b /></span>}
      <span className="shot-viewport">
        <img src={shot.src} alt={`${title}: ${shot.caption}`} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </span>
      {shot.illustrative && <span className="shot-flag">Illustration</span>}
    </Wrapper>
  );
}

/**
 * Device composition for a project:
 *  - web + mobile screens → browser window with a phone in front of it
 *  - mobile only          → up to three phones side by side
 *  - web only             → browser window (plus a second window in the large layout)
 */
export function DeviceStage({ project, size = 'card', eager = false }) {
  const { web, mobile } = splitShots(project);
  const title = project.name;
  if (mobile.length && !web.length) {
    return (
      <span className={`stage stage-${size} stage-phones n${Math.min(mobile.length, 3)}`}>
        {mobile.slice(0, 3).map((s, i) => <Shot key={s.src} shot={s} title={title} eager={eager && i === 0} />)}
      </span>
    );
  }
  return (
    <span className={`stage stage-${size} ${mobile.length ? 'stage-combo' : 'stage-web'}`}>
      <Shot shot={web[0]} title={title} eager={eager} className="stage-main" />
      {mobile.length > 0 && <span className="stage-phone"><Shot shot={mobile[0]} title={title} /></span>}
      {!mobile.length && size === 'large' && web[1] && <span className="stage-sub"><Shot shot={web[1]} title={title} /></span>}
    </span>
  );
}

/** "Mobile app" / "Web app" labels. */
export function DeviceTags({ project, className = '' }) {
  const k = deviceKinds(project);
  if (!k.app && !k.mobileWeb && !k.web && !k.site) return null;
  return (
    <span className={`device-tags ${className}`}>
      {k.app && <span className="device-tag"><i className="fa-solid fa-mobile-screen-button" /> Mobile app</span>}
      {k.web && <span className="device-tag"><i className="fa-solid fa-display" /> Web app</span>}
      {k.site && <span className="device-tag"><i className="fa-solid fa-globe" /> Website</span>}
      {k.mobileWeb && <span className="device-tag"><i className="fa-solid fa-mobile-screen" /> Mobile-friendly</span>}
    </span>
  );
}

export function ProjectCard({ project, index = 0, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <Reveal delay={index % 3} className="project-card" style={{ '--accent': project.accent || '#0a6fd1' }}>
      <Link to={`/portfolio/${project.slug}`} className="project-media" aria-label={`${project.name} case study`} tabIndex={-1}>
        <DeviceStage project={project} />
        <span className="project-badges">
          {project.isNew && <span className="badge badge-new">New</span>}
          {project.screenshots?.length > 0 && <span className="project-count"><i className="fa-regular fa-images" /> {project.screenshots.length}</span>}
        </span>
      </Link>
      <div className="project-body">
        <span className="project-industry">{project.industry}</span>
        <H><Link to={`/portfolio/${project.slug}`}>{project.name}</Link></H>
        <p>{project.summary}</p>
        <DeviceTags project={project} />
        <div className="tag-row">
          {(project.platforms || []).slice(0, 4).map((p) => <span key={p} className="tag">{p}</span>)}
        </div>
        <Link to={`/portfolio/${project.slug}`} className="card-link">View case study <i className="fa-solid fa-arrow-right" /></Link>
      </div>
    </Reveal>
  );
}

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

/**
 * Screenshot showcase for a case study or product: web screens in a browser frame with a
 * thumbnail column, then mobile screens as a row of phones. Everything opens in the lightbox.
 */
export function ScreenGallery({ item, mobileTitle }) {
  const { web, mobile } = splitShots(item);
  const shots = [...web, ...mobile]; // lightbox order: web screens first, then mobile screens
  const lb = useLightbox();
  const [active, setActive] = useState(0);
  const current = web[Math.min(active, web.length - 1)];
  const label = item.name.split(' (')[0];
  return (
    <>
      {web.length > 0 && (
        <div className={`gallery ${web.length > 1 ? '' : 'single'}`}>
          <div className="gallery-main">
            <Shot shot={current} title={item.name} eager onClick={() => lb.open(Math.min(active, web.length - 1))} />
            <p className="gallery-caption">
              <span className="device-tag"><i className="fa-solid fa-display" /> Web app</span>
              <span>{current.caption}{current.illustrative && <span className="muted"> · illustrative preview</span>}</span>
              <span className="gallery-zoom"><i className="fa-solid fa-magnifying-glass-plus" /> Click to enlarge</span>
            </p>
          </div>
          {web.length > 1 && (
            <div className="gallery-thumbs" role="tablist" aria-label={`Web app screenshots (${web.length})`}>
              {web.map((s, i) => (
                <button key={s.src} type="button" role="tab" aria-selected={i === active} className={`thumb ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
                  <img src={s.src} alt="" loading="lazy" />
                  <span>{s.caption}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {mobile.length > 0 && (
        <div className={`phone-gallery ${web.length ? '' : 'first'}`} id="mobile-screens">
          <div className="phone-gallery-head">
            <span className="device-tag"><i className="fa-solid fa-mobile-screen-button" /> Mobile view</span>
            <h2>{mobileTitle || (web.length ? 'On mobile' : 'App screens')}</h2>
            <p>{plural(mobile.length, 'screen')} of the {label} mobile experience. Tap a screen to enlarge it.</p>
          </div>
          <div className={`phone-row n${Math.min(mobile.length, 4)}`}>
            {mobile.map((s, i) => (
              <figure key={s.src} className="phone-item">
                <Shot shot={s} title={item.name} onClick={() => lb.open(web.length + i)} />
                <figcaption>{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
      <Lightbox shots={shots} index={lb.index} title={item.name} onClose={lb.close} onIndex={lb.setIndex} />
    </>
  );
}

/** Fullscreen screenshot viewer with keyboard navigation. */
export function Lightbox({ shots, index, title, onClose, onIndex }) {
  const go = useCallback((d) => onIndex((index + d + shots.length) % shots.length), [index, shots.length, onIndex]);
  useEffect(() => {
    if (index < 0) return undefined;
    document.body.classList.add('no-scroll');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('no-scroll'); window.removeEventListener('keydown', onKey); };
  }, [index, go, onClose]);
  if (index < 0) return null;
  const s = shots[index];
  const mobile = s.type === 'mobile';
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} screenshots`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button type="button" className="icon-btn lb-close" aria-label="Close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
      {shots.length > 1 && <button type="button" className="icon-btn lb-prev" aria-label="Previous" onClick={() => go(-1)}><i className="fa-solid fa-chevron-left" /></button>}
      <figure className={mobile ? 'mobile' : ''}>
        <img src={s.src} alt={`${title}: ${s.caption}`} />
        <figcaption>
          <i className={`fa-solid ${mobile ? 'fa-mobile-screen-button' : 'fa-display'}`} /> {s.caption}{s.illustrative ? ' · Illustration' : ''}
          <span>{index + 1} / {shots.length}</span>
        </figcaption>
      </figure>
      {shots.length > 1 && <button type="button" className="icon-btn lb-next" aria-label="Next" onClick={() => go(1)}><i className="fa-solid fa-chevron-right" /></button>}
    </div>
  );
}

export function useLightbox() {
  const [index, setIndex] = useState(-1);
  return { index, open: setIndex, close: () => setIndex(-1), setIndex };
}
