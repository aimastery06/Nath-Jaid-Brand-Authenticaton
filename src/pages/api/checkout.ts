// POST: bag → reserved stock → pending order → Stripe Checkout Session URL.
import type { APIRoute } from 'astro';
import { parseBag, startCheckout } from '../../lib/server/checkout';
import { commerceConfigured } from '../../lib/server/env';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const POST: APIRoute = async ({ request, locals, url, clientAddress }) => {
  if (!commerceConfigured) return json({ error: 'unavailable' }, 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_bag' }, 400);
  }
  const lines = parseBag(body);
  if (!lines) return json({ error: 'invalid_bag' }, 400);

  try {
    const result = await startCheckout({
      lines,
      user: locals.user,
      origin: url.origin,
      clientKey: clientAddress,
    });
    if (result.ok) return json({ url: result.url });
    return json({ error: result.error, shortages: result.shortages }, result.status);
  } catch (error) {
    console.error('Checkout failed', error);
    return json({ error: 'unavailable' }, 503);
  }
};
