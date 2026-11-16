/* ============================================================
   js/pages-shop.js — الرئيسية + الكولكشن + المنتج + المفضلة + المقارنة
============================================================ */
'use strict';

/* ================= Home ================= */
function HomePage({ api }){
  const [tab, setTab] = useState('new');
  const [tabReady, setTabReady] = useState(false);
  useEffect(() => { setTabReady(false); const id = setTimeout(() => setTabReady(true), 350); return () => clearTimeout(id); }, [tab]);
  useEffect(() => { track('view_item_list', { list: tab, items: PRODUCTS.length }); }, [tab]);
  useEffect(() => { track('page_view', { page: 'home' }); }, []);

  /* عداد العرض */
  const [end] = useState(() => {
    let e = LS.get('ruh_offer_end', null);
    if (!e || e < Date.now() - 86400000){ e = Date.now() + (2 * 86400000 + 11 * 3600000 + 24 * 60000 + 30000); LS.set('ruh_offer_end', e); }
    return e;
  });
  const [left, setLeft] = useState(end - Date.now());
  useEffect(() => {
    if (left <= 0) return;
    const id = setInterval(() => setLeft(Math.max(0, end - Date.now())), 1000);
    return () => clearInterval(id);
  }, [end]);

  /* نشرة */
  const [em, setEm] = useState('');
  const [newsMsg, setNewsMsg] = useState(null);
  const okEm = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const submitNews = e => {
    e.preventDefault();
    if (!okEm(em)){ setNewsMsg({ ok:false, txt:t('newsInv') }); return; }
    api.setPref('news', true); track('select_promotion', { code: 'ROOH10' }); ruhToast(t('newsOkH'), 'ok');
  };

  const tabList = tab === 'new' ? PRODUCTS.filter(p => p.badge === 'new').concat(PRODUCTS.filter(p => !p.badge && !p.old)).slice(0, 8)
    : tab === 'best' ? [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8)
    : PRODUCTS.filter(p => p.old);
  const recent = api.recent.map(byId).filter(Boolean).slice(0, 10);
  const bundleSum = CFG.bundleIds.reduce((a, id) => a + byId(id).price, 0);

  const d = Math.floor(left / 86400000), hh = Math.floor(left % 86400000 / 3600000), mm = Math.floor(left % 3600000 / 60000), ss = Math.floor(left % 60000 / 1000);

  return html`<${React.Fragment}>
    <section className="hero">
      <div className="hero__bg"><${Img} src=${IMG.hero} alt=${api.lang === 'ar' ? 'موديلات محتشمات بقطع روح وقت الغروب' : 'Modestly dressed models at golden hour'} w=${2000} h=${1160} eager=${true}/></div>
      <div className="wrap hero__in">
        <${Reveal}><span className="kicker">${t('heroKick')}</span><//>
        <${Reveal} delay=${70}><h1>${t('heroH')}<span className="serif">RŪH</span></h1><//>
        <${Reveal} delay=${140}><p className="hero__sub">${t('heroSub')}</p><//>
        <${Reveal} delay=${210}>
          <div className="hero__cta">
            <a className="btn btn--clay" href="#/collection/all">${t('ctaCollection')}${' '}<${Icon} n="arr-r" size=${17}/></a>
            <a className="btn btn--bone" href="#story" onClick=${e => { e.preventDefault(); document.getElementById('story')?.scrollIntoView({ behavior:'smooth' }); }}>${t('ctaStory')}</a>
          </div>
          <div className="hero__proof">
            <span><${Icon} n="star-f" size=${17}/><b>4.9/5</b> ${t('heroProof1')}</span>
            <span><${Icon} n="truck" size=${17}/>${t('heroProof2')}</span>
            <span><${Icon} n="refresh" size=${17}/>${t('heroProof3')}</span>
          </div>
        <//>
      </div>
    </section>

    <section className="sec--tight wrap"><div className="trust">
      ${[['truck',t('trust1'),t('trust1s')],['refresh',t('trust2'),t('trust2s')],['cash',t('trust3'),t('trust3s')],['chat',t('trust4'),t('trust4s')]].map((x, i) => html`
        <${Reveal} key=${i} delay=${i * 60} cls="trust__it"><${Icon} n=${x[0]} size=${28}/><div><b>${x[1]}</b><span>${x[2]}</span></div><//>`)}
    </div></section>

    <section className="sec wrap">
      <div className="sec-head"><div><span className="kicker">${t('shop')}</span><h2 className="sec-title">${t('catsT')}</h2><p className="sec-sub">${t('catsS')}</p></div></div>
      <div className="cats">
        ${Object.keys(CFG.cats).map((c, i) => html`<${Reveal} key=${c} delay=${i * 70}>
          <a className="catc" href=${'#/collection/' + c}>
            <${Img} src=${CFG.cats[c].img} alt=${api.lang === 'ar' ? CFG.cats[c].ar : CFG.cats[c].en} w=${600} h=${750}/>
            <span className="catc__txt"><span><b>${api.lang === 'ar' ? CFG.cats[c].ar : CFG.cats[c].en}</b>
              <small>${PRODUCTS.filter(p => p.cat === c).length} ${t('pc')}</small></span>
              <span className="catc__go"><${Icon} n="arr-r" size=${17}/></span></span>
          </a><//>`)}
      </div>
    </section>

    <section className="sec sec--soft" id="tabsSec"><div className="wrap">
      <div className="sec-head">
        <div><span className="kicker">${t('shop')}</span><h2 className="sec-title">${t(tab + 'T')}</h2><p className="sec-sub">${t(tab + 'S')}</p></div>
        <div className="tabs" role="tablist">
          ${['new','best','sale'].map(k => html`<button key=${k} role="tab" aria-selected=${tab === k} className=${'tab' + (tab === k ? ' on' : '')} onClick=${() => setTab(k)}>${t(k + 'T')}</button>`)}
        </div>
      </div>
      <div className="pgrid">
        ${!tabReady ? Array.from({ length: 8 }, (_, i) => html`<${Skel} key=${i}/>`)
          : tabList.map((p, i) => html`<${Reveal} key=${p.id}><${ProductCard} p=${p} api=${api} idx=${i}/><//>`)}
      </div>
      <div style=${{ textAlign:'center', marginTop:'34px' }}>
        <a className="btn btn--ghost" href="#/collection/all">${t('allLink')} — ${PRODUCTS.length} ${t('pc')} <${Icon} n="arr-r" size=${17}/></a>
      </div>
    </div></section>

    <section className="sec wrap"><${Reveal}>
      <div className="edit">
        <div className="edit__img"><${Img} src=${IMG.edit} alt=${api.lang === 'ar' ? 'لوك بوك الصيف' : 'Summer lookbook'} w=${1400} h=${1100}/></div>
        <div className="edit__txt">
          <span className="kicker">${t('editK')}</span>
          <h2 className="sec-title">${t('editH')}</h2>
          <p>${t('editP')}</p>
          <div><a className="btn btn--bone" href="#/collection/all">${t('editCta')} <${Icon} n="arr-r" size=${17}/></a></div>
        </div>
      </div><//>
    </section>

    <section className="sec wrap"><${Reveal}>
      <div className="bundle">
        <div className="sec-head" style=${{ marginBottom:'6px' }}>
          <div><span className="kicker"><${Icon} n="gift" size=${17}/>${t('bundleT')}</span><h2 className="sec-title">${t('bundleT')}</h2><p className="sec-sub">${t('bundleS')}</p></div>
        </div>
        <div className="bundle__items">
          ${CFG.bundleIds.map(id => { const p = byId(id); return html`<a key=${id} className="bi" href=${'#/product/' + p.id}>
            <${Img} src=${p.imgs[0]} alt=${pname(p, api.lang)} w=${128} h=${160}/>
            <span><b>${pname(p, api.lang)}</b><span>${api.fmt(p.price)}</span></span></a>`; })}
        </div>
        <div className="bundle__deal">
          <div className="bundle__price"><b>${api.fmt(Math.round(bundleSum * .85))}</b><span className="old">${api.fmt(bundleSum)}</span> <span style=${{ color:'var(--clay-dark)', fontWeight:'700' }}>−15%</span></div>
          <button className="btn btn--ink" onClick=${() => api.addBundle()}><${Icon} n="bag" size=${17}/>${t('bundleBtn')}</button>
        </div>
      </div><//>
    </section>

    <section className="sec--tight wrap"><${Reveal}>
      <div className="offer">
        <div>
          <span className="kicker" style=${{ color:'#FFD9C9' }}>${t('offerT')}</span>
          <h2 className="sec-title">${t('offerH')}</h2>
          <p>${t('offerP')}</p>
        </div>
        ${left > 0 ? html`<div className="cd" role="timer">
          ${[[d,t('d')],[hh,t('h')],[mm,t('m')],[ss,t('s')]].map(([v, lb], i) => html`<div key=${i} className="cd__cell"><b>${String(v).padStart(2,'0')}</b><span>${lb}</span></div>`)}
        </div>` : html`<p className="offer__end">${t('offerEnd')}</p>`}
        <a className="btn btn--bone" href="#/collection/all">${t('offerCta')}</a>
      </div><//>
    </section>

    <section className="sec wrap" id="story">
      <div className="story">
        <${Reveal}><div className="story__img"><${Img} src=${IMG.sew6} alt=${api.lang === 'ar' ? 'أسطى في الأتيليه بيقيس القماش' : 'Tailor measuring fabric'} w=${900} h=${1125}/></div><//>
        <${Reveal} delay=${70}>
          <div><span className="kicker">${t('storyK')}</span><h2 className="sec-title">${t('storyH')}</h2>
            <div className="story__pts">
              ${[['leaf',t('sp1'),t('sp1s')],['ruler',t('sp2'),t('sp2s')],['pack',t('sp3'),t('sp3s')]].map((x, i) => html`
                <div key=${i} className="story__pt"><${Icon} n=${x[0]}/><div><b>${x[1]}</b><p>${x[2]}</p></div></div>`)}
            </div>
            <a className="btn btn--ghost" href="#/post/atelier-day">${t('storyCta')} <${Icon} n="arr-r" size=${17}/></a>
          </div><//>
      </div>
    </section>

    <section className="sec sec--soft" id="reviews"><div className="wrap">
      <div className="sec-head">
        <div><span className="kicker">${t('revsT')}</span><h2 className="sec-title">${t('revsT')}</h2><p className="sec-sub">${t('revsS')}</p></div>
      </div>
      <div className="revs__g">
        <${Reveal}><div className="rsum">
          <div className="d-flex align-items-baseline gap-2"><span className="rsum__big">4.9</span><span className="rsum__of">${t('of5')}</span></div>
          <${Stars} r=${4.9}/>
          <p style=${{ color:'var(--muted)', fontSize:'13px', margin:'8px 0 14px' }}>${t('basedOn')}</p>
          ${RATING_DIST.map(([s, pc]) => html`<div key=${s} className="rbar">
            <span style=${{ width:'14px', textAlign:'center', fontWeight:'700' }}>${s}</span>
            <svg className="icn icn--sm"><use href="#i-star-f"/></svg>
            <span className="rbar__tr"><span className="rbar__fl" style=${{ width: pc + '%' }}></span></span>
            <span style=${{ width:'34px', textAlign:'end' }}>${pc}%</span>
          </div>`)}
        </div><//>
        <div className="revs" tabIndex="0">
          ${TESTIMONIALS.map(r => { const p = byId(r.prod); return html`<article key=${r.name} className="rev">
            <div className="rev__top"><${Img} src=${r.av} alt=${r.name} cls="rev__av" w=${104} h=${104}/>
              <span><b>${api.lang === 'ar' ? r.nameAr : r.name}</b><span>${api.lang === 'ar' ? r.cityAr : r.city}</span></span>
              <span className="rev__fit">${t('fitRight')}</span></div>
            <${Stars} r=${r.rate}/>
            <p>“${api.lang === 'ar' ? r.txt : r.txtEn}”</p>
            <a className="rev__prod" href=${'#/product/' + p.id}>${pname(p, api.lang)} ←</a>
          </article>`; })}
        </div>
      </div>
    </div></section>

    <section className="sec wrap">
      <div className="sec-head"><div><span className="kicker">@ruh.cairo</span><h2 className="sec-title">${t('ugcT')}</h2><p className="sec-sub">${t('ugcS')}</p></div>
        <a className="sec-link" href="https://instagram.com" target="_blank" rel="noopener">Instagram<${Icon} n="arr-r" size=${17}/></a></div>
      <div className="ugc">
        ${UGC.map((u, i) => html`<${Reveal} key=${u.h} delay=${i * 50}>
          <a className="ugc__it" href="https://instagram.com" target="_blank" rel="noopener"><${Img} src=${u.img} alt=${u.h} w=${400} h=${400}/><span>${u.h}</span></a><//>`)}
      </div>
    </section>

    <section className="sec sec--soft" id="faq"><div className="wrap" style=${{ maxWidth:'860px' }}>
      <div className="sec-head"><div><span className="kicker">FAQ</span><h2 className="sec-title">${t('faqT')}</h2></div></div>
      <${Reveal}><div className="acc">
        ${FAQS.map((f, i) => html`<${Accordion} key=${i} title=${api.lang === 'ar' ? f.q : f.qe}>${api.lang === 'ar' ? f.a : f.ae}<//>`)}
      </div><//>
    </div></section>

    <section className="sec wrap"><${Reveal}>
      <div className="news">
        ${api.prefs.news ? html`<div className="news__ok">
          <${Icon} n="check" size=${28}/><h2 className="sec-title" style=${{ fontSize:'1.6rem' }}>${t('newsOkH')}</h2>
          <p>${t('newsOkP')}</p><code>ROOH10</code><p style=${{ fontSize:'13px', margin:'0' }}>${t('newsOkB')}</p></div>`
        : html`<${React.Fragment}>
          <span className="kicker" style=${{ color:'#FFC24B' }}><${Icon} n="gift" size=${17}/>${t('newsK')}</span>
          <h2 className="sec-title">${t('newsH')}</h2>
          <p>${t('newsP')}</p>
          <form className="news__frm" onSubmit=${submitNews} noValidate>
            <input type="email" value=${em} placeholder=${t('newsPh')} inputMode="email" autoComplete="email"
              onInput=${e => { setEm(e.target.value); setNewsMsg(e.target.value ? (okEm(e.target.value) ? { ok:true, txt:t('newsGood') } : { ok:false, txt:t('newsInv') }) : null); }} />
            <button className="btn btn--clay" type="submit">${t('newsBtn')}</button>
          </form>
          ${newsMsg && html`<p className=${'fmsg ' + (newsMsg.ok ? 'ok' : 'err')} aria-live="polite">${newsMsg.txt}</p>`}
        <//>`}
      </div><//>
    </section>

    ${recent.length > 0 && html`<section className="sec--tight wrap">
      <div className="sec-head"><h2 className="sec-title" style=${{ fontSize:'clamp(1.4rem,2.4vw,1.9rem)' }}>${t('recentT')}</h2></div>
      <div className="recent">${recent.map((p, i) => html`<${ProductCard} key=${p.id} p=${p} api=${api} idx=${i}/>`)}</div>
    </section>`}
  <//>`;
}

