import { Suspense, lazy, useRef, useState } from 'react';
import { uploadImage } from './api.js';

const RichText = lazy(() => import('./RichText.jsx'));

function Label({ field, children }) {
  return (
    <span className="adm-label">
      {children || field.label}{field.required && <b aria-hidden="true"> *</b>}
    </span>
  );
}

export function Field({ field, value, onChange, error }) {
  const id = `f-${field.key}`;
  const common = { id, 'aria-invalid': !!error };
  let control;
  switch (field.type) {
    case 'textarea':
      control = <textarea {...common} rows={field.rows || 4} value={value ?? ''} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'toggle':
      control = (
        <label className="adm-toggle" htmlFor={id}>
          <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span className="adm-switch" aria-hidden="true" />
          <span>{field.label}</span>
        </label>
      );
      break;
    case 'checks':
      control = (
        <div className="adm-checks">
          {field.options.map((o) => (
            <label key={o} className={`adm-check ${(value || []).includes(o) ? 'on' : ''}`}>
              <input type="checkbox" checked={(value || []).includes(o)} onChange={(e) => onChange(e.target.checked ? [...(value || []), o] : (value || []).filter((x) => x !== o))} />
              {o}
            </label>
          ))}
        </div>
      );
      break;
    case 'select':
      control = (
        <select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      );
      break;
    case 'icon':
      control = (
        <div className="adm-icon-select">
          <span className="adm-icon-preview"><i className={value || 'fa-solid fa-briefcase'} /></span>
          <select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            {field.options.map(([cls, name]) => <option key={cls} value={cls}>{name}</option>)}
          </select>
        </div>
      );
      break;
    case 'color':
      control = (
        <div className="adm-color">
          <input type="color" value={value || '#0a6fd1'} onChange={(e) => onChange(e.target.value)} aria-label={field.label} />
          <input {...common} type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
      break;
    case 'list':
      control = (
        <textarea
          {...common}
          rows={field.rows || 5}
          value={Array.isArray(value) ? value.join('\n') : value ?? ''}
          onChange={(e) => onChange(e.target.value.split('\n'))}
          onBlur={(e) => onChange(e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))}
        />
      );
      break;
    case 'image':
      control = <ImageInput value={value} onChange={onChange} />;
      break;
    case 'shots':
      control = <ShotsInput value={value || []} onChange={onChange} />;
      break;
    case 'rich':
      control = (
        <Suspense fallback={<div className="rte rte-loading">Loading editor…</div>}>
          <RichText value={value || ''} onChange={onChange} invalid={!!error} />
        </Suspense>
      );
      break;
    default:
      control = <input {...common} type="text" value={value ?? ''} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div className={`adm-field ${field.half ? 'half' : ''} ${error ? 'has-error' : ''}`}>
      {field.type !== 'toggle' && <label htmlFor={id}><Label field={field} /></label>}
      {control}
      {error ? <span className="adm-error">{error}</span> : field.help && <span className="adm-help">{field.help}</span>}
    </div>
  );
}

/* ------------------------------------------------------------ single image */
export function ImageInput({ value, onChange }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const pick = async (file) => {
    if (!file) return;
    setBusy(true); setErr('');
    try { onChange(await uploadImage(file)); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="adm-image">
      <div className="adm-image-preview">
        {value ? <img src={value} alt="" /> : <span><i className="fa-regular fa-image" /> No image</span>}
      </div>
      <div className="adm-image-actions">
        <button type="button" className="btn btn-sm btn-soft" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? <><i className="fa-solid fa-spinner fa-spin" /> Uploading…</> : <><i className="fa-solid fa-upload" /> {value ? 'Replace' : 'Upload image'}</>}
        </button>
        {value && <button type="button" className="adm-link danger" onClick={() => onChange('')}>Remove</button>}
        <input type="text" value={value || ''} placeholder="…or paste an image URL / path" onChange={(e) => onChange(e.target.value)} />
        {err && <span className="adm-error">{err}</span>}
      </div>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={(e) => { pick(e.target.files[0]); e.target.value = ''; }} />
    </div>
  );
}

