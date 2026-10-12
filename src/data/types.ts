import type { ImageMetadata } from 'astro';

export type CollectionStatus = 'active' | 'upcoming' | 'archived';

export interface ProductImage {
  src: ImageMetadata;
  alt: string;
}

export interface ScentMood {
  slug: string;
  name: string;
  /** Short customer cue shown on the scent-mood tiles. */
  cue: string;
}

export interface SharedSpecs {
  type: string;
  size: string;
  burnTime: string;
  wax: string;
  wicks: string;
}

export interface NoteStructure {
  top: string;
  heart: string;
  base: string;
}

export interface Product {
  slug: string;
  collection: string;
  name: string;
  price: number;
  /** First image is the primary image; extra images become gallery thumbnails. */
  images: ProductImage[];
  vessel: string;
  /** Vessel accent color (hex) used for swatches and slideshow dots. */
  accent: string;
  mood: string;
  shortNotes: string[];
  scentNotes: string[];
  notes: NoteStructure;
  moodLine: string;
  description: string;
  story: string;
}

export interface Collection {
  slug: string;
  /** Season slug from src/data/seasons.ts. */
  season: string;
  name: string;
  status: CollectionStatus;
  route: string;
  tagline: string;
  heroIntro: string;
  description: string;
  gridHeading: string;
  heroImage: ProductImage;
  specs: SharedSpecs;
  moods: ScentMood[];
  featured: string;
  /** Product slugs in display order. */
  products: string[];
}
