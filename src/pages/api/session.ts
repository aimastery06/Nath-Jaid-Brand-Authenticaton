// GET: who is signed in, for the header's account menu on prerendered pages. Only ever describes the
// visitor's own session (the middleware verifies it with Supabase Auth), and is never cached. The id lets the
// bag tell whether it belongs to this account (src/scripts/bag.ts).
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const { supabase, user } = locals;
  let account: { id: string; firstName: string | null; email: string | null } | null = null;

  if (supabase && user) {
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
    account = { id: user.id, firstName: profile?.full_name?.split(/\s+/)[0] || null, email: user.email ?? null };
  }

  return Response.json(
    { account },
    { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } },
  );
};
