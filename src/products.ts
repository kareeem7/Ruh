/* src/products.ts — مخزن منتجات الأدمن: حفظ/تحميل/دمج مع الكتالوج الأساسي
   بيتكمبل لـ js/products.js وبيشتغل كـ classic script (globals) */

const AdminStore = (() => {

  const LS_KEY = 'ruh_admin_products';

  /* بيقرأ المنتجات اللي اتضافت من اللوحة */
  function loadAdminProducts(): Product[] {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      return Array.isArray(raw) ? raw as Product[] : [];
    } catch { return []; }
  }

  function saveAdminProducts(list: Product[]): void {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { /* مساحة مليانة مثلًا */ }
  }

  /* بيدمج منتجات الأدمن جوه الكتالوج (بيتحبس مرة واحدة عند الأحمال) */
  function mergeAdminProducts(target: Product[]): number {
    const extra = loadAdminProducts();
    extra.forEach(p => { if (!target.some(x => x.id === p.id)) target.push(p); });
    return extra.length;
  }

  function nextProductId(all: Product[]): number {
    return all.reduce((m, p) => Math.max(m, p.id), 0) + 1;
  }

  const slugify = (s: string): string =>
    s.toLowerCase().trim()
      .replace(/[\u0600-\u06FF]+/g, w => w)          // سيب العربي زي ما هو
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || ('item-' + Date.now());

  /* يحوّل الفورم لمنتج كامل */
  function productFromForm(f: AdminProductForm, swatches: Record<string, Swatch>, existingId?: number): Product {
    const price = Math.max(0, parseInt(f.price, 10) || 0);
    const old = f.old ? Math.max(0, parseInt(f.old, 10) || 0) : 0;
    const sizes: Record<string, number> = {};
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
      rating: 5.0,
      rvws: 1,
      badge: f.badge || 'new',
      fabric: f.fabric.trim() || 'قطن/كتان',
      fabricEn: f.fabricEn.trim() || 'Cotton/Linen',
      imgs: [f.img1.trim(), f.img2.trim()].filter(Boolean),
      colors: colors.length ? colors : [swatches['beige'] as Swatch],
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

  function stats(all: Product[], orders: Order[], wish: number[], cmp: number[]): AdminStats {
    return {
      products: all.length,
      stock: all.reduce((a, p) => a + Object.values(p.sizes).reduce((x, y) => x + y, 0), 0),
      orders: orders.length,
      revenue: orders.reduce((a, o) => a + o.total, 0),
      lowStock: all.filter(p => Object.values(p.sizes).reduce((a, b) => a + b, 0) <= 4),
      wishCount: wish.length,
      cmpCount: cmp.length
    };
  }

  return { LS_KEY, loadAdminProducts, saveAdminProducts, mergeAdminProducts, nextProductId, productFromForm, slugify, stats };
})();

/* ---- bootstrap ----
   المنتجات جاية من js/data.js كـ global، فبنعرّفها هنا للـ compiler بس (declare مابتطلعش كود) */
declare const PRODUCTS: Product[];

/* بيتنفّذ أول ما الملف يتحمّل — قبل أول ريندر — عشان منتجات الأدمن تبقى في الكتالوج فورًا */
AdminStore.mergeAdminProducts(PRODUCTS);

/* ديمو: الـ PIN. لو شلته من هنا، أي rebuild هيمسحه ولوحة الأدمن تقفل */
const ADMIN_PIN = '2026';
