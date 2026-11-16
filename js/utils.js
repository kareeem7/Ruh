/* ============================================================
   js/utils.js — أدوات مشتركة (React hooks + storage + auth hash)
============================================================ */
'use strict';
const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);

/* تخزين محلي محمي */
const LS = {
  get(k, fb){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }catch(e){ return fb; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
/* حالة بتحفظ نفسها في localStorage */
function useLS(key, initial){
  const [v, setV] = useState(() => LS.get(key, initial));
  useEffect(() => { LS.set(key, v); }, [key, v]);
  return [v, setV];
}
const esc = s => String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const byId = id => PRODUCTS.find(p => p.id === +id);
const pname = (p, l) => l === 'en' ? p.en : p.name;
const subOf = (p, l) => (l === 'en' ? (p.subEn || p.sub) : p.sub);
const fabricOf = (p, l) => (l === 'en' ? (p.fabricEn || p.fabric) : p.fabric);
const descOf = (p, l) => (l === 'en' ? (p.descEn || p.desc) : p.desc);
const careOf = (p, l) => (l === 'en' ? (p.careEn || p.care) : p.care);
const cname = (c, l) => (l === 'en' ? c.en : c.ar);
const totalStock = p => Object.values(p.sizes).reduce((a, b) => a + b, 0);
const firstSize = p => Object.keys(p.sizes).find(s => p.sizes[s] > 0) || null;
const discPct = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

/* فلالوس */
const fmtCur = (egp, curKey) => {
  const c = CFG.cur[curKey] || CFG.cur.EGP;
  const v = (egp * c.r).toFixed(c.d);
  const n = Number(v).toLocaleString('en-US', { minimumFractionDigits: c.d, maximumFractionDigits: c.d });
  return curKey === 'USD' ? `$${n}` : `${n} ${c.s}`;
};

/* ترجمة (بتقرأ من global store اللي app.js بيعمله) */
let __LANG = 'en';
const t = k => (I18N[__LANG] && I18N[__LANG][k]) || I18N.ar[k] || k;

/* إيفينتس (dataLayer جاهز للربط بالبيكسل) */
window.dataLayer = window.dataLayer || [];
const track = (event, payload = {}) => { window.dataLayer.push({ event, ...payload }); };

/* Toasts خارجية للستور بسيط (مش React context عشان نقدر ننده من أي حتة) */
const toastBus = [];
const ruhToast = (msg, type = 'info') => { toastBus.forEach(fn => fn(msg, type)); };
const shareCopy = async txt => { try{ await navigator.clipboard.writeText(txt); ruhToast(t('copyOk'), 'ok'); }catch(e){} };

/* راوتر الهاش */
function parseHash(){
  const h = (location.hash || '#/').replace(/^#/, '');
  const [pathQ, qs] = h.split('?');
  const parts = pathQ.split('/').filter(Boolean);
  return { name: parts[0] || 'home', param: decodeURIComponent(parts[1] || ''), q: Object.fromEntries(new URLSearchParams(qs || '')) };
}
const go = path => { location.hash = path; };

/* أيقونة من السبرايت */
const Icon = ({ n, size = 22 }) => html`<svg className=${'icn' + (size === 17 ? ' icn--sm' : size === 28 ? ' icn--lg' : '')} aria-hidden="true"><use href=${'#i-' + n}/></svg>`;

/* نجوم */
function Stars({ r, sm = true }){
  const nodes = [];
  for(let i = 1; i <= 5; i++){
    nodes.push(html`<svg key=${i} className="icn" style=${{ width:'13px', height:'13px' }} aria-hidden="true"><use href=${'#i-' + (r >= i - .25 ? 'star-f' : 'star')}/></svg>`);
  }
  return html`<span className="stars" aria-label=${r + ' / 5'}>${nodes}</span>`;
}

/* صورة مع fallback لو فشلت */
const LQIP = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="10"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD9A4"/><stop offset="1" stop-color="#FF9E5E"/></linearGradient></defs><rect width="8" height="10" fill="url(#g)"/></svg>');
function Img({ src, alt, cls = '', w = 600, h = 800, eager = false }){
  return html`<img src=${src} alt=${esc(alt)} className=${cls} width=${w} height=${h}
    loading=${eager ? 'eager' : 'lazy'} decoding="async"
    fetchpriority=${eager ? 'high' : 'auto'}
    onError=${e => { e.currentTarget.onerror = null; e.currentTarget.src = LQIP; }} />`;
}

/* نظام مستخدمين ديمو (bcrypt-ish بسيط — SHA256 + salt لكل مستخدم) */
const users = () => LS.get('ruh_users', []);
const saveUsers = u => LS.set('ruh_users', u);
const curUser = () => { const s = LS.get('ruh_session', null); return s ? (users().find(u => u.email === s.email) || null) : null; };
const sessSet = email => LS.set('ruh_session', { email, ts: Date.now() });
const sessClear = () => LS.set('ruh_session', null);
const mkSalt = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
async function hashPass(p, salt){
  const raw = salt + '::' + p;
  if (crypto && crypto.subtle){
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  let h1 = 0x811c9dc5, h2 = 0xcbf29ce4;
  for(let i = 0; i < raw.length; i++){ h1 = Math.imul(h1 ^ raw.charCodeAt(i), 2654435761); h2 = Math.imul(h2 + raw.charCodeAt(i), 1597334677); }
  return (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16);
}
const validPh = v => /^01[0-9]{9}$/.test(v.replace(/\D/g, ''));
const validEm = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/* حسابات الكارت (نقية — بدون state عشان تعيد استخدامها) — deps: cart items array, coupon code */
function cartTotals(cart, coupon){
  const sub = cart.reduce((a, i) => { const p = byId(i.id); return a + (p ? p.price * i.qty : 0); }, 0);
  const bundleOn = CFG.bundleIds.every(id => cart.some(i => i.id === id && i.bundle));
  const bundleD = bundleOn ? Math.round(cart.filter(i => i.bundle).reduce((a, i) => { const p = byId(i.id); return a + (p ? p.price * i.qty : 0); }, 0) * CFG.bundleOff) : 0;
  const cpnD = coupon && CFG.coupons[coupon] ? Math.round(sub * CFG.coupons[coupon].pct) : 0;
  return { sub, bundleD, cpnD, afterDisc: Math.max(0, sub - bundleD - cpnD) };
}
