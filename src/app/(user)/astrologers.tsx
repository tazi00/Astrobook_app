import Header from "@/components/header";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- MOCK DATA ---
const MOCK_ASTROLOGERS = [
  {
    id: "1",
    name: "Suprio Karmakar",
    speciality: "Vedic Astrology",
    languages: "Bengali, Hindi, English",
    experience: "12 years",
    rating: 4.8,
    reviews: 342,
    price: 499,
    emoji: "🔮",
    color: "#6B21A8",
    online: true,
    category: "all",
  },
  {
    id: "2",
    name: "Ananya Sharma",
    speciality: "Tarot Reading",
    languages: "Hindi, English",
    experience: "8 years",
    rating: 4.6,
    reviews: 218,
    price: 349,
    emoji: "⭐",
    color: "#BE185D",
    online: true,
    category: "love",
  },
  {
    id: "3",
    name: "Rohit Verma",
    speciality: "Numerology",
    languages: "Hindi, English",
    experience: "6 years",
    rating: 4.5,
    reviews: 156,
    price: 299,
    emoji: "🌙",
    color: "#1D4ED8",
    online: true,
    category: "education",
  },
  {
    id: "4",
    name: "Priya Nair",
    speciality: "Palmistry",
    languages: "Malayalam, English, Hindi",
    experience: "10 years",
    rating: 4.7,
    reviews: 289,
    price: 399,
    emoji: "☀️",
    color: "#059669",
    online: true,
    category: "health",
  },
  {
    id: "5",
    name: "Vikash Joshi",
    speciality: "Vastu Shastra",
    languages: "Hindi, English",
    experience: "15 years",
    rating: 4.9,
    reviews: 421,
    price: 599,
    emoji: "🪐",
    color: "#B45309",
    online: true,
    category: "career",
  },
];

const MOCK_POSTS = [
  {
    id: "1",
    astrologerId: "1",
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
    id: "3",
    astrologerId: "2",
    astrologerName: "Ananya Sharma",
    emoji: "🌟",
    bgColor: "#1E3A5F",
    content:
      "Mercury Retrograde ends today! Time to move forward with clarity.",
    footer: "Cosmic Update",
    likes: 156,
    comments: 28,
    shares: 12,
    createdAt: "2025-11-01T08:00:00Z",
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "love", label: "Love" },
  { id: "education", label: "Education" },
  { id: "career", label: "Career" },
  { id: "health", label: "Health" },
  { id: "finance", label: "Finance" },
  { id: "spiritual", label: "Spiritual" },
];

// --- STAR RATING COMPONENT ---
function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: 12,
            color: i <= Math.floor(rating) ? "#F59E0B" : "#E5E7EB",
          }}
        >
          ★
        </Text>
      ))}
      <Text style={{ fontSize: 11, color: "#6B7280", marginLeft: 4 }}>
        {rating}
      </Text>
    </View>
  );
}

