/**
 * Single source of truth for prices shown on katafract.com.
 *
 * Every page that displays a $ amount should import from here — never
 * hardcode a price in an .astro template. When prices drift across
 * surfaces (web, ASC, Stripe, Play), it's because someone wrote the
 * number twice. Don't.
 *
 * TODO(pricing-autosync): replace the literals below with a build-time
 * fetch from ASC + Stripe, and run it on a daily GHA cron that opens a
 * PR if drift is detected. Until that lands, this file is the canonical
 * web-side price record — when ASC changes, update here in lockstep.
 *
 * Source authorities:
 *   - iOS standalone IAPs / subs   → App Store Connect (ASC API)
 *   - Stripe subscriptions         → Stripe API (live mode)
 *   - Android IAPs / subs          → Play Console / Play Developer API
 *   - Free products                → no source — they're $0 by definition
 */

export interface VaultyxTier {
  capacity: string;
  capacity_bytes: number;
  monthly_usd: number;
  annual_usd: number;
  featured?: boolean;
}

export interface AppUnlockPrice {
  unlock_usd: number | null; // null => not standalone-priced (e.g. free + credits)
  asc_app_id: string | null; // numeric id from apps.apple.com URL
  status: 'live' | 'review' | 'ready' | 'soon';
}

export interface CreditPack {
  name: string;
  credits: number;
  price_usd: number;
}

/** Vaultyx storage tiers — see ASC IAPs com.katafract.vault.{100gb,1tb,5tb} */
export const VAULTYX_TIERS: VaultyxTier[] = [
  { capacity: '100 GB', capacity_bytes: 100 * 1024 ** 3, monthly_usd: 1.99, annual_usd: 19.99 },
  { capacity: '1 TB',   capacity_bytes: 1024 ** 4,       monthly_usd: 9.99, annual_usd: 99.99, featured: true },
  { capacity: '5 TB',   capacity_bytes: 5 * 1024 ** 4,   monthly_usd: 39.99, annual_usd: 399.99 },
];

/** One-time Pro / unlock IAPs across the standalone Armor apps */
export const APP_UNLOCK_PRICES: Record<string, AppUnlockPrice> = {
  exifarmor: { unlock_usd: 0.99, asc_app_id: '6760979268', status: 'live' },
  parkarmor: { unlock_usd: 0.99, asc_app_id: '6760988040', status: 'live' },
  docarmor:  { unlock_usd: 7.99, asc_app_id: null,         status: 'ready' }, // PREPARE_FOR_SUBMISSION
  safeopen:  { unlock_usd: null, asc_app_id: null,         status: 'review' }, // free + credits, no unlock
  vaultyx:   { unlock_usd: null, asc_app_id: '6762418528', status: 'live' },   // subscription, see VAULTYX_TIERS
};

/** SafeOpen credit packs (consumable IAPs) */
export const SAFEOPEN_CREDITS: CreditPack[] = [
  { name: 'Starter',  credits: 100,  price_usd: 0.99 },
  { name: 'Standard', credits: 500,  price_usd: 3.99 },
  { name: 'Power',    credits: 2000, price_usd: 9.99 },
];

/** Format a USD amount for display: $1, $1.99, $19.99 */
export function fmtUsd(amount: number): string {
  if (Number.isInteger(amount)) return `$${amount}`;
  return `$${amount.toFixed(2)}`;
}

/** Pretty per-month equivalent of an annual price */
export function annualPerMonth(annual: number): string {
  return `$${(annual / 12).toFixed(2)}`;
}

/** Annual savings as a rounded percentage compared to 12× monthly */
export function annualSavingsPct(monthly: number, annual: number): number {
  const monthlyTotal = monthly * 12;
  if (monthlyTotal === 0) return 0;
  return Math.round(((monthlyTotal - annual) / monthlyTotal) * 100);
}

/** App Store URL helper — null if app not yet on ASC */
export function appStoreUrl(slug: string): string | null {
  const id = APP_UNLOCK_PRICES[slug]?.asc_app_id;
  return id ? `https://apps.apple.com/app/id${id}` : null;
}
