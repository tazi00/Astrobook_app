import { MOCK_ASTROLOGERS, MOCK_POSTS } from "@/mock/data";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const { category, label } = useLocalSearchParams<{
    category: string;
    label: string;
  }>();

  const meta = CATEGORY_META[category] || {
    emoji: "🌟",
    color: "#6B21A8",
    description: "Explore the cosmic wisdom of this ancient practice.",
  };

  const posts = MOCK_POSTS;
  const astrologers = MOCK_ASTROLOGERS;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: meta.color }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.heroEmoji}>{meta.emoji}</Text>
          <Text style={styles.heroTitle}>{label}</Text>
          <Text style={styles.heroDesc}>{meta.description}</Text>
        </View>

        {/* Posts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posts on {label}</Text>
          <FlatList
            data={posts}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.postCard, { backgroundColor: item.bgColor }]}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: "/(user)/astrologer-profile" as any,
                    params: { id: item.astrologerId },
                  })
                }
              >
                <View style={styles.postCardHeader}>
                  <View style={styles.postAvatar}>
                    <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
                  </View>
                  <Text style={styles.postAuthor} numberOfLines={1}>
                    {item.astrologerName}
                  </Text>
                </View>
                <Text style={styles.postContent} numberOfLines={4}>
                  {item.content}
                </Text>
                <View style={styles.postStats}>
                  <Text style={styles.postStat}>👍 {item.likes}</Text>
                  <Text style={styles.postStat}>💬 {item.comments}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Top Astrologers Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top {label}ists for you</Text>
          <FlatList
            data={astrologers}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.astroCard}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: "/(user)/astrologer-profile" as any,
                    params: { id: item.id },
                  })
                }
              >
                <View
                  style={[styles.astroAvatar, { backgroundColor: item.color }]}
                >
                  <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                  <View
                    style={[
                      styles.onlineDot,
                      { backgroundColor: item.online ? "#22C55E" : "#9CA3AF" },
                    ]}
                  />
                </View>
                <Text style={styles.astroName} numberOfLines={1}>
                  {item.name.split(" ")[0]}
                </Text>
                <Text style={styles.astroSpeciality} numberOfLines={1}>
                  {item.speciality}
                </Text>
                <Text style={styles.astroRating}>⭐ {item.rating}</Text>
                <Text style={styles.astroPrice}>₹{item.price}</Text>
                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>Book</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },

  // Hero
  hero: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    position: "absolute",
    top: 60,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: { fontSize: 48, marginBottom: 4 },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
  },
  heroDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 4,
  },

  // Section
  section: { paddingTop: 20, paddingBottom: 4 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  horizontalList: { paddingHorizontal: 16, gap: 12 },

  // Post Card
  postCard: {
    width: SCREEN_WIDTH * 0.65,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  postCardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  postAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  postAuthor: { fontSize: 12, fontWeight: "700", color: "#FFF", flex: 1 },
  postContent: { fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 19 },
  postStats: { flexDirection: "row", gap: 12 },
  postStat: { fontSize: 11, color: "rgba(255,255,255,0.8)" },

  // Astro Card
  astroCard: {
    width: 120,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 1,
  },
  astroAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  astroName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A2E",
    textAlign: "center",
  },
  astroSpeciality: { fontSize: 10, color: "#9d0399", textAlign: "center" },
  astroRating: { fontSize: 11, color: "#F59E0B", fontWeight: "600" },
  astroPrice: { fontSize: 13, fontWeight: "800", color: "#1A1A2E" },
  bookBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginTop: 2,
  },
  bookBtnText: { color: "#FFF", fontSize: 11, fontWeight: "700" },
});
