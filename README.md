# RŪH — fashion e-commerce store (متجر روح)

A front-end store for a made-up Cairo clothing brand. Cart, filters, search, wishlist,
3-step checkout, accounts, Arabic/English with RTL, dark mode and a currency switcher —
all client-side, no backend.

**[Open the live store →](https://kareeem7.github.io/ruh-/)**

It runs on React 18 through the UMD build plus `htm` for markup, so there's no bundler and
no build step: the whole thing is a folder you can open with a double click.

## What's in it

- 24 products over home, collection and product pages; filters by size, colour, price, fabric,
  rating and stock; five sort orders
- Cart drawer with quantity steps, a working coupon (`ROOH10`), free-shipping progress and
  bundle discounts
- 3-step checkout with six payment methods (COD, card, Fawry, ValU, InstaPay, Apple Pay)
- Demo accounts: salted SHA-256 via Web Crypto, order history, saved address
- Arabic-first design decisions — RTL flip, Arabic validation messages, IBM Plex Sans Arabic

## Screenshots

<!-- ضيف ٣ صور هنا: home / collection / product. سحب الصور لـ assets/screens/ وسمّيها بنفس الأسماء -->
| Home | Collection | Product |
|---|---|---|
| _home.png_ | _collection.png_ | _product.png_ |

## Run it

Open `index.html`. That's it — no `npm install`, no server, works from `file://`.
If you want a hosted-style run (needed for clean URLs):

```bash
npx serve .
```

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

---

## Project Structure

```text
├── index.html                 # shell + SVG sprite + CDN script tags
├── README.md
├── robots.txt / sitemap.xml   # SEO basics
├── css/
│   └── main.css               # design tokens + every component (no framework overrides)
└── js/
    ├── data.js                # 24 products, reviews, posts, FAQ, translations ← the "API"
    ├── utils.js               # helpers: storage, money fmt, router parse, icons, hash auth
    ├── components.js          # shared UI: Modal, Drawer, Toasts, ProductCard, FABs…
    ├── hud.js                 # Header, Mega menu, Cart drawer, Search overlay, Footer
    ├── pages-shop.js          # Home, Collection, Product, Wishlist, Compare
    ├── pages-plus.js          # Blog, Article, Policies, Order, Account
    ├── pages-auth-checkout.js # Auth (login/signup/reset) + 3-step Checkout
    └── app.js                 # root state, hash router, popups scheduler
```

No `src/`, no bundler. The philosophy: folders by *layer*, components by *screen*.
It's not perfect architecture — but it's honest, readable, and every file has one job.

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
- `sitemap.xml` lists relative URLs and hash routes (`#/collection/all`), which search engines
  don't index properly. A real deployment needs a server that rewrites routes to real paths.
- If `crypto.subtle` isn't available (older browser or non-HTTPS), password hashing falls back
  to a weak non-cryptographic hash. Demo-only, same as the rest of the auth.

---

## Roadmap / next improvements

- [ ] React Router + code-splitting (currently lightweight hash routing on purpose)
- [ ] Real backend: auth API + orders + inventory webhooks
- [ ] Meta / TikTok Pixel wiring (events already push to `dataLayer`)
- [ ] PWA: service worker + offline shell
- [ ] Admin dashboard for products & coupons

---

## Author notes — ملاحظات

الكود معلّق بالعربي في الأماكن المهمة. البيانات كلها في مكان واحد عشان تتنقل لـ API بسهولة.
التصميم مبني على توكِنز، ولو حبيت تغيّر الهوية: ثلاث خطوات بس في README فوق.

MIT License — use it, learn from it, break it, fix it.
