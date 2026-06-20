import { MOCK_ASTROLOGERS, MOCK_SERVICES } from "@/mock/data";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Mock reviews
const MOCK_REVIEWS = [
  {
    id: "1",
    name: "Abhishek Ghosh",
    rating: 5,
    comment: "Amazing session! Very accurate and helpful. Highly recommend.",
    date: "15 Nov 2025",
  },
  {
    id: "2",
    name: "Preethi Menon",
    rating: 4,
    comment:
      "Very insightful reading. Got clarity on many things I was confused about.",
    date: "10 Nov 2025",
  },
  {
    id: "3",
    name: "Rahul Sharma",
    rating: 5,
    comment:
      "Suprio ji is very knowledgeable and patient. The session was very detailed and eye-opening.",
    date: "05 Nov 2025",
  },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{ fontSize: size, color: i <= rating ? "#F59E0B" : "#DDD" }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id, astroId } = useLocalSearchParams<{
    id: string;
    astroId: string;
  }>();

  const service = MOCK_SERVICES.find((s) => s.id === id) || MOCK_SERVICES[0];
  const astrologer =
    MOCK_ASTROLOGERS.find((a) => a.id === (astroId || service.astrologerId)) ||
    MOCK_ASTROLOGERS[0];

  const avgRating = 4.1;
  const totalReviews = 1031;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Banner */}
        <View style={[styles.hero, { backgroundColor: astrologer.color }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.heroEmoji}>{astrologer.emoji}</Text>
          <Text style={styles.heroServiceName}>{service.name}</Text>
          <View style={styles.heroChips}>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipText}>
                ⏱ {service.durationMins} min
              </Text>
            </View>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipText}>
                {service.callType === "VIDEO" ? "📹 Video" : "📞 Voice"}
              </Text>
            </View>
          </View>
        </View>

        {/* Astrologer Info */}
        <View style={styles.astroCard}>
          <Text style={styles.bookWith}>Book consultation with</Text>
          <TouchableOpacity
            style={styles.astroRow}
            onPress={() =>
              router.push({
                pathname: "/(user)/astrologer-profile" as any,
                params: { id: astrologer.id },
              })
            }
          >
            <View
              style={[
                styles.astroAvatar,
                { backgroundColor: astrologer.color },
              ]}
            >
              <Text style={{ fontSize: 24 }}>{astrologer.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.astroName}>{astrologer.name}</Text>
              <Text style={styles.astroSpeciality}>
                {astrologer.speciality} · {astrologer.experience}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#CCC" />
          </TouchableOpacity>
          <Text style={styles.astroDesc} numberOfLines={3}>
            {astrologer.bio}
          </Text>
        </View>

        {/* Reviews Summary */}
        <View style={styles.reviewsSummary}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingBig}>{avgRating}</Text>
            <View>
              <StarRating rating={Math.round(avgRating)} size={18} />
              <Text style={styles.ratingCount}>
                {totalReviews.toLocaleString()} reviews
              </Text>
            </View>
          </View>

          {/* Review Cards */}
          {MOCK_REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{review.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <StarRating rating={review.rating} size={12} />
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        {/* About Service */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About this Service</Text>
          <Text style={styles.aboutDesc}>{service.description}</Text>

          {/* What you'll get */}
          <View style={styles.benefitsList}>
            {[
              "Personalized reading based on your birth details",
              "Detailed analysis of planetary positions",
              "Career, relationship and health insights",
              "Remedies and solutions for challenges",
              "Q&A session to address your concerns",
              "Recording of the session (on request)",
            ].map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Text style={styles.benefitDot}>•</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          {["About Us", "Contact Us", "Policy", "Blog", "Help"].map(
            (link, i, arr) => (
              <View
                key={link}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <TouchableOpacity>
                  <Text style={styles.footerLink}>{link}</Text>
                </TouchableOpacity>
                {i < arr.length - 1 && (
                  <Text style={styles.footerSep}> | </Text>
                )}
              </View>
            ),
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>₹{service.price}</Text>
        </View>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => alert("Added to cart!")}
          >
            <Feather name="shopping-cart" size={15} color="#9d0399" />
            <Text style={styles.cartBtnText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() =>
              router.push({
                pathname: "/(user)/book-slot" as any,
                params: { astroId: astrologer.id, serviceId: service.id },
              })
            }
          >
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: { fontSize: 52, marginBottom: 4 },
  heroServiceName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
  },
  heroChips: { flexDirection: "row", gap: 8, marginTop: 4 },
  heroChip: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroChipText: { color: "#FFF", fontSize: 12, fontWeight: "600" },

  // Astro Card
  astroCard: {
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 2,
  },
  bookWith: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  astroRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  astroAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  astroName: { fontSize: 16, fontWeight: "800", color: "#1A1A2E" },
  astroSpeciality: {
    fontSize: 12,
    color: "#9d0399",
    fontWeight: "600",
    marginTop: 2,
  },
  astroDesc: { fontSize: 13, color: "#6B7280", lineHeight: 20 },

  // Reviews
  reviewsSummary: { paddingHorizontal: 16, paddingBottom: 8, gap: 12 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 4,
  },
  ratingBig: { fontSize: 42, fontWeight: "800", color: "#1A1A2E" },
  ratingCount: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
  reviewCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    gap: 8,
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { fontSize: 16, fontWeight: "700", color: "#9d0399" },
  reviewerName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 2,
  },
  reviewDate: { fontSize: 11, color: "#9CA3AF" },
  reviewComment: { fontSize: 13, color: "#555", lineHeight: 19 },

  // About
  aboutSection: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  aboutDesc: { fontSize: 14, color: "#555", lineHeight: 22 },
  benefitsList: { gap: 8, marginTop: 4 },
  benefitRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  benefitDot: { fontSize: 16, color: "#9d0399", lineHeight: 22 },
  benefitText: { fontSize: 13, color: "#555", lineHeight: 22, flex: 1 },

  // Footer
  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 4,
  },
  footerLink: { fontSize: 12, color: "#9CA3AF" },
  footerSep: { fontSize: 12, color: "#DDD" },

  // Bottom Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#EDE9FF",
    elevation: 10,
  },
  priceLabel: { fontSize: 11, color: "#9CA3AF" },
  price: { fontSize: 22, fontWeight: "800", color: "#9d0399" },
  bottomActions: { flexDirection: "row", gap: 10 },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#9d0399",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  cartBtnText: { color: "#9d0399", fontSize: 13, fontWeight: "700" },
  bookBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  bookBtnText: { color: "#FFF", fontSize: 13, fontWeight: "800" },
});
