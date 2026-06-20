import { MOCK_ASTROLOGERS, MOCK_POSTS, MOCK_SERVICES } from "@/mock/data";
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

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: 13,
            color: i <= Math.floor(rating) ? "#F59E0B" : "#DDD",
          }}
        >
          ★
        </Text>
      ))}
      <Text style={{ fontSize: 12, color: "#666", marginLeft: 4 }}>
        {rating}
      </Text>
    </View>
  );
}

export default function AstrologerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const astrologer =
    MOCK_ASTROLOGERS.find((a) => a.id === id) || MOCK_ASTROLOGERS[0];
  const consultations = MOCK_SERVICES.filter(
    (s) => s.astrologerId === astrologer.id,
  );
  const posts = MOCK_POSTS.filter((p) => p.astrologerId === astrologer.id);

  // First service = basic/primary consultation
  const basicConsultation = consultations[0];
  const otherConsultations = consultations.slice(1);

  const goToService = (serviceId: string) => {
    router.push({
      pathname: "/(user)/service/[id]" as any,
      params: { id: serviceId, astroId: astrologer.id },
    });
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={[styles.hero, { backgroundColor: astrologer.color }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={22} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 52 }}>{astrologer.emoji}</Text>
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: astrologer.online ? "#22C55E" : "#9CA3AF" },
              ]}
            />
          </View>
          <Text style={styles.name}>{astrologer.name}</Text>
          <Text style={styles.speciality}>{astrologer.speciality}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{astrologer.rating}⭐</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{astrologer.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{astrologer.experience}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.followBtn}>
              <Feather name="user-plus" size={15} color="#9d0399" />
              <Text style={styles.followBtnText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Feather name="share-2" size={15} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🌐</Text>
            <Text style={styles.infoText}>{astrologer.languages}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>✨</Text>
            <Text style={styles.infoText}>
              {astrologer.interests.join(", ")}
            </Text>
          </View>
          <Text style={styles.bio}>{astrologer.bio}</Text>
        </View>

        {/* ── Basic Consultation (Primary) ── */}
        {basicConsultation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📌 Book Your First Consultation
            </Text>
            <TouchableOpacity
              style={[styles.basicCard, { borderColor: astrologer.color }]}
              activeOpacity={0.88}
              onPress={() => goToService(basicConsultation.id)}
            >
              <View style={styles.basicCardLeft}>
                <View
                  style={[
                    styles.basicIcon,
                    { backgroundColor: astrologer.color + "20" },
                  ]}
                >
                  <Text style={{ fontSize: 28 }}>{astrologer.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.basicName}>{basicConsultation.name}</Text>
                  <Text style={styles.basicDesc} numberOfLines={2}>
                    {basicConsultation.description}
                  </Text>
                  <View style={styles.basicChips}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>
                        ⏱ {basicConsultation.durationMins} min
                      </Text>
                    </View>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>
                        {basicConsultation.callType === "VIDEO"
                          ? "📹 Video"
                          : "📞 Voice"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.basicCardBottom}>
                <Text style={styles.basicPrice}>
                  ₹{basicConsultation.price}
                </Text>
                <View style={styles.basicActions}>
                  <TouchableOpacity
                    style={styles.cartBtn}
                    onPress={() => alert("Added to cart!")}
                  >
                    <Feather name="shopping-cart" size={14} color="#9d0399" />
                    <Text style={styles.cartBtnText}>Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.bookBtn,
                      { backgroundColor: astrologer.color },
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/(user)/book-slot" as any,
                        params: {
                          astroId: astrologer.id,
                          serviceId: basicConsultation.id,
                        },
                      })
                    }
                  >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* View Details */}
              <TouchableOpacity
                style={styles.viewDetailsRow}
                onPress={() => goToService(basicConsultation.id)}
              >
                <Text
                  style={[styles.viewDetailsText, { color: astrologer.color }]}
                >
                  View full details
                </Text>
                <Feather
                  name="chevron-right"
                  size={14}
                  color={astrologer.color}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {/* ── More Consultations ── */}
        {otherConsultations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>More Consultations</Text>
              <Text style={styles.sectionCount}>
                {otherConsultations.length} more
              </Text>
            </View>
            <FlatList
              data={otherConsultations}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.consultCard}
                  activeOpacity={0.88}
                  onPress={() => goToService(item.id)}
                >
                  <View
                    style={[
                      styles.consultIcon,
                      { backgroundColor: astrologer.color + "20" },
                    ]}
                  >
                    <Text style={{ fontSize: 22 }}>{astrologer.emoji}</Text>
                  </View>
                  <Text style={styles.consultName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.consultChips}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>
                        ⏱ {item.durationMins}m
                      </Text>
                    </View>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>
                        {item.callType === "VIDEO" ? "📹" : "📞"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.consultPrice}>₹{item.price}</Text>
                  <View style={styles.consultActions}>
                    <TouchableOpacity
                      style={styles.cartBtnSmall}
                      onPress={() => alert("Added to cart!")}
                    >
                      <Feather name="shopping-cart" size={12} color="#9d0399" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.bookBtnSmall}
                      onPress={() =>
                        router.push({
                          pathname: "/(user)/book-slot" as any,
                          params: {
                            astroId: astrologer.id,
                            serviceId: item.id,
                          },
                        })
                      }
                    >
                      <Text style={styles.bookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Posts</Text>
            <Text style={styles.sectionCount}>{posts.length} posts</Text>
          </View>
          {posts.length > 0 ? (
            <FlatList
              data={posts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.postCard, { backgroundColor: item.bgColor }]}
                  activeOpacity={0.88}
                  onPress={() =>
                    router.push({
                      pathname: "/(user)/post/[id]" as any,
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={styles.postFooterBadge}>{item.footer}</Text>
                  <Text style={styles.postContent} numberOfLines={5}>
                    {item.content}
                  </Text>
                  <View style={styles.postStats}>
                    <Text style={styles.postStat}>👍 {item.likes}</Text>
                    <Text style={styles.postStat}>💬 {item.comments}</Text>
                    <Text style={styles.postStat}>↗ {item.shares}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.emptyPosts}>
              <Text style={styles.emptyText}>No posts yet</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },
  hero: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 8,
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
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: "#FFF",
  },
  name: { fontSize: 24, fontWeight: "800", color: "#FFF" },
  speciality: { fontSize: 14, color: "rgba(255,255,255,0.85)" },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 8,
  },
  stat: { alignItems: "center", gap: 2 },
  statValue: { fontSize: 15, fontWeight: "800", color: "#FFF" },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,0.7)" },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  followBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  followBtnText: { color: "#9d0399", fontWeight: "700", fontSize: 14 },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: -12,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 2,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoIcon: { fontSize: 16, width: 24 },
  infoText: { fontSize: 13, color: "#555", flex: 1 },
  bio: { fontSize: 13, color: "#6B7280", lineHeight: 20, marginTop: 4 },
  section: { paddingTop: 20, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 12,
  },
  sectionCount: { fontSize: 12, color: "#9CA3AF" },
  horizontalList: { gap: 12 },

  // Basic Card
  basicCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    gap: 12,
    elevation: 2,
  },
  basicCardLeft: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  basicIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  basicName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  basicDesc: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 6,
  },
  basicChips: { flexDirection: "row", gap: 6 },
  basicCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  basicPrice: { fontSize: 22, fontWeight: "800", color: "#9d0399" },
  basicActions: { flexDirection: "row", gap: 8 },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1.5,
    borderColor: "#9d0399",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cartBtnText: { color: "#9d0399", fontSize: 12, fontWeight: "700" },
  bookBtn: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  bookBtnText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  viewDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F5F0FF",
    gap: 4,
  },
  viewDetailsText: { fontSize: 13, fontWeight: "600" },

  // Consultation Cards
  chip: {
    backgroundColor: "#F5F0FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: { fontSize: 10, color: "#6B21A8", fontWeight: "600" },
  consultCard: {
    width: 160,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    gap: 8,
    elevation: 1,
  },
  consultIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  consultName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A2E",
    lineHeight: 18,
  },
  consultChips: { flexDirection: "row", gap: 6 },
  consultPrice: { fontSize: 18, fontWeight: "800", color: "#9d0399" },
  consultActions: { flexDirection: "row", gap: 6, alignItems: "center" },
  cartBtnSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#9d0399",
    alignItems: "center",
    justifyContent: "center",
  },
  bookBtnSmall: {
    flex: 1,
    backgroundColor: "#9d0399",
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: "center",
  },

  // Post Card
  postCard: {
    width: SCREEN_WIDTH * 0.6,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  postFooterBadge: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  postContent: { fontSize: 13, color: "#FFF", lineHeight: 19, flex: 1 },
  postStats: { flexDirection: "row", gap: 12 },
  postStat: { fontSize: 11, color: "rgba(255,255,255,0.8)" },
  emptyPosts: { paddingVertical: 20, alignItems: "center" },
  emptyText: { fontSize: 13, color: "#9CA3AF" },
});
