import type { AstrologerProfile } from "@/features/astrologer/types";

// Backend `FAVORITE_ITEM_TYPES` (core/database/schema/favorites.ts) ke saath
// sync rakho. Abhi consultation service aur astrologer; courses/products aane
// par yahan naya type + naya item shape add hoga.
export type FavoriteItemType = "service" | "astrologer";

export type FavoriteService = {
  id: string;
  astrologerId: string;
  astrologerName: string | null;
  astrologerAvatarUrl: string | null;
  isBasic: boolean;
  title: string;
  shortDescription: string;
  coverImage: string | null;
  durationMinutes: number;
  // numeric column → JSON mein string aata hai
  price: string | null;
  tags: string[];
};

export type FavoriteServiceItem = {
  id: string;
  itemType: "service";
  itemId: string;
  createdAt: string;
  service: FavoriteService;
};

// Favourite astrologer — listing wale card jaisa hi data (phone ke bina)
export type FavoriteAstrologerItem = {
  id: string;
  itemType: "astrologer";
  itemId: string;
  createdAt: string;
  astrologer: Omit<AstrologerProfile, "phone">;
};

// Purane code ke liye alias — FavoriteItem matlab consultation favourite
export type FavoriteItem = FavoriteServiceItem;

export type FavoriteItemFor<T extends FavoriteItemType> = T extends "astrologer"
  ? FavoriteAstrologerItem
  : FavoriteServiceItem;
