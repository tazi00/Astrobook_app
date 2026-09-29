import { apiClient } from "@/services/apiClient";
import type { FavoriteItem, FavoriteItemType } from "../types";

class FavoritesServiceApi {
  private readonly base = "/favorites";

  async add(itemType: FavoriteItemType, itemId: string): Promise<void> {
    await apiClient.post(this.base, { itemType, itemId });
  }

  async remove(itemType: FavoriteItemType, itemId: string): Promise<void> {
    await apiClient.delete(`${this.base}/${itemType}/${itemId}`);
  }

  async getList(itemType: FavoriteItemType): Promise<FavoriteItem[]> {
    const res = await apiClient.get<{ items: FavoriteItem[] }>(
      `${this.base}?itemType=${itemType}`,
    );
    return res.data.items;
  }

  // Cards pe heart ki state ke liye — sirf ids
  async getIds(itemType: FavoriteItemType): Promise<string[]> {
    const res = await apiClient.get<{ ids: string[] }>(
      `${this.base}/ids?itemType=${itemType}`,
    );
    return res.data.ids;
  }
}

export const favoritesService = new FavoritesServiceApi();
