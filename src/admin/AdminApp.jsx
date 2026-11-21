import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ApiError, RESOURCES, api, setUnauthorizedHandler } from './api.js';
import { Field, SeoFields } from './fields.jsx';
import './admin.css';

/** Set by the editor while it has unsaved changes; checked before following admin links. */
const unsaved = { current: false };
function guardLinks(e) {
  const a = e.target.closest('a');
  if (!a || !unsaved.current || a.target === '_blank') return;
  if (!window.confirm('You have unsaved changes. Leave without saving?')) {
    e.preventDefault();
    e.stopPropagation();
  } else {
    unsaved.current = false;
  }
}

/* ================================================================ auth */

export default function AdminApp() {
  const [state, setState] = useState({ loading: true, admin: null, setupRequired: false, error: '' });

  const refresh = useCallback(() => {
    api('/auth/me')
      .then((d) => setState({ loading: false, admin: d.admin, setupRequired: d.setupRequired, error: '' }))
      .catch((e) => setState({ loading: false, admin: null, setupRequired: false, error: e.message }));
  }, []);

  useEffect(() => {
    refresh();
    setUnauthorizedHandler(() => setState((s) => ({ ...s, admin: null })));
  }, [refresh]);

  const head = (
    <Helmet>
      <title>Admin | UltraModern Technologies</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );

  if (state.loading) return <div className="admin-boot">{head}Loading…</div>;
  if (state.error) {
    return (
      <AuthCard title="Admin is unavailable" head={head}>
        <p className="adm-alert error">{state.error}</p>
        <p className="adm-help">The admin panel needs the PHP API (<code>/api</code>). Locally, run <code>npm run api</code> next to <code>npm run dev</code>.</p>
        <button type="button" className="btn btn-primary btn-block" onClick={refresh}>Try again</button>
      </AuthCard>
    );
  }
  if (state.setupRequired) return <Setup head={head} onDone={refresh} />;
  if (!state.admin) return <Login head={head} onDone={refresh} />;
  return (
    <Shell admin={state.admin} onLogout={() => api('/auth/logout', { method: 'POST' }).finally(refresh)}>
      {head}
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="account" element={<Account admin={state.admin} />} />
        <Route path=":type" element={<ResourceList />} />
        <Route path=":type/new" element={<ResourceEditor />} />
        <Route path=":type/:id" element={<ResourceEditor />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  );
}

function AuthCard({ title, subtitle, head, children }) {
  return (
    <div className="adm-auth">
      {head}
      <div className="adm-auth-card">
        <img src="/IMG/umt-logo.png" alt="UltraModern Technologies" className="adm-auth-logo" />
        <h1>{title}</h1>
        {subtitle && <p className="adm-help">{subtitle}</p>}
        {children}
      </div>
      <Link to="/" className="adm-back"><i className="fa-solid fa-arrow-left" /> Back to website</Link>
    </div>
  );
}

function Login({ head, onDone }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { await api('/auth/login', { method: 'POST', body: form }); onDone(); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return (
    <AuthCard title="Sign in to the admin panel" subtitle="Manage portfolio, blog posts and job openings." head={head}>
      <form onSubmit={submit} className="adm-form-stack">
        {error && <p className="adm-alert error" role="alert">{error}</p>}
        <label className="adm-field"><span className="adm-label">Email</span><input type="email" autoComplete="username" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="adm-field"><span className="adm-label">Password</span><input type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </AuthCard>
  );
}

function Setup({ head, onDone }) {
  const [form, setForm] = useState({ key: '', name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setBusy(true); setError('');
    try { await api('/auth/setup', { method: 'POST', body: form }); onDone(); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return (
    <AuthCard title="Create the admin account" subtitle="One-time setup. You’ll use this account to manage the website content." head={head}>
      <form onSubmit={submit} className="adm-form-stack">
        {error && <p className="adm-alert error" role="alert">{error}</p>}
        <label className="adm-field">
          <span className="adm-label">Setup key</span>
          <input type="text" required value={form.key} onChange={set('key')} autoComplete="off" />
          <span className="adm-help">Found in the file <code>umt-data/setup-key.txt</code> next to your website folder (or run <code>php api/cli.php setup-key</code>).</span>
        </label>
        <label className="adm-field"><span className="adm-label">Your name</span><input type="text" required value={form.name} onChange={set('name')} /></label>
        <label className="adm-field"><span className="adm-label">Email</span><input type="email" required autoComplete="username" value={form.email} onChange={set('email')} /></label>
        <label className="adm-field"><span className="adm-label">Password (min. 10 characters)</span><input type="password" required minLength={10} autoComplete="new-password" value={form.password} onChange={set('password')} /></label>
        <label className="adm-field"><span className="adm-label">Confirm password</span><input type="password" required autoComplete="new-password" value={form.confirm} onChange={set('confirm')} /></label>
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating…' : 'Create admin account'}</button>
      </form>
    </AuthCard>
  );
}

/* ================================================================ layout */

function Shell({ admin, onLogout, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`adm ${open ? 'nav-open' : ''}`} onClickCapture={guardLinks}>
      <aside className="adm-side">
        <Link to="/admin" className="adm-brand" onClick={() => setOpen(false)}>
          <img src="/IMG/umt-logo-light.png" alt="UltraModern Technologies" />
          <span>Content admin</span>
        </Link>
        <nav onClick={() => setOpen(false)}>
          <NavLink end to="/admin"><i className="fa-solid fa-gauge" /> Dashboard</NavLink>
          {Object.entries(RESOURCES).map(([key, r]) => (
            <NavLink key={key} to={`/admin/${key}`}><i className={r.icon} /> {r.label}</NavLink>
          ))}
          <NavLink to="/admin/account"><i className="fa-solid fa-user-gear" /> Account</NavLink>
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-arrow-up-right-from-square" /> View website</a>
        </div>
      </aside>
      <div className="adm-main">
        <header className="adm-top">
          <button type="button" className="adm-burger" aria-label="Menu" onClick={() => setOpen(!open)}><i className="fa-solid fa-bars" /></button>
          <span className="adm-who"><span className="adm-avatar">{(admin.name || admin.email)[0].toUpperCase()}</span>{admin.name}</span>
          <button type="button" className="btn btn-sm btn-outline" onClick={onLogout}><i className="fa-solid fa-right-from-bracket" /> Sign out</button>
        </header>
        <main className="adm-content">{children}</main>
      </div>
      <div className="adm-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
    </div>
  );
}

function PageTitle({ title, children, back }) {
  return (
    <div className="adm-page-title">
      <div>
        {back && <Link to={back[1]} className="adm-crumb"><i className="fa-solid fa-arrow-left" /> {back[0]}</Link>}
        <h1>{title}</h1>
      </div>
      <div className="adm-actions">{children}</div>
    </div>
  );
}

/* ================================================================ dashboard */

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/admin/stats').then(setStats).catch((e) => setError(e.message)); }, []);
  return (
    <>
      <PageTitle title="Dashboard" />
      {error && <p className="adm-alert error">{error}</p>}
      <div className="adm-stats">
        {Object.entries(RESOURCES).map(([key, r]) => (
          <Link key={key} to={`/admin/${key}`} className="adm-stat">
            <span className="adm-stat-icon"><i className={r.icon} /></span>
            <span className="adm-stat-num">{stats ? stats[key].published : '–'}</span>
            <span className="adm-stat-label">{r.label} live{stats && stats[key].total > stats[key].published ? ` · ${stats[key].total - stats[key].published} draft` : ''}</span>
          </Link>
        ))}
      </div>
      <h2 className="adm-h2">Quick actions</h2>
      <div className="adm-quick">
        <Link to="/admin/posts/new" className="adm-quick-item"><i className="fa-solid fa-pen-to-square" /><span><strong>Write a blog post</strong>Publish an article with images and SEO settings</span></Link>
        <Link to="/admin/projects/new" className="adm-quick-item"><i className="fa-solid fa-images" /><span><strong>Add a portfolio project</strong>Upload screenshots and write the case study</span></Link>
        <Link to="/admin/jobs/new" className="adm-quick-item"><i className="fa-solid fa-user-plus" /><span><strong>Post a job opening</strong>It appears on the Careers page instantly</span></Link>
      </div>
      <div className="adm-note">
        <i className="fa-solid fa-circle-info" />
        <p>Changes go live as soon as you press <strong>Save</strong> with <strong>Published</strong> switched on. Drafts stay hidden from visitors and Google. Every page gets its own SEO title, description and Google preview.</p>
      </div>
    </>
  );
}

/* ================================================================ list */

function ResourceList() {
  const { type } = useParams();
  const def = RESOURCES[type];
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [savingOrder, setSavingOrder] = useState(false);

  const load = useCallback(() => {
    setItems(null);
    api(`/admin/${type}`).then((d) => setItems(d.items)).catch((e) => setError(e.message));
  }, [type]);
  useEffect(() => { if (def) load(); }, [def, load]);

  const shown = useMemo(() => (items || []).filter((i) => {
    if (filter === 'live' && !i.published) return false;
    if (filter === 'draft' && i.published) return false;
    return !q || JSON.stringify([i[def?.titleKey], i.slug, def?.subtitle(i)]).toLowerCase().includes(q.toLowerCase());
  }), [items, q, filter, def]);

  if (!def) return <Navigate to="/admin" replace />;

  const togglePublish = async (item) => {
    try {
      const { item: saved } = await api(`/admin/${type}/${item.id}`, { method: 'PUT', body: { ...item, published: !item.published } });
      setItems((list) => list.map((i) => (i.id === item.id ? saved : i)));
    } catch (e) { window.alert(e.message); }
  };
  const remove = async (item) => {
    if (!window.confirm(`Delete “${item[def.titleKey]}”? This cannot be undone.`)) return;
    try { await api(`/admin/${type}/${item.id}`, { method: 'DELETE' }); setItems((list) => list.filter((i) => i.id !== item.id)); } catch (e) { window.alert(e.message); }
  };
  const move = async (index, dir) => {
    const next = [...items];
    const [it] = next.splice(index, 1);
    next.splice(index + dir, 0, it);
    setItems(next);
    setSavingOrder(true);
    try { await api(`/admin/${type}/reorder`, { method: 'POST', body: { ids: next.map((i) => i.id) } }); } catch (e) { window.alert(e.message); load(); } finally { setSavingOrder(false); }
  };

  const canReorder = !q && filter === 'all';
  return (
    <>
      <PageTitle title={def.label}>
        <Link to={`/admin/${type}/new`} className="btn btn-primary"><i className="fa-solid fa-plus" /> New {def.singular}</Link>
      </PageTitle>
      {error && <p className="adm-alert error">{error}</p>}
      <div className="adm-toolbar">
        <div className="adm-search"><i className="fa-solid fa-magnifying-glass" /><input type="search" placeholder={`Search ${def.label.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="adm-seg" role="group" aria-label="Filter">
          {[['all', 'All'], ['live', 'Published'], ['draft', 'Drafts']].map(([k, l]) => (
            <button key={k} type="button" className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        {savingOrder && <span className="adm-help">Saving order…</span>}
      </div>
      {!items && !error && <div className="adm-card adm-empty">Loading…</div>}
      {items && shown.length === 0 && <div className="adm-card adm-empty">Nothing here yet. <Link to={`/admin/${type}/new`}>Create the first {def.singular}</Link>.</div>}
      {items && shown.length > 0 && (
        <ul className="adm-list">
          {shown.map((item) => {
            const index = items.indexOf(item);
            const img = def.image(item);
            return (
              <li key={item.id} className="adm-row">
                {canReorder && (
                  <span className="adm-order">
                    <button type="button" className="adm-icon-btn" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up"><i className="fa-solid fa-chevron-up" /></button>
                    <button type="button" className="adm-icon-btn" disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label="Move down"><i className="fa-solid fa-chevron-down" /></button>
                  </span>
                )}
                <span className={`adm-thumb ${img ? '' : 'none'}`}>{img ? <img src={img} alt="" loading="lazy" /> : <i className={type === 'jobs' ? item.icon || def.icon : def.icon} />}</span>
                <Link to={`/admin/${type}/${item.id}`} className="adm-row-main">
                  <strong>{item[def.titleKey]}</strong>
                  <span>{def.subtitle(item) || `${def.urlPrefix}${item.slug}`}</span>
                </Link>
                <button type="button" className={`adm-status ${item.published ? 'live' : 'draft'}`} onClick={() => togglePublish(item)} title="Click to switch">
                  {item.published ? 'Published' : 'Draft'}
                </button>
                <span className="adm-row-actions">
                  {item.published && <a href={def.viewUrl(item)} target="_blank" rel="noopener noreferrer" className="adm-icon-btn" aria-label="View on website"><i className="fa-solid fa-arrow-up-right-from-square" /></a>}
                  <Link to={`/admin/${type}/${item.id}`} className="adm-icon-btn" aria-label="Edit"><i className="fa-solid fa-pen" /></Link>
                  <button type="button" className="adm-icon-btn danger" onClick={() => remove(item)} aria-label="Delete"><i className="fa-solid fa-trash" /></button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

/* ================================================================ editor */

function ResourceEditor() {
  const { type, id } = useParams();
  const def = RESOURCES[type];
  const navigate = useNavigate();
  const isNew = !id;
  const [values, setValues] = useState(isNew && def ? { ...def.defaults, slug: '' } : null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!def || isNew) return;
    api(`/admin/${type}/${id}`)
      .then((d) => setValues({ ...def.defaults, ...d.item }))
      .catch((e) => setMessage({ type: 'error', text: e.message }));
  }, [type, id, def, isNew]);

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);
  useEffect(() => {
    unsaved.current = dirty;
    return () => { unsaved.current = false; };
  }, [dirty]);

  if (!def) return <Navigate to="/admin" replace />;
  if (!values) return message ? <p className="adm-alert error">{message.text}</p> : <div className="adm-card adm-empty">Loading…</div>;

  const set = (key) => (v) => { setValues((s) => ({ ...s, [key]: v })); setDirty(true); };
  const title = values[def.titleKey];

  const save = async (publish) => {
    setSaving(true); setMessage(null); setErrors({});
    const body = { ...values, published: publish ?? values.published };
    try {
      const { item } = isNew
        ? await api(`/admin/${type}`, { method: 'POST', body })
        : await api(`/admin/${type}/${id}`, { method: 'PUT', body });
      setValues({ ...def.defaults, ...item });
      setDirty(false);
      setMessage({ type: 'success', text: item.published ? 'Saved and live on the website.' : 'Saved as draft (not visible on the website).' });
      if (isNew) setTimeout(() => navigate(`/admin/${type}/${item.id}`, { replace: true }), 0);
    } catch (e) {
      if (e instanceof ApiError && e.fields) setErrors(e.fields);
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageTitle title={isNew ? `New ${def.singular}` : title || 'Untitled'} back={[def.label, `/admin/${type}`]}>
        {!isNew && values.published && <a href={def.viewUrl(values)} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><i className="fa-solid fa-arrow-up-right-from-square" /> View</a>}
      </PageTitle>
      {message && <p className={`adm-alert ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</p>}

      <form className="adm-editor" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <div className="adm-editor-main">
          {def.sections.map(([heading, fields]) => (
            <section key={heading} className="adm-card">
              <h2>{heading}</h2>
              <div className="adm-grid">
                {fields.map((f) => <Field key={f.key} field={f} value={values[f.key]} onChange={set(f.key)} error={errors[f.key]} />)}
              </div>
            </section>
          ))}
          <section className="adm-card">
            <h2>SEO</h2>
            <SeoFields
              meta={values.meta || {}}
              onChange={set('meta')}
              url={`${def.urlPrefix}${values.slug || 'new-url'}`}
              fallbackTitle={title ? `${title} | UltraModern Technologies` : ''}
              fallbackDescription={values.summary || values.excerpt || values.desc || ''}
            />
          </section>
        </div>

        <aside className="adm-editor-side">
          <section className="adm-card adm-publish">
            <h2>Publish</h2>
            <label className="adm-toggle">
              <input type="checkbox" checked={!!values.published} onChange={(e) => set('published')(e.target.checked)} />
              <span className="adm-switch" aria-hidden="true" />
              <span>{values.published ? 'Published (visible on website)' : 'Draft (hidden)'}</span>
            </label>
            <div className="adm-field">
              <label htmlFor="f-slug"><span className="adm-label">Page URL</span></label>
              <div className="adm-slug">
                <span>{def.urlPrefix}</span>
                <input id="f-slug" type="text" value={values.slug || ''} placeholder="auto from title" onChange={(e) => set('slug')(e.target.value)} />
              </div>
              <span className="adm-help">{isNew ? 'Leave empty to create it from the title.' : 'Changing the URL of a published page can lose its Google ranking.'}</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            {!values.published && <button type="button" className="btn btn-soft btn-block" disabled={saving} onClick={() => save(true)}>Save &amp; publish</button>}
            {dirty && <span className="adm-help center">Unsaved changes</span>}
            {!isNew && values.updatedAt && <span className="adm-help center">Last saved {values.updatedAt} UTC</span>}
          </section>
        </aside>
      </form>
    </>
  );
}

/* ================================================================ account */

function Account({ admin }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [msg, setMsg] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    if (form.next !== form.confirm) { setMsg({ type: 'error', text: 'New passwords do not match' }); return; }
    try {
      await api('/auth/password', { method: 'POST', body: form });
      setMsg({ type: 'success', text: 'Password changed.' });
      setForm({ current: '', next: '', confirm: '' });
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
  };
  return (
    <>
      <PageTitle title="Account" />
      <section className="adm-card adm-narrow">
        <h2>{admin.name}</h2>
        <p className="adm-help">{admin.email}</p>
        <form onSubmit={submit} className="adm-form-stack">
          {msg && <p className={`adm-alert ${msg.type}`}>{msg.text}</p>}
          <label className="adm-field"><span className="adm-label">Current password</span><input type="password" required autoComplete="current-password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} /></label>
          <label className="adm-field"><span className="adm-label">New password (min. 10 characters)</span><input type="password" required minLength={10} autoComplete="new-password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} /></label>
          <label className="adm-field"><span className="adm-label">Confirm new password</span><input type="password" required autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></label>
          <button className="btn btn-primary">Change password</button>
        </form>
      </section>
    </>
  );
}
