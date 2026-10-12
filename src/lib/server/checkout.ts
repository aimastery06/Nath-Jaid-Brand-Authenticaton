// Creates a pending order and a Stripe Checkout Session from bag contents.
// Prices come from src/data/ only; the browser sends slugs and quantities.
import type { User } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import { getProduct, liveProducts } from '../../data/catalog';
import { company } from '../../data/company';
import { MAX_QUANTITY } from '../../scripts/bag';
import { lineTaxCents, shippingCents, toCents } from '../commerce';
import { getStripe, salesTaxRateId } from './stripe';
import { getServiceClient } from './supabase';

export interface BagLine {
  slug: string;
  quantity: number;
}

export interface Shortage {
  slug: string;
  name: string;
  available: number;
}

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: 'invalid_bag' | 'insufficient_stock' | 'rate_limited' | 'unavailable'; shortages?: Shortage[] };

/** Session lifetime. Stripe requires at least 30 minutes; the extra minute absorbs clock skew. */
const SESSION_SECONDS = 31 * 60;

const liveSlugs = new Set(liveProducts.map((p) => p.slug));

/** Validates untrusted input into merged bag lines, or null when anything is off. */
export function parseBag(input: unknown): BagLine[] | null {
  if (!input || typeof input !== 'object' || !Array.isArray((input as { items?: unknown }).items)) return null;
  const items = (input as { items: unknown[] }).items;
  if (items.length === 0 || items.length > liveSlugs.size) return null;

  const merged = new Map<string, number>();
  for (const item of items) {
    if (!item || typeof item !== 'object') return null;
    const { slug, quantity } = item as { slug?: unknown; quantity?: unknown };
    if (typeof slug !== 'string' || !liveSlugs.has(slug)) return null;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) return null;
    merged.set(slug, (merged.get(slug) ?? 0) + quantity);
  }
  if ([...merged.values()].some((q) => q > MAX_QUANTITY)) return null;
  return [...merged].map(([slug, quantity]) => ({ slug, quantity }));
}

async function hashKey(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Reuses or creates the signed-in customer's Stripe Customer so Checkout can prefill their details. */
async function stripeCustomerFor(user: User): Promise<string> {
  const db = getServiceClient();
  const { data: profile } = await db.from('profiles').select('stripe_customer_id, full_name').eq('id', user.id).single();
  if (profile?.stripe_customer_id) return profile.stripe_customer_id;

  const customer = await getStripe().customers.create(
    { email: user.email, name: profile?.full_name ?? undefined, metadata: { supabase_user_id: user.id } },
    { idempotencyKey: `customer-${user.id}` },
  );
  await db.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id);
  return customer.id;
}

export async function startCheckout(options: {
  lines: BagLine[];
  user: User | null;
  origin: string;
  clientKey: string;
}): Promise<CheckoutResult> {
  const { lines, user, origin } = options;
  const db = getServiceClient();

  const { data: allowed } = await db.rpc('hit_rate_limit', {
    p_key: `checkout:${await hashKey(options.clientKey)}`,
    p_limit: 10,
    p_window_seconds: 600,
  });
  if (allowed === false) return { ok: false, status: 429, error: 'rate_limited' };

  // Safety net for missed expiry webhooks.
  await db.rpc('release_stale_reservations');

  const items = lines.map(({ slug, quantity }) => {
    const product = getProduct(slug)!;
    return { slug, name: product.name, unit_price_cents: toCents(product.price), quantity, product };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unit_price_cents * item.quantity, 0);
  const shipping = shippingCents(subtotal);
  // Estimate stored with the pending order; the webhook replaces it with Stripe's amount.
  const tax = items.reduce((sum, item) => sum + lineTaxCents(item.unit_price_cents * item.quantity), 0);
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;

  const { data: order, error } = await db.rpc('create_pending_order', {
    p_user_id: user?.id ?? (null as unknown as string),
    p_email: user?.email ?? (null as unknown as string),
    p_items: items.map(({ product: _product, ...item }) => item),
    p_shipping_cents: shipping,
    p_tax_cents: tax,
    p_currency: company.currency,
    p_expires_at: new Date(expiresAt * 1000).toISOString(),
  });

  if (error) {
    if (error.message === 'insufficient_stock') {
      const short = JSON.parse(error.details || '[]') as { slug: string; available: number }[];
      return {
        ok: false,
        status: 409,
        error: 'insufficient_stock',
        shortages: short.map(({ slug, available }) => ({ slug, available, name: getProduct(slug)?.name ?? slug })),
      };
    }
    throw error;
  }

  try {
    const stripe = getStripe();
    const customer = user ? await stripeCustomerFor(user) : undefined;
    const taxRate = await salesTaxRateId(company.salesTaxPercent);
    // Stripe fetches product images itself, so only send them from a public https origin.
    const imageUrl = (src: string) => (origin.startsWith('https://') ? [new URL(src, origin).href] : undefined);

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: items.map((item) => ({
        quantity: item.quantity,
        tax_rates: taxRate ? [taxRate] : undefined,
        price_data: {
          currency: company.currency,
          unit_amount: item.unit_price_cents,
          product_data: {
            name: item.name,
            images: item.product.images[0] ? imageUrl(item.product.images[0].src.src) : undefined,
            metadata: { slug: item.slug },
          },
        },
      })),
      allowed_payment_method_types: ['card'],
      shipping_address_collection: { allowed_countries: [...company.shipping.countries] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: shipping === 0 ? 'Complimentary shipping' : 'Standard shipping',
            fixed_amount: { amount: shipping, currency: company.currency },
          },
        },
      ],
      ...(customer ? { customer, customer_update: { shipping: 'auto', name: 'auto' } } : {}),
      client_reference_id: order.id,
      metadata: { order_id: order.id, order_number: order.number },
      payment_intent_data: { metadata: { order_id: order.id, order_number: order.number } },
      expires_at: expiresAt,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/bag?checkout=cancelled`,
    };

    const session = await stripe.checkout.sessions.create(params, { idempotencyKey: `checkout-${order.id}` });
    await db.from('orders').update({ stripe_checkout_session_id: session.id }).eq('id', order.id);
    if (!session.url) throw new Error('Stripe returned a Checkout Session without a URL.');
    return { ok: true, url: session.url };
  } catch (cause) {
    // Give the stock back if Stripe could not start the session.
    await db.rpc('abandon_pending_order', { p_order_id: order.id });
    throw cause;
  }
}
