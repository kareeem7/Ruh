/* ============================================================
   js/admin.js — لوحة الأدمن (#/admin)
   PIN: 2026 (ديمو) — بيتحفظ في sessionStorage للجلسة بس
============================================================ */
'use strict';

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

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSize = (k, v) => setForm(f => ({ ...f, sizes: { ...f.sizes, [k]: v } }));
  const toggleColor = k => setForm(f => ({ ...f, colors: f.colors.includes(k) ? f.colors.filter(x => x !== k) : [...f.colors, k] }));

  if (!authed){
    return html`<div className="wrap sec"><div className="auth-g" style=${{ maxWidth:'520px', marginInline:'auto' }}>
      <div className="auth-form">
        <h1 style=${{ fontSize:'1.5rem', margin:'0 0 6px', display:'flex', alignItems:'center', gap:'10px' }}><${Icon} n="lock"/> لوحة الأدمن</h1>
        <p style=${{ color:'var(--muted)', fontSize:'13.5px', marginTop:'0' }}>ديمو: الـ PIN هو <b>2026</b></p>
        <div className="fld">
          <label htmlFor="admPin">PIN</label>
          <input id="admPin" type="password" inputMode="numeric" value=${pin}
            onInput=${e => setPin(e.target.value.replace(/\D/g, ''))}
            onKeyDown=${e => { if(e.key === 'Enter'){ e.preventDefault();
              pin === ADMIN_PIN ? (sessionStorage.setItem('ruh_admin','1'), setAuthed(true)) : setPinErr('الـ PIN مش مظبوط'); } }}/>
          ${pinErr && html`<p className="fmsg err">${pinErr}</p>`}
        </div>
        <button className="btn btn--clay btn--block" style=${{ marginTop:'14px' }}
          onClick=${() => { pin === ADMIN_PIN ? (sessionStorage.setItem('ruh_admin','1'), setAuthed(true)) : setPinErr('الـ PIN مش مظبوط'); }}>
          دخول</button>
        <a className="lnkbtn" href="#/" style=${{ marginTop:'12px' }}>← رجوع للمتجر</a>
      </div>
    </div></div>`;
  }

  const st = AdminStore.stats(PRODUCTS, api.orders, api.wish, api.cmp);
  const adminCount = PRODUCTS.filter(p => p.admin).length;

  const startEdit = p => {
    setEditId(p.id); setDelId(null);
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
    document.getElementById('admForm')?.scrollIntoView({ behavior:'smooth' });
  };

  const validate = () => {
    const bad = [];
    if (form.name.trim().length < 2) bad.push('الاسم');
    if (!(parseInt(form.price, 10) > 0)) bad.push('السعر');
    if (!form.img1.trim()) bad.push('الصورة الأولى');
    if (!form.colors.length) bad.push('لون واحد على الأقل');
    if (!Object.values(form.sizes).some(v => parseInt(v, 10) > 0)) bad.push('مخزون مقاس واحد على الأقل');
    return bad;
  };

  const save = () => {
    const bad = validate();
    if (bad.length){ ruhToast('ناقص: ' + bad.join('، '), 'err'); return; }
    const prod = AdminStore.productFromForm(form, C, editId ?? undefined);
    if (editId == null) prod.id = AdminStore.nextProductId(PRODUCTS);
    const i = PRODUCTS.findIndex(p => p.id === prod.id);
    if (i > -1) PRODUCTS[i] = prod; else PRODUCTS.push(prod);
    AdminStore.saveAdminProducts(PRODUCTS.filter(p => p.admin));
    api.bumpProducts();
    track('admin_save_product', { id: prod.id, name: prod.name });
    setSavedMsg(true); setForm(blankAdminForm()); setEditId(null);
    ruhToast('اتحفظ — هيظهر في المتجر فورًا', 'ok');
    setTimeout(() => setSavedMsg(false), 4000);
  };

  const del = id => {
    const i = PRODUCTS.findIndex(p => p.id === id);
    if (i > -1) PRODUCTS.splice(i, 1);
    AdminStore.saveAdminProducts(PRODUCTS.filter(p => p.admin));
    setDelId(null); api.bumpProducts(); ruhToast('اتمسح من المتجر', 'info');
  };

  /* فانكشن عادية (مش component) عشان الإدخال ميفقدش الفوكس */
  const fld = (k, lb, ph = '', type = 'text', rows = null) => html`
    <div className="fld"><label htmlFor=${'af_' + k}>${lb}</label>
      ${rows ? html`<textarea id=${'af_' + k} rows=${rows} value=${form[k]} onInput=${e => set(k, e.target.value)}/>`
             : html`<input id=${'af_' + k} type=${type} placeholder=${ph} value=${form[k]} onInput=${e => set(k, e.target.value)}/>`}
    </div>`;

  return html`<div className="wrap sec">
    <div className="sec-head">
      <div><span className="kicker"><${Icon} n="sliders" size=${17}/>Admin</span>
        <h1 className="sec-title">لوحة الأدمن</h1>
        <p className="sec-sub">متابعة المتجر كله من مكان واحد — وأي منتج تضيفه يظهر في المتجر على طول.</p>
      </div>
      <div className="d-flex gap-2">
        <a className="btn btn--ghost btn--sm" href="#/collection/all">افتح المتجر</a>
        <button className="btn btn--ghost btn--sm" onClick=${() => { sessionStorage.removeItem('ruh_admin'); setAuthed(false); }}>خروج</button>
      </div>
    </div>

    <!-- إحصائيات -->
    <div className="astats">
      ${[
        { n: st.products, lb: 'منتج في الكاتالوج', ic: 'pack' },
        { n: st.stock, lb: 'إجمالي القطع في المخزون', ic: 'bag' },
        { n: st.orders, lb: 'طلبات على الجهاز ده', ic: 'truck' },
        { n: api.fmt(st.revenue), lb: 'إجمالي المبيعات (ديمو)', ic: 'cash' },
        { n: st.wishCount, lb: 'في المفضلة', ic: 'heart' },
        { n: adminCount, lb: 'منتجات ضفتها من هنا', ic: 'sparkle' },
      ].map((x, i) => html`<div key=${i} className="acard statc">
        <${Icon} n=${x.ic} size=${22}/><b>${x.n}</b><span>${x.lb}</span></div>`)}
    </div>

    ${st.lowStock.length > 0 && html`
      <div className="acard" style=${{ borderColor:'color-mix(in srgb,var(--danger) 35%,var(--line))', marginBottom:'18px' }}>
        <h2 style=${{ display:'flex', alignItems:'center', gap:'8px', color:'var(--danger)' }}><${Icon} n="alert" size=${20}/> مخزون قليل — جدد قبل ما يخلص</h2>
        <div className="d-flex gap-2 flex-wrap">
          ${st.lowStock.map(p => html`<a key=${p.id} className="chip" href=${'#/product/' + p.id}>${pname(p, api.lang)} · ${totalStock(p)}</a>`)}
        </div>
      </div>`}

    <div className="agrid">
      <!-- فورم المنتج -->
      <div className="acard" id="admForm">
        <h2>${editId ? 'تعديل منتج #' + editId : 'ضيف منتج جديد'}</h2>
        <div className="frm">
          ${fld('name', 'الاسم بالعربي', 'قميص كتان – عاجي')}
          ${fld('en', 'English name', 'Linen Shirt – Ivory')}
          <div className="fld"><label htmlFor="af_cat">القسم</label>
            <select id="af_cat" value=${form.cat} onChange=${e => set('cat', e.target.value)}>
              ${Object.keys(CFG.cats).map(c => html`<option key=${c} value=${c}>${api.lang === 'ar' ? CFG.cats[c].ar : CFG.cats[c].en}</option>`)}
            </select></div>
          ${fld('sub', 'التصنيف الفرعي', 'قمصان')}
          ${fld('price', 'السعر (ج.م)', '1490', 'number')}
          ${fld('old', 'سعر قبل الخصم (اختياري)', '', 'number')}
          ${fld('fabric', 'الخامة', 'كتان 100%')}
          ${fld('fabricEn', 'Fabric (EN)', '100% linen')}
          ${fld('img1', 'رابط الصورة الأساسية *', 'https://…')}
          ${fld('img2', 'صورة الهوفر (اختياري)', 'https://…')}
          <div className="fld"><label htmlFor="af_badge">البادج</label>
            <select id="af_badge" value=${form.badge} onChange=${e => set('badge', e.target.value)}>
              <option value="">بدون</option><option value="new">جديد — New</option><option value="sale">عرض/خصم</option>
            </select></div>
          <div className="fld"><label htmlFor="af_fit">ملاحظة المقاس</label>
            <select id="af_fit" value=${form.fit} onChange=${e => set('fit', e.target.value)}>
              <option value="">عادي</option><option value="small">صغير — خد أكبر</option><option value="large">واسع — خد أصغر</option>
            </select></div>
        </div>

        <div className="fld" style=${{ marginTop:'14px' }}><label>الألوان (اختار من سواتش الستايل)</label>
          <div className="d-flex gap-2 flex-wrap">
            ${Object.entries(C).map(([k, s]) => html`<button key=${k} type="button" title=${s.ar}
              className=${'swt' + (form.colors.includes(k) ? ' on' : '')} onClick=${() => toggleColor(k)}><span style=${{ background: s.c }}></span></button>`)}
          </div>
        </div>

        <div className="fld" style=${{ marginTop:'14px' }}><label>المخزون لكل مقاس (صفر = يختفي)</label>
          <div className="d-flex gap-2 flex-wrap">
            ${['S','M','L','XL','XXL','OS'].map(k => html`<label key=${k} className="d-flex align-items-center gap-1" style=${{ fontSize:'13px' }}>
              <b>${k}</b><input type="number" min="0" style=${{ width:'70px', minHeight:'40px' }} value=${form.sizes[k]} onInput=${e => setSize(k, e.target.value)}/>
            </label>`)}
          </div>
        </div>

        <div className="frm" style=${{ marginTop:'14px' }}>
          <div className="full">${fld('desc', 'الوصف (عربي)', '', 'text', 2)}</div>
          <div className="full">${fld('descEn', 'Description (EN)', '', 'text', 2)}</div>
          ${fld('care', 'تعليمات العناية')}
        </div>

        ${form.img1 && html`<div style=${{ marginTop:'14px' }}><${Img} src=${form.img1} alt="preview" w=${120} h=${150}/></div>`}

        <div className="d-flex gap-2" style=${{ marginTop:'18px' }}>
          <button className="btn btn--clay" style=${{ flex:'1' }} onClick=${save}>${editId ? 'احفظ التعديل' : 'ضيف المنتج للمتجر'}</button>
          ${editId && html`<button className="btn btn--ghost" onClick=${() => { setEditId(null); setForm(blankAdminForm()); }}>إلغاء</button>`}
        </div>
        ${savedMsg && html`<p className="fmsg ok" style=${{ color:'var(--success)' }} role="status">اتحفظ — شوفه هنا: <a href="#/collection/all" style=${{ color:'var(--clay-dark)', textDecoration:'underline' }}>الكولكشن</a></p>`}
      </div>

      <!-- جدول المنتجات -->
      <div className="acard" style=${{ overflow:'auto' }}>
        <h2>المنتجات (${PRODUCTS.length})</h2>
        <table className="atable">
          <thead><tr><th></th><th>الاسم</th><th>السعر</th><th>مخزون</th><th>بادج</th><th></th></tr></thead>
          <tbody>
            ${PRODUCTS.map(p => html`<tr key=${p.id}>
              <td><${Img} src=${p.imgs[0]} alt="" w=${44} h=${56}/></td>
              <td><b style=${{ fontSize:'13px' }}>${pname(p, api.lang)}</b><br/><span style=${{ fontSize:'11.5px', color:'var(--muted)' }}>${subOf(p, api.lang)}</span></td>
              <td>${api.fmt(p.price)}${p.old ? html`<br/><span style=${{ fontSize:'11px', color:'var(--muted)', textDecoration:'line-through' }}>${api.fmt(p.old)}</span>` : ''}</td>
              <td><span className=${'bstk' + (totalStock(p) <= 4 ? ' low' : '')}>${totalStock(p)}</span></td>
              <td>${p.badge ? (p.badge === 'new' ? 'New' : 'Sale') : '—'}${p.admin ? html` <span className="bstk adm">أدمن</span>` : ''}</td>
              <td style=${{ whiteSpace:'nowrap' }}>
                ${p.admin || delId === p.id ? '' : html`<span style=${{ fontSize:'11px', color:'var(--muted)' }}>أساسي</span>`}
                ${(p.admin || true) && html`<button className="lnkbtn" style=${{ minHeight:'34px' }} onClick=${() => startEdit(p)}>عدّل</button>`}
                ${p.admin && (delId === p.id
                  ? html`<${React.Fragment}><button className="lnkbtn" style=${{ color:'var(--danger)' }} onClick=${() => del(p.id)}>متأكد؟ امسح</button>
                      <button className="lnkbtn" onClick=${() => setDelId(null)}>لا</button><//>`
                  : html`<button className="lnkbtn" style=${{ color:'var(--danger)' }} onClick=${() => setDelId(p.id)}>امسح</button>`)}
              </td>
            </tr>`)}
          </tbody>
        </table>
        <p style=${{ fontSize:'12px', color:'var(--muted)', margin:'10px 0 0' }}>المنتجات «الأساسية» الـ 24 بتتعدّل وتتشاف فورًا، بس المسح متاح للي ضفته من اللوحة بس (حماية للكتالوج).</p>
      </div>
    </div>

    <!-- الطلبات -->
    <div className="acard" style=${{ marginTop:'18px' }}>
      <h2>الطلبات (${api.orders.length})</h2>
      ${api.orders.length ? html`<table className="atable">
        <thead><tr><th>رقم</th><th>التاريخ</th><th>الإجمالي</th><th>الشحن</th><th>الدفع</th><th>قطع</th></tr></thead>
        <tbody>
          ${api.orders.slice().reverse().map(o => html`<tr key=${o.num}>
            <td><a href=${'#/order/' + o.num} dir="ltr" style=${{ fontWeight:'700' }}>${o.num}</a></td>
            <td>${new Date(o.ts).toLocaleString(api.lang === 'ar' ? 'ar-EG' : 'en-GB', { dateStyle:'short', timeStyle:'short' })}</td>
            <td><b>${api.fmt(o.total)}</b></td>
            <td>${o.shipLb}</td>
            <td>${o.payLb}</td>
            <td>${o.items.length}</td>
          </tr>`)}
        </tbody></table>`
      : html`<p style=${{ color:'var(--muted)', fontSize:'13.5px', margin:'0' }}>لسه مفيش طلبات — اعمل طلب تجريبي من المتجر وهيظهر هنا.</p>`}
    </div>
  </div>`;
}
