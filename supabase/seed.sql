-- Local development only: opening stock for the live Fall Collection candles (slugs from src/data/).
-- Production stock is set from /admin/inventory.
insert into public.inventory (product_slug, on_hand, low_stock_threshold) values
  ('pumpkin-chai', 24, 5),
  ('apple-cider-hearth', 24, 5),
  ('vanilla-amber', 24, 5),
  ('cedar-and-fig', 3, 5)
on conflict (product_slug) do nothing;
