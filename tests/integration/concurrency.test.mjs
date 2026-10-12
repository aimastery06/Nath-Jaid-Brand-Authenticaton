// Two people can't both buy the last candle: concurrent reservations for one unit, exactly one wins.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { cleanup, db, setStock, stock } from './helpers.mjs';

const slug = 'concurrency-test-candle';

before(() => setStock(slug, 1));
after(() => cleanup(slug));

test('only one of many simultaneous checkouts gets the last unit', async () => {
  const attempts = await Promise.all(
    Array.from({ length: 12 }, () =>
      db.rpc('create_pending_order', {
        p_user_id: null,
        p_email: null,
        p_items: [{ slug, name: 'Last one', unit_price_cents: 2400, quantity: 1 }],
        p_shipping_cents: 600,
    p_tax_cents: 0,
        p_currency: 'usd',
        p_expires_at: new Date(Date.now() + 31 * 60_000).toISOString(),
      }),
    ),
  );
  const won = attempts.filter((a) => !a.error);
  const lost = attempts.filter((a) => a.error);
  assert.equal(won.length, 1);
  assert.ok(lost.every((a) => a.error.message === 'insufficient_stock'));
  assert.deepEqual(await stock(slug), { on_hand: 1, reserved: 1 });
});
