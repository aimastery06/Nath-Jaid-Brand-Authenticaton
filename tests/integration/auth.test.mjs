// Accounts end to end: each customer reaches only their own account and orders, sign-in only ever returns to a
// page on this site, and signed-out or forged sessions get nothing.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { baseUrl, cleanup, db, pendingOrder, setStock } from './helpers.mjs';

const slug = 'auth-test-candle';
const password = 'correct-horse-9';
const stamp = Date.now();
const ana = { email: `ana+${stamp}@example.com`, name: 'Ana Test' };
const ben = { email: `ben+${stamp}@example.com`, name: 'Ben Test' };
let benOrder;

/** Requests a page as a browser would, without following redirects. */
function visit(path, { cookie = '', method = 'GET', form } = {}) {
  return fetch(new URL(path, baseUrl), {
    method,
    redirect: 'manual',
    headers: { Cookie: cookie, ...(form ? { Origin: new URL(baseUrl).origin } : {}) },
    body: form ? new URLSearchParams(form) : undefined,
  });
}

/** Signs in through the site's own form and returns the session cookies plus the redirect it answered with. */
async function signIn(person, next) {
  const path = next === undefined ? '/account/sign-in' : `/account/sign-in?next=${encodeURIComponent(next)}`;
  const response = await visit(path, { method: 'POST', form: { intent: 'password', email: person.email, password } });
  const cookie = response.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
  return { cookie, location: response.headers.get('location') };
}

const sameSite = (location) => new URL(location, baseUrl).origin === new URL(baseUrl).origin;

before(async () => {
  for (const person of [ana, ben]) {
    const { data, error } = await db.auth.admin.createUser({
      email: person.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: person.name },
    });
    if (error) throw error;
    person.id = data.user.id;
  }
  await setStock(slug, 10);
  benOrder = await pendingOrder(slug, 1);
  await db.from('orders').update({ user_id: ben.id, email: ben.email, status: 'paid' }).eq('id', benOrder.id);
});

after(async () => {
  await cleanup(slug);
  for (const person of [ana, ben]) if (person.id) await db.auth.admin.deleteUser(person.id);
});

test('sign-in returns to the page the visitor came from', async () => {
  const { location } = await signIn(ana, '/products/vanilla-amber?size=8oz');
  assert.equal(location, '/products/vanilla-amber?size=8oz');
});

test('sign-in never redirects to another site', async () => {
  const attempts = [
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    '\\\\evil.example',
    '/\t/evil.example',
    '/\n/evil.example',
    '/%09/evil.example',
    '/\\[',
    'javascript:alert(1)',
  ];
  const { cookie } = await signIn(ana);
  for (const next of attempts) {
    // Signing in with the form, and visiting the sign-in page while already signed in, both redirect to `next`.
    const posted = await signIn(ana, next);
    assert.ok(sameSite(posted.location), `sign-in with next=${JSON.stringify(next)} went to ${posted.location}`);
    const visited = await visit(`/account/sign-in?next=${encodeURIComponent(next)}`, { cookie });
    const location = visited.headers.get('location');
    assert.ok(location && sameSite(location), `signed-in visit with next=${JSON.stringify(next)} went to ${location}`);
  }
});

test('wrong password gets no session', async () => {
  const response = await visit('/account/sign-in', { method: 'POST', form: { intent: 'password', email: ana.email, password: 'not-the-password' } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.getSetCookie().some((c) => /auth-token/.test(c) && !/Max-Age=0/i.test(c)), false);
});

test('the header session only ever describes the signed-in visitor', async () => {
  const anonymous = await visit('/api/session');
  assert.deepEqual(await anonymous.json(), { account: null });

  const { cookie } = await signIn(ana);
  const response = await visit('/api/session', { cookie });
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  assert.deepEqual(await response.json(), { account: { firstName: 'Ana', email: ana.email } });
});

test("a customer cannot see another customer's orders", async () => {
  const { cookie: anaCookie } = await signIn(ana);
  const asAna = await visit(`/account/orders/${benOrder.number}`, { cookie: anaCookie });
  assert.equal(asAna.status, 404);
  assert.equal((await visit('/account', { cookie: anaCookie }).then((r) => r.text())).includes(benOrder.number), false);

  const { cookie: benCookie } = await signIn(ben);
  const asBen = await visit(`/account/orders/${benOrder.number}`, { cookie: benCookie });
  assert.equal(asBen.status, 200, 'the owner can see their own order');
});

test("saving details changes only the signed-in customer's profile", async () => {
  const { cookie } = await signIn(ana);
  // Even with another customer's id in the form, the update applies to the session's own account.
  await visit('/account', { cookie, method: 'POST', form: { intent: 'profile', full_name: 'Ana Changed', id: ben.id } });
  const { data } = await db.from('profiles').select('id, full_name').in('id', [ana.id, ben.id]);
  const byId = Object.fromEntries(data.map((p) => [p.id, p.full_name]));
  assert.equal(byId[ana.id], 'Ana Changed');
  assert.equal(byId[ben.id], ben.name);
});

/** Rewrites a session cookie so it claims to belong to someone else, keeping the original signature. */
function impersonate(cookie, userId) {
  const parts = cookie.split('; ').map((pair) => pair.split(/=(.*)/s));
  const chunks = parts.filter(([name]) => /-auth-token(\.\d+)?$/.test(name)).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }));
  const baseName = chunks[0][0].replace(/\.\d+$/, '');
  const session = JSON.parse(Buffer.from(chunks.map(([, v]) => v).join('').replace(/^base64-/, ''), 'base64url').toString());
  const [header, payload, signature] = session.access_token.split('.');
  const claims = { ...JSON.parse(Buffer.from(payload, 'base64url').toString()), sub: userId };
  session.access_token = [header, Buffer.from(JSON.stringify(claims)).toString('base64url'), signature].join('.');
  session.user = { ...session.user, id: userId };
  return `${baseName}=base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`;
}

test('forged or signed-out sessions are refused', async () => {
  const { cookie } = await signIn(ana);
  // Ana's cookie edited to claim Ben's account: Supabase Auth rejects the signature, so nothing of Ben's is shown.
  const forged = impersonate(cookie, ben.id);
  const forgedVisit = await visit('/account', { cookie: forged });
  assert.equal(forgedVisit.status, 302);
  assert.match(forgedVisit.headers.get('location') ?? '', /^\/account\/sign-in/);
  assert.equal((await visit(`/account/orders/${benOrder.number}`, { cookie: forged })).status, 302);
  assert.deepEqual(await visit('/api/session', { cookie: forged }).then((r) => r.json()), { account: null });

  // After signing out, replaying the old cookie no longer opens the account.
  const signOut = await visit('/account/sign-out', { cookie, method: 'POST', form: {} });
  assert.equal(signOut.status, 303);
  const replay = await visit('/account', { cookie });
  assert.equal(replay.status, 302, 'the old session was revoked');
  assert.deepEqual(await visit('/api/session', { cookie }).then((r) => r.json()), { account: null });
});

test('admin pages stay hidden from customers', async () => {
  const { cookie } = await signIn(ana);
  assert.equal((await visit('/admin', { cookie })).status, 404);
});
