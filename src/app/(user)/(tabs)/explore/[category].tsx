import { AstroColors } from "@/constants/astro-theme";
import AstrologerCard from "@/features/astrologer/components/AstrologerCard";
import AstrologerCardSkeleton from "@/features/astrologer/components/AstrologerCardSkeleton";
import { useAstrologersList } from "@/features/astrologer/hooks/useAstrologersList";
import CategoryHero from "@/features/categories/components/CategoryHero";
import { usePullStretch } from "@/features/categories/hooks/usePullStretch";
import ServiceSlideCard from "@/features/consultation/components/ServiceSlideCard";
import { consultationService } from "@/features/consultation/service";
import type { BrowsedService } from "@/features/consultation/types";
import ProfilePostTile from "@/features/posts/components/ProfilePostTile";
import { useCategoryPosts } from "@/features/posts/hooks/useFeed";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PAD = 16;
const GAP = 12;
// Astrologers slider: har "page" me 2 compact cards upar-neeche; agla page
// thoda jhaankta hai taaki pata chale ki slide hota hai
const ASTRO_SLIDE_W = SCREEN_WIDTH - PAD * 2 - 24;
const SERVICE_W = 216;
const POST_W = 156;

// Astrobook ka signature "cosmic" navy — login/otp/onboarding mein already
// establish hai. Har category hero isi navy mein blend hota hai neeche se,
// taaki poora app ek hi visual identity share kare, sirf ek flat solid
// color block na ho.
const COSMIC_NAVY = "#121943";

const CATEGORY_META: Record<
  string,
  { emoji: string; color: string; description: string }
> = {
  numerology: {
    emoji: "🔢",
    color: "#1E40AF",
    description:
      "Discover the mystical relationship between numbers and life events. Numerology reveals your life path, destiny, and personality through the power of numbers.",
  },
  "numerology-name": {
    emoji: "📛",
    color: "#1E3A5F",
    description:
      "Your name carries a unique vibration. Name numerology reveals hidden traits and life influences encoded in your birth name.",
  },
  vastu: {
    emoji: "🏠",
    color: "#1E3A5F",
    description:
      "Ancient Indian science of architecture and space. Vastu Shastra harmonizes your living and working spaces with natural forces.",
  },
  "vastu-home": {
    emoji: "🏡",
    color: "#065F46",
    description:
      "Transform your home into a sanctuary of positive energy with expert Vastu guidance for every room and direction.",
  },
  "vedic-astrology": {
    emoji: "⭐",
    color: "#4C1D95",
    description:
      "The oldest and most complete system of astrology. Vedic astrology uses your birth chart to reveal your destiny, karma, and life purpose.",
  },
  kundli: {
    emoji: "🔮",
    color: "#6B21A8",
    description:
      "Your Kundli is a cosmic blueprint of your life. Get detailed analysis of your birth chart, planetary positions, and life predictions.",
  },
  tarot: {
    emoji: "🃏",
    color: "#92400E",
    description:
      "Tarot cards are windows to the subconscious mind. Get clarity on love, career, and life decisions through intuitive tarot readings.",
  },
  "tarot-love": {
    emoji: "💕",
    color: "#9D174D",
    description:
      "Navigate matters of the heart with tarot. Love readings reveal relationship patterns, compatibility, and the path to your soulmate.",
  },
  palmistry: {
    emoji: "✋",
    color: "#065F46",
    description:
      "Your hands carry the map of your life. Palmistry reads the lines, mounts, and shapes of your palms to reveal personality and destiny.",
  },
  "face-reading": {
    emoji: "👁️",
    color: "#7C2D12",
    description:
      "The face is a mirror of the soul. Face reading reveals character, health, fortune, and life patterns through facial features.",
  },
  reiki: {
    emoji: "✨",
    color: "#065F46",
    description:
      "Reiki is a Japanese healing technique based on the principle of free energy flow. Balance your chakras and restore vitality.",
  },
  "past-life": {
    emoji: "🌀",
    color: "#134E4A",
    description:
      "Explore your soul's journey across lifetimes. Past life readings reveal karmic patterns, unresolved lessons, and soul connections.",
  },
  meditation: {
    emoji: "🧘",
    color: "#1E40AF",
    description:
      "Meditation is the gateway to inner peace. Connect with expert guides for personalized meditation and mindfulness practices.",
  },
  gemstones: {
    emoji: "💎",
    color: "#6B21A8",
    description:
      "Gemstones carry powerful cosmic energies. Get expert guidance on which stones can enhance your luck, health, and prosperity.",
  },
  "love-reading": {
    emoji: "💕",
    color: "#9D174D",
    description:
      "Gain deep insights into your love life, relationships, and romantic future through expert astrology and card readings.",
  },
};

