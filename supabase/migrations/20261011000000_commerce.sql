-- NATH & JAID commerce schema (AGENT.md, "Phase 2 — Commerce" → "Data Model").
-- Product facts (names, prices) live in src/data/. This schema stores only operational data
-- keyed by product slug: stock, orders, customers, and the Stripe webhook log.

-- ---------------------------------------------------------------------------
-- Types and helpers
-- ---------------------------------------------------------------------------

create type public.order_status as enum (
  'pending_payment',
  'paid',
  'fulfilled',
  'expired',
  'cancelled',
  'refunded',
  'partially_refunded'
);

create type public.stock_reason as enum ('restock', 'sale', 'cancel', 'adjustment');

-- Admins carry app_metadata.role = 'admin', which users cannot edit themselves.
create function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (char_length(full_name) <= 120),
  stripe_customer_id text unique,
  deletion_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory (
  product_slug text primary key check (product_slug ~ '^[a-z0-9-]+$'),
  on_hand integer not null default 0 check (on_hand >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now(),
  constraint reserved_within_on_hand check (reserved <= on_hand)
);

create sequence public.order_number_seq start with 100001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique default ('NJ-' || nextval('public.order_number_seq')),
  -- Kept when an account is deleted: order records must remain.
  user_id uuid references auth.users (id) on delete set null,
  email text,
  status public.order_status not null default 'pending_payment',
  currency text not null default 'usd',
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  amount_refunded_cents integer not null default 0 check (amount_refunded_cents >= 0),
  shipping_name text,
  shipping_address jsonb,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  stripe_customer_id text,
  reservation_expires_at timestamptz,
  paid_at timestamptz,
  fulfilled_at timestamptz,
  cancelled_at timestamptz,
  restocked_at timestamptz,
  carrier text,
  tracking_number text,
  needs_attention boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status, created_at desc);
create index orders_email_idx on public.orders (lower(email));

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text not null,
  -- Snapshots taken at purchase; prices and names in src/data/ may change later.
  name text not null,
  unit_price_cents integer not null check (unit_price_cents > 0),
  quantity integer not null check (quantity between 1 and 10),
  unique (order_id, product_slug)
);

create table public.inventory_movements (
  id bigint generated always as identity primary key,
  product_slug text not null references public.inventory (product_slug),
  delta integer not null check (delta <> 0),
  reason public.stock_reason not null,
  order_id uuid references public.orders (id) on delete set null,
  actor_id uuid references auth.users (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index inventory_movements_slug_idx on public.inventory_movements (product_slug, created_at desc);

create table public.order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  type text not null,
  data jsonb not null default '{}'::jsonb,
  actor_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index order_events_order_idx on public.order_events (order_id, created_at);

-- Stripe webhook idempotency: an event ID is recorded once it has been processed.
create table public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

create table public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 0
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger inventory_updated_at before update on public.inventory
  for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- Profiles are created with the user.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.inventory enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;
alter table public.stripe_events enable row level security;
alter table public.rate_limits enable row level security;

-- Clients only read. Every write goes through server code (service role) or the functions below.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

grant select on public.profiles, public.orders, public.order_items to authenticated;
grant select on public.inventory, public.inventory_movements, public.order_events to authenticated;
grant update (full_name) on public.profiles to authenticated;

create policy "Customers read their own profile; admins read all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create policy "Customers update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Customers read their own orders; admins read all"
  on public.orders for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "Order items follow their order"
  on public.order_items for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = (select auth.uid()) or (select public.is_admin()))
    )
  );

create policy "Admins read inventory"
  on public.inventory for select to authenticated
  using ((select public.is_admin()));

create policy "Admins read stock movements"
  on public.inventory_movements for select to authenticated
  using ((select public.is_admin()));

create policy "Admins read order events"
  on public.order_events for select to authenticated
  using ((select public.is_admin()));

-- stripe_events and rate_limits have no policies: only the service role touches them.

-- ---------------------------------------------------------------------------
-- Stock and order functions (service role: checkout API and Stripe webhook)
-- ---------------------------------------------------------------------------

