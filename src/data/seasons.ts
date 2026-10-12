// Seasonal accent palette, transcribed from brand/color.md.
export interface Season {
  slug: string;
  name: string;
  accents: { name: string; hex: string }[];
}

export const seasons: Season[] = [
  {
    slug: 'spring',
    name: 'Spring',
    accents: [
      { name: 'Sage', hex: '#A8B59B' },
      { name: 'Soft Blush', hex: '#E7C7C0' },
    ],
  },
  {
    slug: 'summer',
    name: 'Summer',
    accents: [
      { name: 'Sunwashed Gold', hex: '#D7A84D' },
      { name: 'Soft Coral', hex: '#D9826B' },
    ],
  },
  {
    slug: 'fall',
    name: 'Fall',
    accents: [
      { name: 'Burnt Terracotta', hex: '#B65F43' },
      { name: 'Deep Amber', hex: '#A56A32' },
    ],
  },
  {
    slug: 'holiday',
    name: 'Holiday',
    accents: [
      { name: 'Deep Burgundy', hex: '#7A3037' },
      { name: 'Pine', hex: '#29483D' },
    ],
  },
];

export function getSeason(slug: string): Season | undefined {
  return seasons.find((s) => s.slug === slug);
}
