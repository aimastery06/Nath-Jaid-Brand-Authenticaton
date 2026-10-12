// Stock states from /api/stock, loaded once per page. Failures resolve to {} so everything stays buyable
// (checkout re-validates on the server regardless).
export type StockStatus = 'in_stock' | 'low' | 'sold_out';
export type StockMap = Record<string, StockStatus>;

/** Copy from brand/voice.md ("Stock"). */
export const stockCopy: Record<Exclude<StockStatus, 'in_stock'>, string> = {
  low: 'Only a few left',
  sold_out: 'Sold out',
};

let pending: Promise<StockMap> | undefined;

export function loadStock(): Promise<StockMap> {
  pending ??= fetch('/api/stock', { headers: { Accept: 'application/json' } })
    .then((response) => (response.ok ? response.json() : { stock: {} }))
    .then((body: { stock?: StockMap }) => body.stock ?? {})
    .catch(() => ({}));
  return pending;
}
