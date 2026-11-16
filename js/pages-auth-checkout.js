/* ============================================================
   js/pages-auth-checkout.js — تسجيل الدخول/الحساب + الدفع 3 خطوات
============================================================ */
'use strict';

/* حقول Auth (top-level عشان الفوكس ما يضيعش مع كل ريندر) */
const passScoreFn = v => Math.min(4, ((v.length >= 8) + (v.length >= 12) + (/\d/.test(v) ? 1 : 0) + (/[^A-Za-z0-9]/.test(v) || /[A-Z]/.test(v) ? 1 : 0)));
function AuthField({ id, label, type = 'text', ac = '', ph = '', err, value, onInput }){
  return html`<div className=${'fld' + (err ? ' inv' : '')}>
    <label htmlFor=${'f_' + id}>${label}</label>
    <input id=${'f_' + id} type=${type} autoComplete=${ac} placeholder=${ph} value=${value || ''} onInput=${onInput}/>
    ${err && html`<p className="fmsg">${err}</p>`}
  </div>`;
}
function PwField({ id, label, err, value, onInput, isNew = true }){
  const [seen, setSeen] = useState(false);
  const sc = passScoreFn(value || '');
  return html`<div className=${'fld' + (err ? ' inv' : '')}>
    <label htmlFor=${'f_' + id}>${label}</label>
    <div className="passwrap">
      <input id=${'f_' + id} type=${seen ? 'text' : 'password'} autoComplete=${isNew ? 'new-password' : 'current-password'}
        value=${value || ''} onInput=${onInput}/>
      <button type="button" className="passpeek" onClick=${() => setSeen(!seen)} aria-label=${seen ? t('hideP') : t('showP')}><${Icon} n="eye" size=${17}/></button>
    </div>
    ${isNew && html`<span className="pstr"><i style=${{ width:(sc*25)+'%', background: sc <= 1 ? 'var(--danger)' : sc === 2 ? 'var(--amber)' : 'var(--success)' }}></i></span>
    ${(value || '') && html`<p className="pstr-lb" style=${{ color: sc <= 1 ? 'var(--danger)' : sc === 2 ? 'var(--clay)' : 'var(--success)' }}>${sc <= 1 ? t('passWeak') : sc === 2 ? t('passMid') : t('passStrong')}</p>`}`}
    ${err && html`<p className="fmsg">${err}</p>`}
  </div>`;
}

