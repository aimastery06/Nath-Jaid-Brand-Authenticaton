/// <reference types="astro/client" />

type SupabaseClient = import('@supabase/supabase-js').SupabaseClient<import('./lib/server/database.types').Database>;
type User = import('@supabase/supabase-js').User;

declare namespace App {
  interface Locals {
    /** Request-scoped Supabase client acting as the visitor (RLS applies). Null on static pages or when commerce is not configured. */
    supabase: SupabaseClient | null;
    /** Verified signed-in user, or null. */
    user: User | null;
  }
}
