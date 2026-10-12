import Stripe from 'stripe';
import { env } from './env';

let client: Stripe | undefined;

export function getStripe(): Stripe {
  client ??= new Stripe(env.stripeSecretKey, {
    appInfo: { name: 'NATH & JAID website' },
    maxNetworkRetries: 2,
  });
  return client;
}

const taxRateIds = new Map<number, string>();

/**
 * The Stripe tax rate for the brand's sales tax (src/data/company.ts), found by its metadata key or
 * created on first use, so no rate ID needs configuring. Changing the percentage creates a new rate.
 */
export async function salesTaxRateId(percent: number): Promise<string | undefined> {
  if (!percent) return undefined;
  const cached = taxRateIds.get(percent);
  if (cached) return cached;

  const stripe = getStripe();
  const key = `nathjaid-sales-tax-${percent}`;
  let id: string | undefined;
  for await (const rate of stripe.taxRates.list({ active: true, limit: 100 })) {
    if (rate.metadata?.key === key && rate.percentage === percent && !rate.inclusive) {
      id = rate.id;
      break;
    }
  }
  id ??= (
    await stripe.taxRates.create(
      {
        display_name: 'Sales tax',
        percentage: percent,
        inclusive: false,
        country: 'US',
        tax_type: 'sales_tax',
        metadata: { key },
      },
      { idempotencyKey: key },
    )
  ).id;

  taxRateIds.set(percent, id);
  return id;
}
