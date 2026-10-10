# AGENT.md — NATH & JAID MVP

## Goal

Build the MVP website for **NATH & JAID**, a modern scented-candle and home-fragrance brand built around seasonal collections.

The result should feel warm, editorial, premium, and believable. Keep the implementation focused: presentation matters more than adding features.

## Source of Truth

This file is the entry point for the website. It owns **what to build**: scope, homepage requirements, product and data rules, implementation, quality bar, and build order. Every brand fact comes from [`brand/`](./brand/), which holds all NATH & JAID company information and assets.

| Topic | Authoritative file |
|---|---|
| Scope, build rules, definition of done | `AGENT.md` (this file) |
| Identity, mission, vision, promise, personality, audience, company details (customer email, shipping threshold) | [`brand/README.md`](./brand/README.md) |
| Colors | [`brand/color.md`](./brand/color.md) |
| Typography | [`brand/typography.md`](./brand/typography.md) |
| Voice, tagline, campaign lines | [`brand/voice.md`](./brand/voice.md) |
| Page-by-page site structure, navigation, visual system, logo usage, accessibility baseline | [`brand/website-direction.md`](./brand/website-direction.md) |
| Logo files | [`brand/logo/`](./brand/logo/) |
| Fall Collection products, scent moods, featured candle (active) | [`brand/product/fall-collection.md`](./brand/product/fall-collection.md) |
| Summer Collection products (documented, not in MVP scope) | [`brand/product/summer-collection.md`](./brand/product/summer-collection.md) |
| Photography and naming rules | [`brand/product/images/`](./brand/product/images/README.md) |
| Prompts used to create the photography | [`FALL-`](./brand/product/FALL-IMAGE-GENERATION-PROMPTS.md) and [`SUMMER-IMAGE-GENERATION-PROMPTS.md`](./brand/product/SUMMER-IMAGE-GENERATION-PROMPTS.md) |

Rules:

- Do not duplicate brand information in application components or invent new brand rules. Read the relevant `brand/` file before designing or writing copy.
- Each fact lives in one file. Other files link to it instead of repeating it.
- If this file and a `brand/` file disagree, stop and reconcile the documents before building. Do not resolve a conflict silently in code.
- Change a brand fact in `brand/` first, then update the website to match.

## Scope

Build only:

1. A responsive homepage
2. A Fall Collection page (the candles only)
3. A reusable product-detail page for each of the four candles
4. A concise Our Story page
5. A simple Contact page
6. A local bag stored on the visitor's device, with no checkout

Do not build payment processing, checkout, authentication, customer accounts, inventory, order management, reviews, subscriptions, search, a CMS, or external automations. Forms validate and confirm on the page only until a provider is connected.

## Homepage

The homepage must include, in the order defined in [`brand/website-direction.md`](./brand/website-direction.md#homepage-structure):

- the announcement bar and header
- the active collection's hero with its campaign line
- “Shop by scent mood” links for the active collection's moods
- a product grid showing every candle in the active collection
- the brand statement built on the primary tagline
- a featured-candle slideshow that never auto-rotates
- the email signup band and footer (shared by every page)

Do not add a craft section or a seasonal-philosophy section to the homepage. Product specifications belong on product pages, and the seasonal approach belongs on Our Story.

## Product and Collection Rules

- Use the product names, prices, specifications, descriptions, scent notes, scent moods, vessel accent colors, and featured candle in [`brand/product/fall-collection.md`](./brand/product/fall-collection.md).
- Keep product and collection data centralized rather than hard-coding it repeatedly in UI components.
- Use the routes `/collections/fall`, `/products/<slug>`, `/about`, `/contact`, and `/bag`.
- Build reusable components for product cards, grids, galleries, scent notes, specs, the scent-mood links, the slideshow, buttons, the header, and the footer.
- Use product images only from [`brand/product/images/`](./brand/product/images/). If an image is unavailable, use a clearly labeled temporary placeholder without inventing a new product.
- Data must support future seasonal collections (for example, the documented Summer Collection) without rebuilding pages.

## Design Direction

- Use the approved palette in [`brand/color.md`](./brand/color.md).
- Use the typography rules in [`brand/typography.md`](./brand/typography.md).
- Follow the page structure, visual system, and logo usage in [`brand/website-direction.md`](./brand/website-direction.md).
- Use generous whitespace, large product imagery, subtle transitions, and restrained decoration.
- Avoid excessive cards, borders, shadows, gradients, animation, and visual clutter.
- Use realistic NATH & JAID copy. Do not use lorem ipsum.
- Do not imitate another candle brand's visual identity.

## Implementation

Build a static site with as few dependencies as possible. The reference MVP uses [Astro](https://astro.build/) with this structure:

| Path | Purpose |
|---|---|
| `src/data/` | Collections, products, scent moods, navigation, company details, and seasons, transcribed from `brand/` (the only place product facts live in code) |
| `src/styles/global.css` | Color and type tokens from `brand/color.md` and `brand/typography.md`, plus buttons, forms, and focus states |
| `src/components/` | Reusable UI components |
| `src/pages/` | Routes |
| `scripts/build-logos.mjs` | Crops the approved logo SVGs from `brand/logo/` (crop values in [`brand/website-direction.md`](./brand/website-direction.md#logo-usage-on-the-website)) into `public/brand/` before each build |

Import images directly from `brand/product/images/` and optimize them at build time (AVIF with WebP fallback, responsive widths). Do not copy them into `src/` or `public/`.

## Quality Requirements

- Design mobile-first and verify 375px, 390px, 430px, 768px, and 1440px widths.
- Use semantic HTML, logical headings, keyboard navigation, visible focus states, accessible forms, sufficient contrast, and descriptive image alt text.
- Compress images, lazy-load non-critical media, avoid unnecessary dependencies, and keep animations lightweight.
- Add a descriptive page title, meta description, meaningful URL, and basic Open Graph metadata to each page.
- Ensure there is no horizontal overflow, broken navigation, broken imagery, filler copy, or serious console error.

## Build Order

1. Set up fonts, colors, global styles, layout, header, and footer.
2. Add centralized Fall Collection and product data.
3. Build the responsive homepage.
4. Build the reusable collection and product-page templates.
5. Add Our Story and Contact pages.
6. Add the local bag.
7. Test responsiveness, accessibility, performance, links, and visual consistency.

## Definition of Done

The MVP is done when:

- Visitors understand the brand and Fall Collection within seconds.
- Pumpkin Chai, Apple Cider Hearth, Vanilla Amber, and Cedar & Fig are easy to discover and each has a complete product page.
- The site consistently follows the brand folder's colors, typography, voice, logo, and product information.
- Required pages and primary interactions work on mobile and desktop.
- Product and collection data can support future seasonal collections without rebuilding the site.
- No out-of-scope ecommerce or automation features have been added.

When choosing between more features and better presentation of fewer features, choose better presentation.