/* Accordion بسيط (state داخلي) */
function Accordion({ title, children }){
  const [open, setOpen] = useState(false);
  return html`<div className="acc__it">
    <button className="acc__btn" aria-expanded=${open} onClick=${() => setOpen(!open)}>
      <span>${title}</span><${Icon} n="chev-d"/>
    </button>
    <div className="acc__pn"><div className="acc__pni"><p>${children}</p></div></div>
  </div>`;
}

/* ================= Collection ================= */
function CollectionPage({ api }){
  const r = api.route;
  const cat = r.param || 'all';
  const scope = (list, c) => {
    if (c === 'sale') return list.filter(p => p.old);
    if (c === 'new') return list.filter(p => p.badge === 'new');
    if (c !== 'all') return list.filter(p => p.cat === c);
    return list;
  };
  let base = scope(PRODUCTS, cat);
  if (r.q.q){ const s = r.q.q.toLowerCase(); base = base.filter(p => (p.name + ' ' + p.en + ' ' + p.sub + ' ' + (p.subEn || '') + ' ' + p.fabric + ' ' + (p.fabricEn || '')).toLowerCase().includes(s)); }
  const prices = PRODUCTS.map(p => p.price);
  const pmin0 = Math.min(...prices), pmax0 = Math.max(...prices);
  const subs = cat === 'all' || cat === 'sale' || cat === 'new'
    ? Object.keys(CFG.cats).map(c => ({ v: c, lb: api.lang === 'ar' ? CFG.cats[c].ar : CFG.cats[c].en }))
    : [...new Set(base.map(p => api.lang === 'ar' ? p.sub : (p.subEn || p.sub)))].map(s => ({ v: s, lb: s }));
  const fabList = [...new Set(base.map(p => fabricOf(p, api.lang)))];
  const colorMap = new Map();
  base.forEach(p => p.colors.forEach(c => colorMap.set(cname(c, api.lang), c.c)));

  const [sub, setSub] = useState(new Set(r.q.sub ? [decodeURIComponent(r.q.sub)] : []));
  const [sizes, setSizes] = useState(new Set());
  const [colors, setColors] = useState(new Set());
  const [fabs, setFabs] = useState(new Set());
  const [mn, setMn] = useState(pmin0);
  const [mx, setMx] = useState(pmax0);
  const [av, setAv] = useState(false);
  const [rt, setRt] = useState(0);
  const [sort, setSort] = useState('new');
  const [ready, setReady] = useState(false);
  const [fltOpen, setFltOpen] = useState(false);
  useEffect(() => { const id = setTimeout(() => setReady(true), 320); return () => clearTimeout(id); }, []);
  useEffect(() => { track('view_item_list', { list: cat, items: base.length }); }, [cat]);

  let list = base;
  if (sub.size) list = list.filter(p => sub.has(p.cat) || sub.has(api.lang === 'ar' ? p.sub : (p.subEn || p.sub)));
  if (sizes.size) list = list.filter(p => [...sizes].some(s => p.sizes[s] > 0));
  if (colors.size) list = list.filter(p => p.colors.some(c => colors.has(cname(c, api.lang))));
  if (fabs.size) list = list.filter(p => fabs.has(fabricOf(p, api.lang)));
  list = list.filter(p => p.price >= Math.min(mn, mx) && p.price <= Math.max(mn, mx));
  if (av) list = list.filter(p => totalStock(p) > 0);
  if (rt) list = list.filter(p => p.rating >= rt);
  const sorts = { new:(a,b) => b.id - a.id, best:(a,b) => b.sold - a.sold, rate:(a,b) => b.rating - a.rating, low:(a,b) => a.price - b.price, high:(a,b) => b.price - a.price };
  list = [...list].sort(sorts[sort] || sorts.new);

  const chips = [];
  sub.forEach(v => chips.push({ k:'sub', v, lb: v }));
  sizes.forEach(v => chips.push({ k:'sizes', v, lb: v === 'OS' ? t('sizeOne') : v }));
  colors.forEach(v => chips.push({ k:'colors', v, lb: v }));
  fabs.forEach(v => chips.push({ k:'fabs', v, lb: v }));
  if (Math.min(mn, mx) > pmin0 || Math.max(mn, mx) < pmax0) chips.push({ k:'price', lb: `${api.fmt(Math.min(mn, mx))} — ${api.fmt(Math.max(mn, mx))}` });
  if (av) chips.push({ k:'av', lb: t('fAv') });
  if (rt) chips.push({ k:'rt', lb: rt + '+ ★' });
  const rmChip = c => {
    if (c.k === 'sub'){ const n = new Set(sub); n.delete(c.v); setSub(n); }
    if (c.k === 'sizes'){ const n = new Set(sizes); n.delete(c.v); setSizes(n); }
    if (c.k === 'colors'){ const n = new Set(colors); n.delete(c.v); setColors(n); }
    if (c.k === 'fabs'){ const n = new Set(fabs); n.delete(c.v); setFabs(n); }
    if (c.k === 'price'){ setMn(pmin0); setMx(pmax0); }
    if (c.k === 'av') setAv(false);
    if (c.k === 'rt') setRt(0);
  };
  const clearAll = () => { setSub(new Set()); setSizes(new Set()); setColors(new Set()); setFabs(new Set()); setMn(pmin0); setMx(pmax0); setAv(false); setRt(0); };

  const title = r.q.q ? `“${r.q.q}”` : cat === 'sale' ? t('sale')
    : cat === 'new' ? t('newT') : cat === 'all' ? (api.lang === 'ar' ? 'الكولكشن' : 'Collection') : (api.lang === 'ar' ? CFG.cats[cat].ar : CFG.cats[cat].en);

  return html`<div className="wrap" style=${{ paddingBlock:'8px clamp(48px,7vw,96px)' }}>
    <${Breadcrumbs} items=${[{ label: t('homeTxt'), to: '/' }, { label: title, cur: true }]}/>
    <div className="sec-head" style=${{ marginBottom:'20px' }}>
      <div>
        <h1 className="sec-title" style=${{ fontSize:'clamp(1.6rem,3vw,2.4rem)' }}>${title}</h1>
        <p className="sec-sub">${r.q.q ? (api.lang === 'ar' ? 'نتائج البحث' : 'Search results') : cat === 'sale' ? t('colSale') : t('colSub')}</p>
      </div>
    </div>
    <div className="coll__g">
      <aside className=${'flt' + (fltOpen ? ' show' : '')} aria-label=${t('filters')}>
        <div className="flt__mob"><h2>${t('filters')}</h2><button className="ibtn" onClick=${() => setFltOpen(false)} aria-label=${t('closeTxt')}><${Icon} n="x"/></button></div>
        <div className="flt__body">
          <div className="flt__grp"><h3 className="flt__t">${t('fCat')}</h3>
            ${subs.map(x => html`<label key=${x.v} className="chkf"><input type="checkbox" checked=${sub.has(x.v)} onChange=${() => { const n = new Set(sub); n.has(x.v) ? n.delete(x.v) : n.add(x.v); setSub(n); }}/>${x.lb}</label>`)}
          </div>
          <div className="flt__grp"><h3 className="flt__t">${t('fSize')}</h3>
            <div className="szf">${['S','M','L','XL','XXL','OS'].map(s => html`<button key=${s} className=${'szs' + (sizes.has(s) ? ' on' : '')} aria-pressed=${sizes.has(s)} onClick=${() => { const n = new Set(sizes); n.has(s) ? n.delete(s) : n.add(s); setSizes(n); }}>${s === 'OS' ? t('sizeOne') : s}</button>`)}</div>
          </div>
          <div className="flt__grp"><h3 className="flt__t">${t('fColor')}</h3>
            <div className="swtchs">${[...colorMap.entries()].map(([n, c]) => html`<button key=${n} className=${'swt' + (colors.has(n) ? ' on' : '')} aria-pressed=${colors.has(n)} title=${n} onClick=${() => { const nn = new Set(colors); nn.has(n) ? nn.delete(n) : nn.add(n); setColors(nn); }}><span style=${{ background: c }}></span></button>`)}</div>
          </div>
          <div className="flt__grp"><h3 className="flt__t">${t('fPrice')}</h3>
            <div className="rng">
              <span className="rng__fl" style=${{ insetInlineStart: ((Math.min(mn,mx) - pmin0) / (pmax0 - pmin0) * 100) + '%', insetInlineEnd: (100 - (Math.max(mn,mx) - pmin0) / (pmax0 - pmin0) * 100) + '%' }}></span>
              <input type="range" min=${pmin0} max=${pmax0} step="50" value=${mn} onInput=${e => setMn(+e.target.value)} aria-label="min price"/>
              <input type="range" min=${pmin0} max=${pmax0} step="50" value=${mx} onInput=${e => setMx(+e.target.value)} aria-label="max price"/>
            </div>
            <div className="rng__vals"><span>${api.fmt(Math.min(mn, mx))}</span><span>${api.fmt(Math.max(mn, mx))}</span></div>
          </div>
          <div className="flt__grp"><h3 className="flt__t">${t('fFabric')}</h3>
            ${fabList.map(f => html`<label key=${f} className="chkf"><input type="checkbox" checked=${fabs.has(f)} onChange=${() => { const n = new Set(fabs); n.has(f) ? n.delete(f) : n.add(f); setFabs(n); }}/>${f}</label>`)}
          </div>
          <div className="flt__grp"><h3 className="flt__t">${t('fRt')}</h3>
            ${[[0, t('all')],[4.5,'4.5+'],[4,'4+']].map(([v, lb]) => html`<label key=${v} className="chkf"><input type="radio" name="frt" checked=${rt === v} onChange=${() => setRt(v)}/>${lb} ${v ? html`<svg className="icn icn--sm" style=${{ color:'var(--clay)' }}><use href="#i-star-f"/></svg> ${lb === '4.5+' ? '+' : ''} ${lb !== '0' && lb !== '+0' ? t('andUp') : ''}` : ''}</label>`)}
          </div>
          <div className="flt__grp" style=${{ border:'0' }}>
            <label className="chkf"><input type="checkbox" checked=${av} onChange=${e => setAv(e.target.checked)}/>${t('fAv')}</label>
          </div>
          <button className="btn btn--sm btn--ghost btn--block" onClick=${clearAll} style=${{ marginTop:'8px' }}>${t('clearAll')}</button>
        </div>
      </aside>

      <div>
        <div className="coll__bar">
          <button className="btn btn--ghost btn--sm d-lg-none" onClick=${() => setFltOpen(true)} aria-label=${t('filters')}><${Icon} n="sliders" size=${17}/>${t('filters')}</button>
          <span className="coll__cnt" aria-live="polite"><b>${list.length}</b> ${t('results')}</span>
          <label className="d-flex align-items-center gap-2" style=${{ fontSize:'13.5px', fontWeight:'600' }}>${t('sort')}
            <select className="sel" value=${sort} onChange=${e => setSort(e.target.value)}>
              <option value="new">${t('sNew')}</option>
              <option value="best">${t('sBest')}</option>
              <option value="rate">${t('sRate')}</option>
              <option value="low">${t('sLow')}</option>
              <option value="high">${t('sHigh')}</option>
            </select>
          </label>
        </div>
        <div className="chips">
          ${chips.map(c => html`<span key=${c.k + (c.v || '')} className="chip">${c.lb}<button onClick=${() => rmChip(c)} aria-label=${t('sClr')}><${Icon} n="x" size=${13}/></button></span>`)}
          ${chips.length > 0 && html`<button className="chip chip--clr" onClick=${clearAll}>${t('clearAll')}</button>`}
        </div>
        <div className="pgrid">
          ${!ready ? Array.from({ length: 8 }, (_, i) => html`<${Skel} key=${i}/>`)
            : list.length === 0 ? html`<div style=${{ gridColumn:'1/-1' }}><${EmptyState} icon="search" title=${t('noResH')} sub=${t('noResP')} cta=${t('clearAll')} onGo=${clearAll}/></div>`
            : list.map((p, i) => html`<${Reveal} key=${p.id}><${ProductCard} p=${p} api=${api} idx=${i}/><//>`)}
        </div>
      </div>
    </div>
  </div>`;
}

/* ================= Product page ================= */
function ProductPage({ api }){
  const p = byId(api.route.param);
  const [clr, setClr] = useState(0);
  const [size, setSize] = useState(() => p ? firstSize(p) : null);
  const [thumb, setThumb] = useState(0);
  const [revF, setRevF] = useState('all');
  const [helped, setHelped] = useState({});
  const galRef = useRef(null);

  useEffect(() => { if (p){ api.pushRecent(p.id); track('view_item', { item: p.name, price: p.price }); } }, [p && p.id]);
  useEffect(() => {
    const onSug = e => { const sz = e.detail; if (p && p.sizes[sz] > 0) setSize(sz); };
    window.addEventListener('ruh:suggest', onSug);
    return () => window.removeEventListener('ruh:suggest', onSug);
  }, [p && p.id]);

  if (!p) return NotFound({ api });
  const inWish = api.wish.includes(p.id);
  const rel = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).sort((a, b) => b.sold - a.sold).slice(0, 4);
  const recent = api.recent.filter(id => id !== p.id).map(byId).filter(Boolean).slice(0, 8);
  const inBundle = CFG.bundleIds.includes(p.id);
  const revs = PDP_REVIEWS.filter(r => revF === 'all' ? true : revF === 'pics' ? !!r.img : r.rate === +revF);
  const stockN = p.sizes[size] || 0;

  const onMove = e => {
    const el = galRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const img = el.querySelector('img');
    if (img) img.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`;
  };

  return html`<${React.Fragment}>
    <div className="wrap" style=${{ paddingBottom:'clamp(40px,6vw,80px)' }}>
      <${Breadcrumbs} items=${[
        { label: t('homeTxt'), to: '/' },
        { label: api.lang === 'ar' ? CFG.cats[p.cat].ar : CFG.cats[p.cat].en, to: '/collection/' + p.cat },
        { label: pname(p, api.lang), cur: true }]}/>

      <div className="pd">
        <div className="gal">
          <div ref=${galRef} className="gal__main" onClick=${() => api.setLb({ imgs: p.imgs, i: thumb })} onMouseMove=${onMove} role="button" tabIndex="0"
            onKeyDown=${e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); api.setLb({ imgs: p.imgs, i: thumb }); } }}
            aria-label="Zoom">
            <${Img} src=${p.imgs[thumb]} alt=${pname(p, api.lang)} w=${800} h=${1067} eager=${true}/>
            <span className="gal__z"><${Icon} n="zoom"/></span>
          </div>
          <div className="thumbs">
            ${p.imgs.map((im, i) => html`<button key=${i} className=${thumb === i ? 'on' : ''} onClick=${() => setThumb(i)} aria-label=${'Image ' + (i + 1)}><${Img} src=${im} alt=${pname(p, api.lang) + ' ' + (i + 1)} w=${152} h=${192}/></button>`)}
          </div>
        </div>

        <div className="pd__info">
          <div className="d-flex gap-2" style=${{ marginBottom:'10px' }}>
            ${p.badge === 'new' && html`<span className="bdg bdg--new">${api.lang === 'ar' ? 'جديد' : 'New'}</span>`}
            ${p.old && html`<span className="bdg bdg--sale">−${discPct(p)}%</span>`}
            ${totalStock(p) <= 4 && totalStock(p) > 0 && html`<span className="bdg bdg--low">${api.lang === 'ar' ? 'آخر قطع' : 'Last pieces'}</span>`}
          </div>
          <h1>${pname(p, api.lang)}</h1>
          <div className="pd__rate">
            <${Stars} r=${p.rating}/><span><b>${p.rating}</b> (${p.rvws})</span>
            <a href="#pdRevs" onClick=${e => { e.preventDefault(); document.getElementById('pdRevs')?.scrollIntoView({ behavior:'smooth' }); }}>${t('readRev')}</a>
          </div>
          <${Price} p=${p} api=${api} big=${true}/>
          <p className="pd__desc">${descOf(p, api.lang)}</p>

          <div className="opt">
            <div className="opt__t">${t('fColor')} <span>${cname(p.colors[clr], api.lang)}</span></div>
            <div className="swbtns">${p.colors.map((c, i) => html`
              <button key=${i} className=${'swb' + (clr === i ? ' on' : '')} aria-label=${cname(c, api.lang)} aria-pressed=${clr === i}
                onClick=${() => setClr(i)}><span style=${{ background: c.c }}></span></button>`)}</div>
          </div>

          <div className="opt">
            <div className="opt__t">${t('fSize')}
              <button className="lnkbtn" style=${{ fontSize:'13px' }} onClick=${() => api.setModal('sizeguide')}><${Icon} n="ruler" size=${17}/>${t('szGuide')}</button>
              <button className="lnkbtn" style=${{ fontSize:'13px' }} onClick=${() => api.setModal('suggest')}><${Icon} n="sparkle" size=${17}/>${t('szSuggest')}</button>
            </div>
            <div className="szbtns" id="pdSzs">${Object.entries(p.sizes).map(([s, st]) => html`
              <button key=${s} className=${'szb' + (!st ? ' szb--out' : '') + (size === s ? ' on' : '')} aria-pressed=${size === s}
                disabled=${!st} onClick=${() => setSize(s)}>${s === 'OS' ? t('sizeOne') : s}</button>`)}</div>
            ${p.fit === 'small' && html`<div className="fitw"><${Icon} n="alert" size=${17}/>${t('fitSmall')}</div>`}
            ${p.fit === 'large' && html`<div className="fitw fitw--ok"><${Icon} n="info" size=${17}/>${t('fitLarge')}</div>`}
            <div className=${'stkn' + (stockN > 0 ? (stockN <= 2 ? '' : ' ok') : '')} aria-live="polite">
              <span className="dotp"></span>
              ${!size ? t('inStock') : stockN <= 0 ? t('outOf') : stockN <= 2 ? `${t('last')} ${stockN} ${t('piecesIn')} ${size}` : t('inStock')}
            </div>
          </div>

          <div className="pd__buy">
            <button className="btn btn--clay" onClick=${() => { if (!size){ ruhToast(t('selSizePlz'), 'err'); return; } api.addToCart(p.id, size, cname(p.colors[clr], api.lang), 1, false, true); }}><${Icon} n="bag" size=${17}/>${t('addCart')}</button>
            <button className="btn btn--ghost" onClick=${() => api.toggleWish(p)} aria-pressed=${inWish}>
              <svg className="icn icn--sm"><use href=${inWish ? '#i-heart-f' : '#i-heart'}/></svg>${t('wlT')}
            </button>
          </div>

          <div className="pd__trust">
            <span className="payc"><${Icon} n="truck" size=${17}/>${t('heroProof2')}</span>
            <span className="payc"><${Icon} n="refresh" size=${17}/>${api.lang === 'ar' ? 'استبدال 14 يوم' : '14-day exchange'}</span>
            <span className="payc"><${Icon} n="cash" size=${17}/>${api.lang === 'ar' ? 'ادفع لما تستلم' : 'COD'}</span>
            <span className="payc"><${Icon} n="lock" size=${17}/>${api.lang === 'ar' ? 'دفع آمن' : 'Secure payment'}</span>
          </div>

          <div className="pd__acc acc">
            <${Accordion} title=${t('descT')}>${descOf(p, api.lang)} — ${fabricOf(p, api.lang)}<//>
            <${Accordion} title=${t('careT')}>${careOf(p, api.lang)}<//>
            <${Accordion} title=${t('shipRT')}>${t('shipRTP')}<//>
          </div>
        </div>
      </div>

      ${inBundle && html`<section className="sec--tight"><${Reveal}>
        <div className="bundle" style=${{ padding:'22px' }}>
          <div className="sec-head" style=${{ marginBottom:'6px' }}><h2 style=${{ fontSize:'1.2rem', margin:'0' }}>${t('bundlePdpT')}</h2></div>
          <div className="bundle__items">
            ${CFG.bundleIds.filter(id => id !== p.id).map(id => { const q = byId(id); return html`<a key=${id} className="bi" href=${'#/product/' + q.id}>
              <${Img} src=${q.imgs[0]} alt=${pname(q, api.lang)} w=${128} h=${160}/>
              <span><b>${pname(q, api.lang)}</b><span>${api.fmt(q.price)}</span></span></a>`; })}
            <div className="bi" style=${{ alignItems:'center', justifyContent:'center' }}>
              <button className="btn btn--ink btn--sm" onClick=${() => api.addBundle()}>${t('bundleBtn')}</button>
            </div>
          </div>
        </div><//>
      </section>`}

      <section className="sec" id="pdRevs">
        <div className="sec-head"><div><span className="kicker">${t('revsPDP')}</span><h2 className="sec-title">${t('revsPDP')}</h2></div></div>
        <div className="revs__g">
          <${Reveal}><div className="rsum">
            <div className="d-flex align-items-baseline gap-2"><span className="rsum__big">${p.rating}</span><span className="rsum__of">${t('of5')}</span></div>
            <${Stars} r=${p.rating}/>
            <p style=${{ color:'var(--muted)', fontSize:'13px', margin:'8px 0 14px' }}>${p.rvws} ${api.lang === 'ar' ? 'تقييم' : 'reviews'}</p>
            ${RATING_DIST.map(([s, pc]) => html`<div key=${s} className="rbar"><span style=${{ width:'14px', textAlign:'center', fontWeight:'700' }}>${s}</span><svg className="icn icn--sm"><use href="#i-star-f"/></svg><span className="rbar__tr"><span className="rbar__fl" style=${{ width: pc + '%' }}></span></span><span style=${{ width:'34px', textAlign:'end' }}>${pc}%</span></div>`)}
          </div><//>
          <div>
            <div className="rvws__t">
              <button className="chip" style=${revF === 'all' ? { background:'var(--ink)', color:'var(--bone)' } : {}} onClick=${() => setRevF('all')}>${t('all')}</button>
              <button className="chip" style=${revF === '5' ? { background:'var(--ink)', color:'var(--bone)' } : {}} onClick=${() => setRevF('5')}>5 ★</button>
              <button className="chip" style=${revF === '4' ? { background:'var(--ink)', color:'var(--bone)' } : {}} onClick=${() => setRevF('4')}>4 ★</button>
              <button className="chip" style=${revF === 'pics' ? { background:'var(--ink)', color:'var(--bone)' } : {}} onClick=${() => setRevF('pics')}>${t('withPics')}</button>
            </div>
            ${revs.length === 0 && html`<${EmptyState} icon="chat" title=${t('noResH')}/>`}
            ${revs.map((r, i) => html`<${Reveal} key=${i}><div className="rvws__it">
              <div className="rev__top">
                <span className="rev__av d-inline-flex align-items-center justify-content-center" style=${{ background:'var(--sand)', fontWeight:'700', width:'52px', height:'52px', borderRadius:'50%' }}>${r.name[0]}</span>
                <span><b>${api.lang === 'ar' ? r.name : r.name}</b><span>${r.city}</span></span>
                <span className="rev__fit">${t('fitRight')}</span>
              </div>
              <${Stars} r=${r.rate}/>
              <p style=${{ fontSize:'14px', color:'var(--ink-soft)', margin:'8px 0' }}>“${api.lang === 'ar' ? r.txt : r.txtEn}”</p>
              ${r.img && html`<${Img} src=${r.img} alt=${api.lang === 'ar' ? 'صورة من العميل' : 'Customer photo'} w=${120} h=${150}/>`}
              <div className="rvws__hlp">
                <span>${t('helpful')}</span>
                <button onClick=${() => { setHelped(h => ({ ...h, [i]: 'y' })); ruhToast(t('thanks'), 'ok'); }}>${t('yes')}</button>
                <button onClick=${() => { setHelped(h => ({ ...h, [i]: 'n' })); ruhToast(t('thanks'), 'ok'); }}>${t('no')}</button>
              </div>
            </div><//>`)}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><h2 className="sec-title" style=${{ fontSize:'clamp(1.4rem,2.4vw,1.9rem)' }}>${t('relT')}</h2>
          <a className="sec-link" href=${'#/collection/' + p.cat}>${t('allLink')}<${Icon} n="arr-r" size=${17}/></a></div>
        <div className="pgrid">${rel.map((x, i) => html`<${Reveal} key=${x.id}><${ProductCard} p=${x} api=${api} idx=${i}/><//>`)}</div>
      </section>

      ${recent.length > 0 && html`<section className="sec--tight">
        <div className="sec-head"><h2 className="sec-title" style=${{ fontSize:'clamp(1.3rem,2.2vw,1.7rem)' }}>${t('recentT')}</h2></div>
        <div className="recent">${recent.map((x, i) => html`<${ProductCard} key=${x.id} p=${x} api=${api} idx=${i}/>`)}</div>
      </section>`}
    </div>

    <div className="sticky-add">
      <${Img} src=${p.imgs[0]} alt=${pname(p, api.lang)} w=${88} h=${112}/>
      <span style=${{ minWidth:'0' }}><b>${pname(p, api.lang)}</b><span>${api.fmt(p.price)}</span></span>
      <button className="btn btn--clay btn--sm" onClick=${() => { if (!size){ ruhToast(t('selSizePlz'), 'err'); return; } api.addToCart(p.id, size, cname(p.colors[clr], api.lang), 1, false, true); }}>${t('addCart')}</button>
    </div>
  <//>`;
}

