// Grants (or with --revoke, removes) the admin role for an existing account.
// Usage: npm run admin:grant -- someone@example.com [--revoke]
// Reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env. The role lives in app_metadata, which users cannot edit.
import { createClient } from '@supabase/supabase-js';

const email = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
const revoke = process.argv.includes('--revoke');
const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;

if (!email || !SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Usage: npm run admin:grant -- someone@example.com [--revoke] (needs SUPABASE_URL and SUPABASE_SECRET_KEY in .env)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

let user;
for (let page = 1; !user; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) throw error;
  user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (data.users.length < 200) break;
}
if (!user) {
  console.error(`No account for ${email}. Sign up on the website first.`);
  process.exit(1);
}

const { role: _role, ...rest } = user.app_metadata ?? {};
const app_metadata = revoke ? rest : { ...rest, role: 'admin' };
const { error } = await supabase.auth.admin.updateUserById(user.id, { app_metadata });
if (error) throw error;
console.log(`${email} ${revoke ? 'is no longer an admin' : 'is now an admin'}. They need to sign out and back in.`);
