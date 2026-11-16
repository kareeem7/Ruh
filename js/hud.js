/* ============================================================
   js/hud.js — الهيدر + ميجا منيو + درج السلة + البحث + الفوتر
============================================================ */
'use strict';

const Logo = ({ small = false }) => html`
  <a className=${'logo' + (small ? ' logo--sm' : '')} href="#/" aria-label="RŪH">
    <span className="logo__name">RŪH</span>
    <span className="logo__ar">روح</span>
  </a>`;

/* ---------- Mega menu ---------- */
function MegaMenu({ cat, api }){
  const subs = [...new Set(PRODUCTS.filter(p => p.cat === cat).map(p => subOf(p, api.lang)))];
  const best = PRODUCTS.filter(p => p.cat === cat).sort((a, b) => b.sold - a.sold).slice(0, 3);
  const c = CFG.cats[cat];
  return html`<div className="mega"><div className="mega__g">
    <div><h3>${t('shop')}</h3><div className="mega__links">
      <a href=${'#/collection/' + cat}>${api.lang === 'ar' ? 'كل ' + c.ar : 'All ' + c.en}</a>
      ${subs.map(s => html`<a key=${s} href=${'#/collection/' + cat + '?sub=' + encodeURIComponent(s)}>${s}</a>`)}
    </div></div>
    <div><h3>${t('bestT')}</h3><div className="mega__best">
      ${best.map(p => html`<a key=${p.id} className="mega-mini" href=${'#/product/' + p.id}>
        <${Img} src=${p.imgs[0]} alt=${pname(p, api.lang)} w=${112} h=${140}/>
        <span><b>${pname(p, api.lang)}</b><span>${api.fmt(p.price)}</span></span></a>`)}
    </div></div>
    <div>
      <a className="mega__banner" href=${'#/collection/' + cat}>
        <${Img} src=${c.img} alt="" w=${520} h=${300}/>
        <p>${api.lang === 'ar' ? 'كولكشن «رمل وبحر»' : 'The Sand & Sea edit'}</p>
      </a>
      <div className="mega__promos">
        <a className="mega__promo" href="#/collection/sale"><${Icon} n="tag" size=${17}/>${api.lang === 'ar' ? 'قسم العروض — خصومات حقيقية' : 'Sale — real discounts'}</a>
        <button className="mega__promo" onClick=${() => shareCopy('ROOH10')}><${Icon} n="gift" size=${17}/>ROOH10 — ${api.lang === 'ar' ? 'خصم 10% أول طلب' : '10% off first order'}</button>
      </div>
    </div>
  </div></div>`;
}

