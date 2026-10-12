// Shared setup for integration tests against a local stack: `npm run db:start` and `npm run dev`.
// Run with `npm run test:integration` (reads .env). TEST_BASE_URL overrides the dev server address.
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const baseUrl = process.env.TEST_BASE_URL ?? 'http://localhost:4321';

const { SUPABASE_URL, SUPABASE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env;
if (!SUPABASE_URL?.includes('127.0.0.1') && !SUPABASE_URL?.includes('localhost')) {
  throw new Error('Integration tests only run against a local Supabase stack.');
}

export const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const stripe = new Stripe('sk_test_unused');

export async function setStock(slug, onHand) {
  const { error } = await db.from('inventory').upsert({ product_slug: slug, on_hand: onHand, reserved: 0 });
  if (error) throw error;
}

export async function cleanup(slug) {
  const { data: items } = await db.from('order_items').select('order_id').eq('product_slug', slug);
  const ids = [...new Set((items ?? []).map((i) => i.order_id))];
  if (ids.length) await db.from('orders').delete().in('id', ids);
  await db.from('inventory_movements').delete().eq('product_slug', slug);
  await db.from('inventory').delete().eq('product_slug', slug);
}

export async function pendingOrder(slug, quantity, sessionId) {
  const { data, error } = await db.rpc('create_pending_order', {
    p_user_id: null,
    p_email: null,
    p_items: [{ slug, name: 'Test candle', unit_price_cents: 2400, quantity }],
    p_shipping_cents: 600,
    p_tax_cents: 0,
    p_currency: 'usd',
    p_expires_at: new Date(Date.now() + 31 * 60_000).toISOString(),
  });
  if (error) throw error;
  if (sessionId) await db.from('orders').update({ stripe_checkout_session_id: sessionId }).eq('id', data.id);
  return data;
}

/** Posts a Stripe-signed event to the webhook, exactly as Stripe would. */
export async function sendEvent(type, object, { id = `evt_${crypto.randomUUID()}`, secret = STRIPE_WEBHOOK_SECRET } = {}) {
  const payload = JSON.stringify({ id, object: 'event', type, api_version: '2026-09-30.endive', data: { object } });
  const signature = stripe.webhooks.generateTestHeaderString({ payload, secret });
  const response = await fetch(`${baseUrl}/api/stripe/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Stripe-Signature': signature },
    body: payload,
  });
  return { status: response.status, body: await response.json().catch(() => null), id };
}

export async function order(id) {
  const { data } = await db.from('orders').select('*').eq('id', id).single();
  return data;
}

export async function stock(slug) {
  const { data } = await db.from('inventory').select('on_hand, reserved').eq('product_slug', slug).single();
  return data;
}
