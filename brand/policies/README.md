# Policies

One file per policy. The website renders each at `/policies/<file name>` and links it in the footer and checkout.

Each file starts with frontmatter:

| Field | Meaning |
|---|---|
| `title` | Page heading |
| `description` | Meta description |
| `status` | `draft` or `approved` |
| `updated` | Date of the last approved change (YYYY-MM-DD) |

The four policies were written from the facts in [`../README.md`](../README.md#company-details) and approved by the owner on 2026-10-11 as a starting point; a legal review is still recommended. When a policy changes, set `status: draft` until the owner approves it again, then update `updated`. While a policy is a draft, its page shows a visible draft note and `npm run check:launch` fails.

Do not repeat company facts that may change (shipping rate, threshold, email) without checking them against `../README.md` first.
