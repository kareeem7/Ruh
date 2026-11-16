/* ============================================================
   js/pages-plus.js — المحتوى (مدونة/مقال/سياسات) + الطلب + الحساب
============================================================ */
'use strict';

/* ---------- Blog ---------- */
function BlogPage({ api }){
  return html`<div className="wrap sec">
    <div className="sec-head"><div><span className="kicker">Journal</span><h1 className="sec-title">${api.lang === 'ar' ? 'مدونة روح' : 'The RŪH Journal'}</h1>
      <p className="sec-sub">${api.lang === 'ar' ? 'عناية بالخامات، أفكار تنسيق، وكواليس الأتيليه.' : 'Fabric care, styling ideas, atelier diaries.'}</p></div></div>
    <div className="posts">
      ${POSTS.map((p, i) => html`<${Reveal} key=${p.id} delay=${i * 70}>
        <a className="postc" href=${'#/post/' + p.id}>
          <div className="postc__img"><${Img} src=${p.img} alt=${api.lang === 'ar' ? p.title : p.titleEn} w=${800} h=${500}/></div>
          <div className="postc__b">
            <span className="tg">${api.lang === 'ar' ? p.tag : p.tagEn}</span>
            <h3>${api.lang === 'ar' ? p.title : p.titleEn}</h3>
            <p>${api.lang === 'ar' ? p.ex : p.exEn}</p>
          </div>
        </a><//>`)}
    </div>
  </div>`;
}

function PostPage({ api }){
  const p = POSTS.find(x => x.id === api.route.param);
  if (!p) return NotFound({ api });
  return html`<div className="wrap sec"><article className="posta">
    <${Breadcrumbs} items=${[{ label: t('homeTxt'), to: '/' }, { label: t('blog'), to: '/blog' }, { label: api.lang === 'ar' ? p.title : p.titleEn, cur: true }]}/>
    <span className="kicker">${api.lang === 'ar' ? p.tag : p.tagEn}</span>
    <h1>${api.lang === 'ar' ? p.title : p.titleEn}</h1>
    <div className="posta__mt">
      <span><svg className="icn icn--sm" style=${{ verticalAlign:'-3px' }}><use href="#i-clock"/></svg> ${p.mins} ${api.lang === 'ar' ? 'دقايق قراءة' : 'min read'}</span>
      <span>RŪH Studio</span>
      <button className="lnkbtn" onClick=${() => shareCopy(location.href)}><${Icon} n="copy" size=${17}/>${api.lang === 'ar' ? 'انسخ الرابط' : 'Copy link'}</button>
    </div>
    <div className="posta__img"><${Img} src=${p.img} alt=${api.lang === 'ar' ? p.title : p.titleEn} w=${1400} h=${788} eager=${true}/></div>
    ${(api.lang === 'ar' ? p.body : p.bodyEn).map((b, i) => html`<p key=${i}>${b}</p>`)}
    <div style=${{ marginTop:'30px' }}><a className="btn btn--clay" href="#/collection/all">${t('ctaCollection')} <${Icon} n="arr-r" size=${17}/></a></div>
  </article></div>`;
}

/* ---------- Policy pages + FAQ page ---------- */
function ContentPage({ api }){
  if (api.route.param === 'faq'){
    return html`<div className="wrap sec"><article className="pgdoc">
      <${Breadcrumbs} items=${[{ label: t('homeTxt'), to: '/' }, { label: t('faqT'), cur: true }]}/>
      <h1>${t('faqT')}</h1>
      <div className="acc">${FAQS.map((f, i) => html`<${Accordion} key=${i} title=${api.lang === 'ar' ? f.q : f.qe}>${api.lang === 'ar' ? f.a : f.ae}<//>`)}</div>
    </article></div>`;
  }
  const pg = PAGES[api.route.param];
  if (!pg) return NotFound({ api });
  const title = api.lang === 'ar' ? pg.t : pg.te;
  return html`<div className="wrap sec"><article className="pgdoc">
    <${Breadcrumbs} items=${[{ label: t('homeTxt'), to: '/' }, { label: title, cur: true }]}/>
    <h1>${title}</h1>
    <p>${api.lang === 'ar' ? pg.p : pg.pe}</p>
    ${pg.h.map(([h, b], i) => html`<${React.Fragment} key=${i}><h2>${h}</h2><p>${b}</p><//>`)}
  </article></div>`;
}

/* ---------- Order confirmation ---------- */
function OrderPage({ api }){
  const o = api.orders.find(x => x.num === api.route.param) || LS.get('ruh_last_order', null);
  if (!o || o.num !== api.route.param) return NotFound({ api });
  return html`<div className="wrap sec"><div className="ord">
    <span className="ord__ic"><${Icon} n="check" size=${28}/></span>
    <h1 className="sec-title">${t('ordH')}</h1>
    <p style=${{ color:'var(--muted)' }}>${t('ordP')}</p>
    <p style=${{ fontSize:'22px', fontWeight:'700', letterSpacing:'.05em' }} dir="ltr">${o.num}</p>
    <div className="tl" role="list" aria-label=${t('trackT')}>
      ${[['pack',t('tl1'),'done'],['clock',t('tl2'),'cur'],['truck',t('tl3'),''],['check',t('tl4'),'']].map(([ic, lb, st], i) => html`
        <div key=${i} className=${'tl__st ' + st} role="listitem">
          <span className="tl__dt"><${Icon} n=${ic} size=${17}/></span><b>${lb}</b>
        </div>`)}
    </div>
    <div className="csum" style=${{ textAlign:'start', maxWidth:'520px', marginInline:'auto' }}>
      <div className="tot"><span>${t('shipVia')}</span><b>${o.shipLb}</b></div>
      <div className="tot"><span>${t('payVia')}</span><b>${o.payLb}</b></div>
      <div className="tot tot--grand"><span>${t('total')}</span><b>${api.fmt(o.total)}</b></div>
    </div>
    <div className="d-flex gap-2 justify-content-center flex-wrap" style=${{ marginTop:'28px' }}>
      <button className="btn btn--ink" onClick=${() => api.setModal('track')}><${Icon} n="truck" size=${17}/>${t('ordTrack')}</button>
      <a className="btn btn--ghost" href="#/collection/all">${t('ordCont')}</a>
    </div>
  </div></div>`;
}

/* ---------- Account (محمية — بص مباشر للوهلة) ---------- */
function AccountPage({ api }){
  const u = api.user;
  const [nm, setNm] = useState(u ? u.name : '');
  const [ph, setPh] = useState(u && u.phone ? u.phone : '');
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [errs, setErrs] = useState({});
  useEffect(() => { if (u){ setNm(u.name); setPh(u.phone || ''); } }, [u && u.email]);
  if (!u){ go('#/auth'); return null; }
  const since = new Date(u.ts).toLocaleDateString(api.lang === 'ar' ? 'ar-EG' : 'en-GB', { year:'numeric', month:'long' });

  const saveProfile = () => {
    const e = {};
    if (nm.trim().length < 2) e.nm = t('invNm');
    if (ph && !validPh(ph)) e.ph = t('invPh');
    setErrs(e);
    if (Object.keys(e).length) return;
    const us = users(); const i = us.findIndex(x => x.email === u.email);
    us[i].name = nm.trim(); us[i].phone = ph.replace(/\D/g, '');
    saveUsers(us); api.syncUser(); ruhToast(t('savedOk'), 'ok');
  };
  const changePass = async () => {
    const e = {};
    const h = await hashPass(curPw, u.salt);
    if (h !== u.hash) e.cur = t('eCur');
    if (newPw.length < 8) e.nw = t('ePassLen');
    setErrs(e);
    if (Object.keys(e).length) return;
    const us = users(); const i = us.findIndex(x => x.email === u.email);
    us[i].hash = await hashPass(newPw, u.salt);
    saveUsers(us); setCurPw(''); setNewPw(''); ruhToast(t('passOk'), 'ok');
  };

  return html`<div className="wrap sec">
    <div className="d-flex align-items-center gap-2" style=${{ marginBottom:'14px' }}>
      <button className="btn btn--ghost btn--sm" onClick=${api.goBack}><${Icon} n="arr-r" size=${17}/>${t('backTxt')}</button>
    </div>
    <div className="acct-grid">
      <aside className="acard" style=${{ textAlign:'center', position:'sticky', top:'calc(var(--hdr-h) + 16px)' }}>
        <span className="avatar">${esc((u.name || 'U')[0].toUpperCase())}</span>
        <h2 style=${{ margin:'14px 0 2px', fontSize:'19px' }}>${u.name}</h2>
        <p style=${{ fontSize:'13px', color:'var(--muted)', margin:'2px 0' }} dir="ltr">${u.email}</p>
        ${u.phone && html`<p style=${{ fontSize:'13px', color:'var(--muted)', margin:'2px 0' }} dir="ltr">${u.phone}</p>`}
        <span className="chip" style=${{ background:'var(--soft)', marginTop:'10px' }}>${t('memberSince')} ${since}</span>
        <button className="btn btn--ghost btn--sm btn--block" style=${{ marginTop:'20px' }} onClick=${() => { sessClear(); api.syncUser(); track('logout'); ruhToast(t('outOk'), 'info'); go('#/'); }}>
          <${Icon} n="user" size=${17}/>${t('acctOut')}</button>
      </aside>
      <div className="d-grid" style=${{ gap:'16px' }}>
        <div className="acard"><h2>${t('profile')}</h2>
          <div className="frm">
            <div className=${'fld' + (errs.nm ? ' inv' : '')}><label htmlFor="pNm">${t('acctNm')}</label>
              <input id="pNm" autoComplete="name" value=${nm} onInput=${e => setNm(e.target.value)}/>
              ${errs.nm && html`<p className="fmsg">${errs.nm}</p>`}</div>
            <div className=${'fld' + (errs.ph ? ' inv' : '')}><label htmlFor="pPh">${t('ph')}</label>
              <input id="pPh" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="01xxxxxxxxx" value=${ph} onInput=${e => setPh(e.target.value)} style=${{ textAlign: api.lang === 'ar' ? 'right' : 'left' }}/>
              ${errs.ph && html`<p className="fmsg">${errs.ph}</p>`}</div>
          </div>
          <button className="btn btn--ink btn--sm" style=${{ marginTop:'16px' }} onClick=${saveProfile}>${t('saveBtn')}</button>
        </div>
        <div className="acard"><h2>${t('changePass')}</h2>
          <div className="frm">
            <div className=${'fld' + (errs.cur ? ' inv' : '')}><label htmlFor="cPv">${t('curPass')}</label>
              <input id="cPv" type="password" autoComplete="current-password" value=${curPw} onInput=${e => setCurPw(e.target.value)}/>
              ${errs.cur && html`<p className="fmsg">${errs.cur}</p>`}</div>
            <div className=${'fld' + (errs.nw ? ' inv' : '')}><label htmlFor="nPv">${t('newPass')}</label>
              <input id="nPv" type="password" autoComplete="new-password" value=${newPw} onInput=${e => setNewPw(e.target.value)}/>
              ${errs.nw && html`<p className="fmsg">${errs.nw}</p>`}</div>
          </div>
          <button className="btn btn--ink btn--sm" style=${{ marginTop:'16px' }} onClick=${changePass}>${t('changePass')}</button>
        </div>
        <div className="acard"><h2>${t('ordersT')}</h2>
          ${api.orders.length ? api.orders.slice().reverse().map(o => {
            const fp = byId(o.items[0] && o.items[0].id) || PRODUCTS[0];
            return html`<a key=${o.num} href=${'#/order/' + o.num} className="mega-mini" style=${{ textDecoration:'none', border:'1px solid var(--line)', marginBottom:'8px' }}>
              <${Img} src=${fp.imgs[0]} alt=${o.num} w=${80} h=${100}/>
              <span><b dir="ltr">${o.num}</b><span>${api.fmt(o.total)} · ${new Date(o.ts).toLocaleDateString(api.lang === 'ar' ? 'ar-EG' : 'en-GB')}</span></span></a>`;
          }) : html`<p style=${{ color:'var(--muted)', fontSize:'13.5px', margin:'0' }}>${t('noOrders')}</p>`}
        </div>
        <div className="acard"><h2>${t('savedAddr')}</h2>
          ${api.addr ? html`<p style=${{ fontSize:'14px', margin:'0', color:'var(--ink-soft)' }}>
            <${Icon} n="pin" size=${17}/>${' '}${api.addr.addr} — ${api.addr.city}<br/>
            <span dir="ltr" style=${{ color:'var(--muted)', fontSize:'13px' }}>${api.addr.ph}</span></p>`
          : html`<p style=${{ color:'var(--muted)', fontSize:'14px', margin:'0' }}>${t('noAddr')}</p>`}
        </div>
      </div>
    </div>
  </div>`;
}
