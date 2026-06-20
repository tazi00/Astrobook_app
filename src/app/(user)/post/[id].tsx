import { MOCK_ASTROLOGERS, MOCK_POSTS } from "@/mock/data";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const post = MOCK_POSTS.find((p) => p.id === id) || MOCK_POSTS[0];
  const astrologer =
    MOCK_ASTROLOGERS.find((a) => a.id === post.astrologerId) ||
    MOCK_ASTROLOGERS[0];
  const relatedPosts = MOCK_POSTS.filter((p) => p.id !== post.id);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Post */}
        <View style={[styles.postHero, { backgroundColor: post.bgColor }]}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={22} color="#FFF" />
          </TouchableOpacity>

          {/* Author Row */}
          <View style={styles.authorRow}>
            <TouchableOpacity
              style={styles.authorInfo}
              onPress={() =>
                router.push({
                  pathname: "/(user)/astrologer-profile" as any,
                  params: { id: astrologer.id },
                })
              }
            >
              <View style={styles.authorAvatar}>
                <Text style={{ fontSize: 22 }}>{post.emoji}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>{post.astrologerName}</Text>
                <Text style={styles.authorSpeciality}>
                  {astrologer.speciality}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Follow +</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color="rgba(255,255,255,0.8)"
              />
            </TouchableOpacity>
          </View>

          {/* Post Content */}
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Footer */}
          <View style={styles.postFooterRow}>
            <View style={styles.postLogoRow}>
              <Text style={styles.postLogoAstro}>Astro</Text>
              <View style={styles.postLogoBadge}>
                <Text style={styles.postLogoBook}>Book</Text>
              </View>
            </View>
            <Text style={styles.postFooterText}>{post.footer}</Text>
          </View>
        </View>

        {/* Actions Bar */}
        <View style={styles.actionsBar}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>👍</Text>
              <Text style={styles.actionCount}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionCount}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>↗</Text>
              <Text style={styles.actionCount}>{post.shares}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.bookNowBtn}
            onPress={() =>
              router.push({
                pathname: "/(user)/astrologer-profile" as any,
                params: { id: astrologer.id },
              })
            }
          >
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* Date */}
        <Text style={styles.dateText}>
          {new Date(post.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>

        {/* Related Posts */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>
            More posts from {post.astrologerName.split(" ")[0]}
          </Text>
          <FlatList
            data={relatedPosts}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.relatedCard, { backgroundColor: item.bgColor }]}
                activeOpacity={0.85}
                onPress={() =>
                  router.replace({
                    pathname: "/(user)/post/[id]" as any,
                    params: { id: item.id },
                  })
                }
              >
                <Text style={styles.relatedEmoji}>{item.emoji}</Text>
                <Text style={styles.relatedContent} numberOfLines={3}>
                  {item.content}
                </Text>
                <Text style={styles.relatedFooter}>{item.footer}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },

  // Post Hero
  postHero: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 16,
    gap: 16,
    minHeight: SCREEN_WIDTH,
    justifyContent: "space-between",
  },
  backBtn: {
    position: "absolute",
    top: 60,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Author
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  authorInfo: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  authorName: { fontSize: 14, fontWeight: "700", color: "#FFF" },
  authorSpeciality: { fontSize: 11, color: "rgba(255,255,255,0.75)" },
  followBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  followBtnText: { color: "#FFF", fontSize: 12, fontWeight: "600" },

  // Content
  postContent: {
    fontSize: 17,
    color: "#FFF",
    lineHeight: 26,
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
    marginVertical: 16,
  },

  // Footer
  postFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postLogoRow: { flexDirection: "row", alignItems: "center" },
  postLogoAstro: { fontSize: 13, fontWeight: "800", color: "#FFF" },
  postLogoBadge: {
    backgroundColor: "#FFFFFF30",
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 2,
  },
  postLogoBook: { fontSize: 13, fontWeight: "800", color: "#FFF" },
  postFooterText: { color: "rgba(255,255,255,0.8)", fontSize: 13 },

  // Actions
  actionsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDE9FF",
  },
  leftActions: { flexDirection: "row", alignItems: "center", gap: 20 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionIcon: { fontSize: 18 },
  actionCount: { fontSize: 14, color: "#555", fontWeight: "600" },
  bookNowBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  bookNowText: { color: "#FFF", fontSize: 13, fontWeight: "700" },

  // Date
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  // Related
  relatedSection: { paddingTop: 20 },
  relatedTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A2E",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  relatedList: { paddingHorizontal: 16, gap: 10 },
  relatedCard: {
    width: 160,
    height: 160,
    borderRadius: 14,
    padding: 12,
    justifyContent: "space-between",
  },
  relatedEmoji: { fontSize: 22 },
  relatedContent: {
    fontSize: 12,
    color: "#FFF",
    lineHeight: 17,
    flex: 1,
    marginTop: 6,
  },
  relatedFooter: {
    fontSize: 9,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
