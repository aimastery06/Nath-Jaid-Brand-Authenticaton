-- Row Level Security: customers see only their own data, anonymous visitors see none,
-- and clients cannot write orders or stock directly. Run with `npm run db:test`.
begin;
select plan(20);

insert into auth.users (id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role) values
  ('11111111-1111-1111-1111-111111111111', 'ana@example.com', now(), '{}', '{"full_name":"Ana"}', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'ben@example.com', now(), '{}', '{}', 'authenticated', 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', now(), '{"role":"admin"}', '{}', 'authenticated', 'authenticated'),
  ('44444444-4444-4444-4444-444444444444', 'unverified@example.com', null, '{}', '{}', 'authenticated', 'authenticated');

insert into public.orders (id, user_id, email, status, subtotal_cents, total_cents) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'ana@example.com', 'paid', 2400, 2400),
  ('aaaaaaaa-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'ben@example.com', 'paid', 2400, 2400),
  ('aaaaaaaa-0000-0000-0000-000000000003', null, 'ANA@example.com', 'paid', 4800, 4800),
  ('aaaaaaaa-0000-0000-0000-000000000004', null, 'unverified@example.com', 'paid', 2400, 2400);

insert into public.order_items (order_id, product_slug, name, unit_price_cents, quantity) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'pumpkin-chai', 'Pumpkin Chai', 2400, 1),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'vanilla-amber', 'Vanilla Amber', 2400, 1),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'cedar-and-fig', 'Cedar & Fig', 2400, 2);

select is(
  (select full_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Ana',
  'A profile is created with the user'
);

-- Anonymous visitors
set local role anon;
select throws_ok('select count(*) from public.orders', '42501', null, 'Anonymous visitors cannot read orders');
select throws_ok('select count(*) from public.inventory', '42501', null, 'Anonymous visitors cannot read raw stock');
select lives_ok('select * from public.get_availability()', 'Anonymous visitors can read stock states');
select throws_ok(
  $$select public.create_pending_order(null, null, '[]'::jsonb, 0, 0, 'usd', now())$$,
  '42501', null, 'Anonymous visitors cannot create orders'
);
reset role;

-- A signed-in customer
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated","app_metadata":{}}';

select is((select count(*)::int from public.orders), 1, 'A customer sees only their own orders');
select is((select count(*)::int from public.order_items), 1, 'A customer sees only their own order items');
select is((select count(*)::int from public.profiles), 1, 'A customer sees only their own profile');
select is((select count(*)::int from public.inventory), 0, 'A customer cannot read raw stock');
select is((select count(*)::int from public.order_events), 0, 'A customer cannot read the order audit trail');
select throws_ok(
  $$insert into public.orders (email, subtotal_cents, total_cents) values ('x@example.com', 1, 1)$$,
  '42501', null, 'A customer cannot insert orders'
);
select throws_ok($$update public.orders set status = 'refunded'$$, '42501', null, 'A customer cannot change orders');
select lives_ok($$update public.profiles set full_name = 'Ana B.'$$, 'A customer can change their name');
select throws_ok(
  $$update public.profiles set stripe_customer_id = 'cus_x'$$,
  '42501', null, 'A customer cannot change other profile columns'
);
select throws_ok(
  $$select public.admin_set_stock('pumpkin-chai', 1, 1, 'restock')$$,
  '42501', 'admin_only', 'A customer cannot use admin functions'
);
select is(public.claim_guest_orders(), 1, 'Guest orders with the verified email are claimed (case-insensitive)');
select is((select count(*)::int from public.orders), 2, 'Claimed orders appear in the account');

-- An unverified account cannot claim orders placed with its email
set local request.jwt.claims = '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated","app_metadata":{}}';
select is(public.claim_guest_orders(), 0, 'An unverified email claims nothing');

-- An admin
set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated","app_metadata":{"role":"admin"}}';
select is((select count(*)::int from public.orders), 4, 'An admin reads every order');
select lives_ok($$select public.admin_set_stock('rls-test-candle', 5, 2, 'restock', 'opening stock')$$, 'An admin can set stock');
reset role;

select * from finish();
rollback;