export default function AstrologersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Post Detail Page par navigate karne ka function
  const goToPost = (postId: string) => {
    router.push({
      pathname: "/(user)/post/[id]" as any,
      params: { id: postId },
    });
  };

  // Filtering Logic
  const filteredAstrologers = MOCK_ASTROLOGERS.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

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
        data={filteredAstrologers}
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
                  {/* 1. Avatar */}
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarEmoji}>{item.emoji}</Text>
                  </View>

                  {/* 2. Info Section */}
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.cardName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={styles.cardSpeciality}>{item.speciality}</Text>
                    <Text style={styles.cardMeta}>
                      {item.languages}{" "}
                      {item.experience ? `· Exp: ${item.experience}` : ""}
                    </Text>

                    <View style={styles.ratingRow}>
                      <StarRating rating={item.rating} />
                      <Text style={styles.reviewCount}>
                        · {item.reviews} reviews
                      </Text>
                    </View>
                  </View>

                  {/* 3. Right Actions (Follow + Book) */}
                  <View style={styles.cardRight}>
                    <TouchableOpacity
                      style={styles.followBtn}
                      onPress={(e) => e.stopPropagation?.()}
                    >
                      <Text style={styles.followBtnText}>Follow +</Text>
                    </TouchableOpacity>

                    {/* Split Book Now Button */}
                    <TouchableOpacity
                      style={styles.bookBtnWrapper}
                      onPress={() =>
                        router.push({
                          pathname: "/(user)/astrologer-profile" as any,
                          params: { id: item.id },
                        })
                      }
                    >
                      <View style={styles.bookBtnTop}>
                        <Text style={styles.bookBtnText}>Book Now</Text>
                      </View>
                      <View style={styles.bookBtnBottom}>
                        <Text style={styles.bookBtnPrice}>₹{item.price}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Dropdown — Posts (Full width, Square Cards) */}
              {isExpanded && (
                <View style={styles.dropdown}>
                  <View style={styles.dropdownDivider} />

                  <View style={styles.dropdownHeaderRow}>
                    <Text style={styles.dropdownTitle}>
                      Posts by {item.name.split(" ")[0]}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/(user)/astrologer-profile" as any,
                          params: { id: item.id, tab: "posts" },
                        })
                      }
                    >
                      <Text style={styles.seeMoreLink}>See more posts</Text>
                    </TouchableOpacity>
                  </View>

                  {astrologerPosts.length === 0 ? (
                    <Text style={styles.noPostsText}>No posts yet</Text>
                  ) : (
                    <View style={styles.postsList}>
                      {astrologerPosts.map((post) => (
                        <TouchableOpacity
                          key={post.id}
                          style={[
                            styles.postSquareCard,
                            { backgroundColor: post.bgColor },
                          ]}
                          activeOpacity={0.85}
                          onPress={() => goToPost(post.id)} // Click → Navigate to Post Detail
                        >
                          <View>
                            <Text style={styles.postThumbEmoji}>
                              {post.emoji}
                            </Text>
                            <Text
                              style={styles.postThumbContent}
                              numberOfLines={6}
                            >
                              {post.content}
                            </Text>
                          </View>
                          <Text style={styles.postThumbFooter}>
                            {post.footer}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        }}
      />
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
  filtersRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F9F5FF",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
  },
  filterChipActive: { backgroundColor: "#9d0399", borderColor: "#9d0399" },
  filterChipText: { fontSize: 13, color: "#666", fontWeight: "500" },
  filterChipTextActive: { color: "#FFF", fontWeight: "700" },

  listContent: { padding: 16, gap: 16 },

  // --- CARD DESIGN ---
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
    padding: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#e8d5f5",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarEmoji: { fontSize: 34 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 1 },
  cardName: { fontSize: 16, fontWeight: "700", color: "#0b1d5b" },
  cardSpeciality: {
    fontSize: 13,
    color: "#9d0399",
    fontWeight: "600",
    marginBottom: 2,
  },
  cardMeta: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  reviewCount: { fontSize: 12, color: "#9d0399" },
  cardRight: { alignItems: "flex-end", gap: 8 },

  followBtn: {
    paddingHorizontal: 4,
  },
  followBtnText: { color: "#9d0399", fontSize: 12, fontWeight: "600" },

  // --- SPLIT BOOK BUTTON ---
  bookBtnWrapper: {
    backgroundColor: "#9d0399",
    borderRadius: 8,
    overflow: "hidden",
    minWidth: 80,
  },
  bookBtnTop: {
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: "#9d0399",
  },
  bookBtnBottom: {
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: "#eac0e8",
  },
  bookBtnText: { color: "#FFF", fontSize: 11, fontWeight: "700" },
  bookBtnPrice: { color: "#9d0399", fontSize: 11, fontWeight: "700" },

  // --- DROPDOWN (Posts) ---
  dropdown: { paddingHorizontal: 16, paddingBottom: 16 },
  dropdownDivider: { height: 1, backgroundColor: "#F5F0FF", marginBottom: 12 },
  dropdownHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dropdownTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  seeMoreLink: {
    color: "#9d0399",
    fontSize: 12,
    fontWeight: "600",
  },
  noPostsText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 8,
  },

  // Vertical posts list (Full width square cards)
  postsList: {
    flexDirection: "column",
    gap: 16,
  },
  postSquareCard: {
    width: "100%",
    aspectRatio: 1, // Makes it a perfect square
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
  },
  postThumbEmoji: { fontSize: 20, marginBottom: 8 },
  postThumbContent: {
    fontSize: 14,
    color: "#FFF",
    lineHeight: 20,
    fontWeight: "500",
  },
  postThumbFooter: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
