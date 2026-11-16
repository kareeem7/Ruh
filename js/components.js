/* ============================================================
   js/components.js — اجزاء UI مشتركة (Card / Modal / Toast...)
============================================================ */
'use strict';

/* Reveal on scroll (بخفة ويحترم prefers-reduced-motion) */
function Reveal({ children, cls = '', delay = 0 }){
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if(!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches){ el.classList.add('in'); return; }
    const io = new IntersectionObserver(es => es.forEach(x => {
      if (x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); }
    }), { threshold: .12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return html`<div ref=${ref} className=${'rv ' + cls} style=${delay ? { transitionDelay: delay + 'ms' } : null}>${children}</div>`;
}
const Skel = () => html`<div className="skl" aria-hidden="true"><div className="sk__img"></div><div className="sk__ln" style=${{ width:'70%' }}></div><div className="sk__ln" style=${{ width:'40%' }}></div></div>`;
const EmptyState = ({ icon, title, sub, cta, onGo }) => html`
  <div className="empty"><${Icon} n=${icon} size=${28}/><h3>${title}</h3>${sub && html`<p>${sub}</p>`}
    ${cta && html`<button className="btn btn--clay" onClick=${onGo}>${cta}</button>`}</div>`;
const Breadcrumbs = ({ items }) => html`
  <nav aria-label="breadcrumb"><ol className="crumbs">
    ${items.map((it, i) => html`<${React.Fragment} key=${i}>
      ${i > 0 && html`<li aria-hidden="true">/</li>`}
      <li ${it.cur ? { 'aria-current':'page' } : {}}>${it.cur ? it.label : html`<a href=${'#' + it.to}>${it.label}</a>`}</li>
    <//>`)}
  </ol></nav>`;

/* سعر بالخصم */
const Price = ({ p, api, big = false }) => {
  const off = discPct(p);
  return html`<div className=${big ? 'prix' : 'pc__price'}><b>${api.fmt(p.price)}</b>
    ${p.old && html`<span className="old">${api.fmt(p.old)}</span><span className="off">−${off}%</span>`}</div>`;
};
const Badges = ({ p, api }) => {
  const lo = totalStock(p) <= 4 && totalStock(p) > 0;
  return html`<div className="pc__bdgs">
    ${p.badge === 'new' && html`<span className="bdg bdg--new">${api.lang === 'ar' ? 'جديد' : 'New'}</span>`}
    ${p.old && html`<span className="bdg bdg--sale">−${discPct(p)}%</span>`}
    ${lo && html`<span className="bdg bdg--low">${api.lang === 'ar' ? 'آخر قطع' : 'Last pieces'}</span>`}
  </div>`;
};

/* ================= Product Card ================= */
function ProductCard({ p, api, idx = 0 }){
  const [qaOpen, setQaOpen] = useState(false);
  const [sel, setSel] = useState(null);
  const fav = api.wish.includes(p.id), inCmp = api.cmp.includes(p.id);
  const sizeLbl = s => s === 'OS' ? t('sizeOne') : s;
  const confirmAdd = () => {
    const sz = sel || firstSize(p);
    api.addToCart(p.id, sz, cname(p.colors[0], api.lang), 1);
    setQaOpen(false); setSel(null);
  };
  return html`<article className="pc" style=${{ transitionDelay: (idx % 4) * 60 + 'ms' }} data-pid=${p.id}>
    <div className="pc__media">
      <a href=${'#/product/' + p.id} aria-label=${pname(p, api.lang)} tabIndex="-1">
        <${Img} src=${p.imgs[0]} alt=${pname(p, api.lang)} w=${560} h=${750}/>
        <${Img} src=${p.imgs[1]} alt=${pname(p, api.lang)} cls="pc__alt" w=${560} h=${750}/>
      </a>
      <${Badges} p=${p} api=${api}/>
      <button className=${'pc__fav' + (fav ? ' on' : '')} aria-pressed=${fav}
        aria-label=${api.lang === 'ar' ? 'مفضلة' : 'Wishlist'}
        onClick=${() => api.toggleWish(p)}>
        <svg className="icn icn--sm"><use href=${fav ? '#i-heart-f' : '#i-heart'}/></svg>
      </button>
      <button className=${'pc__cmp' + (inCmp ? ' pc__cmp-on' : '')} aria-pressed=${inCmp}
        aria-label=${t('cmpCta')} onClick=${() => api.toggleCmp(p)}>
        <${Icon} n="cmp" size=${17}/>
      </button>
      <div className="pc__acts">
        <button className="pc__act" onClick=${() => api.setQv(p)}><${Icon} n="eye" size=${17}/>${t('quickView')}</button>
        <button className="pc__act" onClick=${() => setQaOpen(!qaOpen)}><${Icon} n="bag" size=${17}/>${t('quickAdd')}</button>
      </div>
      <div className=${'qa' + (qaOpen ? ' show' : '')} role="group" aria-label=${t('pickSize')}>
        <p>${t('pickSize')}</p>
        <div className="qa__szs">${Object.entries(p.sizes).map(([s, st]) => html`
          <button key=${s} className=${'szb' + (sel === s ? ' on' : '')} data-size=${s} disabled=${!st}
            style=${!st ? { opacity:'.45', textDecoration:'line-through' } : null}
            onClick=${() => setSel(s)}>${sizeLbl(s)}</button>`)}
        </div>
        <button className="qa__ok" onClick=${confirmAdd}><${Icon} n="bag" size=${17}/> ${t('addCart')}</button>
      </div>
    </div>
    <div className="pc__body">
      <h3 className="pc__name"><a href=${'#/product/' + p.id}>${pname(p, api.lang)}</a></h3>
      <div className="pc__rate"><${Stars} r=${p.rating}/><span>${p.rating} (${p.rvws})</span></div>
      <div className="pc__colors">${p.colors.slice(0, 5).map((c, i) => html`<span key=${i} className="dot" style=${{ background: c.c }} title=${cname(c, api.lang)}></span>`)}</div>
      <div className="pc__sizes">${Object.entries(p.sizes).map(([s, st]) => html`<span key=${s} className=${'szs' + (!st ? ' szs--out' : '')} title=${!st ? (api.lang === 'ar' ? 'خلص' : 'Out') : ''}>${s}</span>`)}</div>
      <${Price} p=${p} api=${api}/>
    </div>
  </article>`;
}

/* ================= M Modal (Dialog) ================= */
function Modal({ open, onClose, label, wide = false, children }){
  useEffect(() => {
    if (!open) return;
    const el = document.getElementById('ruhModalCard');
    const prev = document.activeElement;
    setTimeout(() => el && el.querySelector('button,input,select,a,[tabindex]')?.focus(), 60);
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('lck');
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('lck'); prev && prev.focus && prev.focus(); };
  }, [open]);
  if (!open) return null;
  return html`<div className="dlg show" role="dialog" aria-modal="true" aria-label=${label}>
    <div className="dlg__sc" onClick=${onClose}></div>
    <div id="ruhModalCard" className=${'dlg__card' + (wide ? ' dlg__card--lg' : '')}>${children}</div>
  </div>`;
}
const ModalHead = ({ title, onClose }) => html`
  <div className="dlg__head"><h2>${title}</h2>
    <button className="ibtn" onClick=${onClose} aria-label=${t('closeTxt')}><${Icon} n="x"/></button></div>`;

/* ================= Toasts ================= */
function Toasts(){
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fn = (msg, type) => {
      const id = Date.now() + Math.random();
      setItems(list => [...list, { id, msg, type }]);
      setTimeout(() => setItems(list => list.filter(x => x.id !== id)), 3200);
    };
    toastBus.push(fn);
    return () => { const i = toastBus.indexOf(fn); if (i > -1) toastBus.splice(i, 1); };
  }, []);
  return html`<div className="toasts" role="status" aria-live="polite">
    ${items.map(x => html`<div key=${x.id} className=${'tst tst--' + x.type + ' in'}>
      <${Icon} n=${x.type === 'ok' ? 'check' : x.type === 'err' ? 'alert' : 'info'} size=${17}/>
      <span dangerouslySetInnerHTML=${{ __html: x.msg }}></span>
    </div>`)}
  </div>`;
}

/* ================= Lightbox ================= */
function Lightbox({ lb, setLb, lang }){
  useEffect(() => {
    if (!lb) return;
    const onKey = e => {
      if (e.key === 'Escape') setLb(null);
      if (e.key === 'ArrowLeft') setLb(v => ({ ...v, i: (v.i + (document.documentElement.dir === 'rtl' ? 1 : -1) + v.imgs.length) % v.imgs.length }));
      if (e.key === 'ArrowRight') setLb(v => ({ ...v, i: (v.i + (document.documentElement.dir === 'rtl' ? -1 : 1) + v.imgs.length) % v.imgs.length }));
    };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('lck');
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('lck'); };
  }, [!!lb]);
  if (!lb) return null;
  const nav = d => setLb(v => ({ ...v, i: (v.i + d + v.imgs.length) % v.imgs.length }));
  let tx = 0;
  return html`<div className="lb show" role="dialog" aria-modal="true"
      onTouchStart=${e => tx = e.touches[0].clientX}
      onTouchEnd=${e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) nav(document.documentElement.dir === 'rtl' ? (dx > 0 ? 1 : -1) : (dx > 0 ? -1 : 1)); }}
      onClick=${e => { if (e.target.classList.contains('lb')) setLb(null); }}>
    <img className="lb__img" src=${lb.imgs[lb.i]} alt="" />
    <button className="lb__x" onClick=${() => setLb(null)} aria-label=${t('closeTxt')}><${Icon} n="x"/></button>
    <button className="lb__btn lb__btn--prev" onClick=${() => nav(-1)} aria-label="Previous"><${Icon} n="arr-r" size=${22}/></button>
    <button className="lb__btn lb__btn--next" onClick=${() => nav(1)} aria-label="Next"><${Icon} n="arr-r" size=${22}/></button>
    <span className="lb__cnt">${lb.i + 1} / ${lb.imgs.length}</span>
  </div>`;
}

/* ================= Quick View ================= */
function QuickView({ p, api }){
  const [clr, setClr] = useState(0);
  const [size, setSize] = useState(p ? firstSize(p) : null);
  const [qty, setQty] = useState(1);
  useEffect(() => { if (p){ setClr(0); setSize(firstSize(p)); setQty(1); } }, [p && p.id]);
  if (!p) return null;
  const add = () => {
    if (!size){ ruhToast(t('selSizePlz'), 'err'); return; }
    api.addToCart(p.id, size, cname(p.colors[clr], api.lang), qty);
    api.setQv(null);
  };
  return html`<${Modal} open=${!!p} onClose=${() => api.setQv(null)} label=${pname(p, api.lang)} wide=${true}>
    <${ModalHead} title=${pname(p, api.lang)} onClose=${() => api.setQv(null)}/>
    <div className="dlg__body"><div className="qv">
      <div className="qv__img"><${Img} src=${p.imgs[0]} alt=${pname(p, api.lang)} w=${560} h=${750} eager=${true}/></div>
      <div>
        <${Stars} r=${p.rating}/> <span style=${{ fontSize:'12.5px', color:'var(--muted)' }}>${p.rating} (${p.rvws})</span>
        <${Price} p=${p} api=${api} big=${true}/>
        <p style=${{ fontSize:'13.5px', color:'var(--ink-soft)', margin:'6px 0 0' }}>${fabricOf(p, api.lang)}</p>
        <div className="opt"><div className="opt__t">${t('fColor')} <span>${cname(p.colors[clr], api.lang)}</span></div>
          <div className="swbtns">${p.colors.map((c, i) => html`
            <button key=${i} className=${'swb' + (clr === i ? ' on' : '')} aria-label=${cname(c, api.lang)} aria-pressed=${clr === i}
              onClick=${() => setClr(i)}><span style=${{ background: c.c }}></span></button>`)}</div></div>
        <div className="opt"><div className="opt__t">${t('fSize')}</div>
          <div className="szbtns">${Object.entries(p.sizes).map(([s, st]) => html`
            <button key=${s} className=${'szb' + (!st ? ' szb--out' : '') + (size === s ? ' on' : '')} aria-pressed=${size === s}
              onClick=${() => setSize(s)}>${s === 'OS' ? t('sizeOne') : s}</button>`)}</div></div>
        <div className="d-flex gap-2 align-items-center" style=${{ marginTop:'20px' }}>
          <span className="qty">
            <button onClick=${() => setQty(Math.max(1, qty - 1))} aria-label="-"><${Icon} n="minus" size=${17}/></button>
            <output>${qty}</output>
            <button onClick=${() => setQty(qty + 1)} aria-label="+"><${Icon} n="plus" size=${17}/></button>
          </span>
          <button className="btn btn--clay" style=${{ flex:'1' }} onClick=${add}><${Icon} n="bag" size=${17}/>${t('addCart')}</button>
        </div>
        <a className="lnkbtn" href=${'#/product/' + p.id} onClick=${() => api.setQv(null)} style=${{ marginTop:'14px' }}>
          ${t('qvFull')}${' '}<${Icon} n="arr-r" size=${17}/>
        </a>
      </div>
    </div></div>
  <//>`;
}

