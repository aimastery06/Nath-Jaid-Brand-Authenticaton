// Applies verified Stripe events to orders and stock. Every handler is idempotent:
// the database functions ignore events that no longer apply, so retries and duplicates are harmless.
import type Stripe from 'stripe';
import { getServiceClient } from './supabase';

type Db = ReturnType<typeof getServiceClient>;

const idOf = (value: string | { id: string } | null | undefined) => (typeof value === 'string' ? value : value?.id ?? null);

/** Links the session to its order (normally done at creation) so lookups by session ID always succeed. */
async function linkSession(db: Db, session: Stripe.Checkout.Session): Promise<boolean> {
  const orderId = session.metadata?.order_id;
  if (!orderId) return false; // Not a NATH & JAID website checkout.
  await db
    .from('orders')
    .update({ stripe_checkout_session_id: session.id })
    .eq('id', orderId)
    .is('stripe_checkout_session_id', null);
  return true;
}

async function markPaid(db: Db, session: Stripe.Checkout.Session) {
  if (!(await linkSession(db, session))) return;
  const shipping = session.collected_information?.shipping_details ?? null;
  const { error } = await db.rpc('mark_order_paid', {
    p_session_id: session.id,
    p_payment_intent: idOf(session.payment_intent) as string,
    p_email: (session.customer_details?.email ?? null) as string,
    p_customer: idOf(session.customer) as string,
    p_subtotal_cents: session.amount_subtotal ?? 0,
    p_shipping_cents: session.total_details?.amount_shipping ?? 0,
    p_tax_cents: session.total_details?.amount_tax ?? 0,
    p_total_cents: session.amount_total ?? 0,
    p_shipping_name: (shipping?.name ?? null) as string,
    p_shipping_address: shipping ? { ...shipping.address } : null,
  });
  // An order this database doesn't know (another environment sharing the Stripe account): acknowledge it.
  if (error?.message === 'order_not_found') {
    console.warn(`Stripe session ${session.id} has no matching order; ignoring.`);
    return;
  }
  if (error) throw error;
}

async function expire(db: Db, session: Stripe.Checkout.Session, event: string) {
  if (!(await linkSession(db, session))) return;
  const { error } = await db.rpc('expire_order', { p_session_id: session.id, p_event: event });
  if (error) throw error;
}

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  const db = getServiceClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      // Card payments are confirmed here; delayed methods arrive as async_payment_succeeded.
      if (event.data.object.payment_status === 'paid') await markPaid(db, event.data.object);
      return;
    }
    case 'checkout.session.async_payment_succeeded':
      return markPaid(db, event.data.object);
    case 'checkout.session.async_payment_failed':
      return expire(db, event.data.object, 'payment_failed');
    case 'checkout.session.expired':
      return expire(db, event.data.object, 'expired');
    case 'charge.refunded': {
      const charge = event.data.object;
      const paymentIntent = idOf(charge.payment_intent);
      if (!paymentIntent) return;
      const { error } = await db.rpc('record_refund', {
        p_payment_intent: paymentIntent,
        p_amount_refunded: charge.amount_refunded,
      });
      if (error) throw error;
      return;
    }
    case 'charge.dispute.created': {
      const dispute = event.data.object;
      const paymentIntent = idOf(dispute.payment_intent);
      if (!paymentIntent) return;
      const { error } = await db.rpc('flag_order', {
        p_payment_intent: paymentIntent,
        p_type: 'dispute_opened',
        p_data: { dispute: dispute.id, reason: dispute.reason, amount_cents: dispute.amount },
      });
      if (error) throw error;
      return;
    }
    default:
      // Other events are acknowledged and ignored. Subscribe the endpoint only to the events above.
      return;
  }
}

/** Event types the Stripe webhook endpoint should send (Dashboard → Developers → Webhooks). */
export const handledEvents = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
  'charge.refunded',
  'charge.dispute.created',
] as const;