/* ================= Wishlist ================= */
function WishlistPage({ api }){
  const items = api.wish.map(byId).filter(Boolean);
  return html`<div className="wrap sec">
    <div className="d-flex align-items-center gap-2" style=${{ marginBottom:'14px' }}>
      <button className="btn btn--ghost btn--sm" onClick=${api.goBack} aria-label=${t('backTxt')}><${Icon} n="arr-r" size=${17}/>${t('backTxt')}</button>
    </div>
    <div className="sec-head">
      <div><span className="kicker"><${Icon} n="heart" size=${17}/>wishlist</span><h1 className="sec-title">${t('wlT')}</h1></div>
    </div>
    ${items.length ? html`<div className="pgrid">${items.map((p, i) => html`<${Reveal} key=${p.id}><${ProductCard} p=${p} api=${api} idx=${i}/><//>`)}</div>`
    : html`<${EmptyState} icon="heart" title=${t('wlEmptyH')} sub=${t('wlEmptyP')} cta=${t('cartEmptyC')} onGo=${() => go('#/collection/all')}/>`}
  </div>`;
}

/* ================= Compare ================= */
function ComparePage({ api }){
  const items = api.cmp.map(byId).filter(Boolean);
  if (!items.length) return html`<div className="wrap sec">
    <button className="btn btn--ghost btn--sm" onClick=${api.goBack}><${Icon} n="arr-r" size=${17}/>${t('backTxt')}</button>
    <${EmptyState} icon="cmp" title=${t('cmpT')} sub=${t('cmpEmpty')} cta=${t('cartEmptyC')} onGo=${() => go('#/collection/all')}/>
  </div>`;
  return html`<div className="wrap sec">
    <div className="d-flex align-items-center gap-2" style=${{ marginBottom:'14px' }}>
      <button className="btn btn--ghost btn--sm" onClick=${api.goBack}><${Icon} n="arr-r" size=${17}/>${t('backTxt')}</button>
    </div>
    <div className="sec-head"><h1 className="sec-title">${t('cmpT')}</h1></div>
    <div className="cmp"><table>
      <thead><tr><th style=${{ width:'140px' }}></th>
        ${items.map(p => html`<td key=${p.id} style=${{ position:'relative' }}>
          <${Img} src=${p.imgs[0]} alt=${pname(p, api.lang)} w=${240} h=${300}/>
          <button className="cmp__rm" onClick=${() => api.toggleCmp(p)} aria-label=${t('cmpRm')}><${Icon} n="x" size=${17}/></button>
          <a href=${'#/product/' + p.id} style=${{ display:'block', marginTop:'10px', fontWeight:'700', textDecoration:'none' }}>${pname(p, api.lang)}</a>
        </td>`)}
      </tr></thead>
      <tbody>
        <tr><th>${t('cmpPrice')}</th>${items.map(p => html`<td key=${p.id}><b>${api.fmt(p.price)}</b>${p.old && html`<span style=${{ textDecoration:'line-through', color:'var(--muted)', fontSize:'13px' }}> ${api.fmt(p.old)}</span>`}</td>`)}</tr>
        <tr><th>${t('cmpRate')}</th>${items.map(p => html`<td key=${p.id}><${Stars} r=${p.rating}/> ${p.rating} (${p.rvws})</td>`)}</tr>
        <tr><th>${t('cmpFab')}</th>${items.map(p => html`<td key=${p.id}>${fabricOf(p, api.lang)}</td>`)}</tr>
        <tr><th>${t('cmpSz')}</th>${items.map(p => html`<td key=${p.id}><div className="szf">${Object.entries(p.sizes).map(([s, st]) => html`<span key=${s} className=${'szs' + (!st ? ' szs--out' : '')}>${s}</span>`)}</div></td>`)}</tr>
        <tr><th>${t('cmpClr')}</th>${items.map(p => html`<td key=${p.id}><div className="d-flex gap-1">${p.colors.map((c, i) => html`<span key=${i} className="dot" style=${{ background: c.c }} title=${cname(c, api.lang)}></span>`)}</div></td>`)}</tr>
        <tr><th></th>${items.map(p => html`<td key=${p.id}><button className="btn btn--sm btn--clay" onClick=${() => api.setQv(p)}>${t('quickView')}</button></td>`)}</tr>
      </tbody>
    </table></div>
  </div>`;
}

/* 404 */
function NotFound({ api }){
  return html`<div className="wrap sec"><${EmptyState} icon="alert" title=${t('pg404')} sub=${t('pg404p')} cta=${t('pg404b')} onGo=${() => go('#/')}/></div>`;
}