export default function CategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category, label } = useLocalSearchParams<{
    category: string;
    label: string;
  }>();

  const meta = CATEGORY_META[category] || {
    emoji: "🌟",
    color: "#6B21A8",
    description: "Explore the cosmic wisdom of this ancient practice.",
  };

  const { pull, maxPull, scrollProps } = usePullStretch();

  const {
    posts,
    loading: postsLoading,
    loadingMore: postsLoadingMore,
    hasMore: postsHasMore,
    fetchPosts,
    loadMore: loadMorePosts,
  } = useCategoryPosts(category);

  const [services, setServices] = useState<BrowsedService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const astro = useAstrologersList(
    { category, sort: "recommended", limit: 20 },
    { enabled: !!category },
  );

  // 2-2 ke pages (upar-neeche) — horizontal slide
  const astroPages = useMemo(() => {
    const pages: (typeof astro.astrologers)[] = [];
    for (let i = 0; i < astro.astrologers.length; i += 2) {
      pages.push(astro.astrologers.slice(i, i + 2));
    }
    return pages;
  }, [astro.astrologers]);

  useEffect(() => {
    fetchPosts();
    if (category) {
      setServicesLoading(true);
      consultationService
        .browseByTag(category, 20, 0)
        .then((res) => setServices(res.services))
        .catch(() => setServices([]))
        .finally(() => setServicesLoading(false));
    }
  }, [category]);

  const isEmpty =
    !postsLoading &&
    !servicesLoading &&
    !astro.loading &&
    posts.length === 0 &&
    services.length === 0 &&
    astro.astrologers.length === 0;

  const otherCategories = Object.keys(CATEGORY_META)
    .filter((key) => key !== category)
    .slice(0, 8);

  const prettify = (key: string) =>
    key
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        {...scrollProps}
      >
        <CategoryHero
          id={category}
          label={label}
          description={meta.description}
          color={meta.color}
          navy={COSMIC_NAVY}
          paddingTop={insets.top + 50}
          pull={pull}
          maxPull={maxPull}
          onBack={() => router.back()}
        />

        {/* ── Astrologers — horizontal slider ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Astrologers</Text>
            {astro.astrologers.length > 0 ? (
              <Text style={styles.sectionCount}>{astro.astrologers.length}</Text>
            ) : null}
          </View>
        </View>
        {astro.loading ? (
          <View style={{ paddingHorizontal: PAD, gap: 10 }}>
            <AstrologerCardSkeleton variant="compact" />
            <AstrologerCardSkeleton variant="compact" />
          </View>
        ) : astro.error ? (
          <View style={styles.padded}>
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Astrologers load nahi hue</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => astro.refetch()}
                accessibilityRole="button"
              >
                <Text style={styles.retryText}>Dobara try karo</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : astro.astrologers.length === 0 ? (
          <View style={styles.padded}>
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <Feather name="user" size={20} color={AstroColors.brand} />
              </View>
              <Text style={styles.emptyTitle}>Abhi koi astrologer nahi</Text>
              <Text style={styles.emptySubtext}>
                Is category ke astrologers jaldi add honge
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={astroPages}
            horizontal
            keyExtractor={(page) => page.map((a) => a.id).join("-")}
            showsHorizontalScrollIndicator={false}
            snapToInterval={ASTRO_SLIDE_W + GAP}
            decelerationRate="fast"
            snapToAlignment="start"
            contentContainerStyle={styles.sliderContent}
            renderItem={({ item: page }) => (
              <View style={{ width: ASTRO_SLIDE_W, gap: 10 }}>
                {page.map((a) => (
                  <AstrologerCard key={a.id} astrologer={a} variant="compact" />
                ))}
              </View>
            )}
          />
        )}

        {/* ── Consultancies — horizontal slider ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultancies</Text>
        </View>
        {servicesLoading ? (
          <ActivityIndicator color={AstroColors.brand} style={{ marginTop: 4 }} />
        ) : services.length === 0 ? (
          <View style={styles.padded}>
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <Feather name="users" size={20} color={AstroColors.brand} />
              </View>
              <Text style={styles.emptyTitle}>Abhi koi consultancy nahi</Text>
              <Text style={styles.emptySubtext}>
                Is category ke astrologers jaldi add honge
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={services}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={SERVICE_W + GAP}
            decelerationRate="fast"
            snapToAlignment="start"
            contentContainerStyle={styles.sliderContent}
            renderItem={({ item }) => (
              <ServiceSlideCard service={item} width={SERVICE_W} accent={meta.color} />
            )}
          />
        )}

        {/* ── Recent Posts — single row ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Posts</Text>
        </View>
        {postsLoading && posts.length === 0 ? (
          <ActivityIndicator color={AstroColors.brand} style={{ marginTop: 4 }} />
        ) : posts.length === 0 ? (
          <View style={styles.padded}>
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <Feather name="file-text" size={20} color={AstroColors.brand} />
              </View>
              <Text style={styles.emptyTitle}>Koi post nahi mila</Text>
              <Text style={styles.emptySubtext}>
                Astrologers is category mein post karenge toh yahan dikhega
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={posts}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            onEndReached={() => postsHasMore && loadMorePosts()}
            onEndReachedThreshold={0.6}
            contentContainerStyle={styles.sliderContent}
            renderItem={({ item }) => (
              <ProfilePostTile
                post={item}
                width={POST_W}
                showAuthor
                onPress={() =>
                  router.push({
                    pathname: "/(user)/post/[id]" as any,
                    params: { id: item.id },
                  })
                }
              />
            )}
            ListFooterComponent={
              postsLoadingMore ? (
                <ActivityIndicator
                  color={AstroColors.brand}
                  style={{ alignSelf: "center", marginHorizontal: 12 }}
                />
              ) : null
            }
          />
        )}

        {/* Sab kuch khaali ho to dead-end na lage */}
        {isEmpty && otherCategories.length > 0 && (
          <View style={styles.exploreMoreSection}>
            <Text style={styles.sectionTitle}>Aur bhi explore karo</Text>
            <View style={styles.categoryChips}>
              {otherCategories.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.categoryChip}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/(user)/explore/[category]" as any,
                      params: { category: key, label: prettify(key) },
                    })
                  }
                >
                  <Text style={styles.categoryChipText}>{prettify(key)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AstroColors.canvas },

  section: { paddingTop: 22, paddingHorizontal: PAD },
  padded: { paddingHorizontal: PAD },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: AstroColors.ink,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionCount: {
    fontSize: 11.5,
    fontWeight: "800",
    color: AstroColors.brand,
    backgroundColor: AstroColors.brandTint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  // Sliders full-bleed; pehla/aakhri item screen edge se PAD door
  sliderContent: { paddingHorizontal: PAD, gap: GAP, paddingBottom: 6 },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: AstroColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AstroColors.border,
    gap: 4,
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AstroColors.canvas,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  emptyTitle: { fontSize: 13.5, fontWeight: "700", color: "#374151" },
  emptySubtext: {
    fontSize: 12,
    color: AstroColors.textMuted,
    textAlign: "center",
    lineHeight: 17,
  },
  retryBtn: {
    marginTop: 6,
    minHeight: 40,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AstroColors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: { fontSize: 13, fontWeight: "800", color: AstroColors.brand },

  exploreMoreSection: { paddingTop: 24, paddingHorizontal: PAD },
  categoryChips: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryChip: {
    backgroundColor: AstroColors.surface,
    borderWidth: 1,
    borderColor: AstroColors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  categoryChipText: { fontSize: 12.5, fontWeight: "600", color: "#4A4468" },
});
