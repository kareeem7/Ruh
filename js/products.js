/* js/products.js — مترجم من src/products.ts (npx tsc -p src) */
'use strict';
const AdminStore = (() => {
  const LS_KEY = 'ruh_admin_products';
  function loadAdminProducts() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch { return []; }
  }
  function saveAdminProducts(list) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { }
  }
  function mergeAdminProducts(target) {
    const extra = loadAdminProducts();
    extra.forEach(p => { if (!target.some(x => x.id === p.id)) target.push(p); });
    return extra.length;
  }
  function nextProductId(all) { return all.reduce((m, p) => Math.max(m, p.id), 0) + 1; }
  const slugify = (s) =>
    s.toLowerCase().trim()
      .replace(/[؀-ۿ]+/g, w => w)
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || ('item-' + Date.now());
  function productFromForm(f, swatches, existingId) {
    const price = Math.max(0, parseInt(f.price, 10) || 0);
    const old = f.old ? Math.max(0, parseInt(f.old, 10) || 0) : 0;
    const sizes = {};
    Object.entries(f.sizes).forEach(([k, v]) => {
      const n = Math.max(0, parseInt(v, 10) || 0);
      if (n > 0) sizes[k] = n;
    });
    const colors = f.colors.map(k => swatches[k]).filter(Boolean);
    return {
      id: existingId ?? 0,
      slug: slugify(f.en || f.name),
      name: f.name.trim(),
      en: (f.en || f.name).trim(),
      cat: f.cat,
      sub: f.sub.trim() || 'عام',
      subEn: f.subEn.trim() || 'General',
      price,
      old: old > price ? old : null,
      rating: 5.0, rvws: 1,
      badge: f.badge || 'new',
      fabric: f.fabric.trim() || 'قطن/كتان',
      fabricEn: f.fabricEn.trim() || 'Cotton/Linen',
      imgs: [f.img1.trim(), f.img2.trim()].filter(Boolean),
      colors: colors.length ? colors : [swatches['beige']],
      sizes: Object.keys(sizes).length ? sizes : { OS: 10 },
      fit: f.fit || null,
      sold: 0,
      desc: f.desc.trim() || f.name,
      descEn: f.descEn.trim() || f.en || f.name,
      care: f.care.trim() || 'غسيل ناعم بارد.',
      careEn: f.careEn.trim() || 'Gentle cold wash.',
      admin: true
    };
  }
  function stats(all, orders, wish, cmp) {
    return {
      products: all.length,
      stock: all.reduce((a, p) => a + Object.values(p.sizes).reduce((x, y) => x + y, 0), 0),
      orders: orders.length,
      revenue: orders.reduce((a, o) => a + o.total, 0),
      lowStock: all.filter(p => Object.values(p.sizes).reduce((a, b) => a + b, 0) <= 4),
      wishCount: wish.length, cmpCount: cmp.length
    };
  }
  return { LS_KEY, loadAdminProducts, saveAdminProducts, mergeAdminProducts, nextProductId, productFromForm, slugify, stats };
})();
/* دمج منتجات الأدمن فورًا عشان تبان في المتجر من أول ريندر */
AdminStore.mergeAdminProducts(PRODUCTS);
const ADMIN_PIN = '2026';
