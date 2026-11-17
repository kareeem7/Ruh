/* ============================================================
   js/admin.js — لوحة الأدمن (#/admin) — ثنائي اللغة (عربي/إنجليزي)
   PIN: 2026 (ديمو) — sessionStorage بس
============================================================ */
'use strict';
const A = k => { const d = ADMIN_I18N[__LANG] || ADMIN_I18N.ar; return typeof d[k] === 'function' ? d[k] : (d[k] ?? (ADMIN_I18N.ar[k] ?? k)); };

const blankAdminForm = () => ({
  name:'', en:'', cat:'women', sub:'', subEn:'', price:'', old:'',
  fabric:'', fabricEn:'', img1: IMG.shHang, img2:'',
  badge:'new', fit:'', colors:[],
  sizes:{ S:'', M:'', L:'', XL:'', XXL:'', OS:'' },
  desc:'', descEn:'', care:'', careEn:''
});

function AdminPage({ api }){
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ruh_admin') === '1');
  const [pin, setPin] = useState('');
  const [pinErr, setPinErr] = useState('');
  const [form, setForm] = useState(blankAdminForm());
  const [editId, setEditId] = useState(null);
  const [delId, setDelId] = useState(null);
  const [savedMsg, setSavedMsg] = useState(false);
  const [sec, setSec] = useState(1);   // تبويب أقسام الفورم على الموبايل

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSize = (k, v) => setForm(f => ({ ...f, sizes: { ...f.sizes, [k]: v } }));
  const toggleColor = k => setForm(f => ({ ...f, colors: f.colors.includes(k) ? f.colors.filter(x => x !== k) : [...f.colors, k] }));
  const tryPin = () => pin === ADMIN_PIN ? (sessionStorage.setItem('ruh_admin','1'), setAuthed(true)) : setPinErr(A('pinBad'));

  /* ---------- بوابة الـ PIN ---------- */
  if (!authed){
    return html`<div className="wrap sec"><div className="auth-g" style=${{ maxWidth:'480px', marginInline:'auto' }}>
      <div className="auth-form">
        <span className="kicker"><${Icon} n="lock" size=${17}/>RŪH ${api.lang === 'ar' ? 'لوحة' : 'console'}</span>
        <h1 style=${{ fontSize:'1.5rem', margin:'4px 0 6px' }}>${A('pinH')}</h1>
        <p style=${{ color:'var(--muted)', fontSize:'13.5px', marginTop:'0' }}>${A('pinHint')} <b dir="ltr">2026</b></p>
        <div className="fld">
          <label htmlFor="admPin">${A('pinLb')}</label>
          <input id="admPin" type="password" inputMode="numeric" dir="ltr" autoComplete="one-time-code"
            value=${pin} onInput=${e => { setPin(e.target.value.replace(/\D/g, '')); setPinErr(''); }}
            onKeyDown=${e => { if(e.key === 'Enter'){ e.preventDefault(); tryPin(); } }}/>
          ${pinErr && html`<p className="fmsg err" role="alert">${pinErr}</p>`}
        </div>
        <button className="btn btn--clay btn--block" style=${{ marginTop:'14px' }} onClick=${tryPin}>${A('enter')}</button>
        <a className="lnkbtn" href="#/" style=${{ marginTop:'12px' }}>${A('back')}</a>
      </div>
    </div></div>`;
  }

  const st = AdminStore.stats(PRODUCTS, api.orders, api.wish, api.cmp);
  const adminCount = PRODUCTS.filter(p => p.admin).length;

  const startEdit = p => {
    setEditId(p.id); setDelId(null); setSec(1);
    setForm({
      name: p.name, en: p.en, cat: p.cat, sub: p.sub, subEn: p.subEn || '',
      price: String(p.price), old: p.old ? String(p.old) : '',
      fabric: p.fabric, fabricEn: p.fabricEn || '',
      img1: p.imgs[0] || '', img2: p.imgs[1] || '',
      badge: p.badge || '', fit: p.fit || '',
      colors: Object.keys(C).filter(k => p.colors.some(c => c.c === C[k].c)),
      sizes: Object.fromEntries(['S','M','L','XL','XXL','OS'].map(k => [k, p.sizes[k] != null ? String(p.sizes[k]) : ''])),
      desc: p.desc, descEn: p.descEn || '', care: p.care, careEn: p.careEn || ''
    });
    document.getElementById('admForm')?.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  const missing = () => {
    const bad = [];
    if (form.name.trim().length < 2) bad.push(A('nameAr'));
    if (!(parseInt(form.price, 10) > 0)) bad.push(A('price'));
    if (!form.img1.trim()) bad.push(A('img1').replace(' *',''));
    if (!form.colors.length) bad.push(A('colors'));
    if (!Object.values(form.sizes).some(v => parseInt(v, 10) > 0)) bad.push(A('stockLb'));
    return bad;
  };
  const save = () => {
    const bad = missing();
    if (bad.length){ ruhToast(A('missing')(bad.join(api.lang === 'ar' ? '، ' : ', ')), 'err'); return; }
    const prod = AdminStore.productFromForm(form, C, editId ?? undefined);
    if (editId == null) prod.id = AdminStore.nextProductId(PRODUCTS);
    const i = PRODUCTS.findIndex(p => p.id === prod.id);
    if (i > -1) PRODUCTS[i] = prod; else PRODUCTS.push(prod);
    AdminStore.saveAdminProducts(PRODUCTS.filter(p => p.admin));
    api.bumpProducts();
    track('admin_save_product', { id: prod.id, name: prod.name });
    setSavedMsg(true); setForm(blankAdminForm()); setEditId(null); setSec(1);
    ruhToast(A('saved'), 'ok');
    setTimeout(() => setSavedMsg(false), 4500);
  };
  const del = id => {
    const i = PRODUCTS.findIndex(p => p.id === id);
    if (i > -1) PRODUCTS.splice(i, 1);
    AdminStore.saveAdminProducts(PRODUCTS.filter(p => p.admin));
    setDelId(null); api.bumpProducts(); ruhToast(A('delTo'), 'info');
  };

  /* فانكشن حقل عادية (مش component) عشان الفوكس ما يضيعش */
  const fld = (k, lb, ph = '', type = 'text', ltr = false) => html`
    <div className="fld">
      <label htmlFor=${'af_' + k}>${lb}</label>
      <input id=${'af_' + k} type=${type} placeholder=${ph} value=${form[k]} ${ltr ? { dir:'ltr' } : null}
        ${type === 'number' ? { inputMode:'numeric' } : null}
        onInput=${e => set(k, e.target.value)}/>
    </div>`;
  const tArea = (k, lb) => html`
    <div className="fld"><label htmlFor=${'af_' + k}>${lb}</label>
      <textarea id=${'af_' + k} rows="2" value=${form[k]} onInput=${e => set(k, e.target.value)}/></div>`;

  /* أقسام الفورم — تتغيّر بالتبويب الصغير على الموبايل وتنعرض كلها على الديسكتوب */
  const secDefs = [
    { n:1, t:A('s1'), body: html`<div className="frm">
        ${fld('name', A('nameAr'), A('prdNamePh'))}
        ${fld('en', A('nameEn'), A('prdNameEnPh'), 'text', true)}
        <div className="fld"><label htmlFor="af_cat">${A('cat')}</label>
          <select id="af_cat" value=${form.cat} onChange=${e => set('cat', e.target.value)}>
            ${Object.keys(CFG.cats).map(c => html`<option key=${c} value=${c}>${api.lang === 'ar' ? CFG.cats[c].ar : CFG.cats[c].en}</option>`)}
          </select></div>
        ${fld('sub', A('sub'), A('subPh'))}
      </div>` },
    { n:2, t:A('s2'), body: html`<div className="frm">
        ${fld('price', A('price'), A('numPh'), 'number', true)}
        ${fld('old', A('old'), '', 'number', true)}
        ${fld('fabric', A('fabricAr'), A('fabricPh'))}
        ${fld('fabricEn', A('fabricEn'), A('fabricEnPh'), 'text', true)}
      </div>` },
    { n:3, t:A('s3'), body: html`<div className="frm">
        ${fld('img1', A('img1'), A('urlPh'), 'text', true)}
        ${fld('img2', A('img2'), A('urlPh'), 'text', true)}
        <div className="fld full">
          <span style=${{ fontSize:'12px', color:'var(--muted)' }}>${A('preview')}</span>
          <div className="d-flex gap-2 flex-wrap" style=${{ marginTop:'6px' }}>
            ${form.img1 && html`<${Img} src=${form.img1} alt="preview" w=${96} h=${124}/>`}
            ${form.img2 && html`<${Img} src=${form.img2} alt="preview" w=${96} h=${124}/>`}
            ${!form.img1 && !form.img2 && html`<span style=${{ fontSize:'13px', color:'var(--muted)' }}>—</span>`}
          </div>
        </div>
      </div>` },
    { n:4, t:A('s4'), body: html`<${React.Fragment}>
        <div className="frm">
          <div className="fld"><label htmlFor="af_badge">${A('badge')}</label>
            <select id="af_badge" value=${form.badge} onChange=${e => set('badge', e.target.value)}>
              <option value="">${A('badgeNone')}</option><option value="new">${A('badgeNew')}</option><option value="sale">${A('badgeSale')}</option>
            </select></div>
          <div className="fld"><label htmlFor="af_fit">${A('fit')}</label>
            <select id="af_fit" value=${form.fit} onChange=${e => set('fit', e.target.value)}>
              <option value="">${A('fitN')}</option><option value="small">${A('fitS')}</option><option value="large">${A('fitL')}</option>
            </select></div>
        </div>
        <div className="fld" style=${{ marginTop:'14px' }}><label>${A('colors')}</label>
          <div className="d-flex gap-2 flex-wrap">
            ${Object.entries(C).map(([k, s]) => html`<button key=${k} type="button" title=${api.lang === 'ar' ? s.ar : s.en}
              className=${'swt' + (form.colors.includes(k) ? ' on' : '')} aria-pressed=${form.colors.includes(k)} onClick=${() => toggleColor(k)}>
              <span style=${{ background: s.c }}></span></button>`)}
          </div>
        </div>
      <//>` },
    { n:5, t:A('s5'), body: html`
        <div className="admg">
          ${['S','M','L','XL','XXL','OS'].map(k => html`<div key=${k} className="fld">
            <label htmlFor=${'af_sz_' + k}>${k === 'OS' ? (api.lang === 'ar' ? 'مقاس واحد' : 'OS') : k}</label>
            <input id=${'af_sz_' + k} type="number" min="0" inputMode="numeric" placeholder="0"
              value=${form.sizes[k]} onInput=${e => setSize(k, e.target.value)}/>
          </div>`)}
        </div>` },
    { n:6, t:A('s6'), body: html`<div className="frm">
        ${tArea('desc', A('descAr'))}
        ${tArea('descEn', A('descEn'))}
        ${tArea('care', A('careAr'))}
        <div className="fld" style=${{ alignSelf:'end' }}>
          <span style=${{ fontSize:'12px', color:'var(--muted)' }}>${A('req')}</span></div>
      </div>` }
  ];

  const shownSecs = api.lang === 'ar' ? secDefs : secDefs; // الأقسام نفسها، اللي بيغيره هو الترجمة

  return html`<div className="wrap sec">
    <div className="sec-head">
      <div><span className="kicker"><${Icon} n="sliders" size=${17}/>Admin</span>
        <h1 className="sec-title">${A('title')}</h1>
        <p className="sec-sub">${A('sub')}</p>
      </div>
      <div className="d-flex gap-2">
        <a className="btn btn--ghost btn--sm" href="#/collection/all">${A('openStore')}</a>
        <button className="btn btn--ghost btn--sm" onClick=${() => { sessionStorage.removeItem('ruh_admin'); setAuthed(false); }}>${A('logout')}</button>
      </div>
    </div>

    <div className="astats">
      ${[[st.products, A('catalog'), 'pack'], [st.stock, A('stockUnits'), 'bag'], [st.orders, A('ordersN'), 'truck'],
         [api.fmt(st.revenue), A('rev'), 'cash'], [st.wishCount, A('wishN'), 'heart'], [adminCount, A('adminN'), 'sparkle']]
        .map(([n, lb, ic], i) => html`<div key=${i} className="acard statc">
          <${Icon} n=${ic} size=${22}/><b>${n}</b><span>${lb}</span></div>`)}
    </div>

    ${st.lowStock.length > 0 && html`
      <div className="acard" style=${{ borderColor:'color-mix(in srgb,var(--danger) 35%,var(--line))', marginBottom:'18px' }}>
        <h2 style=${{ display:'flex', alignItems:'center', gap:'8px', color:'var(--danger)', fontSize:'15px', margin:'0 0 10px' }}>
          <${Icon} n="alert" size=${19}/> ${A('low')}</h2>
        <div className="d-flex gap-2 flex-wrap">
          ${st.lowStock.map(p => html`<a key=${p.id} className="chip" href=${'#/product/' + p.id}>${pname(p, api.lang)} · ${totalStock(p)} ${A('colS')}</a>`)}
        </div>
      </div>`}

    <div className="agrid">
      <!-- ===== الفورم ===== -->
      <div className="acard adm-form" id="admForm">
        <div className="d-flex align-items-center justify-content-between gap-2" style=${{ marginBottom:'8px' }}>
          <h2 style=${{ margin:'0', fontSize:'16px' }}>${editId ? A('editP')(editId) : A('newP')}</h2>
          ${editId && html`<button className="lnkbtn" onClick=${() => { setEditId(null); setForm(blankAdminForm()); }}>${A('cancel')}</button>`}
        </div>

        <!-- تبويبات أقسام (تظهر بشكل مريح على الموبايل) -->
        <div className="admTabs" role="tablist">
          ${secDefs.map(s => html`<button key=${s.n} role="tab" aria-selected=${sec === s.n}
            className=${'admTab' + (sec === s.n ? ' on' : '')} onClick=${() => setSec(s.n)}>${s.n}</button>`)}
        </div>

        ${shownSecs.map(s => html`<section key=${s.n} className=${'adm-sec' + (sec === s.n ? ' on' : '')}>
          <h3><span className="n">${s.n}</span>${s.t}</h3>
          ${s.body}
        </section>`)}

        <div className="d-flex gap-2" style=${{ marginTop:'20px' }}>
          <button className="btn btn--clay" style=${{ flex:'1' }} onClick=${save}>${editId ? A('saveEdit') : A('saveNew')}</button>
          ${editId && html`<button className="btn btn--ghost" onClick=${() => { setEditId(null); setForm(blankAdminForm()); }}>${A('cancel')}</button>`}
        </div>
        ${savedMsg && html`<p className="fmsg" role="status" style=${{ color:'var(--success)', fontWeight:'600' }}>${A('saved')} — <a href="#/collection/all" style=${{ color:'var(--clay-dark)', textDecoration:'underline' }}>${A('savedLink')}</a></p>`}
      </div>

      <!-- ===== جدول المنتجات ===== -->
      <div className="acard adm-list" style=${{ overflow:'auto' }}>
        <h2 style=${{ fontSize:'16px' }}>${A('prodsT')(PRODUCTS.length)}</h2>
        <table className="atable">
          <thead><tr><th></th><th>${A('hProd')}</th><th>${A('hPrice')}</th><th>${A('hStock')}</th><th>${A('hBadge')}</th><th>${A('hAct')}</th></tr></thead>
          <tbody>
            ${PRODUCTS.map(p => html`<tr key=${p.id}>
              <td><${Img} src=${p.imgs[0]} alt="" w=${44} h=${56}/></td>
              <td><b style=${{ fontSize:'13px' }}>${pname(p, api.lang)}</b><br/>
                  <span style=${{ fontSize:'11.5px', color:'var(--muted)' }}>${subOf(p, api.lang)}</span></td>
              <td style=${{ whiteSpace:'nowrap' }}>${api.fmt(p.price)}
                  ${p.old ? html`<br/><span style=${{ fontSize:'11px', color:'var(--muted)', textDecoration:'line-through' }}>${api.fmt(p.old)}</span>` : ''}</td>
              <td><span className=${'bstk' + (totalStock(p) <= 4 ? ' low' : '')}>${totalStock(p)}</span></td>
              <td>${p.badge ? (p.badge === 'new' ? 'New' : 'Sale') : A('dash')}
                  ${p.admin ? html` <span className="bstk adm">${A('admTag')}</span>` : ''}</td>
              <td style=${{ whiteSpace:'nowrap' }}>
                ${!p.admin && html`<span style=${{ fontSize:'11px', color:'var(--muted)' }}>${A('baseTag')}</span> `}
                <button className="lnkbtn" style=${{ minHeight:'34px' }} onClick=${() => startEdit(p)}>${api.lang === 'en' ? 'Edit' : 'عدّل'}</button>
                ${p.admin && (delId === p.id
                  ? html`<${React.Fragment}><button className="lnkbtn" style=${{ color:'var(--danger)' }} onClick=${() => del(p.id)}>${A('confirmDel')}</button>
                      <button className="lnkbtn" onClick=${() => setDelId(null)}>${A('no')}</button><//>`
                  : html`<button className="lnkbtn" style=${{ color:'var(--danger)' }} onClick=${() => setDelId(p.id)}>${A('del')}</button>`)}
              </td>
            </tr>`)}
          </tbody>
        </table>
        <p style=${{ fontSize:'12px', color:'var(--muted)', margin:'10px 0 0' }}>${A('prot')}</p>
      </div>
    </div>

    <!-- ===== الطلبات ===== -->
    <div className="acard" style=${{ marginTop:'18px' }}>
      <h2 style=${{ fontSize:'16px' }}>${A('ordersT')(api.orders.length)}</h2>
      ${api.orders.length ? html`<div style=${{ overflow:'auto' }}><table className="atable">
        <thead><tr><th>${A('oNum')}</th><th>${A('oDate')}</th><th>${A('oTotal')}</th><th>${A('oShip')}</th><th>${A('oPay')}</th><th>${A('oItems')}</th></tr></thead>
        <tbody>
          ${api.orders.slice().reverse().map(o => html`<tr key=${o.num}>
            <td><a href=${'#/order/' + o.num} dir="ltr" style=${{ fontWeight:'700' }}>${o.num}</a></td>
            <td>${new Date(o.ts).toLocaleString(api.lang === 'ar' ? 'ar-EG' : 'en-GB', { dateStyle:'short', timeStyle:'short' })}</td>
            <td><b>${api.fmt(o.total)}</b></td>
            <td>${o.shipLb}</td><td>${o.payLb}</td><td>${o.items.length}</td>
          </tr>`)}
        </tbody></table></div>`
      : html`<p style=${{ color:'var(--muted)', fontSize:'13.5px', margin:'0' }}>${A('noOrders')}</p>`}
    </div>
  </div>`;
}
