import { toast } from "@/components/toast";
import { queryKeys } from "@/lib/queryClient";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { favoritesService } from "../service";
import type { FavoriteItem, FavoriteItemType } from "../types";

// Sirf ids — har card/heart ek hi cached list se apni state padhta hai,
// isliye 20 cards = 1 network call.
export function useFavoriteIds(itemType: FavoriteItemType = "service") {
  return useQuery({
    queryKey: queryKeys.favorites.ids(itemType),
    queryFn: () => favoritesService.getIds(itemType),
  });
}

// Favourites screen ki enriched list
export function useFavoritesList(itemType: FavoriteItemType = "service") {
  return useQuery({
    queryKey: queryKeys.favorites.list(itemType),
    queryFn: () => favoritesService.getList(itemType),
  });
}

// Heart toggle — optimistic: UI turant badalta hai, fail hone pe wapas revert
// aur toast. Favourites list se hatate waqt item list se bhi turant nikal
// jaata hai.
export function useToggleFavorite(itemType: FavoriteItemType = "service") {
  const queryClient = useQueryClient();
  const idsKey = queryKeys.favorites.ids(itemType);
  const listKey = queryKeys.favorites.list(itemType);

  return useMutation({
    mutationFn: async ({
      itemId,
      isFavorite,
    }: {
      itemId: string;
      isFavorite: boolean; // abhi ki state — true ho to hata do
    }) => {
      if (isFavorite) await favoritesService.remove(itemType, itemId);
      else await favoritesService.add(itemType, itemId);
    },
    onMutate: async ({ itemId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: idsKey });
      const prevIds = queryClient.getQueryData<string[]>(idsKey);
      const prevList = queryClient.getQueryData<FavoriteItem[]>(listKey);

      queryClient.setQueryData<string[]>(idsKey, (old = []) =>
        isFavorite ? old.filter((id) => id !== itemId) : [...old, itemId],
      );
      if (isFavorite) {
        queryClient.setQueryData<FavoriteItem[]>(listKey, (old) =>
          old?.filter((i) => i.itemId !== itemId),
        );
      }
      return { prevIds, prevList };
    },
    onError: (err: any, _vars, ctx) => {
      queryClient.setQueryData(idsKey, ctx?.prevIds);
      queryClient.setQueryData(listKey, ctx?.prevList);
      toast.show(
        err?.response?.data?.message || "Favourite update nahi ho paya",
        "error",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: idsKey });
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
