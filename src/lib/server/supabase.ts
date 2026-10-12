import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';
import type { Database } from './database.types';
import { env } from './env';

/** Acts as the visitor, with their session cookies. Row Level Security applies. */
export function createRequestClient(request: Request, cookies: AstroCookies) {
  return createServerClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '').map(({ name, value }) => ({
          name,
          value: value ?? '',
        }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, { ...options, sameSite: options.sameSite as 'lax' | 'strict' | 'none' | undefined });
        }
      },
    },
  });
}

let serviceClient: ReturnType<typeof createClient<Database>> | undefined;

/** Bypasses Row Level Security. Only for the checkout API, the Stripe webhook, and admin-only account actions. */
export function getServiceClient() {
  serviceClient ??= createClient<Database>(env.supabaseUrl, env.supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceClient;
}

/** Anonymous client for public reads such as stock states. */
export function getPublicClient() {
  return createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isAdmin(user: { app_metadata?: Record<string, unknown> } | null): boolean {
  return user?.app_metadata?.role === 'admin';
}
