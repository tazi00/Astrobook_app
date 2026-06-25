import Header from "@/components/header";
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
  // Nested Comment Example (Aap API ke through ise render karna)
  // {
  //   id: "4",
  //   name: "Suprio Karmakar",
  //   isReply: true,
  //   rating: 0,
  //   comment: "Thank you Abhishek! I'm glad I could help.",
  //   date: "16 Nov 2025",
  // },
];

// Updated StarRating with Purple filled stars and Grey empty stars
function StarRating({
  rating,
  size = 14,
  showNumber = false,
}: {
  rating: number;
  size?: number;
  showNumber?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: size,
            color: i <= Math.floor(rating) ? "#9d0399" : "#E5E7EB",
          }}
        >
          ★
        </Text>
      ))}
      {showNumber && (
        <Text style={{ fontSize: size - 2, color: "#6B7280", marginLeft: 6 }}>
          {rating}
        </Text>
      )}
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
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* --- 1. HERO BANNER --- */}

        <View
          style={{
            backgroundColor: "#fff1feff",
            marginHorizontal: 20,
            borderRadius: 20,
            marginTop: 30,
          }}
        >
          <View style={[styles.heroContainer]}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={22} color="#1F2937" />
            </TouchableOpacity>

            <View style={styles.heroContentRow}></View>
          </View>

          {/* --- 2. ASTROLOGER INFO CARD --- */}
          <View style={styles.astroCard}>
            <Text style={styles.bookWith}>
              Book consultation with{" "}
              <Text
                style={{ color: "#1F2937", fontWeight: "600", fontSize: 20 }}
              >
                {astrologer.name}
              </Text>
            </Text>

            <Text style={styles.astroDesc} numberOfLines={3}>
              {astrologer.bio}
            </Text>
          </View>

          {/* --- 3. CUSTOMER REVIEWS SECTION (EXACT MATCH) --- */}
          <View style={styles.reviewsSummary}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>

            {/* Rating Summary */}
            <View style={styles.ratingRow}>
              <Text style={styles.ratingBig}>{avgRating}</Text>
              <View style={{ gap: 2 }}>
                <StarRating rating={Math.round(avgRating)} size={20} />
                <Text style={styles.ratingCount}>
                  {totalReviews.toLocaleString()} reviews
                </Text>
              </View>
            </View>

            {/* Review Cards */}
            <View style={styles.reviewCardsContainer}>
              {MOCK_REVIEWS.map((review, index) => (
                <View key={review.id}>
                  <View style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>
                          {review.name[0]}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.reviewerName}>{review.name}</Text>
                        <StarRating rating={review.rating} size={13} />
                      </View>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </View>

                  {/* Future Implementation for Nested Replies (Space left here) */}
                  {/* {review.id === "1" && (
                   <View style={styles.nestedReply}>
                      ... Reply Component ...
                   </View>
                )} */}
                </View>
              ))}
            </View>
          </View>

          {/* --- 4. ABOUT THIS SERVICE --- */}
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About this Service</Text>

            <View style={styles.benefitsList}>
              {[
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.",
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.",
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.",
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.",
              ].map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <Text style={styles.benefitDot}>•</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* --- 6. STICKY BOTTOM BAR --- */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>₹{service.price}</Text>
        </View>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() =>
              router.push({
                pathname: "/(user)/cart" as any,
                params: { astroId: astrologer.id, serviceId: service.id },
              })
            }
          >
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

  // --- HERO ---
  heroContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    // backgroundColor: "#F9F5FF",
  },
  backBtn: {
    position: "absolute",
    top: 45,
    left: 30,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    zIndex: 9,
  },
  heroContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    height: 300,
    backgroundColor: "#059669",
    width: "100%",
    borderRadius: 16,
  },
  heroTextColumn: {
    flex: 1,
  },

  // --- ASTROLOGER INFO CARD ---
  astroCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  bookWith: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1F2937",
    textAlign: "center",
  },
  astroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
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
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 2,
  },
  astroDesc: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    textAlign: "center",
  },

  // --- CUSTOMER REVIEWS ---
  reviewsSummary: {
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1F2937",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  ratingBig: {
    fontSize: 44,
    fontWeight: "800",
    color: "#6B21A8",
  },
  ratingCount: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },

  // Review Cards Container
  reviewCardsContainer: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    gap: 8,
  },
  reviewHeader: { flexDirection: "row", alignItems: "center" },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { fontSize: 14, fontWeight: "700", color: "#9d0399" },
  reviewerName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  reviewDate: { fontSize: 11, color: "#9CA3AF", marginLeft: "auto" },
  reviewComment: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
    marginTop: 2,
  },

  // --- ABOUT THIS SERVICE ---
  aboutSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
    paddingBottom: 20,
  },
  benefitsList: { gap: 10, marginTop: 6 },
  benefitRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  benefitDot: { fontSize: 18, color: "#9d0399", lineHeight: 22 },
  benefitText: { fontSize: 13, color: "#4B5563", lineHeight: 22, flex: 1 },

  // --- FOOTER LINKS ---
  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 4,
    backgroundColor: "#F9F5FF",
  },
  footerLink: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  footerSep: { fontSize: 12, color: "#D1D5DB" },

  // --- BOTTOM STICKY BAR ---
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  priceLabel: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  price: { fontSize: 22, fontWeight: "700", color: "#6B21A8" },
  bottomActions: { flexDirection: "row", gap: 10 },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#9d0399",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cartBtnText: { color: "#9d0399", fontSize: 13, fontWeight: "700" },
  bookBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bookBtnText: { color: "#FFF", fontSize: 13, fontWeight: "700" },
});
