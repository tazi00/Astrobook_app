import UserAvatar from "@/components/UserAvatar";
import {
  AstroColors,
  AstroRadius,
  AstroType,
  MIN_TOUCH,
} from "@/constants/astro-theme";
import { useUser } from "@/features/auth/store/auth.store";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommentsSheet from "../components/CommentsSheet";
import PostActionsBar from "../components/PostActionsBar";
import PostHero from "../components/PostHero";
import RelatedPosts from "../components/RelatedPosts";
import {
  usePostCache,
  usePostDetail,
  useRelatedPosts,
} from "../hooks/usePostDetail";
import { useLikePost } from "../hooks/usePosts";
import type { Post } from "../types/post.types";
import { formatPostDate } from "../utils/time";

const H_PAD = 16;

export default function PostDetailScreen() {
  const router = useRouter();
  const me = useUser();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: post, isPending, isError, error, refetch } = usePostDetail(id);
  const { data: related = [] } = useRelatedPosts(id);
  const { setPost } = usePostCache(id);
  const { toggleLike } = useLikePost();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [focusInput, setFocusInput] = useState(false);

  const openComments = (focus: boolean) => {
    setFocusInput(focus);
    setSheetOpen(true);
  };

  const goToAstrologer = (p: Post) =>
    router.push({
      pathname: "/(user)/astrologer-profile" as any,
      params: { id: p.astrologerId },
    });

  // Feed jaisa hi rule: Basic consultancy ho to seedha booking detail, warna profile
  const book = (p: Post) => {
    if (!p.basicServiceId) return goToAstrologer(p);
    router.push({
      pathname: "/(user)/service/[id]" as any,
      params: { id: p.basicServiceId, astroId: p.astrologerId },
    });
  };

  const share = async (p: Post) => {
    try {
      await Share.share({
        message: `${p.astrologerName ?? "Astrobook"} ka post dekho: astrobook://post/${p.id}`,
      });
    } catch {
      // cancelled
    }
  };

  const header = (
    <LinearGradient
      colors={[AstroColors.canvasHeader, AstroColors.canvas]}
      style={styles.header}
    >
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/(user)/(tabs)/feed" as any))}
        hitSlop={8}
        accessibilityLabel="Wapas jao"
      >
        <Feather name="arrow-left" size={19} color={AstroColors.brand} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Post</Text>
      <View style={styles.backBtn} />
    </LinearGradient>
  );

  if (isPending) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        {header}
        <View style={styles.center}>
          <ActivityIndicator color={AstroColors.brand} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !post) {
    const msg =
      (error as any)?.response?.data?.message ?? "Post load nahi hua";
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        {header}
        <View style={styles.center}>
          <Feather name="alert-circle" size={32} color={AstroColors.danger} />
          <Text style={styles.errorText}>{msg}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Dobara try karo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const heroW = width - H_PAD * 2;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {header}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Author */}
        <TouchableOpacity
          style={styles.author}
          activeOpacity={0.75}
          onPress={() => goToAstrologer(post)}
        >
          <UserAvatar
            uri={post.astrologerAvatar}
            name={post.astrologerName}
            id={post.astrologerId}
            size={44}
          />
          <View style={styles.flex}>
            <Text style={styles.authorName} numberOfLines={1}>
              {post.astrologerName ?? "Astrologer"}
            </Text>
            <Text style={styles.authorDate}>{formatPostDate(post.createdAt)}</Text>
          </View>
          <View style={styles.chevron}>
            <Feather name="chevron-right" size={16} color={AstroColors.brand} />
          </View>
        </TouchableOpacity>

        <PostHero post={post} width={heroW} />

        {post.mediaType !== "TEXT" && post.content ? (
          <Text style={styles.caption}>{post.content}</Text>
        ) : null}

        <PostActionsBar
          post={post}
          onLike={() => toggleLike(post, setPost)}
          onComment={() => openComments(false)}
          onShare={() => share(post)}
          onBook={() => book(post)}
        />

        {/* Comments entry — Instagram jaisa: list sheet me khulti hai */}
        <View style={styles.commentsEntry}>
          {post.commentsCount > 0 ? (
            <TouchableOpacity onPress={() => openComments(false)} hitSlop={6}>
              <Text style={styles.viewAll}>
                Saare {post.commentsCount} comments dekho
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.fakeInput}
            activeOpacity={0.8}
            onPress={() => openComments(true)}
            accessibilityLabel="Comment likho"
          >
            <UserAvatar
              uri={me?.avatarUrl}
              name={me?.name}
              id={me?.id}
              size={30}
            />
            <Text style={styles.fakeInputText}>Comment likho…</Text>
          </TouchableOpacity>
        </View>

        <RelatedPosts
          posts={related}
          onOpen={(p) =>
            router.replace({
              pathname: "/(user)/post/[id]" as any,
              params: { id: p.id },
            })
          }
        />
      </ScrollView>

      <CommentsSheet
        postId={post.id}
        visible={sheetOpen}
        totalCount={post.commentsCount}
        focusInput={focusInput}
        onClose={() => setSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AstroColors.canvas },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  errorText: { ...AstroType.body, color: AstroColors.textSecondary, textAlign: "center" },
  retryBtn: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    backgroundColor: AstroColors.brand,
    borderRadius: AstroRadius.pill,
    paddingHorizontal: 22,
  },
  retryText: { ...AstroType.button, color: AstroColors.onBrand },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { ...AstroType.heading, color: AstroColors.ink },

  scroll: { paddingBottom: 40 },
  author: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: H_PAD,
    paddingVertical: 12,
  },
  authorName: { ...AstroType.heading, color: AstroColors.ink },
  authorDate: { ...AstroType.micro, color: AstroColors.textMuted, marginTop: 1 },
  chevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AstroColors.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },

  caption: {
    ...AstroType.body,
    color: AstroColors.text,
    lineHeight: 21,
    paddingHorizontal: H_PAD,
    paddingTop: 14,
  },

  commentsEntry: { paddingHorizontal: H_PAD, paddingTop: 16, gap: 10 },
  viewAll: { ...AstroType.caption, fontWeight: "700", color: AstroColors.textSecondary },
  fakeInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: MIN_TOUCH + 4,
    paddingHorizontal: 12,
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.pill,
    borderWidth: 1,
    borderColor: AstroColors.border,
  },
  fakeInputText: { ...AstroType.body, color: AstroColors.textMuted },
});
