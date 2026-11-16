/* ============================================================
   js/app.js — الجذر: state + router + تجميع كل الحاجات
============================================================ */
'use strict';

function App(){
  /* ---------- الحالة ---------- */
  const [prefs, setPrefs] = useLS('ruh_prefs', { theme:null, lang:'en', cur:'EGP', ann:false, news:false, ck:false });
  const [cart, setCart] = useLS('ruh_cart_v2', []);
  const [wish, setWish] = useLS('ruh_wish', []);
  const [cmp, setCmp] = useLS('ruh_cmp', []);
  const [recent, setRecent] = useLS('ruh_recent', []);
  const [coupon, setCoupon] = useLS('ruh_coupon', null);
  const [addr, setAddr] = useLS('ruh_addr', null);
  const [orders, setOrders] = useLS('ruh_orders', []);
  const [user, setUser] = useState(() => curUser());
  const [session, setSession] = useState(() => curUser());
  const [route, setRoute] = useState(() => parseHash());
  const [ui, setUi] = useState({ cart:false, nav:false, search:false, cookie:false, proof:null });
  const [modal, setModal] = useState(null);   // sizeguide | suggest | track
  const [qv, setQv] = useState(null);         // منتج للكويك فيو
  const [lb, setLb] = useState(null);         // { imgs:[], i }
  const [prodTick, setProdTick] = useState(0); // بيجبر ريندر لما الأدمن يضيف/يعدّل منتج
  const [scrolled40, setScrolled40] = useState(false);

  const lang = prefs.lang || 'en';
  __LANG = lang;
  const theme = prefs.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  const fmt = n => fmtCur(n, prefs.cur);

  /* ---------- Router ---------- */
  useEffect(() => {
    const onHash = () => { setRoute(parseHash()); window.scrollTo({ top: 0 }); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { track('page_view', { page: route.name }); }, [route.name]);

  /* ---------- Direction + theme + meta ---------- */
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = lang === 'ar'
      ? 'RŪH روح — لبس بيشبهك |كتان وقطن مصنوع في القاهرة'
      : 'RŪH — Clothes that feel like you | Made in Cairo';
  }, [lang]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', theme === 'dark' ? '#170B05' : '#FFF8EC');
  }, [theme]);

  /* ---------- بوب اَبز (15ثانية + 40% اسكرول) ---------- */
  useEffect(() => {
    const onScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - innerHeight || 1);
      if (pct > .4) setScrolled40(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const t1 = setTimeout(() => {
      if (!sessionStorage.getItem('ruh_proof')) {
        sessionStorage.setItem('ruh_proof', '1');
        const p = PROOFS[Math.floor(Math.random() * PROOFS.length)];
        setUi(u => ({ ...u, proof: p }));
        setTimeout(() => setUi(u => ({ ...u, proof: null })), 9000);
      }
      if (!prefs.ck) setUi(u => ({ ...u, cookie: true }));
    }, 15000);
    const t2 = setInterval(() => {
      if (scrolled40 && !prefs.ck) setUi(u => ({ ...u, cookie: true }));
    }, 2500);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t1); clearInterval(t2); };
  }, [scrolled40, prefs.ck]);

  /* ---------- Esc على كل الطبقات ---------- */
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Escape') return;
      if (lb) { setLb(null); return; }
      if (modal) { setModal(null); return; }
      if (qv) { setQv(null); return; }
      if (ui.search) { setUi(u => ({ ...u, search:false })); return; }
      if (ui.nav) { setUi(u => ({ ...u, nav:false })); return; }
      if (ui.cart) { setUi(u => ({ ...u, cart:false })); return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lb, modal, qv, ui]);

  /* ---------- API للكومبوننتس ---------- */
  const api = {
    route, prefs, lang, theme, cart, wish, cmp, recent, orders, addr, user,
    fmt, coupon, modal, ui, qv, lb,
    toggleTheme: () => setPrefs(p => ({ ...p, theme: theme === 'dark' ? 'light' : 'dark' })),
    setLang: l => setPrefs(p => ({ ...p, lang: l })),
    setPref: (k, v) => setPrefs(p => ({ ...p, [k]: v })),
    setAddr: d => setAddr(d),
    syncUser: () => setUser(curUser()),
    pushRecent: id => setRecent(r => [id, ...r.filter(x => x !== id)].slice(0, 12)),
    setCoupon: v => setCoupon(v),
    setSession: () => setSession(curUser()),
    openCart: () => setUi(u => ({ ...u, cart: true })),
    closeCart: () => setUi(u => ({ ...u, cart: false })),
    openSearch: () => setUi(u => ({ ...u, search: true })),
    closeSearch: () => setUi(u => ({ ...u, search: false })),
    openNav: () => setUi(u => ({ ...u, nav: true })),
    closeNav: () => setUi(u => ({ ...u, nav: false })),
    setModal, setQv, setLb,
    setProof: p => setUi(u => ({ ...u, proof: p })),
    dismissProof: () => setUi(u => ({ ...u, proof: null })),
    dismissCookie: () => { setPrefs(p => ({ ...p, ck: true })); setUi(u => ({ ...u, cookie: false })); },
    addToCart: (id, size, colorN, qty = 1, bundle = false, openAfter = false) => {
      const p = byId(id); if (!p) return false;
      if (size && p.sizes[size] <= 0){ ruhToast(t('outOf'), 'err'); return false; }
      const key = size || 'OS';
      setCart(list => {
        const ex = list.find(i => i.id === p.id && i.size === key && i.color === colorN);
        if (ex) return list.map(i => i === ex ? { ...i, qty: i.qty + qty } : i);
        return [...list, { id: p.id, size: key, color: colorN, qty, bundle }];
      });
      track('add_to_cart', { item: p.name, qty, price: p.price });
      ruhToast(t('addedOk'), 'ok');
      if (openAfter) setTimeout(() => setUi(u => ({ ...u, cart: true })), 350);
      return true;
    },
    setQty: (idx, d) => setCart(list => {
      const it = list[idx]; const p = byId(it.id);
      let q = it.qty + d;
      if (d > 0 && q > (p.sizes[it.size] ?? 1)){ ruhToast(`${t('last')} ${p.sizes[it.size]} ${t('piecesIn')} ${it.size}`, 'err'); return list; }
      if (q <= 0) return list.filter((_, i) => i !== idx);
      return list.map((x, i) => i === idx ? { ...x, qty: q } : x);
    }),
    rmItem: idx => { setCart(list => list.filter((_, i) => i !== idx)); track('remove_from_cart', {}); ruhToast(t('rmItem'), 'info'); },
    toggleWish: p => {
      const on = wish.includes(p.id);
      setWish(w => on ? w.filter(x => x !== p.id) : [...w, p.id]);
      track(on ? 'remove_from_wishlist' : 'add_to_wishlist', { item: p.name });
      ruhToast(on ? t('wishRm') : t('wishAdd'), on ? 'info' : 'ok');
    },
    toggleCmp: p => {
      const on = cmp.includes(p.id);
      if (on){ setCmp(c => c.filter(x => x !== p.id)); ruhToast(t('cmpRm'), 'info'); if (route.name === 'compare') setRoute(r => ({ ...r })); return; }
      if (cmp.length >= 3){ ruhToast(t('cmpFull'), 'err'); return; }
      setCmp(c => [...c, p.id]);
      ruhToast(`${t('cmpAdd')} — <a href="#/compare" style="color:inherit;text-decoration:underline">${t('cmpCta')}</a>`, 'ok');
    },
    addBundle: () => {
      CFG.bundleIds.forEach(id => {
        const p = byId(id); const sz = firstSize(p);
        setCart(list => {
          const ex = list.find(i => i.id === id && i.bundle);
          if (ex) return list;
          return [...list, { id, size: sz, color: cname(p.colors[0], lang), qty: 1, bundle:true }];
        });
      });
      track('add_to_cart', { bundle: true });
      ruhToast(t('bundleOk'), 'ok');
      Ui_openCart();
    },
    addOrder: o => { setOrders(list => [...list, o]); LS.set('ruh_last_order', o); },
    goBack: () => { const lr = LS.get('ruh_last_route', '#/'); go(lr || '#/'); },
    go: path => go(path),
    getTotals: () => cartTotals(cart, coupon),
    bumpProducts: () => setProdTick(v => v + 1)
  };
  void prodTick; // القيمة نفسها مش بنستخدمها — التغيير هو اللي بيرندر
  // helper صغير عشان addBundle (مش هنكرر الكود)
  function Ui_openCart(){ setUi(u => ({ ...u, cart: true })); }

  /* ---------- JSON-LD للصفحة ---------- */
  useEffect(() => {
    const old = document.getElementById('ldDyn'); if (old) old.remove();
    let data = null;
    if (route.name === 'product'){
      const p = byId(route.param);
      if (p) data = [{
        '@context':'https://schema.org','@type':'Product', name:p.name, image:p.imgs, description:descOf(p, lang), material:fabricOf(p, lang),
        brand:{ '@type':'Brand', name:'RŪH' },
        offers:{ '@type':'Offer', priceCurrency:'EGP', price:p.price, availability: totalStock(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
        aggregateRating:{ '@type':'AggregateRating', ratingValue:p.rating, reviewCount:p.rvws }
      }, {
        '@context':'https://schema.org','@type':'BreadcrumbList',
        itemListElement:[
          { '@type':'ListItem', position:1, name: t('homeTxt'), item:'#/' },
          { '@type':'ListItem', position:2, name: lang === 'ar' ? CFG.cats[p.cat].ar : CFG.cats[p.cat].en, item:'#/collection/' + p.cat },
          { '@type':'ListItem', position:3, name: p.name }]
      }];
    } else if (route.name === 'home'){
      data = { '@context':'https://schema.org','@type':'FAQPage',
        mainEntity: FAQS.map(f => ({ '@type':'Question', name: lang === 'ar' ? f.q : f.qe, acceptedAnswer:{ '@type':'Answer', text: lang === 'ar' ? f.a : f.ae } })) };
    }
    if (data){ const s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ldDyn'; s.textContent = JSON.stringify(data); document.head.appendChild(s); }
  }, [route.name, route.param, lang]);

  /* ---------- Router outlet ---------- */
  let page = null;
  if (route.name === 'home') page = html`<${HomePage} api=${api}/>`;
  else if (route.name === 'collection') page = html`<${CollectionPage} key=${(route.param || 'all') + '|' + JSON.stringify(route.q)} api=${api}/>`;
  else if (route.name === 'product') page = html`<${ProductPage} key=${route.param} api=${api}/>`;
  else if (route.name === 'blog') page = html`<${BlogPage} api=${api}/>`;
  else if (route.name === 'post') page = html`<${PostPage} api=${api}/>`;
  else if (route.name === 'wishlist') page = html`<${WishlistPage} api=${api}/>`;
  else if (route.name === 'compare') page = html`<${ComparePage} api=${api}/>`;
  else if (route.name === 'checkout') page = html`<${CheckoutPage} api=${api}/>`;
  else if (route.name === 'order') page = html`<${OrderPage} api=${api}/>`;
  else if (route.name === 'auth') page = html`<${AuthPage} api=${api}/>`;
  else if (route.name === 'account') page = html`<${AccountPage} api=${api}/>`;
  else if (route.name === 'admin') page = html`<${AdminPage} api=${api}/>`;
  else if (route.name === 'page') page = html`<${ContentPage} api=${api}/>`;
  else page = html`<${NotFound} api=${api}/>`;

  const anyDrawerOpen = ui.cart || ui.nav || ui.search;
  useEffect(() => {
    document.body.classList.toggle('lck', anyDrawerOpen);
    return () => document.body.classList.remove('lck');
  }, [anyDrawerOpen]);

  return html`<${React.Fragment}>
    <${Header} api=${api}/>
    <${MobileNav} api=${api}/>
    <${SearchOverlay} api=${api}/>
    <main id="app" tabIndex="-1">${page}</main>
    <${Footer} api=${api}/>
    <${CartDrawer} api=${api}/>
    <${QuickView} p=${qv} api=${api}/>
    <${SizeGuideModal} api=${api}/>
    <${SuggestModal} api=${api}/>
    <${TrackModal} api=${api}/>
    <${Lightbox} lb=${lb} setLb=${setLb} lang=${lang}/>
    <${ProofPop} api=${api}/>
    <${CookieBar} api=${api}/>
    <${FabZone} api=${api} route=${route}/>
    <${BottomBar} api=${api} route=${route}/>
    <${Toasts}/>
    <span className="sr-live" aria-live="polite"></span>
  <//>`;
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App}/>`);
