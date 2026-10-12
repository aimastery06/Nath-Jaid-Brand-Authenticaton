// Bag stored only in the visitor's browser. Checkout sends its slugs and quantities to /api/checkout.
// The bag records which account it belongs to (null for a guest), so on a shared browser one person's
// bag is never shown to the next: signing out empties it, and another account never sees it.
const STORAGE_KEY = 'nathjaid:bag:v2';
/** Bags saved before they recorded an owner. Whose they were is unknown, so they are discarded. */
const LEGACY_STORAGE_KEY = 'nathjaid:bag';
export const MAX_QUANTITY = 10;
export const BAG_CHANGE = 'bag:change';

export type BagContents = Record<string, number>;
type StoredBag = { owner: string | null; items: BagContents };

function clamp(quantity: number): number {
  return Math.max(0, Math.min(MAX_QUANTITY, Math.floor(quantity)));
}

/** True while the browser holds a Supabase session cookie (the server still has to verify it). */
export function hasSessionCookie(): boolean {
  return /(?:^|;\s*)sb-[^=]+-auth-token(?:\.\d+)?=/.test(document.cookie);
}

function readStored(): StoredBag {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== 'object') return { owner: null, items: {} };
    const { owner, items } = parsed as Partial<StoredBag>;
    const bag: BagContents = {};
    for (const [slug, quantity] of Object.entries(items && typeof items === 'object' ? items : {})) {
      if (typeof quantity === 'number' && clamp(quantity) > 0) bag[slug] = clamp(quantity);
    }
    return { owner: typeof owner === 'string' ? owner : null, items: bag };
  } catch {
    return { owner: null, items: {} };
  }
}

function writeStored(stored: StoredBag): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage unavailable (private mode or blocked); the bag simply won't persist.
  }
  window.dispatchEvent(new CustomEvent(BAG_CHANGE, { detail: stored.items }));
}

export function readBag(): BagContents {
  const stored = readStored();
  // An account's bag with no session left in this browser: its owner signed out or the session ended.
  if (stored.owner && !hasSessionCookie()) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable; nothing was kept.
    }
    return {};
  }
  return stored.items;
}

function writeBag(bag: BagContents): void {
  writeStored({ owner: readStored().owner, items: bag });
}

/**
 * Matches the bag to whoever /api/session says is signed in (null when nobody is). A guest's bag passes
 * to the account that signs in; a bag belonging to anyone else is emptied.
 */
export function syncBagOwner(userId: string | null): void {
  const stored = readStored();
  if (stored.owner === userId) return;
  if (stored.owner === null) writeStored({ owner: userId, items: stored.items });
  else writeStored({ owner: userId, items: {} });
}

export function setQuantity(slug: string, quantity: number): BagContents {
  const bag = readBag();
  const next = clamp(quantity);
  if (next > 0) bag[slug] = next;
  else delete bag[slug];
  writeBag(bag);
  return bag;
}

/** Adds to the bag and returns the new quantity, which never exceeds MAX_QUANTITY. */
export function addToBag(slug: string, quantity = 1): number {
  const current = readBag()[slug] ?? 0;
  return setQuantity(slug, current + quantity)[slug] ?? 0;
}

export function removeFromBag(slug: string): BagContents {
  return setQuantity(slug, 0);
}

/** Empties the bag after a completed checkout or on sign-out. */
export function clearBag(): void {
  writeBag({});
}

export function bagCount(bag: BagContents = readBag()): number {
  return Object.values(bag).reduce((sum, quantity) => sum + quantity, 0);
}

/** Calls back on changes from this tab and from other tabs. */
export function onBagChange(callback: (bag: BagContents) => void): void {
  window.addEventListener(BAG_CHANGE, () => callback(readBag()));
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) callback(readBag());
  });
}
