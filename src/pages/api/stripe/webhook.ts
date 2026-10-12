// POST: Stripe webhook. Payment is confirmed here, never by the success page.
import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { commerceConfigured, env } from '../../../lib/server/env';
import { getStripe } from '../../../lib/server/stripe';
import { getServiceClient } from '../../../lib/server/supabase';
import { handleStripeEvent } from '../../../lib/server/webhook';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!commerceConfigured) return new Response('Commerce is not configured', { status: 503 });

  const signature = request.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  // The signature covers the raw body, so read it as text before anything parses it.
  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(payload, signature, env.stripeWebhookSecret);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  const db = getServiceClient();
  const { data: seen } = await db.from('stripe_events').select('id').eq('id', event.id).maybeSingle();
  if (seen) return Response.json({ received: true, duplicate: true });

  try {
    await handleStripeEvent(event);
  } catch (error) {
    // A non-2xx response makes Stripe retry later.
    console.error(`Stripe event ${event.id} (${event.type}) failed`, error);
    return new Response('Event processing failed', { status: 500 });
  }

  await db.from('stripe_events').upsert({ id: event.id, type: event.type }, { ignoreDuplicates: true });
  return Response.json({ received: true });
};
