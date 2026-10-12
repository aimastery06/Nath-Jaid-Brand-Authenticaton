-- Sales tax (brand/README.md, Company Details): pending orders record the tax estimate so the
-- confirmation page shows the right total before the webhook replaces it with Stripe's amounts.

drop function public.create_pending_order(uuid, text, jsonb, integer, text, timestamptz);

create function public.create_pending_order(
  p_user_id uuid,
  p_email text,
  p_items jsonb,
  p_shipping_cents integer,
  p_tax_cents integer,
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
    user_id, email, currency, subtotal_cents, shipping_cents, tax_cents, total_cents, reservation_expires_at
  )
  values (
    p_user_id, p_email, p_currency, v_subtotal, p_shipping_cents, p_tax_cents,
    v_subtotal + p_shipping_cents + p_tax_cents, p_expires_at
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

revoke execute on function public.create_pending_order(uuid, text, jsonb, integer, integer, text, timestamptz)
  from public, anon, authenticated;
