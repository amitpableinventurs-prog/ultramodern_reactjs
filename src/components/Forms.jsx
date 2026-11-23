import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { careerRoles, cloudinaryConfig, emailjsConfig, enquiryServices } from '../data/site.js';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RX = /^[6-9]\d{9}$/;

async function sendEmail(template, params) {
  const { default: emailjs } = await import('@emailjs/browser');
  return emailjs.send(emailjsConfig.serviceId, template, params, { publicKey: emailjsConfig.publicKey });
}

function Field({ label, error, children, full, hideLabel }) {
  return (
    <label className={`field ${full ? 'full' : ''} ${error ? 'has-error' : ''}`}>
      <span className={hideLabel ? 'field-label sr-only' : 'field-label'}>{label}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

function Status({ status }) {
  if (!status) return null;
  return (
    <div className={`form-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>
      <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`} aria-hidden="true" />
      <span>{status.text}</span>
    </div>
  );
}

/* ------------------------------------------------------------ Enquiry form */
/** Enquiry form. Optional props turn it into another kind of request (e.g. a product demo): `services`
 *  replaces the service list, and the labels change the wording. Submissions go to the same EmailJS template.
 *  `popup` = the "Get a Free Consultation" popup look: one column, placeholder-only fields, "I'm not a robot". */
export function ContactForm({
  compact = false, popup = false, defaultService = '', source = 'website', services = enquiryServices,
  serviceLabel = 'Service', messageLabel = 'Project details', messagePlaceholder = 'What would you like to build or improve?', submitLabel = 'Send enquiry',
}) {
  const [values, setValues] = useState({ name: '', email: '', phone: '', service: defaultService, message: '', consent: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = 'Please enter your name';
    if (!EMAIL_RX.test(values.email.trim())) e.email = 'Enter a valid email address';
    if (!PHONE_RX.test(values.phone.replace(/\D/g, '').slice(-10))) e.phone = 'Enter a valid 10-digit mobile number';
    if (!values.service) e.service = `Choose a ${serviceLabel.toLowerCase()}`;
    if (values.message.trim().length < 5) e.message = services === enquiryServices ? 'Tell us a little about your project' : 'Tell us a little about your requirement';
    if (!values.consent) e.consent = 'Please confirm to continue';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setStatus(null);
    if (!validate()) return;
    setSending(true);
    try {
      await sendEmail(emailjsConfig.enquiryTemplate, {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.replace(/\D/g, '').slice(-10),
        service: values.service,
        message: `${values.message.trim()}\n\n(Source: ${source})`,
      });
      setStatus({ type: 'success', text: `Thank you, ${values.name.trim().split(' ')[0]}! Your message has been sent. Our team will contact you within one business day.` });
      setValues({ name: '', email: '', phone: '', service: defaultService, message: '', consent: false });
    } catch {
      setStatus({ type: 'error', text: 'Something went wrong while sending. Please try again or call us on +91 86400 89400.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className={`form ${compact ? 'compact' : ''} ${popup ? 'form-popup' : ''}`} onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <Field label="Full name *" error={errors.name} hideLabel={popup}>
          <input type="text" autoComplete="name" placeholder={popup ? 'Name' : 'Your name'} value={values.name} onChange={set('name')} />
        </Field>
        <Field label="Email *" error={errors.email} hideLabel={popup}>
          <input type="email" autoComplete="email" placeholder={popup ? 'Email' : 'you@company.com'} value={values.email} onChange={set('email')} />
        </Field>
        <Field label="Phone *" error={errors.phone} hideLabel={popup}>
          <input type="tel" autoComplete="tel" inputMode="numeric" placeholder={popup ? 'Phone No' : '10-digit mobile number'} value={values.phone} onChange={set('phone')} />
        </Field>
        <Field label={`${serviceLabel} *`} error={errors.service} hideLabel={popup}>
          <select value={values.service} onChange={set('service')}>
            <option value="" disabled>{popup ? `Select ${serviceLabel}` : `Select a ${serviceLabel.toLowerCase()}`}</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label={`${messageLabel} *`} error={errors.message} full hideLabel={popup}>
          <textarea rows={compact ? 3 : 4} placeholder={popup ? 'Message' : messagePlaceholder} value={values.message} onChange={set('message')} />
        </Field>
      </div>
      <label className={`check ${errors.consent ? 'has-error' : ''}`}>
        <input type="checkbox" checked={values.consent} onChange={set('consent')} />
        {popup
          ? <span>I&apos;m not a robot</span>
          : <span>I agree to be contacted about my enquiry as per the <Link to="/privacy-policy">privacy policy</Link>.</span>}
      </label>
      <button className={`btn btn-primary btn-block ${popup ? 'btn-submit' : ''}`} type="submit" disabled={sending}>
        {sending ? <><i className="fa-solid fa-spinner fa-spin" /> Sending…</>
          : popup ? 'SUBMIT' : <>{submitLabel} <i className="fa-solid fa-paper-plane" /></>}
      </button>
      <Status status={status} />
    </form>
  );
}

/* ------------------------------------------------------------ Consultation panel */
/** "Get a Free Consultation" form on the left, "Get in touch" artwork on the right.
 *  Used by the enquiry popup and the Contact page. */
export function ConsultationPanel({ source, headingId, as: Heading = 'h2' }) {
  return (
    <>
      <div className="consult-body">
        <Heading id={headingId} className="consult-title">Get a Free Consultation</Heading>
        <ContactForm compact popup source={source} />
      </div>
      <div className="consult-side">
        <p className="consult-side-title">GET IN <span>TOUCH</span></p>
        <img src="/IMG/popup-get-in-touch.webp" alt="UltraModern Technologies" width="1270" height="900" loading="lazy" />
      </div>
    </>
  );
}

/* ------------------------------------------------------------ Career application */
const EXTRA_ROLES = ['Android Developer', 'Angular Developer', 'Node.js Developer', 'Automation Tester (QA)', 'Overseas Education Counselor', 'Work From Home / Remote', 'Internship'];

export function CareerForm({ roles, defaultRole = '' }) {
  const roleOptions = [...new Set([...(roles && roles.length ? roles : careerRoles.map((r) => r.title)), ...EXTRA_ROLES])];
  const [values, setValues] = useState({ name: '', email: '', phone: '', role: defaultRole, consent: false });
  const [resume, setResume] = useState(null); // { name, url }
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const upload = async (file) => {
    if (!file) return;
    const okType = /\.(pdf|docx?)$/i.test(file.name);
    if (!okType) { setErrors((e) => ({ ...e, resume: 'Upload a PDF, DOC, or DOCX file' })); return; }
    if (file.size > 5 * 1024 * 1024) { setErrors((e) => ({ ...e, resume: 'Maximum file size is 5 MB' })); return; }
    setErrors((e) => ({ ...e, resume: undefined }));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', cloudinaryConfig.uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/raw/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.secure_url) throw new Error('upload failed');
      setResume({ name: file.name, url: data.secure_url });
    } catch {
      setErrors((e) => ({ ...e, resume: 'Upload failed. Please try again.' }));
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setStatus(null);
    const e = {};
    if (values.name.trim().length < 2) e.name = 'Please enter your name';
    if (!EMAIL_RX.test(values.email.trim())) e.email = 'Enter a valid email address';
    if (!PHONE_RX.test(values.phone.replace(/\D/g, '').slice(-10))) e.phone = 'Enter a valid 10-digit mobile number';
    if (!values.role) e.role = 'Choose a role';
    if (!resume) e.resume = 'Please upload your resume';
    if (!values.consent) e.consent = 'Please confirm to continue';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true);
    try {
      await sendEmail(emailjsConfig.careerTemplate, {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.replace(/\D/g, '').slice(-10),
        service: values.role,
        resume_link: resume.url,
        resume_name: resume.name,
        application_date: new Date().toLocaleString('en-IN'),
      });
      setStatus({ type: 'success', text: `Application received. Thank you, ${values.name.trim().split(' ')[0]}! Our hiring team will get back to you soon.` });
      setValues({ name: '', email: '', phone: '', role: defaultRole, consent: false });
      setResume(null);
    } catch {
      setStatus({ type: 'error', text: 'Submission failed. Please try again later.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <Field label="Full name *" error={errors.name}>
          <input type="text" autoComplete="name" placeholder="Your name" value={values.name} onChange={set('name')} />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={set('email')} />
        </Field>
        <Field label="Phone *" error={errors.phone}>
          <input type="tel" inputMode="numeric" placeholder="10-digit mobile number" value={values.phone} onChange={set('phone')} />
        </Field>
        <Field label="Role *" error={errors.role}>
          <select value={values.role} onChange={set('role')}>
            <option value="" disabled>Choose a position</option>
            {roleOptions.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <div className={`field full ${errors.resume ? 'has-error' : ''}`}>
          <span className="field-label">Resume / CV * <small>(PDF, DOC, DOCX · max 5 MB)</small></span>
          <div
            className={`dropzone ${resume ? 'done' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files[0]); }}
          >
            {uploading ? (
              <><i className="fa-solid fa-spinner fa-spin" /> Uploading…</>
            ) : resume ? (
              <><i className="fa-solid fa-file-circle-check" /> <span className="dz-name">{resume.name}</span>
                <button type="button" className="link-btn" onClick={(e) => { e.stopPropagation(); setResume(null); }}>Remove</button></>
            ) : (
              <><i className="fa-solid fa-cloud-arrow-up" /> <span>Click or drag your resume here</span></>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => upload(e.target.files[0])} />
          {errors.resume && <span className="field-error">{errors.resume}</span>}
        </div>
      </div>
      <label className={`check ${errors.consent ? 'has-error' : ''}`}>
        <input type="checkbox" checked={values.consent} onChange={set('consent')} />
        <span>I agree to my details being used for this job application as per the <Link to="/privacy-policy">privacy policy</Link>.</span>
      </label>
      <button className="btn btn-primary btn-block" type="submit" disabled={sending || uploading}>
        {sending ? <><i className="fa-solid fa-spinner fa-spin" /> Submitting…</> : <>Submit application <i className="fa-solid fa-paper-plane" /></>}
      </button>
      <Status status={status} />
    </form>
  );
}
