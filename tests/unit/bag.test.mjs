// The bag on a shared browser: one person's bag must never reach the next. Run with `npm run test:unit`.
// localStorage and the cookie jar are faked once and shared by every "user", as on a real device.
import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
globalThis.localStorage = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};
globalThis.window = { addEventListener() {}, dispatchEvent() {} };
globalThis.document = { cookie: '' };

const { addToBag, clearBag, readBag, syncBagOwner } = await import('../../src/scripts/bag.ts');

/** A page load as the header sees it: the session cookie, then /api/session's answer. */
function pageLoad(userId) {
  document.cookie = userId ? `sb-127-auth-token=${userId}` : '';
  syncBagOwner(userId);
}

/** The header's sign-out form: the bag is emptied, then the server clears the session cookie. */
function signOut() {
  clearBag();
  document.cookie = '';
}

beforeEach(() => {
  store.clear();
  document.cookie = '';
});

test("signing out hides the bag, and the next account doesn't get it", () => {
  pageLoad('user-1');
  addToBag('ember-and-oak', 2);
  assert.deepEqual(readBag(), { 'ember-and-oak': 2 });

  signOut();
  assert.deepEqual(readBag(), {});

  pageLoad('user-2');
  assert.deepEqual(readBag(), {});
});

test('a bag left behind by an ended session is empty before the session check finishes', () => {
  pageLoad('user-1');
  addToBag('ember-and-oak', 2);
  document.cookie = ''; // Session cookie gone without a sign-out (expired or cleared).
  assert.deepEqual(readBag(), {});
});

test("another account signing in over a stale session doesn't see the earlier bag", () => {
  pageLoad('user-1');
  addToBag('ember-and-oak', 2);
  pageLoad('user-2'); // Cookie still present, but /api/session now names someone else.
  assert.deepEqual(readBag(), {});
  pageLoad('user-1');
  assert.deepEqual(readBag(), {});
});

test("an account's bag survives its own page loads", () => {
  pageLoad('user-1');
  addToBag('ember-and-oak', 1);
  pageLoad('user-1');
  assert.deepEqual(readBag(), { 'ember-and-oak': 1 });
});

test('a guest bag passes to the account that signs in', () => {
  pageLoad(null);
  addToBag('ember-and-oak', 1);
  pageLoad('user-1');
  assert.deepEqual(readBag(), { 'ember-and-oak': 1 });
  signOut();
  pageLoad('user-2');
  assert.deepEqual(readBag(), {});
});

test('bags saved before owners were recorded are discarded', () => {
  store.set('nathjaid:bag', JSON.stringify({ 'ember-and-oak': 3 }));
  pageLoad('user-2');
  assert.deepEqual(readBag(), {});
  assert.equal(store.has('nathjaid:bag'), false);
});
