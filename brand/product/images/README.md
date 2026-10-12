# Product Images

All approved product and campaign photography lives in this folder, organized by collection: [`fall/`](./fall/) and [`summer/`](./summer/). The website imports images directly from here and generates optimized sizes at build time, so do not copy them elsewhere.

## Current Files

Each image has a `.webp` (used by the website) and a `.png` (high-quality source).

### This folder — brand images (not tied to a collection)

| File | Use | Alt text |
|---|---|---|
| `our-story-hero` | Our Story page image (3:2) | Two people in linen aprons pouring creamy wax into amber glass vessels and setting wicks at a stone counter, with a finished NATH & JAID candle, spices, and autumn leaves nearby. |

### [`fall/`](./fall/) — Fall Collection, active

| File | Use |
|---|---|
| `fall-collection-hero-v2` | Homepage hero (16:9) |
| `pumpkin-chai-v2` | Pumpkin Chai product image (4:5) |
| `apple-cider-hearth-v2` | Apple Cider Hearth product image (4:5) |
| `vanilla-amber-v2` | Vanilla Amber product image (4:5) |
| `cedar-and-fig-v2` | Cedar & Fig product image (4:5) |

### [`summer/`](./summer/) — Summer Collection, not yet on the website

| File | Use |
|---|---|
| `summer-collection-hero` | Collection hero (16:9) |
| `citrus-grove-01` | Citrus Grove product image (4:5) |
| `coconut-linen-01` | Coconut Linen product image (4:5) |
| `peach-hibiscus-01` | Peach Hibiscus product image (4:5) |
| `sea-salt-neroli-01` | Sea Salt Neroli product image (4:5) |

Each collection file in [`../`](../) names its hero and primary images; keep those paths in sync with this folder.

## Naming New Images

- Put every collection image in its collection's folder, e.g. `spring/` for a Spring Collection. Brand images that belong to no collection stay in this folder, named by page (e.g. `our-story-hero`).
- Collection hero: `<season>/<season>-collection-hero.webp`
- Product images: `<season>/<product-slug>-<nn>.webp`, where `01` is the primary image and `02`, `03` are extra gallery images.
- A replacement version adds a suffix (for example `-v2`); update the collection file to point to it.

Extra gallery images appear on the product page automatically once they are added to the product data.

## Photography Direction

- warm natural lighting
- realistic candle wax and flame
- tasteful interiors
- wood, stone, and linen surfaces
- restrained seasonal elements
- shallow depth of field
- subtle shadows
- consistent vessel, label, and logo treatment across products

Avoid artificial-looking renders, oversaturated colors, busy backgrounds, generic stock imagery, and visible AI artifacts.

Prompts used to create the current images are in [`../FALL-IMAGE-GENERATION-PROMPTS.md`](../FALL-IMAGE-GENERATION-PROMPTS.md) (Fall) and [`../SUMMER-IMAGE-GENERATION-PROMPTS.md`](../SUMMER-IMAGE-GENERATION-PROMPTS.md) (Summer).

## Delivery Guidance

- Product images are 4:5 portrait; campaign heroes are 16:9 with clean negative space on the left for the headline.
- Provide WebP (or AVIF) for the website and keep a high-quality source alongside it.
- Write useful alt text for every image in the product data. Fall product and hero alt text lives in [`../fall-collection.md`](../fall-collection.md); brand-image alt text lives in the table above.
- Do not add unapproved or temporary images without clearly marking them as placeholders.
