import type { VariantDurationMinutes } from "../types";

// Backend (VARIANT_DEFAULT_PRICES) se same — naya service banate waqt form
// mein yehi pehle se bhare dikhte hain, astrologer sirf badalna chahe to badle.
export const DEFAULT_VARIANT_PRICES: Record<VariantDurationMinutes, string> = {
  10: "199",
  30: "399",
  45: "799",
  60: "1099",
  90: "1499",
};

export const DEFAULT_DURATION: VariantDurationMinutes = 30;

export function earningsFor(amount: number, commissionPercentage: number) {
  const fee = (amount * commissionPercentage) / 100;
  return { fee, payout: amount - fee };
}

/** Draft string ko valid price (>0) mein badalta hai, warna null */
export function parsePrice(draft: string | undefined): number | null {
  if (draft === undefined || draft.trim() === "") return null;
  const n = Number(draft);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const rupees = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
