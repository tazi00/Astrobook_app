import Header from "@/components/header";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MOCK_FEED_POSTS = [
  {
    id: "1",
    astrologerId: "astro_001",
    astrologerName: "Suprio Karmakar",
    emoji: "🙏",
    bgColor: "#6B21A8",
    content:
      "দুর্গতি নাশিনী\nইয়া দেবী সর্বভূতেষু, শক্তি রূপেণ সংস্থিতা!\nনমস্তে নমস্তে নমস্তে নমো নমঃ ॥",
    footer: "মহালয়া শুভেচ্ছা",
    likes: 248,
    comments: 42,
    shares: 18,
    createdAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "2",
    astrologerId: "astro_002",
    astrologerName: "Ananya Sharma",
    emoji: "🌟",
    bgColor: "#1E3A5F",
    content:
      "Mercury Retrograde ends today! Time to move forward with clarity and renewed purpose. ✨\n\nThis is the perfect time to revisit old projects and clear communication.",
    footer: "Cosmic Update",
    likes: 156,
    comments: 28,
    shares: 12,
    createdAt: "2025-11-01T08:00:00Z",
  },
  {
    id: "3",
    astrologerId: "astro_003",
    astrologerName: "Rohit Verma",
    emoji: "♈",
    bgColor: "#164E63",
    content:
      "आज का राशिफल 🪐\nमेष राशि के जातकों के लिए आज का दिन विशेष शुभ है। नए कार्यों की शुरुआत के लिए उत्तम समय।",
    footer: "Daily Horoscope",
    likes: 312,
    comments: 67,
    shares: 45,
    createdAt: "2025-11-01T06:00:00Z",
  },
  {
    id: "4",
    astrologerId: "astro_004",
    astrologerName: "Priya Nair",
    emoji: "☀️",
    bgColor: "#065F46",
    content:
      "Your palm lines tell a story that no one else can read. Every line, every curve is unique to you. Book a session to discover your life path. 🌿",
    footer: "Palmistry Insight",
    likes: 189,
    comments: 34,
    shares: 22,
    createdAt: "2025-10-31T14:00:00Z",
  },
  {
    id: "5",
    astrologerId: "astro_005",
    astrologerName: "Vikash Joshi",
    emoji: "🏠",
    bgColor: "#92400E",
    content:
      "Vastu tip of the day:\nKeep your main entrance clean and well-lit. The north-east corner of your home is the zone of wisdom and prosperity. 🌅",
    footer: "Vastu Shastra",
    likes: 421,
    comments: 89,
    shares: 67,
    createdAt: "2025-10-31T10:00:00Z",
  },
  {
    id: "6",
    astrologerId: "astro_001",
    astrologerName: "Suprio Karmakar",
    emoji: "🔮",
    bgColor: "#4C1D95",
    content:
      "Saturn's transit into Pisces brings deep spiritual lessons. This is a time for inner work, not outer achievements. Embrace the slowdown. 🪐",
    footer: "Saturn Transit 2025",
    likes: 298,
    comments: 51,
    shares: 38,
    createdAt: "2025-10-30T16:00:00Z",
  },
  {
    id: "7",
    astrologerId: "astro_002",
    astrologerName: "Ananya Sharma",
    emoji: "🃏",
    bgColor: "#9D174D",
    content:
      "The Tower card appeared in 70% of readings this week. Major changes are coming — but remember, destruction always precedes creation. Stay grounded. 🌪️",
    footer: "Weekly Tarot",
    likes: 167,
    comments: 45,
    shares: 29,
    createdAt: "2025-10-30T12:00:00Z",
  },
  {
    id: "8",
    astrologerId: "astro_003",
    astrologerName: "Rohit Verma",
    emoji: "🔢",
    bgColor: "#1E40AF",
    content:
      "Life Path Number 7 individuals are natural seekers of truth. If you're a 7, today's energy supports deep research and solitary reflection. 📚",
    footer: "Numerology Daily",
    likes: 234,
    comments: 38,
    shares: 19,
    createdAt: "2025-10-30T08:00:00Z",
  },
  {
    id: "9",
    astrologerId: "astro_004",
    astrologerName: "Priya Nair",
    emoji: "✋",
    bgColor: "#065F46",
    content:
      "Did you know? The heart line in your palm reveals your emotional nature and relationship patterns. A curved heart line indicates a passionate, expressive person. 💝",
    footer: "Hand Reading",
    likes: 345,
    comments: 72,
    shares: 41,
    createdAt: "2025-10-29T18:00:00Z",
  },
  {
    id: "10",
    astrologerId: "astro_005",
    astrologerName: "Vikash Joshi",
    emoji: "🌿",
    bgColor: "#14532D",
    content:
      "Plants in the east direction bring positive energy and growth. The Tulsi plant especially is considered sacred and purifies the air and energy of your home. 🌱",
    footer: "Vastu & Nature",
    likes: 512,
    comments: 103,
    shares: 78,
    createdAt: "2025-10-29T14:00:00Z",
  },
  {
    id: "11",
    astrologerId: "astro_001",
    astrologerName: "Suprio Karmakar",
    emoji: "⭐",
    bgColor: "#7C3AED",
    content:
      "Full Moon in Taurus tonight brings powerful energy for manifestation. Write down what you want to release and what you want to attract. 🌕",
    footer: "Full Moon Ritual",
    likes: 678,
    comments: 134,
    shares: 89,
    createdAt: "2025-10-29T10:00:00Z",
  },
  {
    id: "12",
    astrologerId: "astro_002",
    astrologerName: "Ananya Sharma",
    emoji: "💫",
    bgColor: "#1E3A5F",
    content:
      "The Fool card is not about foolishness — it's about courage. The courage to start fresh, to take a leap of faith into the unknown. Are you ready? 🌈",
    footer: "Tarot Wisdom",
    likes: 223,
    comments: 47,
    shares: 31,
    createdAt: "2025-10-28T16:00:00Z",
  },
  {
    id: "13",
    astrologerId: "astro_003",
    astrologerName: "Rohit Verma",
    emoji: "🪐",
    bgColor: "#0F172A",
    content:
      "Master Number 11 is the most intuitive of all numbers. If your name or birth date reduces to 11, you have a special connection to higher consciousness. ✨",
    footer: "Master Numbers",
    likes: 189,
    comments: 29,
    shares: 17,
    createdAt: "2025-10-28T12:00:00Z",
  },
  {
    id: "14",
    astrologerId: "astro_004",
    astrologerName: "Priya Nair",
    emoji: "🌙",
    bgColor: "#1E3A5F",
    content:
      "The fate line running straight and deep from the wrist to the middle finger indicates a person who is very focused and driven by destiny. 🎯",
    footer: "Fate Line Reading",
    likes: 267,
    comments: 58,
    shares: 33,
    createdAt: "2025-10-28T08:00:00Z",
  },
  {
    id: "15",
    astrologerId: "astro_005",
    astrologerName: "Vikash Joshi",
    emoji: "🏆",
    bgColor: "#78350F",
    content:
      "The south-west corner of your home governs stability and relationships. Keep this area heavy, grounded, and clutter-free for a harmonious family life. 🏡",
    footer: "Vastu Corner Tips",
    likes: 445,
    comments: 91,
    shares: 62,
    createdAt: "2025-10-27T18:00:00Z",
  },
  {
    id: "16",
    astrologerId: "astro_001",
    astrologerName: "Suprio Karmakar",
    emoji: "🌺",
    bgColor: "#6B21A8",
    content:
      "Jupiter enters Gemini — the planet of luck and expansion meets the sign of communication and learning. This is THE time to start a new course, write that book, or launch your podcast. 📢",
    footer: "Jupiter Transit",
    likes: 534,
    comments: 112,
    shares: 76,
    createdAt: "2025-10-27T14:00:00Z",
  },
  {
    id: "17",
    astrologerId: "astro_002",
    astrologerName: "Ananya Sharma",
    emoji: "🌊",
    bgColor: "#164E63",
    content:
      "Three cards for the week ahead:\n🌟 The Star — Hope and healing are available\n⚡ The Tower — Unexpected changes\n🌙 The Moon — Trust your intuition",
    footer: "Weekly Tarot Spread",
    likes: 389,
    comments: 84,
    shares: 55,
    createdAt: "2025-10-27T10:00:00Z",
  },
  {
    id: "18",
    astrologerId: "astro_003",
    astrologerName: "Rohit Verma",
    emoji: "💎",
    bgColor: "#1E40AF",
    content:
      "Your name carries a vibration. The letters in your name each have a numerical value that influences your personality, talents, and life path. Get your free name analysis in the comments! 🔢",
    footer: "Name Numerology",
    likes: 456,
    comments: 178,
    shares: 93,
    createdAt: "2025-10-26T16:00:00Z",
  },
  {
    id: "19",
    astrologerId: "astro_004",
    astrologerName: "Priya Nair",
    emoji: "🦋",
    bgColor: "#065F46",
    content:
      "Life Line myth busted! A short life line does NOT mean a short life. It represents the quality and vitality of your life energy — not its length. 💪",
    footer: "Palmistry Myths",
    likes: 612,
    comments: 143,
    shares: 87,
    createdAt: "2025-10-26T12:00:00Z",
  },
  {
    id: "20",
    astrologerId: "astro_005",
    astrologerName: "Vikash Joshi",
    emoji: "🔥",
    bgColor: "#92400E",
    content:
      "Avoid placing mirrors directly facing the bed — this is one of the most common Vastu mistakes. Mirrors reflect energy and can disturb sleep and relationships. 🪞",
    footer: "Vastu Bedroom Tips",
    likes: 723,
    comments: 167,
    shares: 112,
    createdAt: "2025-10-26T08:00:00Z",
  },
];

