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

---

# Phase 2a — Reproduce and Harden

**Status: current state of the project.** Phase 2a explains how to rebuild this exact project from scratch. It records every bug found while building and testing Phases 1 and 2 and turns each one into a check in its Definition of Done. [Phase 1](#goal) and [Phase 2](#phase-2--commerce) remain the specification. Phase 2a adds no features. It adds the exact setup, the extra pieces that came out of debugging, and the checks that keep those bugs from coming back.

## Phase 2a Goal

An agent following this file builds a site that matches the current repository, and every problem listed in the [debug log](#debug-log) is ruled out before the work is called done.

## Toolchain

| Tool | Version used | Notes |
|---|---|---|
| Node | 22.12+ | `node --test` needs a quoted glob (`"tests/unit/*.test.mjs"`), not a directory |
| Astro | 7.x | Runs `astro dev` in the background; `@astrojs/check` 0.9 for `npm run check` |
| `@astrojs/vercel` | 11.x | SSR adapter |
| `@supabase/supabase-js`, `@supabase/ssr` | 2.x, 0.12.x | |
| `stripe` | 23.x | |
| TypeScript, `@types/node` | 6.x, 22.x | `@types/node` is required because `astro.config.mjs` reads `process.env` |
| Supabase CLI | 2.x (dev dependency) | Needs Docker for the local stack |
| Stripe CLI | current | Only for `npm run stripe:listen` |

## Reproduction Order

1. Build Phase 1 by its [Build Order](#build-order), then apply the [Phase 1 regression fixes](#phase-1-regressions) before starting Phase 2.
2. Record the confirmed brand facts in `brand/` before writing commerce code:
   - Shipping: $6 flat under $35, complimentary at $35 or more, US only.
   - Sales tax: 3.25% on candles, not on shipping.
   - Legal business name: Nath & Jaid Fragrances.
   - Policies in `brand/policies/`: approved as written.
   - Still **pending confirmation** (blocks `npm run check:launch`): processing time and the card statement descriptor.
3. Build Phase 2 by its [Build Order](#phase-2-build-order). Use two migrations: `20261011000000_commerce.sql`, plus `20261011010000_tax_on_pending_orders.sql`, which stores the tax estimate on pending orders.
4. Add the pieces that Phase 2 does not specify but the project needs (see [Additions from Debugging](#additions-from-debugging)).
5. Apply the [required configuration](#required-configuration) exactly.
6. Run the [Phase 2a Definition of Done](#phase-2a-definition-of-done).

## Additions from Debugging

Each item below exists because of a bug in the [debug log](#debug-log). Build all of them.

| Path | Purpose |
|---|---|
| `src/pages/api/session.ts` | `GET`: the signed-in visitor's own `{ id, firstName, email }` or `null`. Sends `Cache-Control: private, no-store` and `Vary: Cookie`. Prerendered pages use it to learn who is signed in. |
| `src/components/Header.astro` | Signed-in account menu: first name with ▾ on desktop, a panel with "Signed in as <email>", "Your account" and "Sign out". On mobile, the account icon opens the same panel and the menu gains "Sign out". Escape, an outside click, or tabbing away closes it. Only calls `/api/session` when a Supabase session cookie exists. |
| `src/scripts/bag.ts` | The bag records its owner (`null` for a guest). `syncBagOwner(userId)` empties the bag when its owner is no longer signed in or a different account signs in. A guest bag passes to the account that signs in. Bags saved before owners were recorded are discarded. `clearBag()` runs on every sign-out form. |
| `src/lib/server/forms.ts` | `safeNext()`: allows only same-site return paths and parses them the way a browser does. `confirmUrl()`: builds the `/account/confirm?next=…` address that every auth email call passes to Supabase as its redirect. |
| `src/pages/account/confirm.ts` | Accepts both `?token_hash=…&type=…` (branded templates) and `?code=…` (Supabase default templates). Sends failures to sign-in with a clear message. |
| `scripts/connect-supabase.mjs` | `npm run db:connect [-- --seed]`: links the hosted project named by `SUPABASE_URL`, applies migrations (and seed), pushes `[auth]` settings and templates, and fills in blank or mismatched keys in `.env`. If a free-tier project refuses custom templates, it retries without them. |
| `src/styles/global.css` | `--page-top-space` (1.75rem to 2.75rem), applied to `main > .section:first-child` on every page with a header; `admin.css` uses it too. |
| `tests/integration/auth.test.mjs` | Return-to-page, open-redirect payloads, wrong password, header shows only own identity, cross-customer order access, profile tampering, forged cookie, reuse of a signed-out cookie, customer on `/admin`. |
| `tests/unit/bag.test.mjs` | `npm run test:unit`: bag ownership scenarios (see the debug log). |

## Required Configuration

| Setting | Value | Why |
|---|---|---|
| Dev server port | `server.port: 4321` with `vite.server.strictPort: true` in `astro.config.mjs` | Auth email links point to `SITE_URL`. A silent move to 4322 breaks them. |
| Local Supabase ports | 554xx (`api` 55421, `db` 55422, `studio` 55423, Mailpit 55424, pooler 55429, shadow 55420) | The default 543xx ports clash with other local Supabase projects |
| `[auth] site_url` | `http://localhost:4321` locally; the production domain when live | The fallback target for email links |
| `[auth] additional_redirect_urls` | `http://localhost:4321/**`, `http://127.0.0.1:4321/**`; add `https://<domain>/account/confirm` for production | `confirmUrl()` redirects are refused unless they are listed |
| `[auth] minimum_password_length` | `8` | Matches `MIN_PASSWORD_LENGTH` |
| `[auth.email] enable_confirmations` | `true` | Verified email is required to claim guest orders |
| `.env` | Exactly one active `SUPABASE_URL`, with keys from the same project | Duplicate lines silently override each other |

## Debug Log

Every issue found so far, with its root cause and the fix that is now in the code. Each one has a matching check in the Definition of Done.

### Supabase and auth email

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| D1 | After sign-up, no email reaches Gmail and no user appears on supabase.com | `.env` pointed at the **local** stack. The user was in local Studio (55423) and the email in Mailpit (55424). The local stack never sends real email. | Documented. Use a hosted project via `npm run db:connect` to get real accounts and emails. |
| D2 | Confirmation link opens a 404 | Another process held port 4321, so `astro dev` silently moved to 4322 while email links still pointed to 4321 | Pinned the port with `strictPort`. `npm run dev` now fails instead of drifting. Free the port before starting. |
| D3 | Switching to another Supabase project by changing keys alone breaks the site | A new project has no tables, auth settings, redirect URLs or templates | `scripts/connect-supabase.mjs` sets up whichever project `SUPABASE_URL` names and corrects mismatched keys |
| D4 | Verification link goes to `http://localhost:3000/?code=…` ("site can't be reached") | Free-tier projects on the built-in sender reject custom email templates, and that rejected the **whole** auth config push, so Site URL stayed `localhost:3000` with no redirect URLs. The app also handled only `?token_hash=` links. | The connect script retries without templates. `confirm.ts` handles `?code=` as well. Sign-up, reset and magic link all pass `confirmUrl()` as the redirect. |
| D5 | A signed-up user has no `profiles` row | They signed up before the migrations ran, so the sign-up trigger did not exist yet | Run migrations before the first sign-up; backfill missing profile rows |
| D6 | The wrong Supabase project is used | `SUPABASE_URL` appeared twice in `.env` | Keep a single active line; comment out the other |
| D7 | `?code=` links fail when opened in another browser | Default-template links use PKCE and only work in the browser that started the flow | Expected. The error message explains it. Branded templates (custom SMTP) work in any browser. |

### Session, header and security

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| D8 | After sign-in, the home page still shows "Account" and there is no way to sign out | Storefront pages are prerendered and cannot know the session | `/api/session` (never cached) plus the header account menu with sign-out. Sign-in returns to the page the visitor came from. |
| D9 | `/account/sign-in?next=/%09/evil.com` sends the user to an outside site after sign-in | The old return-path check missed characters that browsers strip (tab, newline), which leaves `//evil.com` | `safeNext()` resolves the path with the URL parser and allows only the site's own origin. Tested with nine payloads (`//`, `\`, tab, newline, `javascript:` and others). |
| D10 | User 1's bag is visible after sign-out and to user 2 on the same browser | The `localStorage` bag had one fixed key and no owner | The bag records an owner; `syncBagOwner` and `clearBag` (see [Additions](#additions-from-debugging)). Trade-off: a bag no longer survives sign-out. Keeping it across devices would need a Supabase bag table with RLS. |

### Database and tests

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| D11 | `supabase db reset` appears to fail, then `db:test` times out with `DbConnectError` | Containers were still restarting, not a migration error | Wait until `docker ps` shows the containers healthy, retry, and only then debug the SQL. Run `npm run db:types` again after a successful reset. |
| D12 | One integration run fails right after a database restart | Same startup timing | Rerun after the stack is healthy. Treat a failure as real only if it repeats. |
| D13 | A pgTAP stock test fails | A temporary table in the test harness lacked a grant for the admin role | Grant the role in the test setup |
| D14 | `astro check` errors on `process.env` | Node types were missing | Add `@types/node` |
| D15 | `node --test tests/integration` fails on Node 22 | Node 22 needs a glob, not a directory | Use a quoted glob in npm scripts |
| D16 | `supabase start` port conflict | Another local Supabase project uses the default ports | 554xx ports in `supabase/config.toml` |

### Phase 1 Regressions

| # | Symptom | Fix |
|---|---|---|
| D17 | Homepage hero cropped away from 16:9 | Removed the height cap; exactly 16:9 at every width |
| D18 | Motion beyond what the brand allows | Removed smooth scrolling, the animated nav underline and the animated slideshow dot. Motion is limited to the card zoom, the slideshow cross-fade, the menu icon and button colour changes. |
| D19 | Logo almost touches the nav at 960–1000px | The logo scales down there, leaving at least 48px |
| D20 | Announcement bar wraps at 320px | Stays on one line |
| D21 | Skip-link focus outline gold on Cream (2.31:1) | Evergreen outline |
| D22 | Some buttons bypassed the shared component | Every button uses `Button.astro` |
| D23 | Our Story photo sat inside the page margins | Runs edge to edge at 3:2, directly on the section below, with no text over it |
| D24 | Too much space between the header and the content on Our Story and then on the policy, account, auth, order, contact, checkout and 404 pages | One `--page-top-space` token for every page; Home keeps its full-width hero |

### Publishing

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| D25 | `git commit` fails with "Author identity unknown" | No git name and email set on the machine | Set `user.name` and `user.email` for this repository only (`git config`, no `--global`) |
| D26 | `git push` fails with `HTTP 400` / "remote end hung up" | The pack (about 23 MB, mostly brand images) is larger than git's default HTTP buffer | `git config http.postBuffer 157286400` for this repository |
| D27 | Work pushed to the wrong repository | `origin` points at the template repository | Add the target as its own remote (for example `auth`) and push `main` to it; leave `origin` alone |

## Phase 2a Definition of Done

The Phase 1 and Phase 2 Definitions of Done still apply. Phase 2a is done when every check below passes. The `D` numbers refer to the debug log.

**Build and tooling**

- [ ] `npm run check` reports 0 errors and `npm run build` succeeds (D14).
- [ ] `npm run test:unit`, `npm run db:test` and `npm run test:integration` all pass, run only after every Supabase container reports healthy (D11, D12, D13, D15).
- [ ] `npm run db:types` was run after the last migration, and `database.types.ts` includes `p_tax_cents`.

**Environment and Supabase**

- [ ] Port 4321 is free and `npm run dev` serves on 4321. If the port is taken, startup fails instead of moving (D2).
- [ ] `.env` has exactly one active `SUPABASE_URL`, and its keys belong to that project (D6). You know whether it names the local stack or a hosted project, and where users and emails will appear (D1).
- [ ] For a hosted project, `npm run db:connect -- --seed` completed. The dashboard shows Site URL `http://localhost:4321` (or the production domain), the `/account/confirm` redirect URLs, and minimum password length 8, not Supabase's defaults (D3, D4).
- [ ] Migrations ran before the first sign-up, and every `auth.users` row has a `profiles` row (D5).

**Auth emails**

- [ ] Sign-up, password reset and magic-link emails all land on `/account/confirm` and finish on the intended page, with both the `?token_hash=` and the `?code=` link styles (D4).
- [ ] A `?code=` link opened in a different browser shows the expired-or-other-browser message, not an error page (D7).
- [ ] Before inviting anyone outside the Supabase organization, custom SMTP is configured and the branded templates are pushed.

**Session and security**

- [ ] On a prerendered page, the signed-in header shows the user's first name with an account menu that has sign-out, on desktop and mobile; it closes with Escape, an outside click and tabbing away (D8).
- [ ] `/api/session` returns only the caller's identity and sends `Cache-Control: private, no-store` (D8).
- [ ] Sign-in returns to the page the visitor started from, including after sign-up and email confirmation (D8).
- [ ] All nine open-redirect payloads in `auth.test.mjs` stay on the site (D9).
- [ ] Customer A cannot read customer B's orders or profile, a forged or signed-out cookie gets no session, and customers get "not found" on `/admin`.

**Bag**

- [ ] User 1 adds to the bag and signs out: the bag is empty for the signed-out visitor and for user 2 (D10).
- [ ] A session that ends without sign-out also empties the bag, and a different account signing in over an old session empties it (D10).
- [ ] A guest bag carries over to the account that signs in, and the owner keeps their bag across page loads (D10).

**Commerce** (still to be done end to end with a Stripe test key)

- [ ] The Phase 2 Stripe test-mode matrix passes with a real test key and `npm run stripe:listen`.
- [ ] One Pumpkin Chai shows subtotal $24, shipping $6, sales tax (3.25%) $0.78, total $30.78 in the bag and on the pending order, and Stripe charges the same tax.
- [ ] `npm run check:launch` lists only the processing time and the statement descriptor until those are confirmed, then passes.

**Layout regressions**

- [ ] D17–D24 still hold at 320, 375, 390, 430, 768 and 1440px. There is no horizontal overflow, and every page with a header starts `--page-top-space` below it.

**Publishing**

- [ ] The commit has an author identity, the push to the intended remote succeeds, and no `.env` or secret is in the commit (D25–D27).
