// Transcribed from brand/README.md (company details, mission, promise) and brand/voice.md (tagline).
export const company = {
  name: 'NATH & JAID',
  email: 'info@nathjaid.com',
  freeShippingThreshold: 35,
  // Commerce details (brand/README.md, Company Details). Values marked pending there are working defaults.
  currency: 'usd',
  shipping: {
    flatRate: 6,
    /** ISO country codes Stripe Checkout accepts for shipping addresses. */
    countries: ['US'] as const,
  },
  /** Sales tax on candles (not shipping), applied at checkout as a Stripe tax rate. 0 turns it off. */
  salesTaxPercent: 3.25,
  tagline: 'Light the moment.',
  descriptor: 'Seasonal candles & home fragrance',
  mission: 'To transform everyday spaces through fragrances inspired by seasons, memories, and meaningful moments.',
  promise: [
    { title: 'A memorable fragrance', text: 'Scents with clear personalities rather than generic names.' },
    { title: 'A beautiful object', text: 'A candle that looks good even when it is not burning.' },
    { title: 'A feeling', text: 'A fragrance that evokes a place, season, mood, or memory.' },
  ],
};
