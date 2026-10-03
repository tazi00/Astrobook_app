import Header from "@/components/header";
import {
  AstroColors,
  AstroRadius,
  AstroType,
  MIN_TOUCH,
} from "@/constants/astro-theme";
import { useUser } from "@/features/auth/store/auth.store";
import { useToggleFollow } from "@/features/follows/hooks/useFollow";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewToken,
} from "react-native";
import CommentsSheet from "../components/CommentsSheet";
import FeedPostCard, { type FeedCardHandlers } from "../components/FeedPostCard";
import FeedSkeleton from "../components/FeedSkeleton";
import { useFeedPosts } from "../hooks/useFeed";
import { useLikePost } from "../hooks/usePosts";
import type { Post } from "../types/post.types";
import { prettyTag } from "../utils/tags";

const VIEWABILITY = { itemVisiblePercentThreshold: 60 };

export default function FeedScreen() {
  const router = useRouter();
  const user = useUser();
  const { toggleLike } = useLikePost();
  const { toggleFollow } = useToggleFollow();
  const { posts, loading, refreshing, loadingMore, hasMore, error, fetchFeed, loadMore, updatePost } =
    useFeedPosts();

  const [visibleVideoId, setVisibleVideoId] = useState<string | null>(null);
  const [sheetPostId, setSheetPostId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Cards memo hain — handlers stable rakhne ke liye latest values ref me
  const latest = useRef({ toggleLike, toggleFollow, updatePost });
  latest.current = { toggleLike, toggleFollow, updatePost };

  const handlers = useMemo<FeedCardHandlers>(
    () => ({
      onLike: (p) => latest.current.toggleLike(p, latest.current.updatePost),
      onFollow: (p) =>
        latest.current.toggleFollow(p.astrologerId, p, latest.current.updatePost),
      onOpenPost: (p) =>
        router.push({ pathname: "/(user)/post/[id]" as any, params: { id: p.id } }),
      onOpenAuthor: (p) =>
        router.push({
          pathname: "/(user)/astrologer-profile" as any,
          params: { id: p.astrologerId },
        }),
      // Feed jaisa rule: Basic consultancy ho to seedha booking detail, warna profile
      onBook: (p) => {
        if (!p.basicServiceId) {
          router.push({
            pathname: "/(user)/astrologer-profile" as any,
            params: { id: p.astrologerId },
          });
          return;
        }
        router.push({
          pathname: "/(user)/service/[id]" as any,
          params: { id: p.basicServiceId, astroId: p.astrologerId },
        });
      },
      onComment: (p) => {
        setSheetPostId(p.id);
        setSheetOpen(true);
      },
      onShare: async (p) => {
        try {
          await Share.share({
            message: `${p.astrologerName ?? "Astrobook"} ka post dekho: astrobook://post/${p.id}`,
          });
        } catch {
          // cancelled
        }
      },
      onTag: (tag) =>
        router.push({
          pathname: "/(user)/explore/[category]" as any,
          params: { category: tag, label: prettyTag(tag) },
        }),
    }),
    [router],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstVideo = viewableItems.find(
        (v) => (v.item as Post).mediaType === "VIDEO",
      );
      setVisibleVideoId(firstVideo ? (firstVideo.item as Post).id : null);
    },
  ).current;

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <FeedPostCard
        post={item}
        isActive={visibleVideoId === item.id}
        isMine={item.astrologerId === user?.id}
        handlers={handlers}
      />
    ),
    [visibleVideoId, user?.id, handlers],
  );

  const sheetPost = posts.find((p) => p.id === sheetPostId);

  return (
    <View style={styles.root}>
      <Header
        rightSlot={
          user?.isAstrologer ? (
            <TouchableOpacity
              style={styles.addPostBtn}
              onPress={() => router.push("/(astrologer)/posts" as any)}
              accessibilityLabel="Naya post"
            >
              <Feather name="plus-circle" size={26} color={AstroColors.brand} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      {loading ? (
        <FeedSkeleton />
      ) : error ? (
        <View style={styles.center}>
          <Feather name="alert-circle" size={30} color={AstroColors.danger} />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.retry} onPress={() => fetchFeed(true)}>
            <Text style={styles.retryText}>Dobara try karo</Text>
          </TouchableOpacity>
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.center}>
          <Feather name="inbox" size={30} color={AstroColors.offline} />
          <Text style={styles.emptyText}>Abhi tak koi post nahi hai</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={visibleVideoId}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchFeed(true)}
              colors={[AstroColors.brand]}
              tintColor={AstroColors.brand}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={VIEWABILITY}
          initialNumToRender={3}
          windowSize={7}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={AstroColors.brand} style={styles.footerPad} />
            ) : !hasMore ? (
              <Text style={styles.endText}>Bas itna hi — aur posts nahi hain</Text>
            ) : null
          }
        />
      )}

      {/* Comments — post kholne ki zaroorat nahi, yahin sheet */}
      {sheetPostId ? (
        <CommentsSheet
          postId={sheetPostId}
          visible={sheetOpen}
          totalCount={sheetPost?.commentsCount ?? 0}
          focusInput={false}
          onClose={() => setSheetOpen(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AstroColors.canvas },
  addPostBtn: { padding: 4 },
  listContent: { paddingBottom: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  emptyText: { ...AstroType.body, color: AstroColors.textSecondary, textAlign: "center" },
  retry: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    paddingHorizontal: 22,
    borderRadius: AstroRadius.pill,
    backgroundColor: AstroColors.brand,
  },
  retryText: { ...AstroType.button, color: AstroColors.onBrand },
  footerPad: { marginVertical: 20 },
  endText: {
    ...AstroType.caption,
    textAlign: "center",
    color: AstroColors.textMuted,
    paddingVertical: 24,
  },
});
