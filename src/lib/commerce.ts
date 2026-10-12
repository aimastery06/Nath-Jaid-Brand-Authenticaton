// Pricing rules shared by the bag (estimates) and the checkout API (authoritative).
// Amounts are integer cents; product prices come from src/data/ in dollars.
import { company } from '../data/company';
import { formatPrice } from '../data/catalog';

export const toCents = (dollars: number): number => Math.round(dollars * 100);

export const freeShippingThresholdCents = toCents(company.freeShippingThreshold);
export const flatShippingCents = toCents(company.shipping.flatRate);

export function shippingCents(subtotalCents: number): number {
  return subtotalCents >= freeShippingThresholdCents ? 0 : flatShippingCents;
}

/** Tax on one line, rounded per line as Stripe does. Shipping is not taxed. */
export function lineTaxCents(lineCents: number): number {
  return Math.round((lineCents * company.salesTaxPercent) / 100);
}

export function formatCents(cents: number): string {
  return formatPrice(cents / 100);
}