/* ------------------------------------------------------------ screenshot gallery */
export function ShotsInput({ value, onChange }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState('');
  const update = (i, patch) => onChange(value.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const move = (i, d) => {
    const next = [...value];
    const [s] = next.splice(i, 1);
    next.splice(i + d, 0, s);
    onChange(next);
  };
  const addFiles = async (files) => {
    setErr('');
    const list = [...files];
    setBusy(list.length);
    let shots = [...value];
    for (const file of list) {
      try {
        const src = await uploadImage(file);
        shots = [...shots, { src, caption: file.name.replace(/\.[a-z]+$/i, '').replace(/[-_]+/g, ' '), type: 'desktop', illustrative: false }];
        onChange(shots);
      } catch (e) {
        setErr(`${file.name}: ${e.message}`);
      }
      setBusy((n) => n - 1);
    }
  };
  return (
    <div className="adm-shots">
      {value.length === 0 && <p className="adm-empty-note">No screenshots yet. Upload a few images of the website, app or admin panel.</p>}
      {value.map((s, i) => (
        <div key={`${s.src}-${i}`} className="adm-shot">
          <div className="adm-shot-img"><img src={s.src} alt="" />{i === 0 && <span className="adm-badge">Cover</span>}</div>
          <div className="adm-shot-fields">
            <input type="text" value={s.caption} placeholder="Caption, e.g. Admin dashboard" onChange={(e) => update(i, { caption: e.target.value })} />
            <div className="adm-shot-row">
              <select value={s.type} onChange={(e) => update(i, { type: e.target.value })} aria-label="Frame">
                <option value="desktop">Browser frame</option>
                <option value="mobile">Phone frame</option>
              </select>
              <label className="adm-inline-check"><input type="checkbox" checked={!!s.illustrative} onChange={(e) => update(i, { illustrative: e.target.checked })} /> Illustration</label>
            </div>
          </div>
          <div className="adm-shot-tools">
            <button type="button" className="adm-icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><i className="fa-solid fa-arrow-up" /></button>
            <button type="button" className="adm-icon-btn" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><i className="fa-solid fa-arrow-down" /></button>
            <button type="button" className="adm-icon-btn danger" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove screenshot"><i className="fa-solid fa-trash" /></button>
          </div>
        </div>
      ))}
      <div
        className="adm-drop"
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
      >
        {busy > 0 ? <><i className="fa-solid fa-spinner fa-spin" /> Uploading {busy} image{busy > 1 ? 's' : ''}…</> : <><i className="fa-solid fa-cloud-arrow-up" /> Click or drop screenshots here (you can select several)</>}
      </div>
      {err && <span className="adm-error">{err}</span>}
      <input ref={input} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
    </div>
  );
}

/* ------------------------------------------------------------ SEO */
export function SeoFields({ meta = {}, onChange, fallbackTitle, fallbackDescription, url }) {
  const set = (k) => (e) => onChange({ ...meta, [k]: e.target.value });
  const [ldText, setLdText] = useState(() => (meta.jsonLd?.length ? JSON.stringify(meta.jsonLd, null, 2) : ''));
  const [ldError, setLdError] = useState('');
  const title = meta.title || fallbackTitle || 'Page title';
  const desc = meta.description || fallbackDescription || '';
  return (
    <div className="adm-seo">
      <div className="adm-serp" aria-label="Google search preview">
        <span className="adm-serp-url">ultramoderntechnologies.com{url}</span>
        <span className="adm-serp-title">{title.length > 62 ? `${title.slice(0, 60)}…` : title}</span>
        <span className="adm-serp-desc">{desc.length > 160 ? `${desc.slice(0, 157)}…` : desc || 'Add a meta description to control this text.'}</span>
      </div>
      <div className="adm-field">
        <label htmlFor="seo-title"><span className="adm-label">Meta title</span></label>
        <input id="seo-title" type="text" value={meta.title || ''} placeholder={fallbackTitle} onChange={set('title')} />
        <span className={`adm-help ${(meta.title || '').length > 65 ? 'warn' : ''}`}>{(meta.title || '').length}/60 characters. Leave empty to use the default.</span>
      </div>
      <div className="adm-field">
        <label htmlFor="seo-desc"><span className="adm-label">Meta description</span></label>
        <textarea id="seo-desc" rows={3} value={meta.description || ''} placeholder={fallbackDescription} onChange={set('description')} />
        <span className={`adm-help ${(meta.description || '').length > 165 ? 'warn' : ''}`}>{(meta.description || '').length}/160 characters.</span>
      </div>
      <div className="adm-field half">
        <label htmlFor="seo-kw"><span className="adm-label">Keywords</span></label>
        <input id="seo-kw" type="text" value={meta.keywords || ''} placeholder="comma, separated, keywords" onChange={set('keywords')} />
      </div>
      <div className="adm-field half">
        <label htmlFor="seo-robots"><span className="adm-label">Search engines</span></label>
        <select id="seo-robots" value={meta.robots || 'index, follow'} onChange={set('robots')}>
          <option value="index, follow">Show in Google (index, follow)</option>
          <option value="noindex, follow">Hide from Google (noindex)</option>
        </select>
      </div>
      <details className="adm-advanced">
        <summary>Advanced: structured data (JSON-LD)</summary>
        <textarea
          rows={8}
          spellCheck={false}
          value={ldText}
          placeholder='[{"@context":"https://schema.org","@type":"FAQPage", …}]'
          onChange={(e) => {
            setLdText(e.target.value);
            if (!e.target.value.trim()) { setLdError(''); onChange({ ...meta, jsonLd: [] }); return; }
            try {
              const parsed = JSON.parse(e.target.value);
              setLdError('');
              onChange({ ...meta, jsonLd: Array.isArray(parsed) ? parsed : [parsed] });
            } catch {
              setLdError('Not valid JSON yet. Changes are saved once it is valid.');
            }
          }}
        />
        <span className={ldError ? 'adm-error' : 'adm-help'}>{ldError || 'Kept exactly as entered. Existing pages keep the structured data from the old website.'}</span>
      </details>
    </div>
  );
}
