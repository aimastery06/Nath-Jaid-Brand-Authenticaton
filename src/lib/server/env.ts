// Server-only configuration. Never import from components or client scripts.
import {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY,
  SUPABASE_URL,
} from 'astro:env/server';

export const env = {
  supabaseUrl: SUPABASE_URL ?? '',
  supabasePublishableKey: SUPABASE_PUBLISHABLE_KEY ?? '',
  supabaseSecretKey: SUPABASE_SECRET_KEY ?? '',
  stripeSecretKey: STRIPE_SECRET_KEY ?? '',
  stripeWebhookSecret: STRIPE_WEBHOOK_SECRET ?? '',
};

/** True when every commerce secret is set. Commerce routes stay unavailable otherwise. */
export const commerceConfigured = Object.values(env).every(Boolean);
