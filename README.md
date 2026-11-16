# RŪH — Fashion E-commerce Store — متجر روح

A fully working fashion e-commerce front-end for a made-up Cairo brand called **RŪH (روح)**.
Built as a portfolio / learning project — the whole store (cart, filters, auth, checkout, i18n…) runs client-side, no backend.

> متجر أزياء مصري كامل شغال 100% على الفرونت إند — سلة، فلاتر، تسجيل دخول، دفع، لغتين، ودارك مود.

**[Open the live store →](https://kareeem7.github.io/ruh-/)** · **[Open the admin panel →](https://kareeem7.github.io/ruh-/#/admin)** — PIN `2026`

---

## Preview

Everything above is running from GitHub Pages right now. Locally it's the same folder —
open `index.html` in your browser. No `npm install`, no build step, no server required
(it also works from `file://`).

```bash
# or serve it if you prefer
npx serve .
# then open http://localhost:3000
```

### Try the admin panel

The nicest thing to open first isn't the storefront — it's the back office:

**`#/admin`** · PIN **`2026`** (also linked as *Admin* in the footer)

Add a product there, save, then open `#/collection/all` — it's already in the grid,
in search, in the filters, and it has its own product page. Nothing reloads, nothing
is faked; the admin and the storefront are reading the same array.

---

## Tech Stack

| Layer      | Choice                                             | Why |
|------------|----------------------------------------------------|-----|
| UI library | **React 18** (production UMD via CDN)              | Real component model without tooling |
| Templates  | **htm** (JSX-like tagged templates, no Babel)      | Readable markup, zero build |
| CSS        | **Bootstrap 5.3** (utilities only) + custom tokens | Fast layouts + own design system |
| Fonts      | IBM Plex Sans Arabic + Instrument Serif            | Brand look |
| State      | React hooks + `localStorage` persistence           | Survives refresh |
| Icons      | Inline SVG sprite (`#i-*`)                         | 1.5px stroke, no emoji |
| Images     | Pexels CDN (real photos, no gray placeholders)     | Free stock |

The goal was: *"the store should feel real, but still be a single repo you can open with a double click."*

---

## Features

**Storefront**
- Home: hero, trust strip, categories, product tabs (new / best sellers / on sale), seasonal editorial, *Complete-the-look* bundle (−15% auto), real countdown offer, brand story, reviews + rating bars, UGC grid, FAQ, newsletter (ROOH10 code), recently-viewed rail
- Collection page: filters (category, size, color swatches, price double-range, fabric, rating, in-stock), 5 sort orders, active-filter chips, result counter, empty state, mobile filter drawer
- Product page: gallery + thumbnails + lightbox (keyboard + swipe), hover zoom with transform-origin, color/size pickers, live stock urgency ("Only 2 left in M"), fit warnings, size-guide modal, size suggestion wizard, accordions, reviews with filters + "helpful" votes, related items
- Blog (3 posts) + full policy pages

**Commerce**
- Cart drawer: quantity steppers, remove, **coupon `ROOH10`** (−10%), live free-shipping progress bar, totals, bundle discount logic
- 3-step checkout (guest allowed): details → shipping method → payment (COD / card / Fawry / ValU installments / InstaPay / Apple Pay) with Arabic validation messages
- Order confirmation: order number + tracking timeline
- Wishlist, compare table (max 3, live state on cards), social-proof popup (15s + 40% scroll rule)

**Account system (demo-grade auth)**
- Sign up / sign in / forgot password (reset-code flow)
- Passwords hashed with **SHA-256 + random salt** (Web Crypto) — never stored plain
- Protected `#/account` page: profile edit, change password, order history, saved address

**Experience**
- **English default** — full AR / EN toggle with RTL ⇄ LTR switch
- Dark mode (respects `prefers-color-scheme`, token-swap not hacks)
- Currency switcher: EGP / SAR / AED / USD
- Toasts for every action, skeleton loaders, focus-visible styles, Esc closes everything, `dataLayer` analytics events ready to wire (`view_item`, `add_to_cart`, `purchase`…)

**Admin panel** — the part I'm most proud of. Full section below.
- PIN-gated `#/admin` route with five live stat counters and a low-stock rail
- Full product CRUD: create, edit any field, delete — with validation and Arabic error messages
- What you add is merged into the catalog on boot and pushed to the UI with a re-render bump, so the storefront updates instantly
- Orders from every checkout land in the admin table as they happen

---

## Admin panel — لوحة الأدمن

A storefront is easy to fake. A back office is where a real shop gets hard — inventory,
editing, and "did my change actually reach the customer?" I wanted to build that part too,
so the project stops being a pretty catalog and starts behaving like a shop.

**Open `#/admin`** (or the **Admin** link in the footer) → PIN **`2026`**

```text
PIN: 2026        # ADMIN_PIN — authored in src/products.ts, built into js/products.js
```

### What's in it

- **Six live stat counters** — catalog size, total stock units, orders, demo revenue, wishlist count
- **Low-stock rail** — anything with ≤ 4 units left floats to the top, so it's the first thing you see
- **Products table** — edit *any* product in place, including the original 24. Deleting is restricted to admin-created items on purpose: you shouldn't be able to wipe the seed catalog by accident
- **Add / edit form** — bilingual names, category & section, price and old price, fabric, colour swatches pulled from the same design tokens the store uses, per-size stock, badge and fit note, two image URLs with a live preview
- **Orders table** — every checkout lands here the moment it's placed, newest first

### The bit that matters

This is not a mockup with fake rows. The flow is real end to end:

```text
PIN gate → form → validation → AdminStore.productFromForm() → PRODUCTS array
        → localStorage['ruh_admin_products'] → bumpProducts() → React re-render
        → the new product is in the grid, the search, the filters, the "new" tab and its own page
```

`AdminStore.mergeAdminProducts(PRODUCTS)` runs on boot, so a product you added last week is
still there after a refresh. `api.bumpProducts()` bumps a counter in the root component — the
cheapest possible way to force a re-render without threading state through five layers.

Validation is server-side honest about being client-side: name ≥ 2 chars, price > 0, at least
one image, at least one colour, at least one size with stock — otherwise the save is refused
with the missing fields named in Arabic.

### Files

| File | Role |
|---|---|
| `js/admin.js` | `AdminPage` — PIN gate, stats, form, both tables (~240 lines) |
| `src/products.ts` → `js/products.js` | `AdminStore`: load, save, merge, slug, form → product, stats |
| `src/types.ts` | the shapes — `Product`, `Order`, `AdminProductForm`, `AdminStats` |
| `js/app.js` | one route line: `else if (route.name === 'admin') page = <AdminPage .../>` |
| `js/hud.js` | the footer link |
| `css/main.css` | `.astats`, `.atable`, `.bstk` … at the end of the file |

**Read the limitation honestly:** the PIN is a UI gate, not security — anyone can run
`sessionStorage.setItem('ruh_admin','1')` and walk in. That's fine while every byte of data
lives in the visitor's own `localStorage`, and it's the first thing to move behind a real API
(see [Known limitations](#known-limitations-on-purpose) and the roadmap).

## TypeScript layer

The product/admin logic is typed in `src/` and stays the source of truth:

```text
src/
├── tsconfig.json     # strict, module:none, outDir → ../js
├── types.ts          # Product, CartItem, Order, StoreUser, AdminProductForm, AdminStats
└── products.ts       # AdminStore: load/save/merge/slugify/productFromForm/stats
```

Rebuild the runtime after touching `src/`:

```bash
npx tsc -p src        # writes js/products.js (+ js/types.js)
```

`js/products.js` is the committed build of `src/products.ts` — rebuilt and diffed against it,
the two are identical apart from formatting (the committed copy is prettified: single quotes,
2-space indent, and the `\u0600-\u06FF` range written as literal Arabic letters).

Two things are deliberately inside the `.ts`, not appended to the `.js`, so a rebuild can't
delete them: the `AdminStore.mergeAdminProducts(PRODUCTS)` boot call and `ADMIN_PIN`.
If you keep `js/products.js` as the only source of truth you *will* lose both on the next
build, and the admin panel stops opening — that's the reason `src/` exists.

The rest of the runtime is JS — gradually portable the same way.

## Project Structure

```text
├── index.html                 # shell + SVG sprite + CDN script tags
├── README.md
├── robots.txt / sitemap.xml   # SEO basics
├── css/
│   └── main.css               # design tokens + every component (no framework overrides)
├── js/
│   ├── data.js                # 24 products, reviews, posts, FAQ, translations ← the "API"
│   ├── products.js            # AdminStore — build output of src/products.ts (see below)
│   ├── utils.js               # helpers: storage, money fmt, router parse, icons, hash auth
│   ├── components.js          # shared UI: Modal, Drawer, Toasts, ProductCard, FABs…
│   ├── hud.js                 # Header, Mega menu, Cart drawer, Search overlay, Footer
│   ├── pages-shop.js          # Home, Collection, Product, Wishlist, Compare
│   ├── pages-plus.js          # Blog, Article, Policies, Order, Account
│   ├── pages-auth-checkout.js # Auth (login/signup/reset) + 3-step Checkout
│   ├── admin.js               # AdminPage: PIN gate, stats, product form, tables
│   └── app.js                 # root state, hash router, popups scheduler
└── src/                       # typed source for the product/admin layer only
    ├── tsconfig.json          # strict, module:none, outDir → ../js
    ├── types.ts               # shared interfaces (Product, Order, AdminProductForm…)
    └── products.ts            # AdminStore + boot merge
```

No bundler anywhere: `index.html` loads plain `<script>` tags and `file://` still works.
The philosophy is folders by *layer*, components by *screen*. Only the product/admin layer
has a typed source (`src/`); the rest of the runtime is JS and gets ported the same way,
one file at a time.

---

## Add / edit a product

Everything renders from `js/data.js`. One object = one product:

```js
{ id: 25, slug: 'linen-set-sand', name: 'طقم كتان – رملي', en: 'Linen Set – Sand',
  cat: 'women',            // women | men | unisex | acc
  sub: 'بيتي',             // free-text section label
  price: 1890, old: 2290,  // old = strikethrough price
  rating: 4.8, rvws: 12, badge: 'new',           // 'new' | 'sale' | null
  fabric: 'كتان مغسول',
  imgs: [IMG.hero, IMG.edit],                    // main + hover photo
  colors: [C.sand, C.ivory],
  sizes: { S: 3, M: 4, L: 2 },                   // stock per size. Add OS for one-size.
  fit: null,               // 'small' | 'large' shows a fit warning
  sold: 0,
  desc: 'وصف بشرية…', care: 'غسيل بارد…' }
```

That's it — it appears in the grid, search, filters, PDP, PDP schema, everywhere.

### Wire a real API later

All reads go through this file. Replace the `PRODUCTS` array with a fetch and keep the shape:

```js
// js/data.js — later
fetch('/api/products').then(r => r.json()).then(list => { window.PRODUCTS = list; rerender(); });
```

The rest of the app doesn't need to change.

---

## Rebrand in 3 steps

1. **Colors** → edit the token block at the top of `css/main.css` (`--clay`, `--bone`, `--ink`…)
2. **Name/logo** → replace `RŪH` in `index.html` `<title>` + `Logo` component + `CFG.name`
3. **Photos** → swap the `IMG` map keys in `js/data.js` with your own URLs

---

## Image manifest

All photos are hot-linked from Pexels (license: free to use). If you want local copies,
drop them into `assets/img/` and rewrite the `IMG` map. Prompts below match the vibe
if you'd rather generate your own.

| File (key)     | Used for            | Suggested prompt |
|----------------|---------------------|------------------|
| `hero`         | Home hero           | "two modestly dressed women in earth-tone traditional-inspired outfits holding hands at golden hour, warm cinematic light, editorial fashion photography" |
| `edit`         | Seasonal editorial  | "group of women wearing hijabs laughing outdoors at sunset, warm tones, lifestyle fashion editorial" |
| `wOversize`    | Category / auth     | "elegant woman in beige hijab and flowing dress, studio portrait, warm brown backdrop, soft light" |
| Product cards  | 24 products (2 each)| "modest fashion studio shot, linen garment on model or hanger, neutral beige palette, soft window light" |
| `sew1..sew6`   | Story / size guide  | "tailor's hands sewing and measuring fabric in an atelier, warm workshop light" |
| `UGC[0..5]`    | Instagram grid      | "real-customer street style selfie, hijab / modest looks, city background" |

---

## Known limitations (on purpose)

- **Auth is demo auth.** Users live in `localStorage` with salted SHA-256. Fine for a demo,
  *not* production — for production you'd swap `pages-auth-checkout.js` handlers to call a
  real auth API (and keep the UI as-is).
- Payments are mocked (no gateway calls) — integration points are marked in the checkout handlers.
- Product photos are same-per-category hot-links, so a real catalog would need its own photography.
- **If `crypto.subtle` is unavailable** (older browser, or any non-HTTPS context) the password
  hash falls back to a weaker non-cryptographic function. Same demo-grade caveat as the rest of auth.
- **The admin PIN is not security.** Checking it in the browser means anyone can open devtools,
  run `sessionStorage.setItem('ruh_admin','1')` and walk in. It gates a UI, not data — everything
  lives in `localStorage` on the visitor's own machine, so there is nothing to protect yet. A real
  deployment moves the check to a server and the panel behind real auth.
- Deep links are hash routes (`#/product/x`), which crawlers don't index as separate pages, so
  the site is one indexable URL. `sitemap.xml` reflects that instead of listing fragment URLs.

---

## Roadmap / next improvements

- [ ] React Router + code-splitting (currently lightweight hash routing on purpose)
- [ ] Move the rest of `js/` to `src/` TypeScript module-by-module
- [ ] Real backend: auth API + orders + inventory webhooks — admin PIN becomes real RBAC
- [ ] Meta / TikTok Pixel wiring (events already push to `dataLayer`)
- [ ] PWA: service worker + offline shell

---

## Author notes — ملاحظات

الكود معلّق بالعربي في الأماكن المهمة. البيانات كلها في مكان واحد عشان تتنقل لـ API بسهولة.
التصميم مبني على توكِنز، ولو حبيت تغيّر الهوية: ثلاث خطوات بس في README فوق.

MIT License — use it, learn from it, break it, fix it.
