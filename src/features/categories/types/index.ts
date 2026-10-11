export type CategoryFilter = {
  id: string;
  label: string;
};

export type Category = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  filter: string;
  // Hero media — admin upload karta hai; null = koi video/image nahi
  heroVideoUrl?: string | null;
  heroImageUrl?: string | null;
  // Legacy — ab use nahi hota
  imageUrl?: string | null;
};

export type CategoryStats = {
  categoryId: string;
  postCount: number;
  interestedUserCount: number;
  sampleAvatars: string[];
};
