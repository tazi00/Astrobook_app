import Header from "@/components/header";
import { MOCK_ASTROLOGERS, MOCK_POSTS } from "@/mock/data";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "love", label: "Love" },
  { id: "education", label: "Education" },
  { id: "career", label: "Career" },
  { id: "health", label: "Health" },
  { id: "finance", label: "Finance" },
  { id: "spiritual", label: "Spiritual" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: 12,
            color: i <= Math.floor(rating) ? "#F59E0B" : "#DDD",
          }}
        >
          ★
        </Text>
      ))}
      <Text style={{ fontSize: 11, color: "#666", marginLeft: 3 }}>
        {rating}
      </Text>
    </View>
  );
}

type Post = (typeof MOCK_POSTS)[number];

export default function AstrologersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.root}>
      <Header />

      {/* Filter Tabs */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.filterChip,
                activeFilter === f.id && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(f.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === f.id && styles.filterChipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Astrologer List */}
      <FlatList
        data={MOCK_ASTROLOGERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          const astrologerPosts = MOCK_POSTS.filter(
            (p) => p.astrologerId === item.id,
          );

          return (
            <View style={styles.card}>
              {/* Card Top — tap to expand */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => toggleExpand(item.id)}
              >
                <View style={styles.cardTop}>
                  <View
                    style={[styles.avatar, { backgroundColor: item.color }]}
                  >
                    <Text style={styles.avatarEmoji}>{item.emoji}</Text>
                    <View
                      style={[
                        styles.onlineDot,
                        {
                          backgroundColor: item.online ? "#22C55E" : "#9CA3AF",
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.cardName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        style={styles.followBtn}
                        onPress={(e) => e.stopPropagation?.()}
                      >
                        <Text style={styles.followBtnText}>Follow +</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cardSpeciality}>{item.speciality}</Text>
                    <Text style={styles.cardMeta}>{item.languages}</Text>
                    <Text style={styles.cardMeta}>Exp: {item.experience}</Text>
                    <View style={styles.ratingRow}>
                      <StarRating rating={item.rating} />
                      <Text style={styles.reviewCount}>
                        · {item.reviews} reviews
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardRight}>
                    <TouchableOpacity
                      style={styles.bookBtn}
                      onPress={() =>
                        router.push({
                          pathname: "/(user)/astrologer-profile" as any,
                          params: { id: item.id },
                        })
                      }
                    >
                      <Text style={styles.bookBtnPrice}>₹{item.price}</Text>
                      <Text style={styles.bookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                    <Feather
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#9CA3AF"
                      style={{ marginTop: 8, alignSelf: "center" }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Dropdown — Posts */}
              {isExpanded && (
                <View style={styles.dropdown}>
                  <View style={styles.dropdownDivider} />
                  <Text style={styles.dropdownTitle}>
                    Posts by {item.name.split(" ")[0]}
                  </Text>

                  {astrologerPosts.length === 0 ? (
                    <Text style={styles.noPostsText}>No posts yet</Text>
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.postsRow}
                    >
                      {astrologerPosts.map((post) => (
                        <TouchableOpacity
                          key={post.id}
                          style={[
                            styles.postThumb,
                            { backgroundColor: post.bgColor },
                          ]}
                          activeOpacity={0.85}
                          onPress={() => setSelectedPost(post)}
                        >
                          <Text style={styles.postThumbEmoji}>
                            {post.emoji}
                          </Text>
                          <Text
                            style={styles.postThumbContent}
                            numberOfLines={3}
                          >
                            {post.content}
                          </Text>
                          <Text style={styles.postThumbFooter}>
                            {post.footer}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}

                  {/* View Profile */}
                  <TouchableOpacity
                    style={styles.viewProfileBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/(user)/astrologer-profile" as any,
                        params: { id: item.id },
                      })
                    }
                  >
                    <Text style={styles.viewProfileText}>
                      View Full Profile →
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Post Modal */}
      <Modal
        visible={!!selectedPost}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedPost(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                {selectedPost && (
                  <>
                    {/* Square Post */}
                    <View
                      style={[
                        styles.postSquare,
                        { backgroundColor: selectedPost.bgColor },
                      ]}
                    >
                      <View style={styles.modalPostHeader}>
                        <View style={styles.modalAvatar}>
                          <Text style={{ fontSize: 18 }}>
                            {selectedPost.emoji}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.modalAuthorName}>
                            {selectedPost.astrologerName}
                          </Text>
                          <Text style={styles.modalPostBadge}>
                            {selectedPost.footer}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.modalCloseBtn}
                          onPress={() => setSelectedPost(null)}
                        >
                          <Feather
                            name="x"
                            size={18}
                            color="rgba(255,255,255,0.8)"
                          />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.modalPostContent} numberOfLines={8}>
                        {selectedPost.content}
                      </Text>

                      <View style={styles.modalPostFooterRow}>
                        <View style={styles.postLogoRow}>
                          <Text style={styles.postLogoAstro}>Astro</Text>
                          <View style={styles.postLogoBadge}>
                            <Text style={styles.postLogoBook}>Book</Text>
                          </View>
                        </View>
                        <Text style={styles.modalPostDate}>
                          {new Date(selectedPost.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short" },
                          )}
                        </Text>
                      </View>
                    </View>

                    {/* Actions + Read More */}
                    <View style={styles.modalActions}>
                      <TouchableOpacity style={styles.modalActionBtn}>
                        <Text>👍</Text>
                        <Text style={styles.modalActionText}>
                          {selectedPost.likes}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalActionBtn}>
                        <Text>💬</Text>
                        <Text style={styles.modalActionText}>
                          {selectedPost.comments}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalActionBtn}>
                        <Text>↗</Text>
                        <Text style={styles.modalActionText}>
                          {selectedPost.shares}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.readMoreBtn}
                        onPress={() => {
                          setSelectedPost(null);
                          router.push({
                            pathname: "/(user)/astrologer-profile" as any,
                            params: { id: selectedPost.astrologerId },
                          });
                        }}
                      >
                        <Text style={styles.readMoreText}>Read more →</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },
  filterWrapper: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDE9FF",
  },
  filtersRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F9F5FF",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
  },
  filterChipActive: { backgroundColor: "#9d0399", borderColor: "#9d0399" },
  filterChipText: { fontSize: 13, color: "#666", fontWeight: "500" },
  filterChipTextActive: { color: "#FFF", fontWeight: "700" },
  listContent: { padding: 16, gap: 14 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 2,
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    padding: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarEmoji: { fontSize: 28 },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  cardInfo: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  cardName: { fontSize: 15, fontWeight: "700", color: "#1A1A2E", flex: 1 },
  followBtn: {
    borderWidth: 1,
    borderColor: "#9d0399",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  followBtnText: { color: "#9d0399", fontSize: 11, fontWeight: "600" },
  cardSpeciality: {
    fontSize: 13,
    color: "#9d0399",
    fontWeight: "600",
    marginBottom: 1,
  },
  cardMeta: { fontSize: 11, color: "#888", marginBottom: 1 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  reviewCount: { fontSize: 11, color: "#AAA" },
  cardRight: { alignItems: "center" },
  bookBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  bookBtnPrice: { color: "#FFD700", fontSize: 11, fontWeight: "700" },
  bookBtnText: { color: "#FFF", fontSize: 11, fontWeight: "700" },

  // Dropdown
  dropdown: { paddingHorizontal: 14, paddingBottom: 14 },
  dropdownDivider: { height: 1, backgroundColor: "#F5F0FF", marginBottom: 12 },
  dropdownTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 10,
  },
  noPostsText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 8,
  },
  postsRow: { gap: 10 },
  postThumb: {
    width: 140,
    height: 140,
    borderRadius: 12,
    padding: 10,
    justifyContent: "space-between",
  },
  postThumbEmoji: { fontSize: 20 },
  postThumbContent: {
    fontSize: 11,
    color: "#FFF",
    lineHeight: 16,
    flex: 1,
    marginTop: 4,
  },
  postThumbFooter: {
    fontSize: 9,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  viewProfileBtn: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5F0FF",
  },
  viewProfileText: { color: "#9d0399", fontSize: 13, fontWeight: "700" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: { width: "100%", borderRadius: 20, overflow: "hidden" },
  postSquare: {
    width: "100%",
    aspectRatio: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  modalPostHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  modalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalAuthorName: { fontSize: 13, fontWeight: "700", color: "#FFF" },
  modalPostBadge: { fontSize: 10, color: "rgba(255,255,255,0.7)" },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalPostContent: {
    fontSize: 15,
    color: "#FFF",
    lineHeight: 22,
    textAlign: "center",
  },
  modalPostFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postLogoRow: { flexDirection: "row", alignItems: "center" },
  postLogoAstro: { fontSize: 11, fontWeight: "800", color: "#FFF" },
  postLogoBadge: {
    backgroundColor: "#FFFFFF30",
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 2,
  },
  postLogoBook: { fontSize: 11, fontWeight: "800", color: "#FFF" },
  modalPostDate: { fontSize: 10, color: "rgba(255,255,255,0.7)" },
  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
    backgroundColor: "#FFF",
  },
  modalActionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  modalActionText: { fontSize: 13, color: "#555", fontWeight: "600" },
  readMoreBtn: {
    marginLeft: "auto" as any,
    backgroundColor: "#9d0399",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  readMoreText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
});
