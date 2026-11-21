import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { uploadImage } from './api.js';

/* "Callout" highlight box, rendered on the site as <aside class="callout"> (used by existing posts). */
const Block = Quill.import('blots/block');
class CalloutBlot extends Block {
  static blotName = 'callout';
  static tagName = 'ASIDE';
  static className = 'callout';
}
Quill.register(CalloutBlot, true);
const icons = Quill.import('ui/icons');
icons.callout = '<i class="fa-solid fa-lightbulb" aria-hidden="true"></i>';

// Markup the visual editor cannot represent; such content opens in HTML mode so nothing is lost.
const UNSUPPORTED = /<(table|figure|iframe|pre|h1|div|span|img[^>]*\bwidth)/i;

export default function RichText({ value, onChange, invalid }) {
  const host = useRef(null);
  const quill = useRef(null);
  const latest = useRef(value);
  const [mode, setMode] = useState(() => (UNSUPPORTED.test(value || '') ? 'html' : 'visual'));
  const [busy, setBusy] = useState(false);
  latest.current = value;

  useEffect(() => {
    if (mode !== 'visual' || !host.current) return undefined;
    host.current.innerHTML = '';
    const editorEl = document.createElement('div');
    host.current.appendChild(editorEl);
    const q = new Quill(editorEl, {
      theme: 'snow',
      placeholder: 'Write here…',
      modules: {
        toolbar: {
          container: [
            [{ header: [2, 3, false] }],
            ['bold', 'italic', 'underline', 'link'],
            [{ list: 'ordered' }, { list: 'bullet' }, 'blockquote', 'callout'],
            ['image', 'clean'],
          ],
          handlers: {
            callout(active) { this.quill.format('callout', active); },
            image() {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/png,image/jpeg,image/webp,image/gif';
              input.onchange = async () => {
                const file = input.files[0];
                if (!file) return;
                setBusy(true);
                try {
                  const url = await uploadImage(file);
                  const range = q.getSelection(true);
                  q.insertEmbed(range.index, 'image', url, 'user');
                  q.setSelection(range.index + 1);
                } catch (err) {
                  window.alert(err.message);
                } finally {
                  setBusy(false);
                }
              };
              input.click();
            },
          },
        },
      },
    });
    if (latest.current) q.clipboard.dangerouslyPasteHTML(latest.current, 'silent');
    q.on('text-change', () => {
      const html = q.getSemanticHTML();
      onChange(html === '<p></p>' || q.getText().trim() === '' && !/<img/i.test(html) ? '' : html);
    });
    quill.current = q;
    return () => { quill.current = null; };
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchMode = () => {
    if (mode === 'html' && UNSUPPORTED.test(value || '')
      && !window.confirm('This content contains elements the visual editor does not support (e.g. tables). Switching may remove them. Continue?')) return;
    setMode(mode === 'visual' ? 'html' : 'visual');
  };

  return (
    <div className={`rte ${invalid ? 'invalid' : ''}`}>
      <div className="rte-bar">
        <span>{mode === 'visual' ? 'Visual editor' : 'HTML source'}{busy && ' · uploading image…'}</span>
        <button type="button" className="adm-link" onClick={switchMode}>
          {mode === 'visual' ? <><i className="fa-solid fa-code" /> Edit HTML</> : <><i className="fa-solid fa-eye" /> Visual editor</>}
        </button>
      </div>
      {mode === 'visual'
        ? <div ref={host} className="rte-host" />
        : <textarea className="rte-html" value={value} onChange={(e) => onChange(e.target.value)} rows={18} spellCheck={false} />}
    </div>
  );
}
