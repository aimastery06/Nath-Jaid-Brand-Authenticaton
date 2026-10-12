-- Stock reservation, payment, expiry, refunds, and cancellation. Run with `npm run db:test`.
begin;
select plan(27);

insert into public.inventory (product_slug, on_hand, low_stock_threshold) values
  ('test-candle', 3, 1),
  ('test-plenty', 50, 5);

insert into auth.users (id, email, email_confirmed_at, raw_app_meta_data, aud, role) values
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', now(), '{"role":"admin"}', 'authenticated', 'authenticated');

create temp table t (key text primary key, id uuid);
grant select on t to authenticated;

-- Reserve
insert into t
select 'first', (public.create_pending_order(
  null, 'guest@example.com',
  '[{"slug":"test-candle","name":"Test","unit_price_cents":2400,"quantity":2}]'::jsonb,
  600, 156, 'usd', now() + interval '30 minutes'
)).id;

select is((select reserved from public.inventory where product_slug = 'test-candle'), 2, 'Checkout reserves stock');
select is((select subtotal_cents from public.orders where id = (select id from t where key = 'first')), 4800, 'Subtotal is computed from item snapshots');
select is((select total_cents from public.orders where id = (select id from t where key = 'first')), 5556, 'Total includes shipping and tax');
select is((select status from public.get_availability() where product_slug = 'test-candle'), 'low', 'One left reads as low stock');

select throws_ok(
  $$select public.create_pending_order(null, null,
    '[{"slug":"test-candle","name":"Test","unit_price_cents":2400,"quantity":2}]'::jsonb, 0, 0, 'usd', now())$$,
  'P0001', 'insufficient_stock', 'Checkout cannot reserve more than is available'
);
select throws_ok(
  $$select public.create_pending_order(null, null,
    '[{"slug":"not-stocked","name":"Nope","unit_price_cents":2400,"quantity":1}]'::jsonb, 0, 0, 'usd', now())$$,
  'P0001', 'insufficient_stock', 'Products without a stock row cannot be bought'
);

-- Pay
update public.orders set stripe_checkout_session_id = 'cs_first' where id = (select id from t where key = 'first');
select is(
  public.mark_order_paid('cs_first', 'pi_first', 'guest@example.com', 'cus_1', 4800, 600, 0, 5400, 'Guest', '{"city":"Austin"}'),
  'paid'::public.order_status, 'Payment marks the order paid'
);
select is((select on_hand from public.inventory where product_slug = 'test-candle'), 1, 'Payment takes stock from on hand');
select is((select reserved from public.inventory where product_slug = 'test-candle'), 0, 'Payment releases the reservation');
select is((select sum(delta)::int from public.inventory_movements where product_slug = 'test-candle'), -2, 'A sale movement is logged');
select is(
  public.mark_order_paid('cs_first', 'pi_first', 'guest@example.com', 'cus_1', 4800, 600, 0, 5400, 'Guest', '{}'),
  'paid'::public.order_status, 'A duplicate payment event is harmless'
);
select is((select on_hand from public.inventory where product_slug = 'test-candle'), 1, 'A duplicate payment event does not take stock twice');

-- Expire
insert into t
select 'second', (public.create_pending_order(
  null, null, '[{"slug":"test-candle","name":"Test","unit_price_cents":2400,"quantity":1}]'::jsonb, 0, 0, 'usd', now()
)).id;
update public.orders set stripe_checkout_session_id = 'cs_second' where id = (select id from t where key = 'second');
select is((select status from public.get_availability() where product_slug = 'test-candle'), 'sold_out', 'A fully reserved product reads as sold out');
select is(public.expire_order('cs_second'), 'expired'::public.order_status, 'An expired session expires the order');
select is((select reserved from public.inventory where product_slug = 'test-candle'), 0, 'Expiry releases the reservation');
select is(public.expire_order('cs_second'), 'expired'::public.order_status, 'A duplicate expiry event is harmless');
select is((select reserved from public.inventory where product_slug = 'test-candle'), 0, 'A duplicate expiry does not release twice');

-- Stale reservations
insert into t
select 'stale', (public.create_pending_order(
  null, null, '[{"slug":"test-plenty","name":"Plenty","unit_price_cents":2400,"quantity":4}]'::jsonb, 0, 0, 'usd',
  now() - interval '2 hours'
)).id;
select is(public.release_stale_reservations(), 1, 'Reservations long past expiry are released');
select is((select reserved from public.inventory where product_slug = 'test-plenty'), 0, 'The stale reservation no longer holds stock');

-- Refunds
select is(public.record_refund('pi_first', 1000), 'partially_refunded'::public.order_status, 'A partial refund is recorded');
select is(public.record_refund('pi_first', 5400), 'refunded'::public.order_status, 'A full refund is recorded');

-- Admin cancellation of a paid order restocks it once
insert into t
select 'third', (public.create_pending_order(
  null, null, '[{"slug":"test-plenty","name":"Plenty","unit_price_cents":2400,"quantity":5}]'::jsonb, 0, 0, 'usd', now()
)).id;
update public.orders set stripe_checkout_session_id = 'cs_third' where id = (select id from t where key = 'third');
select public.mark_order_paid('cs_third', 'pi_third', 'x@example.com', null, 12000, 0, 0, 12000, null, null);
select is((select on_hand from public.inventory where product_slug = 'test-plenty'), 45, 'Paid stock leaves on hand');

set local role authenticated;
set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated","app_metadata":{"role":"admin"}}';
select lives_ok(format('select public.admin_cancel_order(%L, %L)', (select id from t where key = 'third'), 're_1'), 'An admin can cancel a paid order');
select is((select on_hand from public.inventory where product_slug = 'test-plenty'), 50, 'Cancellation returns stock');
select lives_ok(format('select public.admin_restock_order(%L)', (select id from t where key = 'third')), 'Restocking twice is allowed');
select is((select on_hand from public.inventory where product_slug = 'test-plenty'), 50, 'but returns stock only once');
select throws_ok(
  $$select public.admin_set_stock('test-plenty', -1, 5, 'adjustment')$$,
  '23514', null, 'Stock cannot go negative'
);
reset role;

select * from finish();
rollback;
