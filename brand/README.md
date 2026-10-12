# NATH & JAID Brand

This directory holds all NATH & JAID company information and brand assets: identity, colors, type, voice, logo, products, and photography. Website scope and build rules live in [`../AGENT.md`](../AGENT.md), which points back here for every brand fact.

## Who We Are

**NATH & JAID** is a modern home-fragrance brand that creates candles inspired by seasons, memories, moods, and everyday moments.

The name is personal: **Jaid** is derived from **Jaiden** and is pronounced “Jayd.” The brand name is spoken as **“Nath and Jayd.”**

Rather than offering the same scents all year, the brand introduces focused collections for seasons and occasions such as Spring, Summer, Fall, Holiday, Valentine's Day, Mother's Day, and limited editions.

Our products are designed to make a room feel different the moment a candle is lit. We believe fragrance should be more than something that smells good. It should create a feeling.

## Mission

> **To transform everyday spaces through fragrances inspired by seasons, memories, and meaningful moments.**

NATH & JAID creates thoughtfully designed candles that make homes feel warmer, calmer, brighter, and more personal.

## Vision

To become a recognizable modern home-fragrance brand known for:

- memorable seasonal collections
- beautiful scent combinations
- premium but approachable products
- distinctive packaging
- emotionally driven storytelling
- highly anticipated product launches

Customers should look forward to each collection the way they anticipate a seasonal fashion release.

## Brand Promise

Every NATH & JAID product should deliver:

1. **A memorable fragrance** — scents with clear personalities rather than generic names.
2. **A beautiful object** — a candle that looks good even when it is not burning.
3. **A feeling** — a fragrance that evokes a place, season, mood, or memory.

## Brand Personality

NATH & JAID is:

- warm
- sophisticated
- calm
- sensory
- seasonal
- inviting
- modern
- thoughtful
- slightly playful
- premium without feeling exclusive

It should not feel corporate, overly luxurious, childish, overly feminine, rustic, cheap, cluttered, or driven by short-lived trends.

## Target Customer

The primary customer is approximately 22–45, enjoys home decor and seasonal rituals, buys candles or gifts, values wellness and cozy spaces, and discovers products through Instagram, TikTok, Pinterest, YouTube, and creators.

The brand may live in the premium home-fragrance and lifestyle space, but it must not directly imitate another company's identity.

## Company Details

| Detail | Value |
|---|---|
| Customer email | info@nathjaid.com |
| Complimentary shipping | Orders of $35 or more |
| Standard shipping (orders under $35) | $6 flat rate |
| Ships to | United States only |
| Processing time | Orders ship within 2–3 business days — **pending confirmation** |
| Currency | USD |
| Sales tax | 3.25% on candles, added at checkout (shipping is not taxed) |
| Legal business name | Nath & Jaid Fragrances |
| Card statement descriptor | `NATH JAID` (set in the Stripe Dashboard) — **pending confirmation** |
| Receipt and support email | info@nathjaid.com |

Values marked **pending confirmation** are working defaults so commerce can be built and tested. Confirm or replace each one before taking live payments; `npm run check:launch` fails while any remain.

## Directory Guide

- [`color.md`](./color.md) — approved colors and usage
- [`voice.md`](./voice.md) — brand voice, tagline, and copy examples
- [`typography.md`](./typography.md) — font system
- [`website-direction.md`](./website-direction.md) — website merchandising, layout, and interaction direction
- [`logo/`](./logo/) — approved logo files (website usage is defined in [`website-direction.md`](./website-direction.md#logo-usage-on-the-website))
- [`product/fall-collection.md`](./product/fall-collection.md) — Fall Collection products, scent moods, and status (active)
- [`product/summer-collection.md`](./product/summer-collection.md) — Summer Collection products (documented, not yet launched)
- [`product/FALL-IMAGE-GENERATION-PROMPTS.md`](./product/FALL-IMAGE-GENERATION-PROMPTS.md) and [`product/SUMMER-IMAGE-GENERATION-PROMPTS.md`](./product/SUMMER-IMAGE-GENERATION-PROMPTS.md) — prompts used to create the photography
- [`product/images/`](./product/images/) — product and campaign photography, with a file guide and naming rules
- [`policies/`](./policies/) — shipping, returns, privacy, and terms policies shown on the website

Update these files first; the website and [`../AGENT.md`](../AGENT.md) should then be brought in line with them.