/* ---------- Header ---------- */
function Header({ api }){
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    fn(); window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const overHero = api.route.name === 'home' && !scrolled;
  const cartN = api.cart.reduce((a, i) => a + i.qty, 0);
  return html`<${React.Fragment}>
    ${!api.prefs.ann && html`<div className="annb" role="region">
      <div className="annb__in">
        <span>${t('annTxt1')} <b>${t('annTxt1b')}</b> ${t('annTxt2')}</span>
        <button className="annb__x" onClick=${() => api.setPref('ann', true)} aria-label=${t('closeTxt')}><${Icon} n="x" size=${17}/></button>
      </div></div>`}
    <header id="hdr" className=${(scrolled ? 'solid ' : '') + (overHero ? 'over-hero' : '')}>
      <div className="wrap hdr__in">
        <button className="ibtn burger" onClick=${api.openNav} aria-label="Menu" aria-expanded=${api.ui.nav}><${Icon} n="menu"/></button>
        <${Logo}/>
        <nav className="navx" aria-label="main">
          ${Object.keys(CFG.cats).map(cat => html`<div key=${cat} className="navx__item">
            <a className="navx__link" href=${'#/collection/' + cat} aria-haspopup="true">${api.lang === 'ar' ? CFG.cats[cat].ar : CFG.cats[cat].en}<${Icon} n="chev-d" size=${17}/></a>
            <${MegaMenu} cat=${cat} api=${api}/>
          </div>`)}
          <div className="navx__item"><a className="navx__link navx__link--sale" href="#/collection/sale">${t('sale')}</a></div>
          <div className="navx__item"><a className="navx__link" href="#/blog">${t('blog')}</a></div>
        </nav>
        <div className="hdr__acts">
          <select className="hdr__cur" value=${api.prefs.cur} aria-label="Currency"
            onChange=${e => api.setPref('cur', e.target.value)}>
            ${Object.keys(CFG.cur).map(c => html`<option key=${c} value=${c}>${CFG.cur[c].s} ${c}</option>`)}
          </select>
          <button className="ibtn" onClick=${() => api.setLang(api.lang === 'ar' ? 'en' : 'ar')} aria-label="Language"><${Icon} n="globe"/></button>
          <button className="ibtn" onClick=${api.toggleTheme} aria-label="Theme"><${Icon} n=${api.theme === 'dark' ? 'sun' : 'moon'}/></button>
          <button className="ibtn" onClick=${api.openSearch} aria-label="Search"><${Icon} n="search"/></button>
          <a className="ibtn hide-m" href="#/wishlist" aria-label="Wishlist"><${Icon} n="heart"/>${api.wish.length > 0 && html`<span className="cntbadge">${api.wish.length}</span>`}</a>
          <a className="ibtn hide-m" href=${api.user ? '#/account' : '#/auth'} aria-label="Account"><${Icon} n="user"/>${api.user && html`<span className="cntbadge" style=${{ minWidth:'11px', height:'11px', padding:'0', background:'var(--success)' }}></span>`}</a>
          <button className="ibtn" onClick=${api.openCart} aria-label="Cart"><${Icon} n="bag"/>${cartN > 0 && html`<span key=${cartN} className="cntbadge bump">${cartN}</span>`}</button>
        </div>
      </div>
    </header>
  <//>`;
}

/* ---------- Mobile nav drawer ---------- */
function MobileNav({ api }){
  if (!api.ui.nav) return null;
  return html`<aside className="drw drw--nav show" role="dialog" aria-modal="true" aria-label="Menu">
    <div className="drw__head"><h2>${t('menuTxt')}</h2>
      <button className="ibtn" onClick=${api.closeNav} aria-label=${t('closeTxt')}><${Icon} n="x"/></button></div>
    <div className="drw__body">
      ${Object.keys(CFG.cats).map(c => html`<div key=${c}>
        <a className="mlink" href=${'#/collection/' + c} onClick=${api.closeNav} style=${{ fontWeight:'700', padding:'14px 4px', display:'flex' }}>${api.lang === 'ar' ? CFG.cats[c].ar : CFG.cats[c].en}</a>
      </div>`)}
      <a className="mlink" href="#/collection/sale" onClick=${api.closeNav} style=${{ color:'var(--clay-dark)', fontWeight:'700', padding:'14px 4px', display:'flex' }}>${t('sale')}</a>
      <a className="mlink" href="#/blog" onClick=${api.closeNav} style=${{ padding:'14px 4px', display:'flex' }}>${t('blog')}</a>
      <a className="mlink" href="#/compare" onClick=${api.closeNav} style=${{ padding:'14px 4px', display:'flex' }}>${t('cmpT')} (${api.cmp.length})</a>
      <a className="mlink" href="#/wishlist" onClick=${api.closeNav} style=${{ padding:'14px 4px', display:'flex' }}>${t('wlT')} (${api.wish.length})</a>
      <a className="mlink" href=${api.user ? '#/account' : '#/auth'} onClick=${api.closeNav} style=${{ padding:'14px 4px', display:'flex', gap:'9px' }}><${Icon} n="user" size=${17}/>${api.user ? t('acctPage') : t('authLogin')}</a>
      <div className="d-flex gap-2" style=${{ marginTop:'18px' }}>
        <select className="sel" style=${{ flex:'1' }} value=${api.prefs.cur} onChange=${e => api.setPref('cur', e.target.value)}>
          ${Object.keys(CFG.cur).map(c => html`<option key=${c} value=${c}>${c}</option>`)}
        </select>
        <button className="btn btn--ghost" onClick=${() => { api.setLang(api.lang === 'ar' ? 'en' : 'ar'); api.closeNav(); }}>${t('langBtn')}</button>
      </div>
    </div>
  </aside>`;
}

