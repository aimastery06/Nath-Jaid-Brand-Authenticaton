// Transcribed from brand/product/fall-collection.md. Change that file first, then this one.
import hero from '../../../brand/product/images/fall/fall-collection-hero-v2.webp';
import pumpkinChai from '../../../brand/product/images/fall/pumpkin-chai-v2.webp';
import appleCiderHearth from '../../../brand/product/images/fall/apple-cider-hearth-v2.webp';
import vanillaAmber from '../../../brand/product/images/fall/vanilla-amber-v2.webp';
import cedarAndFig from '../../../brand/product/images/fall/cedar-and-fig-v2.webp';
import type { Collection, Product } from '../types';

const PRICE = 24;

export const fallCollection: Collection = {
  slug: 'fall',
  season: 'fall',
  name: 'The Fall Collection',
  status: 'active',
  route: '/collections/fall',
  tagline: 'The season for staying in.',
  heroIntro: 'Fall has arrived. Meet four scents made for cooler nights, warm drinks, and staying in.',
  description: 'Four fragrances inspired by crisp evenings, warm kitchens, falling leaves, and slow nights at home.',
  gridHeading: 'Four scents for cooler nights.',
  heroImage: {
    src: hero,
    alt: 'The four Fall Collection candles — Pumpkin Chai, Apple Cider Hearth, Vanilla Amber, and Cedar & Fig — on a pale travertine console in late-afternoon light, with Vanilla Amber lit in front among a cinnamon stick, vanilla pod, apple slice, fig, and cedar sprig.',
  },
  specs: {
    type: '3-wick candle',
    size: '14.5 oz / 411 g',
    burnTime: 'Approximately 40–50 hours',
    wax: 'Soy-blend wax',
    wicks: 'Three cotton wicks',
  },
  moods: [
    { slug: 'warm-and-spiced', name: 'Warm & Spiced', cue: 'Cozy spice, kitchen warmth, familiar fall rituals.' },
    { slug: 'fruity-and-bright', name: 'Fruity & Bright', cue: 'Crisp fruit, lively spice, fresh autumn afternoons.' },
    { slug: 'soft-and-comforting', name: 'Soft & Comforting', cue: 'Creamy warmth, calm evenings, understated sweetness.' },
    { slug: 'woody-and-grounded', name: 'Woody & Grounded', cue: 'Fig, woods, depth, and a quiet sophisticated finish.' },
  ],
  featured: 'vanilla-amber',
  products: ['pumpkin-chai', 'apple-cider-hearth', 'vanilla-amber', 'cedar-and-fig'],
};

export const fallProducts: Product[] = [
  {
    slug: 'pumpkin-chai',
    collection: 'fall',
    name: 'Pumpkin Chai',
    price: PRICE,
    images: [
      {
        src: pumpkinChai,
        alt: 'Pumpkin Chai three-wick candle in translucent burnt-terracotta glass on a travertine block, beside a cinnamon stick and a dried maple leaf.',
      },
    ],
    vessel: 'Translucent burnt terracotta',
    accent: '#B65F43',
    mood: 'warm-and-spiced',
    shortNotes: ['Pumpkin', 'Cinnamon', 'Vanilla'],
    scentNotes: ['spiced pumpkin', 'cinnamon bark', 'vanilla cream'],
    notes: { top: 'Spiced Pumpkin', heart: 'Cinnamon Bark', base: 'Vanilla Cream' },
    moodLine: 'Warm, comforting, cozy.',
    description: 'Spiced pumpkin, cinnamon bark, and smooth vanilla fill the room with everything we love about fall.',
    story: 'Made for the first cool evening when opening the windows suddenly feels like fall.',
  },
  {
    slug: 'apple-cider-hearth',
    collection: 'fall',
    name: 'Apple Cider Hearth',
    price: PRICE,
    images: [
      {
        src: appleCiderHearth,
        alt: 'Apple Cider Hearth three-wick candle in translucent honey-gold glass on a travertine block, beside an apple slice and two cloves.',
      },
    ],
    vessel: 'Translucent honey-gold',
    accent: '#A56A32',
    mood: 'fruity-and-bright',
    shortNotes: ['Apple', 'Cinnamon', 'Warm Woods'],
    scentNotes: ['crisp apple', 'cinnamon', 'clove', 'warm woods'],
    notes: { top: 'Crisp Apple', heart: 'Cinnamon and Clove', base: 'Warm Woods' },
    moodLine: 'A fresh fall afternoon moving into a cozy evening.',
    description: 'Crisp apple and warm spices settle into soft woods for a scent that feels like cider simmering in the kitchen.',
    story: 'Made for afternoons that begin outdoors and end beside a warm kitchen.',
  },
  {
    slug: 'vanilla-amber',
    collection: 'fall',
    name: 'Vanilla Amber',
    price: PRICE,
    images: [
      {
        src: vanillaAmber,
        alt: 'Vanilla Amber three-wick candle in translucent champagne-gold glass on a travertine block, beside a dried vanilla pod and a small gold stone.',
      },
    ],
    vessel: 'Translucent champagne gold',
    accent: '#C79A4A',
    mood: 'soft-and-comforting',
    shortNotes: ['Vanilla', 'Golden Amber', 'Sandalwood'],
    scentNotes: ['Madagascar vanilla', 'golden amber', 'sandalwood'],
    notes: { top: 'Madagascar Vanilla', heart: 'Golden Amber', base: 'Sandalwood' },
    moodLine: 'Warm, relaxing, understated.',
    description: 'Creamy vanilla meets golden amber and sandalwood for a warm fragrance made for slow evenings.',
    story: 'Soft light, a quiet room, and nowhere else to be.',
  },
  {
    slug: 'cedar-and-fig',
    collection: 'fall',
    name: 'Cedar & Fig',
    price: PRICE,
    images: [
      {
        src: cedarAndFig,
        alt: 'Cedar & Fig three-wick candle in translucent deep-evergreen glass on a travertine block, beside a halved fig and a cedar sprig.',
      },
    ],
    vessel: 'Translucent deep evergreen',
    accent: '#183F35',
    mood: 'woody-and-grounded',
    shortNotes: ['Fig', 'Cedarwood', 'Tonka Bean'],
    scentNotes: ['ripe fig', 'cedarwood', 'tonka bean'],
    notes: { top: 'Ripe Fig', heart: 'Cedarwood', base: 'Tonka Bean' },
    moodLine: 'Earthy, sophisticated, slightly mysterious.',
    description: 'Ripe fig softens into cedarwood and tonka bean for a rich scent with a quiet, woody finish.',
    story: 'A deep, grounded fragrance for nights that arrive a little earlier.',
  },
];