/* ================= Auth ================= */
function AuthPage({ api }){
  const m = api.route.q.m || 'login';
  const [mode, setMode] = useState(m);
  useEffect(() => setMode(m), [m]);
  const [form, setForm] = useState({});
  const [errs, setErrs] = useState({});
  const [resetCode, setResetCode] = useState(null);
  const [busy, setBusy] = useState(false);
  const inp = k => ({ value: form[k] || '', onInput: e => setForm(f => ({ ...f, [k]: e.target.value })) });

  const submit = async () => {
    setBusy(true);
    const e = {};
    if (mode === 'login'){
      const em = (form.em || '').trim().toLowerCase(), pw = form.pw || '';
      if (!validEm(em)) e.em = t('invEm');
      const u = users().find(x => x.email === em);
      if (!e.em && !u) e.em = t('eNo');
      if (!e.em && u){
        const h = await hashPass(pw, u.salt);
        if (h !== u.hash) e.pw = t('ePass');
      }
      setErrs(e);
      if (!Object.keys(e).length){ sessSet(u.email); api.syncUser(); track('login', { method:'password' }); ruhToast(`${t('loginOk')}, ${u.name}!`, 'ok'); go('#/account'); return setBusy(false); }
    }
    else if (mode === 'signup'){
      const nm = (form.nm || '').trim(), ph = (form.ph || '').replace(/\D/g, ''), em = (form.em || '').trim().toLowerCase(), pw = form.pw || '', pw2 = form.pw2 || '';
      if (nm.length < 2) e.nm = t('invNm');
      if (!validPh(ph)) e.ph = t('invPh');
      if (!validEm(em)) e.em = t('invEm'); else if (users().some(x => x.email === em)) e.em = t('eDup');
      if (pw.length < 8) e.pw = t('ePassLen');
      if (pw !== pw2) e.pw2 = t('ePass2');
      if (!form.tm) e.tm = t('eTerm');
      setErrs(e);
      if (!Object.keys(e).length){
        const salt = mkSalt(); const hash_ = await hashPass(pw, salt);
        const us = users(); us.push({ name: nm, email: em, phone: ph, salt, hash: hash_, ts: Date.now() }); saveUsers(us);
        sessSet(em); api.syncUser(); track('sign_up', { method:'password' }); ruhToast(`${t('signupOk')}, ${nm}!`, 'ok'); go('#/account'); return setBusy(false);
      }
    }
    else if (mode === 'forgot'){
      const em = (form.em || '').trim().toLowerCase();
      if (!validEm(em)) e.em = t('invEm');
      if (!e.em && !users().some(x => x.email === em)) e.em = t('eNo');
      setErrs(e);
      if (!Object.keys(e).length){
        const code = String(Math.floor(1000 + Math.random() * 9000));
        sessionStorage.setItem('ruh_reset', JSON.stringify({ em, code, until: Date.now() + 600000 }));
        setResetCode(code); setMode('reset'); ruhToast(t('codeSent'), 'ok'); return setBusy(false);
      }
    }
    else { /* reset */
      const cd = (form.cd || '').trim(), pw = form.pw || '';
      const saved = JSON.parse(sessionStorage.getItem('ruh_reset') || 'null');
      if (!saved || cd !== saved.code || Date.now() > saved.until) e.cd = t('eCode');
      if (pw.length < 8) e.pw = t('ePassLen');
      setErrs(e);
      if (!Object.keys(e).length){
        const us = users(); const i = us.findIndex(x => x.email === saved.em);
        us[i].hash = await hashPass(pw, us[i].salt); saveUsers(us);
        sessionStorage.removeItem('ruh_reset'); setResetCode(null);
        ruhToast(t('resetOk'), 'ok'); setMode('login'); return setBusy(false);
      }
    }
    setBusy(false);
  };

  return html`<div className="wrap sec">
    <div className="auth-g">
      <div className="auth-side">
        <${Img} src=${IMG.wOversize} alt=${api.lang === 'ar' ? 'موديل بقطع روح' : 'RŪH look'} w=${800} h=${1000} eager=${true}/>
        <div>
          <span className="kicker" style=${{ color:'#FFC24B' }}>RŪH ${api.lang === 'ar' ? 'ميمبرز' : 'members'}</span>
          <h2>${t('authH')}</h2>
          <div className="auth-bens">
            ${[t('authB1'), t('authB2'), t('authB3'), t('authB4')].map((b, i) => html`<span key=${i}><${Icon} n="check" size=${17}/>${b}</span>`)}
          </div>
        </div>
      </div>
      <div className="auth-form">
        <div className="auth-tabs" role="tablist">
          ${[['login', t('authLogin')], ['signup', t('authSignup')]].map(([k, lb]) => html`
            <a key=${k} href=${'#/auth?m=' + k} className=${mode !== 'signup' && k === 'login' ? 'on' : mode === 'signup' && k === 'signup' ? 'on' : ''} onClick=${e => { e.preventDefault(); setMode(k); setErrs({}); go('#/auth?m=' + k); }}>${lb}</a>`)}
        </div>

        ${mode === 'login' && html`<${React.Fragment}>
          <p style=${{ color:'var(--muted)', fontSize:'14px', marginTop:'0' }}>${t('authEP')}</p>
          <div className="frm" style=${{ gridTemplateColumns:'1fr' }}>
            <${AuthField} id="em" label=${t('acctEm')} type="email" ac="email" ph="you@mail.com" err=${errs.em} value=${form.em} onInput=${e => setForm(f => ({ ...f, em: e.target.value }))}/>
            <${PwField} id="pw" label=${t('pass')} isNew=${false} err=${errs.pw} value=${form.pw} onInput=${e => setForm(f => ({ ...f, pw: e.target.value }))}/>
          </div>
          <div style=${{ textAlign:'end', marginTop:'10px' }}>
            <a className="lnkbtn" href="#/auth?m=forgot" onClick=${e => { e.preventDefault(); setMode('forgot'); go('#/auth?m=forgot'); }} style=${{ fontSize:'13.5px' }}>${t('forH')}</a>
          </div>
          <button className="btn btn--clay btn--block" style=${{ marginTop:'16px' }} disabled=${busy} onClick=${submit}>${t('loginBtn')}</button>
        <//>`}

        ${mode === 'signup' && html`<${React.Fragment}>
          <p style=${{ color:'var(--muted)', fontSize:'14px', marginTop:'0' }}>${t('authSP')}</p>
          <div className="frm">
            <${AuthField} id="nm" label=${t('acctNm')} ac="name" err=${errs.nm} value=${form.nm} onInput=${e => setForm(f => ({ ...f, nm: e.target.value }))}/>
            <${AuthField} id="ph" label=${t('ph')} type="tel" ac="tel" ph="01xxxxxxxxx" err=${errs.ph} value=${form.ph} onInput=${e => setForm(f => ({ ...f, ph: e.target.value }))}/>
            <div className="full"><${AuthField} id="em" label=${t('acctEm')} type="email" ac="email" ph="you@mail.com" err=${errs.em} value=${form.em} onInput=${e => setForm(f => ({ ...f, em: e.target.value }))}/></div>
            <${PwField} id="pw" label=${t('pass')} err=${errs.pw} value=${form.pw} onInput=${e => setForm(f => ({ ...f, pw: e.target.value }))}/>
            <${PwField} id="pw2" label=${t('pass2')} err=${errs.pw2} value=${form.pw2} onInput=${e => setForm(f => ({ ...f, pw2: e.target.value }))}/>
          </div>
          <label className=${'chkf' + (errs.tm ? ' inv' : '')} style=${{ marginTop:'14px' }}>
            <input type="checkbox" checked=${!!form.tm} onChange=${e => setForm(f => ({ ...f, tm: e.target.checked }))}/>
            ${t('termsAcc')} <a href="#/page/terms" style=${{ color:'var(--clay-dark)', textDecoration:'underline' }}>${t('termsL')}</a>
          </label>
          ${errs.tm && html`<p className="fmsg err">${errs.tm}</p>`}
          <button className="btn btn--clay btn--block" style=${{ marginTop:'16px' }} disabled=${busy} onClick=${submit}>${t('signupBtn')}</button>
        <//>`}

        ${mode === 'forgot' && html`<${React.Fragment}>
          <p style=${{ color:'var(--muted)', fontSize:'14px', marginTop:'0' }}>${t('forP')}</p>
          <div className="frm" style=${{ gridTemplateColumns:'1fr' }}>
            <${AuthField} id="em" label=${t('acctEm')} type="email" ac="email" ph="you@mail.com" err=${errs.em} value=${form.em} onInput=${e => setForm(f => ({ ...f, em: e.target.value }))}/>
          </div>
          <button className="btn btn--clay btn--block" style=${{ marginTop:'18px' }} disabled=${busy} onClick=${submit}>${t('sendCode')}</button>
        <//>`}

        ${mode === 'reset' && html`<${React.Fragment}>
          <div className="codewrap" role="status">${t('demoCode')}<b>${resetCode}</b></div>
          <div className="frm" style=${{ gridTemplateColumns:'1fr', marginTop:'16px' }}>
            <${AuthField} id="cd" label=${t('codePh')} type="tel" ph="••••" err=${errs.cd} value=${form.cd} onInput=${e => setForm(f => ({ ...f, cd: e.target.value }))}/>
            <${PwField} id="pw" label=${t('newPass')} err=${errs.pw} value=${form.pw} onInput=${e => setForm(f => ({ ...f, pw: e.target.value }))}/>
          </div>
          <button className="btn btn--clay btn--block" style=${{ marginTop:'14px' }} disabled=${busy} onClick=${submit}>${t('resetBtn')}</button>
        <//>`}
      </div>
    </div>
  </div>`;
}

/* ================= Checkout ================= */
function CheckoutPage({ api }){
  const [step, setStep] = useState(1);
  const [ship, setShip] = useState('cairo');
  const [pay, setPay] = useState(null);
  const [form, setForm] = useState(() => ({
    nm: (api.addr && api.addr.nm) || (api.user && api.user.name) || '',
    ph: (api.addr && api.addr.ph) || (api.user && api.user.phone) || '',
    em: (api.addr && api.addr.em) || (api.user && api.user.email) || '',
    city: (api.addr && api.addr.city) || (api.lang === 'ar' ? 'القاهرة' : 'Cairo'),
    addr: (api.addr && api.addr.addr) || '',
    notes: (api.addr && api.addr.notes) || '',
    save: !!api.addr
  }));
  const [errs, setErrs] = useState({});
  const inp = k => ({ value: form[k] || '', onInput: e => setForm(f => ({ ...f, [k]: e.target.value })) });

  const T = api.getTotals();
  const shipC = ship === 'cairo' ? (T.afterDisc >= CFG.freeShip ? 0 : CFG.shipCairo)
    : ship === 'gov' ? (T.afterDisc >= CFG.freeShip ? 0 : CFG.shipGov) : 0;
  const total = T.afterDisc + shipC;
  useEffect(() => { if (step === 2) track('begin_checkout', { value: T.afterDisc }); }, [step]);

  if (!api.cart.length) return html`<div className="wrap sec"><${EmptyState} icon="bag" title=${t('cartEmptyH')} sub=${t('cartEmptyP')} cta=${t('cartEmptyC')} onGo=${() => go('#/collection/all')}/></div>`;

  const next = () => {
    const e = {};
    if (step === 1){
      if (!form.nm || form.nm.trim().length < 2) e.nm = t('invNm');
      if (!validPh(form.ph || '')) e.ph = t('invPh');
      if (form.em && !validEm(form.em)) e.em = t('invEm');
      if (!form.addr || form.addr.trim().length < 8) e.addr = t('invAddr');
      setErrs(e);
      if (Object.keys(e).length) return;
      if (form.save) api.setAddr({ nm: form.nm.trim(), ph: form.ph.replace(/\D/g, ''), em: form.em.trim(), city: form.city, addr: form.addr.trim(), notes: form.notes.trim() });
      setStep(2); window.scrollTo({ top: 0, behavior:'smooth' });
      return;
    }
    if (step === 2){ setStep(3); window.scrollTo({ top: 0, behavior:'smooth' }); return; }
    if (step === 3){
      if (!pay){ ruhToast(t('ckP'), 'err'); return; }
      const num = 'RUH-' + Math.floor(100000 + Math.random() * 900000);
      const shipLb = ship === 'cairo' ? t('shp1') : ship === 'gov' ? t('shp2') : t('shp3');
      const payLb = ({ cod:t('pay1'), card:t('pay2'), fawry:t('pay3'), valu:t('pay4'), insta:t('pay5'), apple:t('pay6') })[pay];
      const o = { num, ts: Date.now(), total, shipLb, payLb, items: [...api.cart], addr: form };
      api.addOrder(o);
      ruhToast(t('ordH'), 'ok');
      go('#/order/' + num);
    }
  };
  const stepKeys = ['st1','st2','st3'];

  return html`<div className="wrap sec">
    <div className="sec-head">
      <h1 className="sec-title">${t('ckoT')}</h1>
      <span className="chip" style=${{ background:'var(--soft)' }}><${Icon} n="user" size=${17}/>${t('guestNote')}</span>
    </div>
    <div className="steps">
      ${stepKeys.map((k, i) => html`<div key=${k} className=${'step' + (i + 1 < step ? ' done' : '') + (i + 1 === step ? ' cur' : '')}><span>${t(k)}</span></div>`)}
    </div>
    <div className="cko">
      <div id="ckBody">
        ${step === 1 && html`<${React.Fragment}>
          <h2 style=${{ fontSize:'18px', margin:'0 0 18px' }}>${t('st1')}</h2>
          <div className="frm">
            <div className=${'fld full' + (errs.nm ? ' inv' : '')}><label htmlFor="ckNm">${t('nm')} <em>*</em></label>
              <input id="ckNm" autoComplete="name" ...${inp('nm')}/>${errs.nm && html`<p className="fmsg">${errs.nm}</p>`}</div>
            <div className=${'fld' + (errs.ph ? ' inv' : '')}><label htmlFor="ckPh">${t('ph')} <em>*</em></label>
              <input id="ckPh" type="tel" inputMode="tel" autoComplete="tel" placeholder="01xxxxxxxxx" ...${inp('ph')}/>${errs.ph && html`<p className="fmsg">${errs.ph}</p>`}</div>
            <div className=${'fld' + (errs.em ? ' inv' : '')}><label htmlFor="ckEm">${t('em')}</label>
              <input id="ckEm" type="email" inputMode="email" autoComplete="email" ...${inp('em')}/>${errs.em && html`<p className="fmsg">${errs.em}</p>`}</div>
            <div className="fld"><label htmlFor="ckCity">${t('city')} <em>*</em></label>
              <select id="ckCity" autoComplete="address-level1" value=${form.city} onChange=${e => setForm(f => ({ ...f, city: e.target.value }))}>
                ${['القاهرة','الجيزة','الإسكندرية','الدقهلية','الشرقية','الغربية','أسيوط','أسوان','بورسعيد','السويس','البحر الأحمر','أخرى'].map(c => html`<option key=${c} value=${c}>${c}</option>`)}
              </select></div>
            <div className=${'fld' + (errs.addr ? ' inv' : '')}><label htmlFor="ckAddr">${t('addr')} <em>*</em></label>
              <input id="ckAddr" autoComplete="street-address" ...${inp('addr')} placeholder=${api.lang === 'ar' ? 'شارع، رقم عمارة، علامة' : 'Street, building, landmark'}/>${errs.addr && html`<p className="fmsg">${errs.addr}</p>`}</div>
            <div className="fld full"><label htmlFor="ckNotes">${t('notes')}</label>
              <input id="ckNotes" ...${inp('notes')}/></div>
            <label className="chkf full">
              <input type="checkbox" checked=${form.save} onChange=${e => setForm(f => ({ ...f, save: e.target.checked }))}/>
              ${t('saveAddr')}
            </label>
          </div>
          <button className="btn btn--clay btn--block" style=${{ marginTop:'20px' }} onClick=${next}>${t('next')} — ${t('st2')}</button>
        <//>`}

        ${step === 2 && html`<${React.Fragment}>
          <h2 style=${{ fontSize:'18px', margin:'0 0 18px' }}>${t('shipM')}</h2>
          <div className="radios">
            ${[
              { v:'cairo', tt: t('shp1'), s: t('shp1s'), c: T.afterDisc >= CFG.freeShip ? 0 : CFG.shipCairo },
              { v:'gov',   tt: t('shp2'), s: t('shp2s'), c: T.afterDisc >= CFG.freeShip ? 0 : CFG.shipGov },
              { v:'pickup',tt: t('shp3'), s: t('shp3s'), c: 0 }
            ].map(x => html`<label key=${x.v} className="rad">
              <input type="radio" name="ckShip" checked=${ship === x.v} onChange=${() => setShip(x.v)}/>
              <span style=${{ flex:'1' }}><b>${x.tt}</b><span style=${{ fontSize:'12.5px', color:'var(--muted)' }}>${x.s}</span></span>
              <span className="prc">${x.c === 0 ? t('freeTxt') : api.fmt(x.c)}</span>
            </label>`)}
          </div>
          ${T.afterDisc >= CFG.freeShip && html`<p className="fmsg ok" style=${{ color:'var(--success)' }}>${t('freeOver')}</p>`}
          <div className="d-flex gap-2" style=${{ marginTop:'20px' }}>
            <button className="btn btn--ghost" onClick=${() => setStep(1)}>${t('back')}</button>
            <button className="btn btn--clay" style=${{ flex:'1' }} onClick=${next}>${t('next')} — ${t('st3')}</button>
          </div>
        <//>`}

        ${step === 3 && html`<${React.Fragment}>
          <h2 style=${{ fontSize:'18px', margin:'0 0 18px' }}>${t('payM')}</h2>
          <div className="radios">
            ${[
              { v:'cod',   ic:'cash',  tt: t('pay1'), s: t('pay1s') },
              { v:'card',  ic:'card',  tt: t('pay2'), s: t('pay2s') },
              { v:'fawry', ic:'tag',   tt: t('pay3'), s: t('pay3s') },
              { v:'valu',  ic:'clock', tt: t('pay4'), s: t('pay4s') },
              { v:'insta', ic:'send',  tt: t('pay5'), s: t('pay5s') },
              { v:'apple', ic:'lock',  tt: t('pay6'), s: t('pay6s') }
            ].map(x => html`<label key=${x.v} className="rad">
              <input type="radio" name="ckPay" checked=${pay === x.v} onChange=${() => { setPay(x.v); track('add_payment_info', { method: x.v }); }}/>
              <span style=${{ flex:'1' }}><b>${x.tt}</b><span style=${{ fontSize:'12.5px', color:'var(--muted)' }}>${x.s}</span></span>
              <${Icon} n=${x.ic} size=${17}/>
            </label>`)}
          </div>
          ${pay === 'card' && html`<div style=${{ marginTop:'14px' }}><div className="frm">
            <div className="fld full"><label>${t('cardNo')}</label><input inputMode="numeric" placeholder="0000 0000 0000 0000" maxLength="19"/></div>
            <div className="fld"><label>${t('cardEx')}</label><input placeholder="MM/YY" maxLength="5"/></div>
            <div className="fld"><label>${t('cardCv')}</label><input inputMode="numeric" maxLength="4"/></div>
          </div></div>`}
          ${pay === 'valu' && html`<div style=${{ marginTop:'14px' }}><div className="fld"><label>${t('valuT')}</label>
            <select>${[6,12,18,24,36].map(m => html`<option key=${m} value=${m}>${m} ${t('mo')}</option>`)}</select></div></div>`}
          <div className="d-flex gap-2" style=${{ marginTop:'22px' }}>
            <button className="btn btn--ghost" onClick=${() => setStep(2)}>${t('back')}</button>
            <button className="btn btn--clay" style=${{ flex:'1' }} disabled=${!pay} onClick=${next}>${t('placeOrder')} — ${api.fmt(total)}</button>
          </div>
          <p className="shpnote" style=${{ justifyContent:'center' }}><${Icon} n="shield" size=${17}/>${api.lang === 'ar' ? 'بياناتك مش بتتخزن عندنا — الدفع على بوابات معتمدة' : 'Payments run on certified gateways; we never store card data.'}</p>
        <//>`}
      </div>
      <aside className="csum">
        <h3>${t('ckoSum')}</h3>
        ${api.cart.map((it, i) => { const p = byId(it.id); if (!p) return null; return html`<div key=${i} className="csum__it">
          <${Img} src=${p.imgs[0]} alt=${pname(p, api.lang)} w=${104} h=${132}/>
          <span><b>${pname(p, api.lang)}</b><span>${it.size} · ${it.color} · ×${it.qty}</span></span>
          <span className="pp">${api.fmt(p.price * it.qty)}</span>
        </div>`; })}
        <div style=${{ paddingTop:'12px' }}>
          <div className="tot"><span>${t('subtotal')}</span><span>${api.fmt(T.sub)}</span></div>
          ${T.bundleD > 0 && html`<div className="tot"><span>${t('bundleDisc')}</span><span className="neg">−${api.fmt(T.bundleD)}</span></span>`}
          ${T.cpnD > 0 && html`<div className="tot"><span>${t('couponDisc')} (${api.coupon})</span><span className="neg">−${api.fmt(T.cpnD)}</span></div>`}
          <div className="tot"><span>${t('ship')}</span><span>${shipC === 0 ? t('freeTxt') : api.fmt(shipC)}</span></div>
          <div className="tot tot--grand"><span>${t('total')}</span><span>${api.fmt(total)}</span></div>
        </div>
      </aside>
    </div>
  </div>`;
}
