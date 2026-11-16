/* src/types.ts — الأنواع الأساسية للمتجر (global، بدون modules عشان الشغل classic scripts) */

type CategoryKey = 'women' | 'men' | 'unisex' | 'acc';
type Badge = 'new' | 'sale' | null;
type Fit = 'small' | 'large' | null;

interface Swatch { ar: string; en: string; c: string }

interface Product {
  id: number;
  slug: string;
  name: string;
  en: string;
  cat: CategoryKey;
  sub: string;
  subEn?: string;
  price: number;
  old: number | null;
  rating: number;
  rvws: number;
  badge: Badge;
  fabric: string;
  fabricEn?: string;
  imgs: string[];
  colors: Swatch[];
  sizes: Record<string, number>;
  fit: Fit;
  sold: number;
  desc: string;
  descEn?: string;
  care: string;
  careEn?: string;
  admin?: boolean;            // منتج مضاف من لوحة الأدمن
}

interface CartItem { id: number; size: string; color: string; qty: number; bundle?: boolean }

interface Order {
  num: string; ts: number; total: number;
  shipLb: string; payLb: string;
  items: CartItem[];
  addr: Record<string, string>;
}

interface StoreUser {
  name: string; email: string; phone: string;
  salt: string; hash: string; ts: number;
}

interface Prefs {
  theme: 'dark' | 'light' | null;
  lang: 'ar' | 'en';
  cur: string;
  ann: boolean; news: boolean; ck: boolean;
}

/* فورم الأدمن — كل القيم strings قبل الـ parse */
interface AdminProductForm {
  name: string; en: string;
  cat: CategoryKey; sub: string; subEn: string;
  price: string; old: string;
  fabric: string; fabricEn: string;
  img1: string; img2: string;
  badge: '' | 'new' | 'sale';
  fit: '' | Fit;
  colors: string[];                    // مفاتيح السواتش (ivory, coal…)
  sizes: Record<string, string>;       // أرقام كـ strings
  desc: string; descEn: string;
  care: string; careEn: string;
}

interface AdminStats {
  products: number;
  stock: number;
  orders: number;
  revenue: number;
  lowStock: Product[];
  wishCount: number;
  cmpCount: number;
}
