import Header from "@/components/header";
import { MOCK_ASTROLOGERS, MOCK_POSTS } from "@/mock/data";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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

const STORIES = MOCK_ASTROLOGERS.map((a) => ({
  id: a.id,
  name: a.name.split(" ")[0],
  emoji: a.emoji,
  color: a.color,
}));

export default function FeedScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState(
    MOCK_POSTS.map((p) => ({ ...p, liked: false })),
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

  return (
    <View style={styles.root}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Stories Row */}
        <FlatList
          data={STORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.storyItem} activeOpacity={0.8}>
              <View style={[styles.storyRing, { borderColor: item.color }]}>
                <View
                  style={[styles.storyAvatar, { backgroundColor: item.color }]}
                >
                  <Text style={styles.storyEmoji}>{item.emoji}</Text>
                </View>
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Posts */}
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
            <View style={styles.postHeader}>
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
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.postHeaderRight}>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followBtnText}>Follow +</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={28}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Post Content Area */}
            <View
              style={[styles.postImageArea, { backgroundColor: post.bgColor }]}
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
                  <TouchableOpacity style={styles.actionBtn}>
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
                  onPress={() => router.push("/(user)/explore" as any)}
                >
                  <Text style={styles.bookText}>Book Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.dateText}>
                {new Date(post.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
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
  storiesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 20,
    backgroundColor: "#FFF",
  },
  storyItem: { alignItems: "center", width: 64 },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    padding: 2,
    marginBottom: 5,
  },
  storyAvatar: {
    flex: 1,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  storyEmoji: { fontSize: 24 },
  storyName: { fontSize: 11, color: "#444", textAlign: "center", width: 60 },
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
  dateText: { fontSize: 12, color: "#8B8BA5", marginTop: 6 },
});