-- Creates a pending order and reserves its stock in one transaction.
-- p_items: [{ "slug", "name", "unit_price_cents", "quantity" }], prices computed by the server from src/data/.
-- Raises 'insufficient_stock' with a JSON detail of [{ "slug", "available" }] when any item is short.
create function public.create_pending_order(
  p_user_id uuid,
  p_email text,
  p_items jsonb,
  p_shipping_cents integer,
  p_currency text,
  p_expires_at timestamptz
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
  v_item jsonb;
  v_available integer;
  v_short jsonb := '[]'::jsonb;
  v_subtotal integer;
begin
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'empty_order';
  end if;

  -- Lock stock rows in slug order so concurrent checkouts queue instead of deadlocking.
  for v_item in
    select value from jsonb_array_elements(p_items) order by value ->> 'slug'
  loop
    select i.on_hand - i.reserved into v_available
    from public.inventory i
    where i.product_slug = v_item ->> 'slug'
    for update;

    v_available := coalesce(v_available, 0);
    if v_available < (v_item ->> 'quantity')::integer then
      v_short := v_short || jsonb_build_object('slug', v_item ->> 'slug', 'available', greatest(v_available, 0));
    end if;
  end loop;

  if jsonb_array_length(v_short) > 0 then
    raise exception using errcode = 'P0001', message = 'insufficient_stock', detail = v_short::text;
  end if;

  select sum((value ->> 'unit_price_cents')::integer * (value ->> 'quantity')::integer)
  into v_subtotal
  from jsonb_array_elements(p_items);

  insert into public.orders (
    user_id, email, currency, subtotal_cents, shipping_cents, total_cents, reservation_expires_at
  )
  values (
    p_user_id, p_email, p_currency, v_subtotal, p_shipping_cents, v_subtotal + p_shipping_cents, p_expires_at
  )
  returning * into v_order;

  insert into public.order_items (order_id, product_slug, name, unit_price_cents, quantity)
  select v_order.id, value ->> 'slug', value ->> 'name',
         (value ->> 'unit_price_cents')::integer, (value ->> 'quantity')::integer
  from jsonb_array_elements(p_items);

  update public.inventory i
  set reserved = i.reserved + oi.quantity
  from public.order_items oi
  where oi.order_id = v_order.id and i.product_slug = oi.product_slug;

  insert into public.order_events (order_id, type, data)
  values (v_order.id, 'created', jsonb_build_object('items', p_items));

  return v_order;
end;
$$;

-- Releases a pending order's reservation. Internal: callers hold the order row lock.
create function public.release_order_stock(p_order_id uuid, p_status public.order_status, p_event text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.inventory i
  set reserved = greatest(i.reserved - oi.quantity, 0)
  from public.order_items oi
  where oi.order_id = p_order_id and i.product_slug = oi.product_slug;

  update public.orders set status = p_status where id = p_order_id;

  insert into public.order_events (order_id, type) values (p_order_id, p_event);
end;
$$;

-- Webhook: checkout.session.completed (paid) or checkout.session.async_payment_succeeded.
-- Idempotent: returns the current status without side effects when the order is no longer pending.
create function public.mark_order_paid(
  p_session_id text,
  p_payment_intent text,
  p_email text,
  p_customer text,
  p_subtotal_cents integer,
  p_shipping_cents integer,
  p_tax_cents integer,
  p_total_cents integer,
  p_shipping_name text,
  p_shipping_address jsonb
)
returns public.order_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
begin
  select * into v_order from public.orders where stripe_checkout_session_id = p_session_id for update;
  if not found then
    raise exception 'order_not_found';
  end if;

  if v_order.status not in ('pending_payment', 'expired') then
    return v_order.status;
  end if;

  if v_order.status = 'pending_payment' then
    -- Reserved stock becomes sold stock.
    update public.inventory i
    set reserved = greatest(i.reserved - oi.quantity, 0),
        on_hand = i.on_hand - oi.quantity
    from public.order_items oi
    where oi.order_id = v_order.id and i.product_slug = oi.product_slug;

    insert into public.inventory_movements (product_slug, delta, reason, order_id)
    select product_slug, -quantity, 'sale', order_id from public.order_items where order_id = v_order.id;
  end if;

  update public.orders
  set status = 'paid',
      paid_at = now(),
      email = coalesce(p_email, email),
      stripe_payment_intent_id = p_payment_intent,
      stripe_customer_id = p_customer,
      subtotal_cents = p_subtotal_cents,
      shipping_cents = p_shipping_cents,
      tax_cents = p_tax_cents,
      total_cents = p_total_cents,
      shipping_name = p_shipping_name,
      shipping_address = p_shipping_address,
      -- A payment for an already-released reservation needs a person to check stock.
      needs_attention = (v_order.status = 'expired')
  where id = v_order.id;

  insert into public.order_events (order_id, type, data)
  values (
    v_order.id,
    case when v_order.status = 'expired' then 'paid_after_expiry' else 'paid' end,
    jsonb_build_object('payment_intent', p_payment_intent, 'total_cents', p_total_cents)
  );

  return 'paid';
end;
$$;

-- Webhook: checkout.session.expired or checkout.session.async_payment_failed.
create function public.expire_order(p_session_id text, p_event text default 'expired')
returns public.order_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
begin
  select * into v_order from public.orders where stripe_checkout_session_id = p_session_id for update;
  if not found then
    return null;
  end if;
  if v_order.status <> 'pending_payment' then
    return v_order.status;
  end if;
  perform public.release_order_stock(v_order.id, 'expired', p_event);
  return 'expired';
end;
$$;

-- Safety net for missed expiry webhooks: releases reservations well past their session's expiry.
create function public.release_stale_reservations()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_count integer := 0;
begin
  for v_id in
    select id from public.orders
    where status = 'pending_payment' and reservation_expires_at < now() - interval '1 hour'
    for update skip locked
  loop
    perform public.release_order_stock(v_id, 'expired', 'reservation_released');
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- Deletes a pending order whose Checkout Session could not be created, releasing its stock.
create function public.abandon_pending_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform 1 from public.orders where id = p_order_id and status = 'pending_payment' for update;
  if found then
    perform public.release_order_stock(p_order_id, 'expired', 'checkout_failed');
  end if;
end;
$$;

-- Webhook: charge.refunded. p_amount_refunded is Stripe's cumulative refunded amount.
create function public.record_refund(p_payment_intent text, p_amount_refunded integer)
returns public.order_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
  v_status public.order_status;
begin
  select * into v_order from public.orders where stripe_payment_intent_id = p_payment_intent for update;
  if not found then
    return null;
  end if;

  v_status := v_order.status;
  if v_order.status in ('paid', 'fulfilled', 'partially_refunded', 'refunded') then
    v_status := case when p_amount_refunded >= v_order.total_cents then 'refunded' else 'partially_refunded' end;
  end if;

  update public.orders
  set amount_refunded_cents = greatest(amount_refunded_cents, p_amount_refunded),
      status = v_status
  where id = v_order.id;

  insert into public.order_events (order_id, type, data)
  values (v_order.id, 'refund_recorded', jsonb_build_object('amount_refunded_cents', p_amount_refunded));

  return v_status;
end;
$$;

-- Webhook: charge.dispute.created and anything else that needs a person.
create function public.flag_order(p_payment_intent text, p_type text, p_data jsonb default '{}'::jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  select id into v_id from public.orders where stripe_payment_intent_id = p_payment_intent;
  if v_id is null then
    return;
  end if;
  update public.orders set needs_attention = true where id = v_id;
  insert into public.order_events (order_id, type, data) values (v_id, p_type, p_data);
end;
$$;

-- Fixed-window rate limiter. Returns true while the caller is within the limit.
create function public.hit_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  insert into public.rate_limits as r (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
  set count = case when r.window_start < now() - make_interval(secs => p_window_seconds) then 1 else r.count + 1 end,
      window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds) then now() else r.window_start end
  returning count into v_count;
  return v_count <= p_limit;
end;
$$;

-- ---------------------------------------------------------------------------
-- Storefront (anyone)
-- ---------------------------------------------------------------------------

-- Stock state per product without exposing counts. Products without a stock row are sold out.
create function public.get_availability()
returns table (product_slug text, status text)
language sql
stable
security definer
set search_path = ''
as $$
  select
    i.product_slug,
    case
      when i.on_hand - i.reserved <= 0 then 'sold_out'
      when i.on_hand - i.reserved <= i.low_stock_threshold then 'low'
      else 'in_stock'
    end
  from public.inventory i;
$$;

-- ---------------------------------------------------------------------------
-- Customers (signed in)
-- ---------------------------------------------------------------------------

-- Attaches guest orders placed with the customer's verified email address.
create function public.claim_guest_orders()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text;
  v_count integer;
begin
  select u.email into v_email
  from auth.users u
  where u.id = auth.uid() and u.email_confirmed_at is not null;

  if v_email is null then
    return 0;
  end if;

  update public.orders
  set user_id = auth.uid()
  where user_id is null
    and lower(email) = lower(v_email)
    and status <> 'pending_payment';
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create function public.request_account_deletion()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_signed_in';
  end if;
  update public.profiles
  set deletion_requested_at = coalesce(deletion_requested_at, now())
  where id = auth.uid();
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin (signed in with the admin role); every action is logged
-- ---------------------------------------------------------------------------

create function public.assert_admin()
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'admin_only';
  end if;
end;
$$;

create function public.admin_fulfil_order(p_order_id uuid, p_carrier text, p_tracking_number text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.order_status;
begin
  perform public.assert_admin();
  select status into v_status from public.orders where id = p_order_id for update;
  if v_status is null or v_status not in ('paid', 'partially_refunded') then
    raise exception 'order_not_fulfillable';
  end if;
  if nullif(trim(p_carrier), '') is null or nullif(trim(p_tracking_number), '') is null then
    raise exception 'tracking_required';
  end if;

  update public.orders
  set status = 'fulfilled', fulfilled_at = now(), carrier = trim(p_carrier), tracking_number = trim(p_tracking_number)
  where id = p_order_id;

  insert into public.order_events (order_id, type, data, actor_id)
  values (p_order_id, 'fulfilled', jsonb_build_object('carrier', trim(p_carrier), 'tracking_number', trim(p_tracking_number)), auth.uid());
end;
$$;

-- Returns a paid order's items to stock once. Used after cancellation, or after a refund when chosen.
create function public.admin_restock_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
begin
  perform public.assert_admin();
  select * into v_order from public.orders where id = p_order_id for update;
  if not found or v_order.paid_at is null then
    raise exception 'order_not_restockable';
  end if;
  if v_order.restocked_at is not null then
    return;
  end if;

  update public.inventory i
  set on_hand = i.on_hand + oi.quantity
  from public.order_items oi
  where oi.order_id = p_order_id and i.product_slug = oi.product_slug;

  insert into public.inventory_movements (product_slug, delta, reason, order_id, actor_id)
  select product_slug, quantity, 'cancel', order_id, auth.uid() from public.order_items where order_id = p_order_id;

  update public.orders set restocked_at = now() where id = p_order_id;

  insert into public.order_events (order_id, type, actor_id) values (p_order_id, 'restocked', auth.uid());
end;
$$;

-- Called after the server has refunded the full amount through Stripe.
create function public.admin_cancel_order(p_order_id uuid, p_refund_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
begin
  perform public.assert_admin();
  select * into v_order from public.orders where id = p_order_id for update;
  if not found or v_order.status <> 'paid' then
    raise exception 'order_not_cancellable';
  end if;

  update public.orders
  set status = 'cancelled', cancelled_at = now(), amount_refunded_cents = total_cents
  where id = p_order_id;

  insert into public.order_events (order_id, type, data, actor_id)
  values (p_order_id, 'cancelled', jsonb_build_object('refund_id', p_refund_id), auth.uid());

  perform public.admin_restock_order(p_order_id);
end;
$$;

create function public.admin_log_refund(p_order_id uuid, p_refund_id text, p_amount_cents integer, p_restock boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  insert into public.order_events (order_id, type, data, actor_id)
  values (p_order_id, 'refund_requested', jsonb_build_object('refund_id', p_refund_id, 'amount_cents', p_amount_cents), auth.uid());
  if p_restock then
    perform public.admin_restock_order(p_order_id);
  end if;
end;
$$;

create function public.admin_add_note(p_order_id uuid, p_note text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  if nullif(trim(p_note), '') is null then
    raise exception 'note_required';
  end if;
  insert into public.order_events (order_id, type, data, actor_id)
  values (p_order_id, 'note', jsonb_build_object('note', left(trim(p_note), 2000)), auth.uid());
end;
$$;

create function public.admin_resolve_attention(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  update public.orders set needs_attention = false where id = p_order_id;
  insert into public.order_events (order_id, type, actor_id) values (p_order_id, 'attention_resolved', auth.uid());
end;
$$;

-- Sets on-hand stock (creating the row on first save) and logs the difference.
create function public.admin_set_stock(
  p_slug text,
  p_on_hand integer,
  p_low_stock_threshold integer,
  p_reason public.stock_reason,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_before integer;
begin
  perform public.assert_admin();
  if p_reason not in ('restock', 'adjustment') then
    raise exception 'invalid_reason';
  end if;

  insert into public.inventory (product_slug) values (p_slug) on conflict (product_slug) do nothing;
  select on_hand into v_before from public.inventory where product_slug = p_slug for update;

  -- The reserved_within_on_hand constraint rejects stock below what open checkouts hold.
  update public.inventory
  set on_hand = p_on_hand, low_stock_threshold = p_low_stock_threshold
  where product_slug = p_slug;

  if p_on_hand <> v_before then
    insert into public.inventory_movements (product_slug, delta, reason, actor_id, note)
    values (p_slug, p_on_hand - v_before, p_reason, auth.uid(), nullif(trim(p_note), ''));
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Function privileges
-- ---------------------------------------------------------------------------

revoke execute on all functions in schema public from public, anon, authenticated;

-- RLS policies call is_admin() as the querying role.
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.get_availability() to anon, authenticated;
grant execute on function
  public.claim_guest_orders(),
  public.request_account_deletion(),
  public.admin_fulfil_order(uuid, text, text),
  public.admin_restock_order(uuid),
  public.admin_cancel_order(uuid, text),
  public.admin_log_refund(uuid, text, integer, boolean),
  public.admin_add_note(uuid, text),
  public.admin_resolve_attention(uuid),
  public.admin_set_stock(text, integer, integer, public.stock_reason, text)
to authenticated;
