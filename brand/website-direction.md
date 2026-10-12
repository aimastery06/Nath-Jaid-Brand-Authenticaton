# NATH & JAID Website Direction

This document defines the approved structure of the Episode 1 (Fall Collection) website. Follow it page by page to reproduce the MVP. Scope and build rules live in [`AGENT.md`](../AGENT.md). Product and collection facts live in [`product/fall-collection.md`](./product/fall-collection.md); colors, type, and voice live in their own files in this folder.

## Design Objective

Create a seasonal home-fragrance shopping experience that combines:

- clear collection and product discovery
- calm, premium editorial presentation
- concise sensory storytelling
- a focused path from inspiration to product

The site should feel like NATH & JAID—not a replica of another candle or body-care retailer.

## Reference Principles

Two sites informed this direction:

- [Bath & Body Works](https://www.bathandbodyworks.com/) demonstrates strong seasonal merchandising, collection discovery, category organization, and repeated shopping opportunities.
- [Kindle & Bloom](https://kindleandbloomcandles.com/) demonstrates a quieter product-first presentation, concise copy, craftsmanship storytelling, and generous spacing.

Use these references only for high-level patterns. Do not copy their layouts, wording, typography, imagery, code, or recognizable visual trade dress.

## NATH & JAID Interpretation

NATH & JAID should combine the **clarity of a seasonal retailer** with the **restraint of an editorial fragrance brand**.

Prioritize:

- one seasonal campaign at a time
- large, believable product and lifestyle photography
- clear collection and product links
- short sensory copy
- generous whitespace
- limited promotional messaging
- consistent product-image proportions
- a small number of deliberate calls to action

Avoid:

- stacks of competing promotions
- discount-led brand positioning
- crowded category grids
- rotating messages that obscure the primary launch
- excessive badges, popups, shadows, gradients, and animation
- copying the exact composition of either reference site

## Site Map

| Page | Route | Purpose |
|---|---|---|
| Home | `/` | Campaign, discovery, brand statement, candle showcase |
| Collection | `/collections/fall` | The four candles only, with scent-mood filtering |
| Product | `/products/<slug>` | One template for every candle |
| Our Story | `/about` | Brand belief, mission, promise, seasonal approach |
| Contact | `/contact` | Simple contact form |
| Bag | `/bag` | Bag on the visitor's device, with checkout (Phase 2) |
| Checkout confirmation | `/checkout/success` | Order confirmation after Stripe Checkout (Phase 2) |
| Account | `/account`, `/account/orders/<number>` | Profile and orders (Phase 2) |
| Sign in, sign up, reset | `/account/sign-in`, `/account/sign-up`, `/account/reset-password`, `/account/update-password` | Authentication (Phase 2) |
| Policies | `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms` | From [`policies/`](./policies/) (Phase 2) |
| Admin | `/admin` | Private order and inventory management; not linked, not indexed (Phase 2) |
| Not found | 404 | Short message and a link to the collection |

Product slugs come from the product file: `pumpkin-chai`, `apple-cider-hearth`, `vanilla-amber`, `cedar-and-fig`.

## Global Layout

Every page uses, in order:

1. **Announcement bar** — Evergreen background, Cream text, one message: “Complimentary shipping on orders of $35 or more.” (threshold from [`README.md`](./README.md#company-details))
2. **Header** — sticky, Warm Cream background, thin bottom rule.
3. Page content.
4. **Newsletter band** — Soft Ivory background, shown on every page directly above the footer.
5. **Footer** — Evergreen background.

### Header and Navigation

Episode 1 navigation stays small, in this order:

- Home → `/`
- Shop → `/collections/fall#shop` (jumps to the candle grid)
- Collection → `/collections/fall` (labelled “Collection,” not “Fall Collection”)
- Our Story → `/about`
- Contact → `/contact`
- Bag → `/bag`, with an item count once something is added
- Account → `/account` (Phase 2), shown beside Bag rather than in the centered links

Do not add Search in the MVP. Introduce category menus only when those categories exist.

- **Desktop (≥ 960px):** logo left, links centered, Account and Bag right. The current page gets a thin Warm Gold underline.
- **Mobile:** menu button left, logo centered, Account and Bag icons right. Account also appears in the menu panel. The menu opens as a panel below the header with large serif links; Escape and link selection close it.

### Newsletter Band

- Eyebrow: “Early access”
- Heading: “Be the first to know when a new season arrives.”
- Text: “Join the list for early access to future collections and limited releases.”
- One labelled email field and a “Sign up” button, with inline validation and an on-page thank-you message.

### Footer

- Cream version of the full logo lockup, with “Light the moment.” beneath it.
- **Shop:** The Fall Collection and each of the four candles.
- **NATH & JAID:** Our Story, Contact, the customer email as a `mailto:` link, Bag.
- **Follow:** Instagram, TikTok, Pinterest, YouTube. Until official handles exist, link each to the platform homepage and open it in a new tab.
- Copyright line: “© [year] NATH & JAID. Seasonal candles & home fragrance.”
- **Help** (Phase 2): Shipping, Returns, Privacy, Terms, and Account.

## Homepage Structure

Use this order for the Episode 1 homepage:

1. **Seasonal hero** — the collection's hero image, its name as the eyebrow, its tagline as the headline, its hero intro as the supporting line, and one CTA, “Shop the collection.” (For Fall these come from [`product/fall-collection.md`](./product/fall-collection.md#campaign).) On wide screens (≥ 1024px), the copy sits in the photo's clean left-side negative space. On smaller screens, the image sits above the copy.
2. **Shop by scent mood** — Soft Ivory section, eyebrow “Find your [season]” (for example, “Find your fall”), with one tile per mood (see below).
3. **Collection grid** — the collection name as the eyebrow, its grid heading, its description, a card for every candle, and a text link, “Explore the collection.”
4. **Brand statement** — Evergreen section with the tagline “Light the moment.” set large, two short paragraphs (“We believe fragrance should be more than something that smells good. It should create a feeling.” and how a candle changes a room), and an “Our story” button.
5. **Featured candle slideshow** — all four candles, opening on the collection's featured candle (see below).

The homepage does **not** include a craft section, a seasonal-philosophy section, or a second campaign image. The seasonal story belongs on Our Story, and product specifications belong on product pages.

### Shop by Scent Mood

Use the active collection's scent moods, cues, and candles from its collection file (for Fall: [`product/fall-collection.md`](./product/fall-collection.md#scent-moods)).

Each tile shows a small dot in the candle's vessel accent color, the mood name, the cue, and the candle name. Each tile links to `/collections/fall?mood=<mood-slug>#shop`, which opens the collection page filtered to that mood. Tiles sit 2 × 2 on mobile and in one row of four on desktop; never make them scroll horizontally. The data must allow several candles per mood later.

### Featured Candle Slideshow

One slide per candle in the active collection, starting on the featured candle named in the collection file (Vanilla Amber for Fall). Each slide shows:

- the product image (4:5) beside the copy on desktop, above it on mobile
- an eyebrow with the scent mood
- the product name
- the product story, in the serif face
- the description
- Top / Heart / Base notes
- the price and one CTA, “Discover [candle name]”

Controls sit beneath the copy: previous and next arrows, a counter (e.g. “03 / 04”), and one dot per candle in its vessel color.

Rules:

- **Never auto-rotate.** Slides change only by arrow buttons, dots, keyboard arrow keys, or swipe.
- Slides cross-fade (about 0.5s); with reduced motion, they switch without the transition.
- Hidden slides must not be focusable, and each change is announced to screen readers (“2 of 4: Apple Cider Hearth”).

## Collection Page

Only the candles; no campaign image and no shared-specifications block.

1. Breadcrumb: Home / The Fall Collection
2. H1 “The Fall Collection” and the collection description
3. **Shop by scent mood** filter: “All” plus the four moods as pill buttons, with a short live count (“Showing 1 candle · Woody & Grounded”). The selected mood is kept in the `?mood=` URL parameter.
4. Product grid (anchor `#shop`): two columns below 1024px, four columns above.

### Product Card

The 4:5 product image, the name (serif) linking to the product page, the short notes joined with “ · ”, and the price. The whole card is clickable. On hover the image zooms very slightly (about 2.5%). No badges.

## Product Page

1. Breadcrumb: Home / The Fall Collection / [Candle]
2. Two columns on desktop, stacked on mobile:
   - **Gallery:** 4:5 primary image. Thumbnails appear automatically when a product has more than one approved image.
   - **Information:** eyebrow “The Fall Collection · [Scent mood]”, H1 product name, short notes, price, description, and a full-width “Add to bag — $24” button with an inline confirmation and a “View bag” link. Then:
     - **Scent notes:** Top / Heart / Base, plus “The feeling:” and the product's mood line.
     - **Details:** type, size, burn time, wax, wicks (shared specs), and the vessel description.
3. **The moment:** a centered Soft Ivory band with the product story in large serif type and the line “Notes of [full scent notes].”
4. **More for the season:** the other three candles as product cards.

## Our Story Page

1. **Intro:** eyebrow “Our Story,” H1 “Fragrance that creates a feeling.”, and a short lead describing the brand.
2. **Story image:** `product/images/our-story-hero` shown full width (3:2) directly below the intro, with no text over it. This is the page's only image.
3. **Fragrance for the moments you want to keep.:** Soft Ivory section with the heading in one column and, in the other, two short paragraphs about how the candles change a room and how each scent begins with a place, season, or memory, then the mission as a quote.
4. **Our promise:** “Every candle should offer three things.” The three points are a memorable fragrance, a beautiful object, and a feeling.
5. **Our approach:** Evergreen section, “A scent for every season.” It explains why collections change, includes the active collection's description and a list of seasons with their accent colors (Spring, Summer, Fall, Holiday), marks the active season “Now,” and ends with a “Shop the Fall Collection” button.

Do not feature the origin or pronunciation of the brand name on the website. The story image shows candles being poured; do not add copy claiming the candles are hand-poured unless that is verified and added to the brand files.

## Contact Page

Heading “We'd love to hear from you.” and the line “Questions about a scent, a gift, or the next collection? Send us a note.” The form fields are Name, Email address, an optional Topic (A question about a scent / Gifting / Something else), and Message, plus a “Send message” button. Below the intro, offer the customer email from [`README.md`](./README.md#company-details) as a `mailto:` link (“Prefer email? Write to info@nathjaid.com”). Do not show a phone number or address until one is confirmed.

## Bag

The bag is stored only in the visitor's browser. It shows each candle with its image, name, notes, quantity controls (up to 10, or fewer when less stock is available), a remove control, the line price, and a subtotal. When the bag is empty, show “Your bag is empty — for now.” and a link to the collection.

**Phase 2 summary:** subtotal; a shipping line (“Complimentary”, or the flat rate with a note that shipping is complimentary at the threshold); a sales-tax line; an estimated total; a full-width “Checkout” button; and a small line linking the Shipping and Returns policies. Checkout sends the visitor to Stripe Checkout. Stock and checkout messages use the copy in [`voice.md`](./voice.md#commerce-copy) and appear in a polite live region above the summary. Returning from a cancelled checkout shows “Your bag is just as you left it.”

## Stock States (Phase 2)

- **Sold out:** the product page button becomes a disabled “Sold out”; cards show a small muted “Sold out” line under the price. Sold-out candles stay visible — never hide a candle from the collection.
- **Low stock:** “Only a few left” in small muted text under the price. Never show exact counts.
- No badges, colored labels, or countdowns. Stock loads after the page and never shifts the layout.

## Checkout Confirmation (Phase 2)

A single calm column: eyebrow “Order [number]”, the heading from [`voice.md`](./voice.md#checkout), a short line saying a receipt is on its way to the customer's email, the items with quantities, and the totals. Guests see the account prompt with a “Create an account” button. Always end with a text link back to the collection.

## Account Pages (Phase 2)

- **Sign in / sign up / reset:** a single narrow column (max ~28rem) on Warm Cream with a serif heading, a short lead, and labelled fields following the accessibility baseline. Sign-in offers a password form and, below a thin rule, “Email me a sign-in link.” Keep links between sign-in, sign-up, and reset as small text links.
- **Account:** heading from [`voice.md`](./voice.md#accounts); an orders list (number, date, status label, total, and a link to details); a profile section with the name and email; sign-out; and a quiet “Request account deletion” link at the bottom.
- **Order detail:** order number as the H1; status label and line; tracking when shipped; items with thumbnails, quantities, and prices; subtotal, shipping, tax, and total; and the shipping address.
- Account pages share the global layout (announcement bar, header, newsletter band, footer).

## Admin (Phase 2)

Admin pages are for the team, not customers: plain, dense, readable tables on Soft Ivory using the same type and colors. They use the header and footer but not the newsletter band. Every destructive action (cancel, refund) asks for confirmation.

## Visual System

- **Section rhythm:** alternate Warm Cream, Soft Ivory, and Evergreen backgrounds so no two adjacent sections share a color. Evergreen is reserved for the announcement bar, the brand statement, Our approach, and the footer.
- **Contrast:** Warm Gold is for underlines, rules, small accents, and eyebrows on Evergreen only, never body text on Cream. Seasonal colors (Burnt Terracotta, Deep Amber, and others) appear as dots, borders, and vessel swatches, not as small text.
- **Type:** DM Serif Display for headings, product names, stories, and notes. Inter (400/500/600) for body text, UI, prices, and labels. Eyebrows are small uppercase Inter with wide letter-spacing; headings are not all-caps.
- **Buttons:** an Evergreen fill with Cream uppercase label, which inverts on hover. On Evergreen sections, use a Cream fill with an Evergreen label. Text links are uppercase with a Warm Gold underline.
- **Imagery:** product images are always 4:5 and campaign images 16:9, using only files from [`product/images/`](./product/images/). Load the hero image first; lazy-load the rest.
- **Motion:** limited to the card image zoom, slideshow cross-fades, the menu icon, and button color changes. Respect reduced-motion settings.

## Logo Usage on the Website

Approved logo files live in [`logo/`](./logo/). The MVP uses two of them:

| Placement | Source file | Treatment | Crop (SVG `viewBox`) |
|---|---|---|---|
| Header | `concept1-serif-wordmark-transparent.svg` | Evergreen wordmark with Gold ampersand. Keep only the first three `<path>` elements (the letters and ampersand); drop the “Candles · Home Fragrance” subline path and the two gold `<line>` rules, which are too small to read at header size | `124 208 950 148` |
| Footer | `concept1-serif-wordmark-on-evergreen-transparent.svg` | Full lockup in Cream on the Evergreen footer, unchanged | `124 208 950 216` |
| Favicon | `concept2-monogram-seal.svg` | Monogram seal cropped to the circle; replace the background rectangle with a Warm Cream tile (`rx="96"`) matching the crop | `216 96 468 468` |

Generate these crops from the source files at build time rather than editing the files in `logo/`.

The Concept 3 botanical files are not used in the MVP. [`logo/overview.png`](./logo/overview.png) shows all three concepts.

Rules:

- Use the Evergreen version on Warm Cream, Soft Ivory, or white backgrounds, and the Cream version on Evergreen.
- Keep clear space around the logo.
- Crop the approved SVGs only; never stretch, rotate, outline, add shadows, recolor, or redraw them.
- Do not place the logo over a busy image.
- Use the monogram seal only where the full name would be too small to read.

## Merchandising Rules

- Lead with the active seasonal collection rather than generic discounts.
- Give every homepage section one clear purpose.
- Use one primary CTA per editorial section.
- Keep product names, scent summaries, prices, and imagery consistent across cards, slides, and product pages.
- Make the four Fall candles visible without forcing visitors through several promotional blocks.
- Allow future categories such as room sprays, diffusers, soaps, body care, and gifts without displaying empty categories in the MVP.
- If promotional pricing is introduced later, present it clearly without making the entire brand feel discount-driven.

## Editorial Rules

- Product photography should carry the visual experience.
- Copy should describe the room, ritual, mood, or memory created by the fragrance.
- Keep paragraphs short and use descriptive headings.
- Alternate product grids with spacious editorial sections instead of filling the page with cards.
- Use subtle motion only when it improves orientation or feedback.

## Trust and Craftsmanship

The site may describe documented product facts such as:

- soy-blend wax
- three cotton wicks
- 14.5 oz / 411 g size
- approximately 40–50 hours of burn time

In Episode 1 these facts appear in the product-page Details table.

Do not invent claims about sustainability, testing, ingredient safety, sourcing, hand-pouring, regulatory compliance, cruelty-free status, or manufacturing location unless verified and added to the product source of truth.

## Mobile Direction

- Keep the announcement bar to one short line.
- Collapse navigation into the menu panel described above.
- Never auto-rotate the hero or the slideshow.
- Show product cards in two columns below 1024px.
- Lay scent-mood tiles out 2 × 2; do not use horizontal scrolling.
- Keep purchase actions prominent without a sticky or permanently obstructive bar.
- Verify layouts at 375, 390, 430, 768, and 1440px with no horizontal overflow.

## Accessibility Baseline

- One H1 per page, logical heading order, and a skip link to the main content.
- Visible focus states on every interactive element, using the Evergreen outline on light backgrounds and Cream on Evergreen.
- Labelled form fields, with error messages announced and focus moved to the first invalid field.
- Descriptive alt text for every product and campaign image.
- Touch targets of at least 44px for icon buttons, slideshow controls, and quantity steppers.

## Open Items Before Launch

- Connect the newsletter and contact forms to a provider (they currently confirm on the page only).
- Replace the social placeholder links with the official profiles.
- Confirm the values marked **pending confirmation** in [`README.md`](./README.md#company-details) and approve each policy in [`policies/`](./policies/) (`npm run check:launch` lists what remains).

## Final Test

Every design decision should support this statement:

> NATH & JAID makes seasonal fragrance easy to discover while preserving a calm, premium sense of place.
