# NATH & JAID Colors

Use these values consistently. Do not introduce arbitrary colors or redesign the entire website for each season.

## Core Palette

| Color | HEX | Primary use |
|---|---|---|
| Evergreen | `#183F35` | Logo, navigation, headings, primary buttons, footer, important UI |
| Warm Cream | `#F7F2E8` | Main page background, product sections, large editorial areas |
| Soft Ivory | `#FFFDF8` | Lighter secondary background and contrast areas |
| Charcoal | `#292824` | Primary body text instead of pure black |
| Warm Gold | `#C79A4A` | Small highlights, icons, badges, and premium details |

### Usage Notes

- Evergreen is the primary brand color and represents nature, calm, sophistication, and permanence.
- Warm Cream should be the dominant background. Avoid using pure white as the main background.
- Warm Gold is an accent only. Do not make it the main interface color.
- Maintain sufficient text and control contrast for accessibility.

## Seasonal Accent Palette

| Collection | Color | HEX |
|---|---|---|
| Spring | Sage | `#A8B59B` |
| Spring | Soft Blush | `#E7C7C0` |
| Summer | Sunwashed Gold | `#D7A84D` |
| Summer | Soft Coral | `#D9826B` |
| Fall | Burnt Terracotta | `#B65F43` |
| Fall | Deep Amber | `#A56A32` |
| Holiday / Winter | Deep Burgundy | `#7A3037` |
| Holiday / Winter | Pine | `#29483D` |

Seasonal colors complement the core palette. Evergreen, Warm Cream, Soft Ivory, and Charcoal should keep the brand recognizable across collections.

## Suggested CSS Tokens

```css
:root {
  --color-evergreen: #183F35;
  --color-warm-cream: #F7F2E8;
  --color-soft-ivory: #FFFDF8;
  --color-charcoal: #292824;
  --color-warm-gold: #C79A4A;
  --color-fall-terracotta: #B65F43;
  --color-fall-amber: #A56A32;
}
```
