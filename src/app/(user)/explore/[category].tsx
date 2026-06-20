import { MOCK_ASTROLOGERS, MOCK_POSTS, MOCK_SERVICES } from "@/mock/data";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  "love-reading": { emoji: "💕", color: "#9D174D" },
  reiki: { emoji: "✨", color: "#065F46" },
  numerology: { emoji: "🔢", color: "#1E40AF" },
  kundli: { emoji: "🔮", color: "#6B21A8" },
  tarot: { emoji: "🃏", color: "#92400E" },
  palmistry: { emoji: "✋", color: "#065F46" },
  vastu: { emoji: "🏠", color: "#1E3A5F" },
  astrology: { emoji: "⭐", color: "#4C1D95" },
  "face-reading": { emoji: "👁️", color: "#7C2D12" },
  "past-life": { emoji: "🌀", color: "#134E4A" },
  meditation: { emoji: "🧘", color: "#1E40AF" },
  gemstones: { emoji: "💎", color: "#6B21A8" },
};

const TABS = ["Posts", "Services", "Astrologers"];

export default function CategoryScreen() {
  const router = useRouter();
  const { category, label } = useLocalSearchParams<{
    category: string;
    label: string;
  }>();
  const [activeTab, setActiveTab] = useState(0);

  const meta = CATEGORY_META[category] || { emoji: "🌟", color: "#6B21A8" };

  // Mock filter — baad mein API se real filter aayega
  const posts = MOCK_POSTS;
  const services = MOCK_SERVICES.map((s) => ({
    ...s,
    astrologer: MOCK_ASTROLOGERS.find((a) => a.id === s.astrologerId),
  }));
  const astrologers = MOCK_ASTROLOGERS;

  return (
    <View style={styles.root}>
      {/* Hero Header */}
      <View style={[styles.hero, { backgroundColor: meta.color }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.heroEmoji}>{meta.emoji}</Text>
        <Text style={styles.heroTitle}>{label}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 0 && (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={[styles.postCard, { backgroundColor: post.bgColor }]}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/(user)/astrologer-profile" as any,
                  params: { id: post.astrologerId },
                })
              }
            >
              <View style={styles.postHeader}>
                <View style={styles.postAvatarCircle}>
                  <Text style={{ fontSize: 18 }}>{post.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.postAuthorName}>
                    {post.astrologerName}
                  </Text>
                  <Text style={styles.postTime}>
                    {new Date(post.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Text>
                </View>
              </View>
              <Text style={styles.postContent} numberOfLines={3}>
                {post.content}
              </Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>👍 {post.likes}</Text>
                <Text style={styles.postStat}>💬 {post.comments}</Text>
                <Text style={styles.postStat}>↗ {post.shares}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}

      {activeTab === 1 && (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <TouchableOpacity
                style={styles.astroRow}
                onPress={() =>
                  router.push({
                    pathname: "/(user)/astrologer-profile" as any,
                    params: { id: item.astrologerId },
                  })
                }
              >
                <View
                  style={[
                    styles.astroAvatar,
                    { backgroundColor: item.astrologer?.color || "#6B21A8" },
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>{item.astrologer?.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.astroName}>{item.astrologer?.name}</Text>
                  <Text style={styles.astroSpeciality}>
                    {item.astrologer?.speciality}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color="#CCC" />
              </TouchableOpacity>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.chips}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>⏱ {item.durationMins} min</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {item.callType === "VIDEO" ? "📹 Video" : "📞 Voice"}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.price}>₹{item.price}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.cartBtn}
                    onPress={() => alert("Added to cart!")}
                  >
                    <Feather name="shopping-cart" size={13} color="#9d0399" />
                    <Text style={styles.cartBtnText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/(user)/book-slot" as any,
                        params: {
                          astroId: item.astrologerId,
                          serviceId: item.id,
                        },
                      })
                    }
                  >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {activeTab === 2 && (
        <FlatList
          data={astrologers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.astrologerCard}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/(user)/astrologer-profile" as any,
                  params: { id: item.id },
                })
              }
            >
              <View
                style={[
                  styles.astrologerAvatar,
                  { backgroundColor: item.color },
                ]}
              >
                <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                <View
                  style={[
                    styles.onlineDot,
                    { backgroundColor: item.online ? "#22C55E" : "#9CA3AF" },
                  ]}
                />
              </View>
              <View style={styles.astrologerInfo}>
                <Text style={styles.astrologerName}>{item.name}</Text>
                <Text style={styles.astrologerSpeciality}>
                  {item.speciality}
                </Text>
                <Text style={styles.astrologerMeta}>
                  {item.languages} · {item.experience}
                </Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                  <Text style={styles.reviewText}>
                    ({item.reviews} reviews)
                  </Text>
                </View>
              </View>
              <View style={styles.astrologerRight}>
                <Text style={styles.astrologerPrice}>₹{item.price}</Text>
                <Text style={styles.bookNowText}>Book</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },

  // Hero
  hero: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 6,
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
  heroEmoji: { fontSize: 36, marginBottom: 4 },
  heroTitle: { fontSize: 22, fontWeight: "800", color: "#FFF" },

  // Tabs
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDE9FF",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#9d0399" },
  tabText: { fontSize: 14, color: "#888", fontWeight: "500" },
  tabTextActive: { color: "#9d0399", fontWeight: "700" },

  content: { padding: 16, gap: 12 },

  // Post Card
  postCard: { borderRadius: 16, padding: 16, gap: 10 },
  postHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  postAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  postAuthorName: { fontSize: 13, fontWeight: "700", color: "#FFF" },
  postTime: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
  postContent: { fontSize: 14, color: "#FFF", lineHeight: 20 },
  postStats: { flexDirection: "row", gap: 16 },
  postStat: { fontSize: 12, color: "rgba(255,255,255,0.8)" },

  // Service Card
  serviceCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    gap: 10,
  },
  astroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F0FF",
  },
  astroAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  astroName: { fontSize: 13, fontWeight: "700", color: "#1A1A2E" },
  astroSpeciality: { fontSize: 11, color: "#9d0399" },
  serviceName: { fontSize: 15, fontWeight: "800", color: "#1A1A2E" },
  serviceDesc: { fontSize: 12, color: "#6B7280", lineHeight: 18 },
  chips: { flexDirection: "row", gap: 8 },
  chip: {
    backgroundColor: "#F5F0FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: { fontSize: 11, color: "#6B21A8", fontWeight: "600" },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { fontSize: 20, fontWeight: "800", color: "#9d0399" },
  actions: { flexDirection: "row", gap: 8 },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1.5,
    borderColor: "#9d0399",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  cartBtnText: { color: "#9d0399", fontSize: 12, fontWeight: "700" },
  bookBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bookBtnText: { color: "#FFF", fontSize: 12, fontWeight: "700" },

  // Astrologer Card
  astrologerCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 14,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 1,
  },
  astrologerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
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
  astrologerInfo: { flex: 1 },
  astrologerName: { fontSize: 14, fontWeight: "700", color: "#1A1A2E" },
  astrologerSpeciality: {
    fontSize: 12,
    color: "#9d0399",
    fontWeight: "600",
    marginTop: 2,
  },
  astrologerMeta: { fontSize: 11, color: "#888", marginTop: 2 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#F59E0B" },
  reviewText: { fontSize: 11, color: "#AAA" },
  astrologerRight: { alignItems: "center", justifyContent: "center", gap: 4 },
  astrologerPrice: { fontSize: 16, fontWeight: "800", color: "#9d0399" },
  bookNowText: { fontSize: 11, color: "#9d0399", fontWeight: "600" },
});