/* ---------- Cart drawer ---------- */
function CartDrawer({ api }){
  const [cpn, setCpn] = useState(api.coupon || '');
  const [cpnMsg, setCpnMsg] = useState(null);
  useEffect(() => { setCpn(api.coupon || ''); }, [api.ui.cart]);
  if (!api.ui.cart) return null;
  const T = api.getTotals();
  const pct = Math.min(100, Math.round(T.afterDisc / CFG.freeShip * 100));
  const applyCpn = () => {
    const v = cpn.trim().toUpperCase();
    if (!v) return;
    if (CFG.coupons[v]){ api.setCoupon(v); setCpnMsg({ ok: true, txt: t('cpnOk') }); ruhToast(t('cpnOk'), 'ok'); }
    else { api.setCoupon(null); setCpnMsg({ ok: false, txt: t('cpnBad') }); }
  };
  return html`<aside className="drw drw--cart show" role="dialog" aria-modal="true" aria-label=${t('cartT')}>
    <div className="drw__head">
      <h2>${t('cartT')} ${api.cart.length ? `(${api.cart.reduce((a, i) => a + i.qty, 0)})` : ''}</h2>
      <button className="ibtn" onClick=${api.closeCart} aria-label=${t('closeTxt')}><${Icon} n="x"/></button>
    </div>
    ${api.cart.length ? html`
      <div className="drw__body">
        <div className="shipbar" aria-live="polite">
          <p className=${'shipbar__tx' + (T.afterDisc >= CFG.freeShip ? ' ok' : '')}>
            ${T.afterDisc >= CFG.freeShip ? t('freeShipOk')
              : html`<${React.Fragment}>${api.lang === 'ar' ? 'باقي' : 'Only'} <b>${api.fmt(CFG.freeShip - T.afterDisc)}</b> ${t('freeShipNote2')}<//>`}</p>
          <div className="shipbar__tr"><span className=${'shipbar__fl' + (T.afterDisc >= CFG.freeShip ? ' full' : '')} style=${{ width: pct + '%' }}></span></div>
        </div>
        ${api.cart.map((it, idx) => {
          const p = byId(it.id); if (!p) return null;
          return html`<div key=${idx} className="ci">
            <${Img} src=${p.imgs[0]} alt=${pname(p, api.lang)} cls="ci__img" w=${164} h=${208}/>
            <div className="ci__inf">
              <b>${pname(p, api.lang)}</b>
              <span className="ci__meta">${it.color} · ${it.size}${it.bundle ? html` · <span style=${{ color:'var(--olive)', fontWeight:'700' }}>−15%</span>` : ''}</span>
              <span className="ci__price">${api.fmt(p.price * it.qty)}
                ${p.old && html`<span style=${{ textDecoration:'line-through', color:'var(--muted)', fontWeight:'400', fontSize:'12px' }}> ${api.fmt(p.old * it.qty)}</span>`}</span>
              <div className="ci__row">
                <span className="qty" role="group" aria-label=${t('qty')}>
                  <button onClick=${() => api.setQty(idx, -1)} aria-label="-"><${Icon} n="minus" size=${17}/></button>
                  <output>${it.qty}</output>
                  <button onClick=${() => api.setQty(idx, 1)} aria-label="+"><${Icon} n="plus" size=${17}/></button>
                </span>
                <button className="ci__rm" onClick=${() => api.rmItem(idx)} aria-label="Remove"><${Icon} n="trash" size=${17}/></button>
              </div>
            </div>
          </div>`;
        })}
        <div className="cpn">
          <input value=${cpn} placeholder=${t('couponPh')} onInput=${e => setCpn(e.target.value)} aria-label="coupon" style=${{ textTransform:'uppercase' }}/>
          <button className="btn btn--ghost btn--sm" onClick=${applyCpn} style=${{ minHeight:'46px' }}>${t('applyBtn')}</button>
        </div>
        ${cpnMsg && html`<p className=${'cpnmsg ' + (cpnMsg.ok ? 'ok' : 'err')} aria-live="polite">${cpnMsg.txt}</p>`}
      </div>
      <div className="drw__foot">
        <div className="tot"><span>${t('subtotal')}</span><span>${api.fmt(T.sub)}</span></div>
        ${T.bundleD > 0 && html`<div className="tot"><span>${t('bundleDisc')}</span><span className="neg">−${api.fmt(T.bundleD)}</span></div>`}
        ${T.cpnD > 0 && html`<div className="tot"><span>${t('couponDisc')} (${api.coupon})</span><span className="neg">−${api.fmt(T.cpnD)}</span></div>`}
        <div className="tot tot--grand"><span>${t('total')}</span><span>${api.fmt(T.afterDisc)}</span></div>
        <p className="shpnote"><${Icon} n="truck" size=${17}/>${t('shipNote')}</p>
        <button className="btn btn--clay btn--block" style=${{ marginTop:'12px' }}
          onClick=${() => { api.closeCart(); go('#/checkout'); }}>${t('checkoutBtn')}<${Icon} n="arr-r" size=${17}/></button>
        <button className="btn btn--ghost btn--block btn--sm" style=${{ marginTop:'8px' }} onClick=${api.closeCart}>${t('contShop')}</button>
      </div>`
    : html`<div className="drw__body">
        <${EmptyState} icon="bag" title=${t('cartEmptyH')} sub=${t('cartEmptyP')} cta=${t('cartEmptyC')} onGo=${() => { api.closeCart(); go('#/collection/all'); }}/>
      </div>`}
  </aside>`;
}

