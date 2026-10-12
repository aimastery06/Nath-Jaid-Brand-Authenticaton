// GET: stock state per live product ({ stock: { [slug]: 'in_stock' | 'low' | 'sold_out' } }). Never exact counts.
import type { APIRoute } from 'astro';
import { liveProducts } from '../../data/catalog';
import { commerceConfigured } from '../../lib/server/env';
import { getPublicClient } from '../../lib/server/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  // Without commerce configured, report nothing so the storefront behaves as in Phase 1.
  if (!commerceConfigured) return Response.json({ stock: {} });

  const { data, error } = await getPublicClient().rpc('get_availability');
  if (error) {
    console.error('Stock lookup failed', error);
    return Response.json({ stock: {} }, { status: 503 });
  }

  const known = new Map((data ?? []).map((row) => [row.product_slug, row.status]));
  // A live product without a stock row can't be bought yet.
  const stock = Object.fromEntries(liveProducts.map((p) => [p.slug, known.get(p.slug) ?? 'sold_out']));

  return Response.json(
    { stock },
    { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=60' } },
  );
};
