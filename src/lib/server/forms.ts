// Helpers for server-handled forms on account and admin pages.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

/**
 * Where an auth email link lands. Supabase's default templates redirect here with `?code=`; the templates in
 * supabase/templates/ link here directly with `?token_hash=`. The URL must be in the project's redirect allow list.
 */
export function confirmUrl(current: URL, next: string): string {
  return new URL(`/account/confirm?next=${encodeURIComponent(next)}`, current).href;
}

/**
 * A same-site path to return to after sign-in, or the fallback. Parsed the way browsers parse a Location header
 * (they drop tabs and newlines and read `\` as `/`), so `/\t/evil.com` and similar can't leave the site.
 */
export function safeNext(value: string | null | undefined, fallback = '/account'): string {
  if (!value?.startsWith('/')) return fallback;
  const base = 'https://same-site.invalid';
  const url = URL.parse(value, base); // null for input like `/\[`, which would point at an invalid host
  if (url?.origin !== base) return fallback;
  return url.pathname + url.search + url.hash;
}

export function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

export type FieldErrors = Record<string, string>;