/* ---------- Search overlay ---------- */
function SearchOverlay({ api }){
  const [q, setQ] = useState('');
  const [hits, setHits] = useState(null); // null = لسه مفيهوش بحث
  const [recents, setRecents] = useState(() => LS.get('ruh_rsearch', []));
  useEffect(() => {
    if (!q.trim()){ setHits(null); return; }
    const id = setTimeout(() => {
      const s = q.trim().toLowerCase();
      const list = PRODUCTS.filter(p =>
        (p.name + ' ' + p.en + ' ' + p.sub + ' ' + (p.subEn || '') + ' ' + p.fabric + ' ' + (p.fabricEn || '') + ' ' + p.colors.map(c => c.ar + ' ' + c.en).join(' ') + ' ' + CFG.cats[p.cat].ar + ' ' + CFG.cats[p.cat].en)
        .toLowerCase().includes(s));
      track('search', { term: s, results: list.length });
      setHits(list);
    }, 200);
    return () => clearTimeout(id);
  }, [q]);
  if (!api.ui.search) return null;
  const commit = s => {
    const list = [s, ...recents.filter(x => x !== s)].slice(0, 6);
    setRecents(list); LS.set('ruh_rsearch', list);
    api.closeSearch();
    go('#/collection/all?q=' + encodeURIComponent(s));
  };
  return html`<div className="sov show" role="dialog" aria-modal="true" aria-label="Search">
    <div className="wrap sov__bar">
      <div className="sov__in">
        <${Icon} n="search"/>
        <input id="sovQ" type="search" placeholder=${t('searchPh')} autoFocus
          value=${q} onInput=${e => setQ(e.target.value)}
          onKeyDown=${e => { if (e.key === 'Enter'){ e.preventDefault(); commit(q.trim()); } }}/>
      </div>
      <button className="ibtn" onClick=${api.closeSearch} aria-label=${t('closeTxt')}><${Icon} n="x"/></button>
    </div>
    <div className="sov__scrl"><div className="wrap" style=${{ maxWidth:'900px' }}>
      ${hits === null && html`<${React.Fragment}>
        <p className="sov__lbl">${t('sTr')}</p>
        <div className="sugs">${TRENDING.map(x => html`<button key=${x} className="sug" onClick=${() => setQ(x)}>${x}</button>`)}</div>
        ${recents.length > 0 && html`<p className="sov__lbl">${t('sRec')}
          <button onClick=${() => { setRecents([]); LS.set('ruh_rsearch', []); }} style=${{ color:'var(--muted)', fontSize:'11.5px', textDecoration:'underline' }}>${t('sClr')}</button></p>
          <div className="sugs">${recents.map(x => html`<button key=${x} className="sug" onClick=${() => setQ(x)}>${x}</button>`)}</div>`}
      <//>`}
      ${hits !== null && html`<${React.Fragment}>
        ${hits.length ? html`<${React.Fragment}>
          <p className="sov__lbl"><b>${hits.length}</b> ${t('results')}</p>
          <div className="sres">
            ${hits.slice(0, 6).map(p => html`<a key=${p.id} className="sr" href=${'#/product/' + p.id} onClick=${() => api.closeSearch()}>
              <${Img} src=${p.imgs[0]} alt=${pname(p, api.lang)} w=${112} h=${140}/>
              <span><b>${pname(p, api.lang)}</b><span>${api.fmt(p.price)}</span></span></a>`)}
          </div>
          ${hits.length > 6 && html`<div style=${{ textAlign:'center', marginTop:'18px' }}>
            <button className="btn btn--ghost" onClick=${() => commit(q.trim())}>${t('sAll')} (${hits.length})</button></div>`}
        <//>` : html`<div className="empty" style=${{ paddingTop:'30px' }}>
          <${Icon} n="search" size=${28}/>
          <h3>${t('sNoR')} “${q}”</h3><p>${t('sNoRp')}</p>
          <div className="sugs" style=${{ justifyContent:'center' }}>
            ${Object.keys(CFG.cats).map(c => html`<a key=${c} className="sug" href=${'#/collection/' + c} onClick=${api.closeSearch}>${api.lang === 'ar' ? CFG.cats[c].ar : CFG.cats[c].en}</a>`)}
          </div></div>`}
      <//>`}
    </div></div>
  </div>`;
}

/* ---------- Footer ---------- */
function Footer({ api }){
  const l = api.lang;
  return html`<footer className="ft">
    <div className="wrap"><div className="ft__g">
      <div className="ft__brand">
        <${Logo} small=${true}/>
        <p>${t('footerTag')}</p>
        <div className="ft__soc">
          <a className="ibtn" href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><${Icon} n="ig"/></a>
          <a className="ibtn" href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><${Icon} n="fb"/></a>
          <a className="ibtn" href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok"><${Icon} n="tk"/></a>
          <a className="ibtn" href=${CFG.wa} target="_blank" rel="noopener" aria-label="WhatsApp"><${Icon} n="chat"/></a>
        </div>
        <div className="pays">
          ${['Visa','Mastercard','Meeza','Fawry','ValU','InstaPay','Apple Pay', l === 'ar' ? 'كاش عند الاستلام' : 'COD'].map(x => html`<span key=${x} className="payc">${x}</span>`)}
        </div>
      </div>
      <nav><h3>${t('shopT')}</h3><div className="ft__links">
        ${Object.keys(CFG.cats).map(c => html`<a key=${c} href=${'#/collection/' + c}>${l === 'ar' ? CFG.cats[c].ar : CFG.cats[c].en}</a>`)}
        <a href="#/collection/sale">${t('sale')}</a>
      </div></nav>
      <nav><h3>${t('helpT')}</h3><div className="ft__links">
        <a href="#/page/faq">${t('faqT')}</a>
        <button onClick=${() => api.setModal('sizeguide')}>${t('szGuide')}</button>
        <a href="#/page/shipping">${l === 'ar' ? 'الشحن والتوصيل' : 'Shipping'}</a>
        <a href="#/page/returns">${l === 'ar' ? 'الاستبدال والاسترجاع' : 'Returns'}</a>
        <a href="#/admin">Admin</a>
      </div></nav>
      <div><h3>${t('contactT')}</h3><div className="ft__links">
        <a href=${CFG.wa} target="_blank" rel="noopener"><${Icon} n="chat" size=${17}/>WhatsApp</a>
        <a href="mailto:hello@ruh.cairo"><${Icon} n="mail" size=${17}/>hello@ruh.cairo</a>
        <a href="tel:+201000000000"><${Icon} n="phone" size=${17}/><span dir="ltr">010 000 0000</span></a>
        <span style=${{ padding:'7px 0', minHeight:'36px', display:'inline-flex', gap:'8px', alignItems:'center', color:'var(--ink-soft)', fontSize:'14px' }}>
          <${Icon} n="pin" size=${17}/>${l === 'ar' ? '14 ش قصر النيل، وسط البلد، القاهرة' : '14 Qasr El Nil St, Downtown Cairo'}</span>
      </div></div>
    </div>
    <div className="ft__bot">
      <span>© 2026 RŪH — ${t('madeIn')}</span>
      <nav aria-label=${t('policiesT')}>
        <a href="#/page/privacy">${l === 'ar' ? 'الخصوصية' : 'Privacy'}</a>
        <a href="#/page/terms">${l === 'ar' ? 'الشروط' : 'Terms'}</a>
      </nav>
    </div></div>
  </footer>`;
}

/* ---------- Size Guide + Size Suggest + Track modals ---------- */
function SizeGuideModal({ api }){
  if (api.modal !== 'sizeguide') return null;
  const rows = [['S','88–92','70–74','66'],['M','92–98','74–80','68'],['L','98–104','80–86','70'],['XL','104–112','86–94','72'],['XXL','112–120','94–102','74']];
  return html`<${Modal} open=${true} onClose=${() => api.setModal(null)} label=${t('szGuide')}>
    <${ModalHead} title=${t('szGuide')} onClose=${() => api.setModal(null)}/>
    <div className="dlg__body">
      <div className="d-flex gap-3 flex-wrap">
        <${Img} src=${IMG.sew5} alt="Pattern fitting" w=${220} h=${280}/>
        <div style=${{ flex:'1', minWidth:'240px' }}>
          <p style=${{ fontSize:'13.5px', color:'var(--muted)', marginTop:'0' }}>${api.lang === 'ar' ? 'المقاسات بالسنتيمتر، ومقاسين على أجسام حقيقية.' : 'Measurements in cm, fitted on real bodies.'}</p>
          <table className="table table-sm" style=${{ fontSize:'13px' }}>
            <thead><tr><th>${api.lang === 'ar' ? 'المقاس' : 'Size'}</th><th>${api.lang === 'ar' ? 'صدر' : 'Chest'}</th><th>${api.lang === 'ar' ? 'وسط' : 'Waist'}</th><th>${api.lang === 'ar' ? 'طول' : 'Length'}</th></tr></thead>
            <tbody>${rows.map(r => html`<tr key=${r[0]}>${r.map(c => html`<td key=${c}>${c}</td>`)}</tr>`)}</tbody>
          </table>
          <p style=${{ fontSize:'12.5px', color:'var(--muted)' }}>${api.lang === 'ar' ? 'بين مقاسين؟ خد الأصغر للقصّات الواسعة، والأكبر للمظبوط.' : 'Between sizes? Size down for relaxed cuts, up for fitted.'}</p>
        </div>
      </div>
    </div>
  <//>`;
}
function SuggestModal({ api }){
  const [h, setH] = useState('2');
  const [w, setW] = useState('2');
  const [sz, setSz] = useState(null);
  if (api.modal !== 'suggest') return null;
  const calc = () => {
    let s = w === '1' ? (h === '3' ? 'M' : 'S') : w === '2' ? (h === '1' ? 'M' : 'L') : (h === '1' ? 'L' : 'XL');
    const p = api.route.name === 'product' ? byId(api.route.param) : null;
    if (p && p.fit === 'small') s = ({ S:'M', M:'L', L:'XL', XL:'XXL' })[s] || s;
    if (p && !p.sizes[s]) s = firstSize(p) || s;
    setSz(s);
  };
  const confirm = () => { api.setModal(null); if (sz){ ruhToast((api.lang === 'ar' ? 'رشّحنالك مقاس ' : 'We suggest size ') + sz, 'ok'); window.dispatchEvent(new CustomEvent('ruh:suggest', { detail: sz })); } };
  return html`<${Modal} open=${true} onClose=${() => api.setModal(null)} label=${t('szSuggest')}>
    <${ModalHead} title=${t('szSuggest')} onClose=${() => api.setModal(null)}/>
    <div className="dlg__body">
      <p style=${{ fontSize:'13.5px', color:'var(--muted)', marginTop:'0' }}>${api.lang === 'ar' ? 'سؤالين سريعين وهنقولك الأقرب ليك:' : 'Two quick questions:'}</p>
      <div className="frm">
        <div className="fld"><label>${api.lang === 'ar' ? 'طولك' : 'Height'}</label>
          <select value=${h} onChange=${e => setH(e.target.value)}>
            <option value="1">${api.lang === 'ar' ? 'أقل من 160 سم' : 'Under 160 cm'}</option>
            <option value="2">160–175 cm</option>
            <option value="3">${api.lang === 'ar' ? 'أكتر من 175 سم' : 'Over 175 cm'}</option>
          </select></div>
        <div className="fld"><label>${api.lang === 'ar' ? 'وزنك' : 'Weight'}</label>
          <select value=${w} onChange=${e => setW(e.target.value)}>
            <option value="1">${api.lang === 'ar' ? 'أقل من 60 كجم' : 'Under 60 kg'}</option>
            <option value="2">60–80 kg</option>
            <option value="3">${api.lang === 'ar' ? 'أكتر من 80 كجم' : 'Over 80 kg'}</option>
          </select></div>
      </div>
      <button className="btn btn--clay btn--block" style=${{ marginTop:'16px' }} onClick=${sz ? confirm : calc}>
        ${sz ? (api.lang === 'ar' ? 'استخدم المقاس ده — ' : 'Use size ') + sz : (api.lang === 'ar' ? 'احسب مقاسي' : 'Get my size')}
      </button>
    </div>
  <//>`;
}
function TrackModal({ api }){
  if (api.modal !== 'track') return null;
  const steps = [
    { ic:'check', tx:t('tl1'), tm:api.lang === 'ar' ? 'النهارده 10:24ص' : 'Today 10:24am', on:true },
    { ic:'clock', tx:t('tl2'), tm:api.lang === 'ar' ? 'دلوقتي — الأتيليه بيجهز' : 'Now — preparing', on:true },
    { ic:'truck', tx:t('tl3'), tm:api.lang === 'ar' ? 'متوقع بكرة' : 'Expected tomorrow', on:false },
    { ic:'pack',  tx:t('tl4'), tm:api.lang === 'ar' ? 'خلال 48 ساعة' : 'Within 48h', on:false },
  ];
  return html`<${Modal} open=${true} onClose=${() => api.setModal(null)} label=${t('trackT')}>
    <${ModalHead} title=${t('trackT')} onClose=${() => api.setModal(null)}/>
    <div className="dlg__body">
      ${steps.map((s, i) => html`<div key=${i} className="d-flex gap-3 align-items-center" style=${{ padding:'10px 0', borderBottom:'1px dashed var(--line)', opacity: s.on ? 1 : .5 }}>
        <span className="ibtn" style=${{ background: s.on ? 'color-mix(in srgb,var(--success) 12%,transparent)' : 'var(--soft)', color: s.on ? 'var(--success)' : 'var(--muted)' }}><${Icon} n=${s.ic}/></span>
        <span style=${{ flex:'1' }}><b style=${{ display:'block', fontSize:'14px' }}>${s.tx}</b><span style=${{ fontSize:'12px', color:'var(--muted)' }}>${s.tm}</span></span>
      </div>`)}
    </div>
  <//>`;
}

