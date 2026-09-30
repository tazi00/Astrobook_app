// Matches backend AstrologerResponseSchema
// (server/src/modules/astrologers/schemas/astrologer.schema.ts)

export type AstrologerMeta = {
  speciality: string;
  exp: string;
  rating: number;
  reviews: number;
  languages: string;
  emoji: string;
  online: boolean;
  price?: number;
  about?: string;
  // Platform fee % deducted from each booking amount before payout
  commissionPercentage?: number;
};

export type AstrologerProfile = {
  id: string;
  name: string;
  phone: string | null;
  // Real uploaded profile photo — pehle backend isko strip kar deta tha
  avatarUrl: string | null;
  interests: string[] | null;
  meta: AstrologerMeta | null;
  isOnboarded: boolean;
  createdAt: string;
  basicServiceId?: string | null;
  basicPrice?: string | null;
  basicDurationMinutes?: number | null;

  // Asli astrologer_profiles data (backend list/detail API se). `meta.*`
  // purani screens ke liye ab bhi bhara jaata hai, naye code inhi ko padhe.
  experienceYears?: number;
  languages?: string[];
  specializations?: string[];
  // Card pe dikhane ke liye — Explore ke labels (e.g. "Vedic Astrology")
  categories?: string[];
  rating?: number;
  totalReviews?: number;
  bio?: string | null;
  followersCount?: number;
  // "Abhi available" — abhi ke time pe active availability window hai
  isOnline?: boolean;
  isVerified?: boolean;
};

export type AstrologerSlot = {
  date: string;
  startTime: string;
  endTime: string;
};

// GET /astrologers ke query params (backend AstrologerListQuerySchema ke saath sync)
export type AstrologerSort =
  | "recommended"
  | "top_rated"
  | "most_followed"
  | "experienced"
  | "new"
  | "price_low";

export type AstrologerAvailability = "all" | "online" | "offline";

export type AstrologerListParams = {
  sort?: AstrologerSort;
  availability?: AstrologerAvailability;
  q?: string;
  // Explore category id (e.g. "numerology") — us category ke astrologers
  category?: string;
  limit?: number;
  offset?: number;
};
