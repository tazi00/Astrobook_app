// Backend `FAVORITE_ITEM_TYPES` (core/database/schema/favorites.ts) ke saath
// sync rakho. Abhi sirf consultation service; courses/products aane par yahan
// naya type + FavoriteItem ka naya `service`-jaisa field add hoga.
export type FavoriteItemType = "service";

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

export type FavoriteItem = {
  id: string;
  itemType: FavoriteItemType;
  itemId: string;
  createdAt: string;
  service: FavoriteService;
};
