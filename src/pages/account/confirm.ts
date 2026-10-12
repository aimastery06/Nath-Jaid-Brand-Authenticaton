// GET: completes the link in a Supabase auth email (confirm sign-up, sign-in link, reset, email change).
// Two link styles arrive here:
//   ?token_hash=…&type=… from the templates in supabase/templates/ (works in any browser)
//   ?code=…              from Supabase's default templates, after Supabase has verified the link itself
//                        (needs the cookie set by the browser that asked for the email)
import type { APIRoute } from 'astro';
import type { EmailOtpType } from '@supabase/supabase-js';
import { safeNext } from '../../lib/server/forms';

export const prerender = false;

const allowedTypes = new Set<EmailOtpType>(['email', 'signup', 'magiclink', 'recovery', 'email_change']);

export const GET: APIRoute = async ({ url, locals, redirect }) => {
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType | null;
  const code = url.searchParams.get('code');
  const next = safeNext(url.searchParams.get('next'));
  const { supabase } = locals;

  if (!supabase) return redirect('/account/sign-in?error=link', 303);

  let error: unknown;
  if (tokenHash && type && allowedTypes.has(type)) {
    ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  } else if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else {
    error = true;
  }
  if (error) return redirect('/account/sign-in?error=link', 303);

  await supabase.rpc('claim_guest_orders');
  return redirect(next, 303);
};
