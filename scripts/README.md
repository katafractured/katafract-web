# scripts/

## Planned: `sync-pricing.mjs` (not yet implemented)

Single canonical price file is `src/data/pricing.ts` — currently hand-edited.
The plan to eliminate drift completely:

1. Build `scripts/sync-pricing.mjs` — Node script that:
   - Loads ASC API key (`.p8`) from `infisical` secret `prod/asc/AUTH_KEY`
   - Mints a 20-min JWT with kid + iss claims
   - For every iOS app in `src/data/apps.ts`, fetch:
     - In-app purchase price points (`/v1/inAppPurchases/{id}/pricePoints`)
     - Subscription price points (`/v1/subscriptions/{id}/pricePoints`)
     - Resolve USA territory → `customerPrice` for each
   - For Stripe products in scope, fetch live unit_amount via Stripe API
   - Diff against current `src/data/pricing.ts`
   - Write a new `pricing.ts` if changed; exit 0 with no-op otherwise

2. Add `.github/workflows/sync-pricing.yml` — GHA cron:
   - Runs daily 09:00 UTC on `runner-katafract` (chronos LXC 170)
   - Auths via `katafract-autofix` GitHub App for commit
   - If `pricing.ts` changes, opens a PR titled
     `chore(pricing): sync from ASC + Stripe (YYYY-MM-DD)`
   - Auto-merges if all checks pass and the diff is purely numeric
   - Otherwise leaves the PR open for human review

3. Matrix alert (`#alerts-pricing`) when:
   - A drift is detected (was $X, now $Y, on app Z)
   - The sync run fails (auth, network, schema change)

Until step 1 lands, edit `src/data/pricing.ts` directly. Both pricing.astro
and apps.ts derive from it, so a single edit there propagates correctly to
every page that shows a price.