export default function FeedScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState(
    MOCK_FEED_POSTS.map((p) => ({ ...p, liked: false })),
  );

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const goToPost = (postId: string) => {
    router.push({
      pathname: "/(user)/post/[id]" as any,
      params: { id: postId },
    });
  };

  const goToAstrologer = (astrologerId: string) => {
    router.push({
      pathname: "/(user)/astrologer-profile" as any,
      params: { id: astrologerId },
    });
  };

  return (
    <View style={styles.root}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.4)",
                "#00000050",
                "rgba(255,255,255,0.4)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 2, width: "100%" }}
            />

            {/* Post Header — click → astrologer profile */}
            <TouchableOpacity
              style={styles.postHeader}
              activeOpacity={0.8}
              onPress={() => goToAstrologer(post.astrologerId)}
            >
              <View style={styles.postAuthorRow}>
                <View
                  style={[styles.postAvatar, { backgroundColor: post.bgColor }]}
                >
                  <Text style={styles.postAvatarEmoji}>{post.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.postAuthorName}>
                    {post.astrologerName}
                  </Text>
                  <Text style={styles.postTime}>
                    {new Date(post.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.postHeaderRight}>
                <TouchableOpacity
                  style={styles.followBtn}
                  onPress={(e) => e.stopPropagation?.()}
                >
                  <Text style={styles.followBtnText}>Follow +</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(e) => e.stopPropagation?.()}>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={28}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Post Content — click → post detail */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => goToPost(post.id)}
            >
              <View
                style={[
                  styles.postImageArea,
                  { backgroundColor: post.bgColor },
                ]}
              >
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postFooterRow}>
                  <View style={styles.postLogoSmall}>
                    <Text style={styles.postLogoAstro}>Astro</Text>
                    <View style={styles.postLogoBadge}>
                      <Text style={styles.postLogoBook}>Book</Text>
                    </View>
                  </View>
                  <Text style={styles.postFooterText}>{post.footer}</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Post Bottom */}
            <View style={styles.postBottom}>
              <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => toggleLike(post.id)}
                  >
                    <Text style={styles.icon}>{post.liked ? "❤️" : "👍"}</Text>
                    <Text style={styles.count}>{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => goToPost(post.id)}
                  >
                    <Text style={styles.icon}>💬</Text>
                    <Text style={styles.count}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.icon}>↗</Text>
                    <Text style={styles.count}>{post.shares}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => goToAstrologer(post.astrologerId)}
                >
                  <Text style={styles.bookText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  postCard: { backgroundColor: "#FFF", marginTop: 0 },
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  postAuthorRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  postAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  postAvatarEmoji: { fontSize: 20 },
  postAuthorName: { fontSize: 15, fontWeight: "700", color: "#0b1d5b" },
  postTime: { fontSize: 11, color: "#999" },
  postHeaderRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  followBtn: {},
  followBtnText: { color: "#9d0399", fontSize: 12, fontWeight: "600" },
  postImageArea: {
    width: SCREEN_WIDTH,
    minHeight: 320,
    padding: 24,
    justifyContent: "space-between",
  },
  postContent: {
    color: "#FFF",
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
    marginTop: 16,
  },
  postFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  postLogoSmall: { flexDirection: "row", alignItems: "center" },
  postLogoAstro: { fontSize: 13, fontWeight: "800", color: "#FFF" },
  postLogoBadge: {
    backgroundColor: "#FFFFFF30",
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 2,
  },
  postLogoBook: { fontSize: 13, fontWeight: "800", color: "#FFF" },
  postFooterText: { color: "#FFFFFFCC", fontSize: 13 },
  postBottom: { paddingHorizontal: 14, paddingVertical: 10 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  leftActions: { flexDirection: "row", alignItems: "center", gap: 18 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  icon: { fontSize: 16 },
  count: { fontSize: 13, color: "#9d0399" },
  bookBtn: {
    backgroundColor: "#9d0399",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bookText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
