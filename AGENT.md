# AGENT.md — NATH & JAID Website

## Goal

Build the website for **NATH & JAID**, a modern scented-candle and home-fragrance brand built around seasonal collections, in two phases:

- **Phase 1 — Storefront MVP:** a static, presentation-first site with a local bag (everything from [Scope](#scope) to [Definition of Done](#definition-of-done)).
- **Phase 2 — Commerce:** payment processing, checkout, authentication, customer accounts, inventory, and order management on Supabase and Stripe ([Phase 2 — Commerce](#phase-2--commerce)). Phase 2 starts only after Phase 1 meets its Definition of Done and the [Phase 2 prerequisites](#prerequisites-resolve-before-building) are resolved.

The result should feel warm, editorial, premium, and believable. Keep the implementation focused: presentation matters more than adding features.

## Source of Truth

This file is the entry point for the website. It owns **what to build**: scope, homepage requirements, product and data rules, implementation, quality bar, and build order. Every brand fact comes from [`brand/`](./brand/), which holds all NATH & JAID company information and assets.

| Topic | Authoritative file |
|---|---|
| Scope, build rules, definition of done (both phases) | `AGENT.md` (this file) |
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

Phase 1 builds only:

1. A responsive homepage
2. A Fall Collection page (the candles only)
3. A reusable product-detail page for each of the four candles
4. A concise Our Story page
5. A simple Contact page
6. A local bag stored on the visitor's device, with no checkout

In Phase 1, do not build payment processing, checkout, authentication, customer accounts, inventory, or order management; these belong to [Phase 2](#phase-2--commerce). Reviews, subscriptions, search, a CMS, and external automations are out of scope in both phases. Forms validate and confirm on the page only until a provider is connected.

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

Phase 1 is a static site with as few dependencies as possible ([Phase 2 architecture](#architecture) adds on-demand routes without changing this structure). The reference MVP uses [Astro](https://astro.build/) with this structure:

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

Phase 1 is done when:

- Visitors understand the brand and Fall Collection within seconds.
- Pumpkin Chai, Apple Cider Hearth, Vanilla Amber, and Cedar & Fig are easy to discover and each has a complete product page.
- The site consistently follows the brand folder's colors, typography, voice, logo, and product information.
- Required pages and primary interactions work on mobile and desktop.
- Product and collection data can support future seasonal collections without rebuilding the site.
- No Phase 2 or out-of-scope ecommerce or automation features have been added.

When choosing between more features and better presentation of fewer features, choose better presentation.

---

# Phase 2 — Commerce

**Status: built; not yet live.** The open decisions were taken with the recommended defaults (see [Open Decisions](#open-decisions)). Brand facts that still need the owner are marked **pending confirmation** in `brand/`. Do not take live payments until `npm run check:launch` passes.

## Phase 2 Goal

Let visitors buy the active collection's candles with a calm, trustworthy checkout. Customers can check out as guests or with an account, see their orders, and the team can manage stock and fulfil orders. Commerce must not slow down or clutter the storefront: the Phase 1 design, voice, and quality bar still apply to every new page.

## Prerequisites (resolve before building)

Commerce needs facts that `brand/` did not hold before Phase 2. They now live there, following the Source of Truth rules; working defaults are marked **pending confirmation** and must be confirmed before launch. Never invent them in code.

| Fact needed | Add to |
|---|---|
| Shipping rate for orders under $35, ship-to countries, processing time | [`brand/README.md`](./brand/README.md#company-details) (Company Details) |
| Currency (assumed USD) and sales-tax approach | `brand/README.md` (Company Details) |
| Legal business name, support email for receipts, card statement descriptor (max 22 characters) | `brand/README.md` (Company Details) |
| Shipping, returns and refunds, privacy, and terms policy text | New `brand/policies/` folder, one file per policy |
| Page structure for sign-in, account, checkout success, sold-out states, header account link, and footer policy links; replacement for the “Checkout coming soon” bag copy | [`brand/website-direction.md`](./brand/website-direction.md) (also update “Open Items Before Launch”, which still says checkout is out of scope) |
| Copy for order states, stock messages, and authentication emails | [`brand/voice.md`](./brand/voice.md) |

## Phase 2 Scope

Build only:

1. **Checkout** from the existing bag, through Stripe Checkout, for guests and signed-in customers
2. **Payment processing** with Stripe, confirmed by a verified webhook
3. **Authentication** with Supabase Auth (email and password, plus a magic link), password reset, and email verification
4. **Customer accounts:** profile, order history, order detail with status and tracking, sign-out, and an account-deletion request
5. **Inventory:** stock per product, reserved during checkout, decremented on payment, and shown on the storefront as sold out or low stock
6. **Order management:** a private `/admin` area to view orders, mark them fulfilled with tracking, cancel, refund, and adjust stock
7. **Policy pages** for shipping, returns, privacy, and terms, linked in the footer and in checkout

Do not build: saved payment methods in the site's own UI, saved address books, wishlists, discount codes, gift cards, subscriptions, reviews, search, multi-currency, a CMS, shipping-label purchase, marketing automations, or custom transactional email beyond Stripe receipts and Supabase auth emails.

## Stack

| Concern | Choice |
|---|---|
| Framework | Astro (unchanged), with an SSR adapter for on-demand routes |
| Hosting adapter | **Open decision** (recommended: Vercel via `@astrojs/vercel`; Netlify or Node are acceptable) |
| Database, auth | Supabase (Postgres, Row Level Security, Auth) with `@supabase/supabase-js` and `@supabase/ssr` for cookie sessions |
| Payments | Stripe Checkout with the `stripe` Node SDK (card and wallets only) |
| Local tooling | Supabase CLI (local stack and migrations) and Stripe CLI (webhook forwarding) as dev tools, not runtime dependencies |

Add no other runtime dependencies without a stated reason.

## Architecture

- **Prerendered by default.** Every Phase 1 page stays static. Only `/api/*`, `/checkout/*`, `/account/*`, and `/admin/*` render on demand (`export const prerender = false`). The storefront's speed must not regress.
- **Prices stay in `src/data/`.** `src/data/` is still the only place product facts live in code, prices included. The server reads prices from `src/data/catalog.ts` when it creates a checkout and never trusts prices or totals sent by the browser. Supabase does not store a product catalog; it stores operational data keyed by product slug (stock, orders, customers). A price change is a brand change: `brand/` first, then `src/data/`, then redeploy.
- **The bag stays local.** The Phase 1 `localStorage` bag is the cart for guests and signed-in customers. Checkout sends `{ slug, quantity }[]` only; the server validates each slug against the live collections and checks the 1–10 quantity limit and available stock.
- **Stripe Checkout, not a custom payment form.** Line items use `price_data` built from `src/data/` (amount in cents, name, and primary image), so there is no Stripe product catalog to keep in sync. Card data never touches this site.
- **Webhooks are the source of truth for payment.** The success page only reads and displays an order. Orders become paid only when a verified Stripe webhook says so.
- **Middleware owns sessions.** `src/middleware.ts` creates a per-request Supabase server client from cookies, sets `Astro.locals.user`, and guards `/account/*` (signed-in) and `/admin/*` (admin role).
- **Secrets stay on the server.** The Supabase service-role key and Stripe secret and webhook keys are used only in server modules under `src/lib/server/`, never in components or client scripts.

### New and changed paths

| Path | Purpose |
|---|---|
| `supabase/migrations/` | Versioned SQL: tables, enums, RLS policies, and database functions |
| `supabase/seed.sql` | Local-only seed (stock rows for live products, a test admin) |
| `src/middleware.ts` | Session loading and route guards |
| `src/lib/server/supabase.ts` | Request-scoped client (user's session) and service-role client (webhooks and admin only) |
| `src/lib/server/stripe.ts` | Stripe client, checkout-session builder, webhook verification |
| `src/pages/api/checkout.ts` | `POST`: validate bag → reserve stock → create pending order → create Checkout Session → return URL |
| `src/pages/api/stripe/webhook.ts` | `POST`: verify the signature on the raw body and process events idempotently |
| `src/pages/api/stock.ts` | `GET`: availability for live products (`in_stock` / `low` / `sold_out`), cached briefly |
| `src/pages/checkout/success.astro` | Order confirmation by `session_id`; clears the local bag |
| `src/pages/checkout/unavailable.astro` | Prerendered fallback while commerce secrets are not configured |
| `src/pages/account/…` | `sign-in`, `sign-up`, `reset-password`, `update-password`, `confirm` (verifies email links), `sign-out`, `index` (orders and profile), `orders/[number]` |
| `src/pages/admin/…` | `index` (overview and deletion requests), `orders/index`, `orders/[number]`, `inventory` |
| `src/pages/policies/[slug].astro` | Prerendered policy pages from `brand/policies/` |
| `src/lib/commerce.ts` | Cents conversion and the shipping rule, shared by the bag estimate and the checkout API |
| `src/lib/server/checkout.ts`, `webhook.ts` | Checkout session creation and Stripe event handling |
| `src/lib/server/database.types.ts` | Generated by `npm run db:types`; regenerate after every migration |
| `src/data/policies.ts`, `order-status.ts` | Policy loader and customer-facing status copy (from `brand/voice.md`) |
| `src/scripts/bag.ts`, `stock.ts` | Bag storage (now with `clearBag`) and stock states for cards, product pages, and the bag |
| `supabase/templates/` | Auth emails in the brand voice; their links go to `/account/confirm` |
| `supabase/tests/`, `tests/integration/` | pgTAP database tests and webhook/concurrency tests |
| `scripts/grant-admin.mjs`, `check-launch.mjs` | Admin role grants and the pre-launch check |

## Data Model (Supabase)

All tables have RLS enabled. Customers read only their own rows; admins are identified by `app_metadata.role = 'admin'` (users cannot edit it) through an `is_admin()` SQL function. Writes to orders and stock happen only through server code or `security definer` functions.

| Table | Key columns | Notes |
|---|---|---|
| `profiles` | `id` (= `auth.users.id`), `full_name`, `stripe_customer_id`, `created_at` | Created by a trigger on sign-up |
| `inventory` | `product_slug` (PK), `on_hand`, `reserved`, `low_stock_threshold`, `updated_at` | Check constraints: `on_hand >= 0`, `0 <= reserved <= on_hand` |
| `inventory_movements` | `id`, `product_slug`, `delta`, `reason` (`restock`, `sale`, `cancel`, `adjustment`), `order_id`, `actor_id`, `created_at` | Append-only ledger for every stock change |
| `orders` | `id`, `number` (e.g. `NJ-100001`), `user_id` (nullable), `email`, `status`, `subtotal_cents`, `shipping_cents`, `tax_cents`, `total_cents`, `currency`, `shipping_address` (jsonb), `stripe_checkout_session_id` (unique), `stripe_payment_intent_id`, `reservation_expires_at`, `paid_at`, `fulfilled_at`, `carrier`, `tracking_number`, `created_at` | Guest orders have a null `user_id` |
| `order_items` | `order_id`, `product_slug`, `name`, `unit_price_cents`, `quantity` | Name and price are snapshots taken at purchase |
| `order_events` | `id`, `order_id`, `type`, `data` (jsonb), `actor_id`, `created_at` | Audit trail of status changes, refunds, and notes |
| `stripe_events` | `id` (Stripe event ID, PK), `type`, `processed_at` | Webhook idempotency |

**Order statuses:** `pending_payment` → `paid` → `fulfilled`; also `expired` (checkout abandoned), `cancelled`, `refunded`, `partially_refunded`. Only the transitions in the flows below are allowed; enforce them in the database functions.

**Database functions** (transactional, with row locks so two buyers can't take the last candle):

- `reserve_stock(items, order_id)`: fails if any `on_hand - reserved < quantity`
- `release_stock(order_id)`: on expiry, cancel before payment, or a failed checkout
- `commit_stock(order_id)`: on payment, moves stock from reserved to sold and writes `sale` movements
- `restock_order(order_id)`: on cancel or refund of an unshipped order
- `claim_guest_orders()`: attaches guest orders to the signed-in user when the email matches their **verified** email

## Checkout and Payment Flow

1. The visitor selects **Checkout** on `/bag`. The bag posts slugs and quantities to `/api/checkout`.
2. The server validates the items against `src/data/` (live collections only) and computes the subtotal and shipping from the Company Details (complimentary at $35 or more). It creates a `pending_payment` order with item snapshots and calls `reserve_stock`.
3. The server creates a Stripe Checkout Session with `price_data` line items, shipping options, `shipping_address_collection` for the approved countries, the order ID in `metadata` and `client_reference_id`, `expires_at` 30 minutes out, and `success_url` and `cancel_url`. Signed-in customers reuse their Stripe Customer; guests get `customer_email` once they enter it. Each line item carries the sales-tax rate from `src/data/company.ts`; the pending order stores the same tax estimate, and the webhook replaces it with Stripe's amount.
4. If stock is short, return a clear message naming the candle and the available quantity, and update the bag. Never silently change quantities.
5. **Webhook events:**
   - `checkout.session.completed` (with `payment_status = paid`): set the order to `paid`, store totals, address, and payment intent from Stripe, and call `commit_stock`
   - `checkout.session.expired`: set the order to `expired` and call `release_stock`
   - `charge.refunded`: set the order to `refunded` or `partially_refunded`, and log an event
   - `charge.dispute.created`: log an event and flag the order for admin
   
   Each event is recorded in `stripe_events` first; already-processed events return `200` without side effects.
6. `/checkout/success?session_id=…` shows the order number, items, and total (status “Confirming…” until the webhook lands), clears the local bag, and offers account creation to guests.
7. A cancel returns the visitor to `/bag` with a short note; the reservation expires with the session.
8. Stripe sends the payment receipt (enable customer emails in the Stripe Dashboard).

## Authentication and Accounts

- Supabase Auth with email and password and a magic link; email verification is required before an account can see claimed guest orders. No social sign-in in Phase 2.
- Account creation is never required to buy. Guests can create an account after purchase, and `claim_guest_orders()` runs after sign-in.
- Configure custom SMTP for Supabase auth emails before launch (the built-in sender is rate-limited), and write their templates in the brand voice.
- `/account` shows profile (name and email), recent orders, and sign-out. `/account/orders/[number]` shows items, totals, shipping address, status, and tracking. Account deletion is a request the admin completes, because order records must be kept.
- The header gains an account link (exact placement comes from `brand/website-direction.md`). Account pages are `noindex`.

## Inventory

- Every live product needs an `inventory` row. `/admin/inventory` lists live products from `src/data/` joined with stock, highlights missing rows, and creates them on first save.
- Storefront: product pages, cards, and the bag fetch `/api/stock` on load and show “Sold out” (disabled add-to-bag) or a low-stock note. Static pages stay static; stock is a progressive enhancement, and checkout re-validates regardless.
- Every stock change writes an `inventory_movements` row with a reason and an actor.

## Order Management (Admin)

- `/admin` is limited to users with the admin role, `noindex`, not linked from the storefront, and every action is logged to `order_events`.
- **Orders list:** filter by status, search by order number or email, and show newest first.
- **Order detail:** items, totals, customer, address, timeline, and these actions:
  - **Mark fulfilled:** carrier and tracking number → `fulfilled`
  - **Cancel:** for a paid, unfulfilled order: full Stripe refund, then `restock_order`
  - **Refund:** full or partial through the Stripe API; the status follows the `charge.refunded` webhook. Restock is optional and explicit.
  - **Internal note**
- **Inventory:** set on-hand quantity, restock, and set the low-stock threshold.
- Supabase Studio and the Stripe Dashboard stay available for anything beyond this; do not rebuild them.

## Security Requirements

- RLS on every table, with a test proving a customer cannot read another customer's orders and an anonymous visitor cannot read any.
- Verify the Stripe webhook signature against the raw request body; reject anything unverified.
- Recompute every price, total, and shipping amount on the server.
- Keep Astro's origin check (`security.checkOrigin`) on for all `POST` routes; rate-limit `/api/checkout`.
- Make sure no secret appears in the client bundle; check the built `dist/` output for key prefixes before each deploy.
- Use separate Supabase projects and Stripe accounts or modes for test and live; live keys exist only in production environment variables.

### Environment variables

| Variable | Scope |
|---|---|
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | Server only (the browser never talks to Supabase directly) |
| `SUPABASE_SECRET_KEY` | Server only |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Server only |
| `SITE_URL` | Build (canonical and Open Graph URLs) |

Secrets are declared in `astro.config.mjs` with `astro:env` (`context: 'server', access: 'secret'`), so importing them into client code fails the build. All are optional: without them the storefront behaves as in Phase 1 and commerce pages show `/checkout/unavailable`. `.env.example` lists the names.

### Running commerce locally

1. `npm run db:start` (needs Docker). It starts Supabase on ports 554xx, applies `supabase/migrations/`, and seeds stock. Copy the printed URL and keys into `.env`.
2. `npm run dev`, then `npm run stripe:listen` (Stripe CLI) and copy its `whsec_…` secret into `.env`, with a Stripe **test** secret key.
3. Auth emails arrive in Mailpit at http://127.0.0.1:55424.
4. Sign up on the site, then `npm run admin:grant -- you@example.com` and sign in again to reach `/admin`.
5. Tests: `npm run check` (types), `npm run db:test` (RLS and stock functions), `npm run test:integration` (webhook, concurrency, and account security; needs the dev server; set `TEST_BASE_URL` if it isn't on port 4321).

**Using a hosted Supabase project instead** (accounts visible on supabase.com, real emails): create the project, set `SUPABASE_URL=https://<project-ref>.supabase.co` in `.env`, run `npx supabase login`, then `npm run db:connect -- --seed`. It links the project named in `.env`, applies the migrations and opening stock, pushes the auth settings and email templates from `supabase/config.toml`, and fills in the project's keys in `.env` when they are blank or belong to another project. To switch projects, change `SUPABASE_URL` and run it again. Supabase's built-in email sender only delivers to members of the project's organization and is rate-limited to a few emails an hour; configure custom SMTP before inviting anyone else.

### Going live

1. Create the production Supabase project, then `supabase link` and `supabase db push`. Turn on email confirmations, set the Site URL, add the redirect URL `https://<domain>/account/confirm`, paste the templates from `supabase/templates/`, and configure custom SMTP.
2. In Stripe: add a webhook endpoint at `https://<domain>/api/stripe/webhook` for the events in `src/lib/server/webhook.ts` (`handledEvents`), turn on customer email receipts, and set the statement descriptor and branding.
3. Set the environment variables in Vercel, set stock in `/admin/inventory`, and grant the first admin.
4. `npm run build && npm run check:launch` must pass. Then place a real low-value order and refund it.

## Phase 2 Quality Requirements

Everything in [Quality Requirements](#quality-requirements) still applies, plus:

- **End-to-end in Stripe test mode:**
  - a successful card payment
  - a declined card
  - a 3-D Secure card
  - an abandoned checkout that expires and releases stock
  - two concurrent buyers for the last unit, where exactly one succeeds
  - a duplicate webhook delivery, which has no double effect
  - a full and a partial refund
- Check the flow under and over the $35 threshold: the shipping amount must match the announcement bar.
- Auth forms meet the Phase 1 accessibility baseline (labels, announced errors, focus on the first invalid field) and show password-manager-friendly `autocomplete` attributes.
- Prerendered pages show no Lighthouse performance regression against Phase 1.
- Order, stock, and account copy follows `brand/voice.md`; no generic ecommerce boilerplate.

## Phase 2 Build Order

1. Resolve the prerequisites in `brand/` and answer the open decisions.
2. Add the adapter, environment handling, the Supabase local stack, and the migrations (tables, RLS, functions) with RLS tests.
3. Add middleware and authentication: sign-up, sign-in, magic link, reset, and the header account link.
4. Add inventory: the stock API, storefront sold-out and low-stock states, and admin inventory.
5. Add checkout: the API, Stripe session, success and cancel pages, and bag changes.
6. Add the webhook with idempotency and the stock commit and release.
7. Add customer accounts: orders list and detail, and claiming guest orders.
8. Add admin order management: list, detail, fulfil, cancel, refund, and notes.
9. Add the policy pages and footer links.
10. Run the full test matrix, then do a live-mode smoke test with a real low-value order, refunded afterwards.

## Phase 2 Definition of Done

- A guest and a signed-in customer can each buy candles from the active collection, pay through Stripe, and see a confirmation with an order number.
- Paid orders appear in the customer's account and in `/admin`; stock is correct after payment, expiry, cancellation, and refund.
- Overselling is impossible under concurrent checkouts.
- No price, total, or stock decision trusts the browser, and no secret reaches the client.
- Every new page follows the brand folder's design, voice, and accessibility baseline, and the static storefront is as fast as in Phase 1.
- Nothing from the Phase 2 “Do not build” list has been added.

## Open Decisions

| Decision | Recommendation |
|---|---|
Each was built with the recommendation below. Change any of them by updating `brand/` and the one place named.

| Decision | Built with | Change in |
|---|---|---|
| Hosting and adapter | Vercel (`@astrojs/vercel`) | `astro.config.mjs` |
| Hosted or embedded Stripe Checkout | Hosted redirect; embedded (`ui_mode: 'embedded'`) is a later visual upgrade | `src/lib/server/checkout.ts` |
| Sales tax | 3.25% on candles, not shipping (confirmed), applied as a Stripe tax rate that checkout finds or creates by itself; the same rate for every US address | `brand/README.md`, then `salesTaxPercent` in `src/data/company.ts` |
| Ship-to countries | US only | `src/data/company.ts` |
| Shipping under $35 | $6 flat rate (confirmed) | `brand/README.md`, then `src/data/company.ts` |
| Low-stock display | “Only a few left” at the per-product threshold (default 5); never exact counts | `/admin/inventory` |
| Admin users | Granted with `npm run admin:grant` (`app_metadata.role = 'admin'`); no self-service invites | — |
