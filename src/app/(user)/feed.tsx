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
  // ... (rest of your mock data remains the same)
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

            {/* Post Header */}
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

            {/* Post Content */}
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

            {/* Post Bottom (Updated Icons Here) */}
            <View style={styles.postBottom}>
              <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => toggleLike(post.id)}
                  >
                    <MaterialCommunityIcons
                      name={post.liked ? "thumb-up" : "thumb-up-outline"}
                      size={22}
                      color="#9d0399"
                    />
                    <Text style={styles.count}>{post.likes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => goToPost(post.id)}
                  >
                    <MaterialCommunityIcons
                      name="comment-outline"
                      size={22}
                      color="#9d0399"
                    />
                    <Text style={styles.count}>{post.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons
                      name="share-outline"
                      size={22}
                      color="#9d0399"
                    />
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
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  count: { fontSize: 13, color: "#9d0399" },
  bookBtn: {
    backgroundColor: "#9d0399",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bookText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
