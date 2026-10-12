// The Stripe webhook end to end: signature check, payment, duplicates, expiry, refunds, disputes.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { cleanup, order, pendingOrder, sendEvent, setStock, stock } from './helpers.mjs';

const slug = 'webhook-test-candle';

const session = (o, overrides = {}) => ({
  id: o.stripe_checkout_session_id,
  object: 'checkout.session',
  metadata: { order_id: o.id, order_number: o.number },
  payment_status: 'paid',
  payment_intent: `pi_${o.id.slice(0, 8)}`,
  customer: null,
  customer_details: { email: 'guest@example.com' },
  amount_subtotal: o.subtotal_cents,
  amount_total: o.total_cents,
  total_details: { amount_shipping: 600, amount_tax: 0, amount_discount: 0 },
  collected_information: {
    shipping_details: { name: 'Guest Shopper', address: { line1: '1 Main St', city: 'Austin', state: 'TX', postal_code: '78701', country: 'US' } },
  },
  ...overrides,
});

before(() => setStock(slug, 10));
after(() => cleanup(slug));

test('rejects events without a valid signature', async () => {
  const { status } = await sendEvent('checkout.session.completed', {}, { secret: 'whsec_wrong' });
  assert.equal(status, 400);
});

test('a completed checkout marks the order paid and takes stock once', async () => {
  const pending = await pendingOrder(slug, 2, `cs_test_paid_${Date.now()}`);
  const o = await order(pending.id);
  assert.deepEqual(await stock(slug), { on_hand: 10, reserved: 2 });

  const first = await sendEvent('checkout.session.completed', session(o));
  assert.equal(first.status, 200);

  const paid = await order(o.id);
  assert.equal(paid.status, 'paid');
  assert.equal(paid.email, 'guest@example.com');
  assert.equal(paid.shipping_address.city, 'Austin');
  assert.deepEqual(await stock(slug), { on_hand: 8, reserved: 0 });

  // Stripe redelivers the same event.
  const again = await sendEvent('checkout.session.completed', session(o), { id: first.id });
  assert.equal(again.status, 200);
  assert.equal(again.body.duplicate, true);
  // A different event for the same session is also harmless.
  await sendEvent('checkout.session.completed', session(o));
  assert.deepEqual(await stock(slug), { on_hand: 8, reserved: 0 });

  // Partial, then full refund.
  const charge = { id: 'ch_1', object: 'charge', payment_intent: paid.stripe_payment_intent_id, amount: paid.total_cents };
  await sendEvent('charge.refunded', { ...charge, amount_refunded: 1000 });
  assert.equal((await order(o.id)).status, 'partially_refunded');
  await sendEvent('charge.refunded', { ...charge, amount_refunded: paid.total_cents });
  const refunded = await order(o.id);
  assert.equal(refunded.status, 'refunded');
  assert.equal(refunded.amount_refunded_cents, paid.total_cents);

  // A dispute flags the order for a person.
  await sendEvent('charge.dispute.created', { id: 'dp_1', object: 'dispute', payment_intent: paid.stripe_payment_intent_id, reason: 'fraudulent', amount: 1000 });
  assert.equal((await order(o.id)).needs_attention, true);
});

test('an unpaid completed session waits; an expired session releases stock', async () => {
  const pending = await pendingOrder(slug, 3, `cs_test_expire_${Date.now()}`);
  const o = await order(pending.id);
  await sendEvent('checkout.session.completed', session(o, { payment_status: 'unpaid' }));
  assert.equal((await order(o.id)).status, 'pending_payment');

  const before = await stock(slug);
  await sendEvent('checkout.session.expired', session(o, { payment_status: 'unpaid' }));
  assert.equal((await order(o.id)).status, 'expired');
  assert.equal((await stock(slug)).reserved, before.reserved - 3);
});

test('links the session from metadata if the webhook beats the session update', async () => {
  const pending = await pendingOrder(slug, 1, null);
  const o = { ...(await order(pending.id)), stripe_checkout_session_id: `cs_test_race_${Date.now()}` };
  const { status } = await sendEvent('checkout.session.completed', session(o));
  assert.equal(status, 200);
  assert.equal((await order(o.id)).status, 'paid');
});

test('acknowledges sessions from other systems without failing', async () => {
  const { status } = await sendEvent('checkout.session.completed', { id: 'cs_test_foreign', object: 'checkout.session', metadata: {}, payment_status: 'paid' });
  assert.equal(status, 200);
});