/* ================= FABs + back-to-top ================= */
function FabZone({ api, route }){
  const [showBtt, setShowBtt] = useState(false);
  useEffect(() => {
    const fn = () => setShowBtt(window.scrollY > 600);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const p = route.name === 'product' ? byId(route.param) : null;
  const msg = p ? `${t('waTxtP')} ${pname(p, api.lang)} (${api.fmt(p.price)}) — ${location.href}` : t('waTxt');
  return html`<${React.Fragment}>
    <a className="wafab" href=${CFG.wa + '?text=' + encodeURIComponent(msg)} target="_blank" rel="noopener" aria-label="WhatsApp">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    </a>
    <button className=${'btt' + (showBtt ? ' show' : '')} onClick=${() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><${Icon} n="chev-u"/></button>
  <//>`;
}

/* ================= Bottom bar (موبايل) ================= */
function BottomBar({ api, route }){
  const cartN = api.cart.reduce((a, i) => a + i.qty, 0);
  return html`<nav className="bbar" aria-label="mobile">
    <div className="bbar__in">
      <a className=${'bbar__it' + (route.name === 'home' ? ' on' : '')} href="#/"><${Icon} n="home"/><span>${t('homeTxt')}</span></a>
      <button className="bbar__it" onClick=${api.openSearch}><${Icon} n="search"/><span>${api.lang === 'ar' ? 'بحث' : 'Search'}</span></button>
      <a className=${'bbar__it' + (route.name === 'wishlist' ? ' on' : '')} href="#/wishlist"><${Icon} n="heart"/>${api.wish.length > 0 && html`<span className="cntbadge">${api.wish.length}</span>`}<span>${t('wlT')}</span></a>
      <button className="bbar__it" onClick=${api.openCart}><${Icon} n="bag"/>${cartN > 0 && html`<span className="cntbadge" key=${cartN}>${cartN}</span>`}<span>${api.lang === 'ar' ? 'السلة' : 'Cart'}</span></button>
    </div>
  </nav>`;
}
