// Single entry point for collection and product data.
// To launch another season, add src/data/collections/<season>.ts and register it below.
import { fallCollection, fallProducts } from './collections/fall';
import type { Collection, Product, ScentMood } from './types';

export const collections: Collection[] = [fallCollection];

const allProducts: Product[] = [...fallProducts];

/** Collections shown on the website (active now; others stay documented only). */
export const liveCollections = collections.filter((c) => c.status === 'active');

export const activeCollection: Collection = (() => {
  const active = liveCollections[0];
  if (!active) throw new Error('No active collection is configured in src/data/catalog.ts.');
  return active;
})();

export const liveProducts: Product[] = liveCollections.flatMap((c) => getCollectionProducts(c));

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getCollectionProducts(collection: Collection): Product[] {
  return collection.products.map((slug) => {
    const product = getProduct(slug);
    if (!product) throw new Error(`Collection "${collection.slug}" lists unknown product "${slug}".`);
    return product;
  });
}

export function getMood(collection: Collection, slug: string): ScentMood {
  const mood = collection.moods.find((m) => m.slug === slug);
  if (!mood) throw new Error(`Collection "${collection.slug}" has no scent mood "${slug}".`);
  return mood;
}

export function getProductCollection(product: Product): Collection {
  const collection = getCollection(product.collection);
  if (!collection) throw new Error(`Product "${product.slug}" belongs to unknown collection "${product.collection}".`);
  return collection;
}

/** Products in a collection that carry a given mood (a mood may hold several candles). */
export function getMoodProducts(collection: Collection, moodSlug: string): Product[] {
  return getCollectionProducts(collection).filter((p) => p.mood === moodSlug);
}

export function productHref(product: Product): string {
  return `/products/${product.slug}`;
}

export function formatPrice(amount: number): string {
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

const listFormat = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

/** "spiced pumpkin, cinnamon bark, and vanilla cream" */
export function formatNoteList(notes: string[]): string {
  return listFormat.format(notes);
}

export function formatShortNotes(notes: string[]): string {
  return notes.join(' · ');
}