/* ---------- Cookie bar + social proof + live region ---------- */
function CookieBar({ api }){
  if (!api.ui.cookie) return null;
  return html`<div className="cookie show" role="region">
    <div className="wrap cookie__in">
      <p>${t('cookieTxt')}</p>
      <div className="cookie__btns">
        <button className="btn btn--sm btn--bone" onClick=${api.dismissCookie}>${t('cookieOk')}</button>
        <a className="btn btn--sm btn--ghost" href="#/page/privacy" style=${{ color:'var(--bone)', borderColor:'rgba(250,247,242,.4)' }} onClick=${api.dismissCookie}>${t('cookieP')}</a>
      </div>
    </div>
  </div>`;
}
function ProofPop({ api }){
  const p = api.ui.proof;
  if (!p) return null;
  return html`<div className="proof show" role="status">
    <${Img} src=${p.img} alt="" w=${104} h=${124}/>
    <p><b>${api.lang === 'ar' ? p.nAr : p.n}</b>${api.lang === 'ar' ? p.tAr : p.t}<br/>
      <span className="ago">${api.lang === 'ar' ? p.agoAr : p.ago}</span></p>
    <button className="proof__x" onClick=${api.dismissProof} aria-label=${t('closeTxt')}><${Icon} n="x" size=${17}/></button>
  </div>`;
}
