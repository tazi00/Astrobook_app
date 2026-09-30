import type { AstrologerProfile } from "../types";

// AstrologerCard ke saare display rules ek jagah (pure functions) — taaki
// listing, explore aur favourites teeno jagah card same behave kare.

/** 1200 → "1.2k", 10000 → "10k", 1500000 → "1.5M" */
export function formatCount(n: number | null | undefined): string {
  const value = Math.max(0, Math.floor(n ?? 0));
  if (value < 1000) return String(value);
  const fmt = (x: number, suffix: string) =>
    `${(Math.round(x * 10) / 10).toString().replace(/\.0$/, "")}${suffix}`;
  if (value < 1_000_000) return fmt(value / 1000, "k");
  return fmt(value / 1_000_000, "M");
}

/** "399.00" → "₹399", "399.50" → "₹399.5", missing/invalid → null */
export function formatPrice(price: string | number | null | undefined): string | null {
  if (price === null || price === undefined || price === "") return null;
  const n = Number(price);
  if (!Number.isFinite(n) || n < 0) return null;
  return `₹${Math.round(n * 100) / 100}`;
}

export function formatDuration(minutes: number | null | undefined): string | null {
  if (!minutes || minutes <= 0) return null;
  return `${minutes} min`;
}

/** "Starts ₹399 · 30 min" — price nahi hai to null */
export function startsAtLabel(a: Pick<AstrologerProfile, "basicPrice" | "basicDurationMinutes">) {
  const price = formatPrice(a.basicPrice);
  if (!price) return null;
  const duration = formatDuration(a.basicDurationMinutes);
  return duration ? `Starts ${price} · ${duration}` : `Starts ${price}`;
}

/** Categories ki line: pehle `max` dikhao, baaki "+N" */
export function splitCategories(categories: string[] | undefined, max = 2) {
  const list = (categories ?? []).filter(Boolean);
  return { visible: list.slice(0, max), extra: Math.max(0, list.length - max) };
}

export function experienceLabel(years: number | undefined): string | null {
  return years && years > 0 ? `${years} yr${years === 1 ? "" : "s"}` : null;
}

/** Abhi tak koi review nahi → rating ki jagah "New" dikhate hain */
export function hasReviews(a: Pick<AstrologerProfile, "totalReviews">): boolean {
  return (a.totalReviews ?? 0) > 0;
}

/** Top Choice: acchi rating AUR kaafi reviews (2 reviews ki 5.0 "top" nahi) */
export function isTopChoice(a: Pick<AstrologerProfile, "rating" | "totalReviews">): boolean {
  return (a.rating ?? 0) >= 4.5 && (a.totalReviews ?? 0) >= 10;
}

/** Rating ek decimal tak: 4.8, 5 (5.0 nahi) */
export function formatRating(rating: number | undefined): string {
  return (Math.round((rating ?? 0) * 10) / 10).toString();
}

// ─── Card display model ─────────────────────────────────────────────────────
// Naye backend fields (rating, isOnline, categories...) ko prefer karta hai,
// aur agar app naye backend se pehle deploy ho gaya to purane `meta.*` pe
// gracefully fall back karta hai — card kabhi crash/khaali nahi hoga.
export type AstrologerCardModel = {
  id: string;
  name: string;
  avatarUrl: string | null;
  isVerified: boolean;
  isOnline: boolean;
  rating: number;
  totalReviews: number;
  experienceYears: number;
  languages: string[];
  categories: string[];
  followersCount: number;
  startsAt: string | null;
  price: string | null;
};

export function toCardModel(a: AstrologerProfile): AstrologerCardModel {
  const meta = a.meta;
  const metaYears = Number(/(\d+)/.exec(meta?.exp ?? "")?.[1] ?? 0);
  return {
    id: a.id,
    name: a.name?.trim() || "Astrologer",
    avatarUrl: a.avatarUrl,
    isVerified: a.isVerified ?? true,
    isOnline: a.isOnline ?? meta?.online ?? false,
    rating: a.rating ?? meta?.rating ?? 0,
    totalReviews: a.totalReviews ?? meta?.reviews ?? 0,
    experienceYears: a.experienceYears ?? metaYears,
    languages:
      a.languages ??
      (meta?.languages
        ? meta.languages.split(",").map((l) => l.trim()).filter(Boolean)
        : []),
    categories: a.categories ?? (meta?.speciality ? [meta.speciality] : []),
    followersCount: a.followersCount ?? 0,
    startsAt: startsAtLabel(a),
    price: formatPrice(a.basicPrice),
  };
}

// ─── Saved tab ke liye local filter ─────────────────────────────────────────
// Saved list /favorites se aati hai (server-side filter nahi), isliye toggle
// aur search wahi rules se yahan lagate hain jo server list pe lagte hain.
export function filterAstrologersLocally(
  list: AstrologerProfile[],
  availability: "all" | "online" | "offline",
  query: string,
): AstrologerProfile[] {
  const q = query.trim().toLowerCase();
  return list.filter((a) => {
    const m = toCardModel(a);
    if (availability === "online" && !m.isOnline) return false;
    if (availability === "offline" && m.isOnline) return false;
    if (!q) return true;
    return [m.name, ...m.languages, ...m.categories].some((t) =>
      t.toLowerCase().includes(q),
    );
  });
}
