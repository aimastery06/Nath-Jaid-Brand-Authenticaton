// Sessions and route guards for on-demand commerce routes (AGENT.md, Phase 2 → Architecture).
// Prerendered pages pass straight through.
import { defineMiddleware } from 'astro:middleware';
import { commerceConfigured } from './lib/server/env';
import { createRequestClient, isAdmin } from './lib/server/supabase';

/** Account pages reachable while signed out. */
const publicAccountPaths = new Set([
  '/account/sign-in',
  '/account/sign-up',
  '/account/reset-password',
  '/account/confirm',
]);

const startsWithAny = (path: string, prefixes: string[]) =>
  prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = null;
  context.locals.user = null;
  if (context.isPrerendered) return next();

  const path = context.url.pathname.replace(/\/$/, '') || '/';
  const isPrivatePage = startsWithAny(path, ['/account', '/admin', '/checkout']);
  const needsSession = isPrivatePage || path === '/api/checkout' || path === '/api/session';

  if (!commerceConfigured) {
    if (isPrivatePage) return context.redirect('/checkout/unavailable');
    return next();
  }

  if (needsSession) {
    const supabase = createRequestClient(context.request, context.cookies);
    context.locals.supabase = supabase;
    // getUser() verifies the session with Supabase Auth rather than trusting the cookie.
    const { data } = await supabase.auth.getUser();
    context.locals.user = data.user ?? null;
  }

  const { user } = context.locals;
  const signIn = `/account/sign-in?next=${encodeURIComponent(context.url.pathname + context.url.search)}`;

  if (startsWithAny(path, ['/account']) && !publicAccountPaths.has(path) && !user) {
    return context.redirect(signIn);
  }
  if (startsWithAny(path, ['/admin'])) {
    if (!user) return context.redirect(signIn);
    // Admin pages don't reveal that they exist to anyone else.
    if (!isAdmin(user)) return new Response('Not found', { status: 404 });
  }

  const response = await next();
  if (isPrivatePage) {
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
});
