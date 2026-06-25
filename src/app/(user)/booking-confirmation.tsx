import Header from "@/components/header";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data — wire karna baad mein payment response se
const MOCK_BOOKING = {
  orderDate: "8th Dec 2025",
  bookingId: "AB548652",
  transactionId: "694754758654",
  items: [
    {
      id: "1",
      serviceName: "Kundli Analysis",
      astrologerName: "Pt. Rajesh Sharma",
      type: "Consultation",
      price: 1200,
      date: "9th Dec 2025, Tue",
      emoji: "🔮",
    },
    {
      id: "2",
      serviceName: "Couples Harmony",
      astrologerName: "Astro Book",
      type: "Consultation",
      price: 4000,
      date: "9th Dec 2025, Tue",
      emoji: "💑",
    },
    {
      id: "3",
      serviceName: "Career Guidance",
      astrologerName: "Pt. Suresh Mishra",
      type: "Consultation",
      price: 800,
      date: "9th Dec 2025, Tue",
      emoji: "⭐",
    },
  ],
  customer: {
    name: "Ankush Sarkar",
    phone: "+91 99968 47146",
    email: "ankush256@gmail.com",
    address: "Champadali More, Barasat, North 24 Parganas, WB - 700125",
  },
  originalPrice: 12000,
  discount: 2000,
  platformFee: 20,
  shipping: 100,
};

const total =
  MOCK_BOOKING.originalPrice -
  MOCK_BOOKING.discount +
  MOCK_BOOKING.platformFee +
  MOCK_BOOKING.shipping;

export default function OrderSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {/* --- SUCCESS BANNER --- */}
        <View style={styles.successBanner}>
          <View style={styles.checkCircle}>
            <Feather name="check" size={32} color="#FFF" />
          </View>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your order has been confirmed
          </Text>
          <View style={styles.orderMetaRow}>
            <Text style={styles.orderMetaText}>
              Order placed on{" "}
              <Text style={styles.orderMetaBold}>{MOCK_BOOKING.orderDate}</Text>
            </Text>
          </View>
          <View style={styles.idRow}>
            <Text style={styles.idLabel}>Booking ID:</Text>
            <Text style={styles.idValue}>{MOCK_BOOKING.bookingId}</Text>
          </View>
          <View style={styles.idRow}>
            <Text style={styles.idLabel}>Transaction ID:</Text>
            <Text style={styles.idValue}>{MOCK_BOOKING.transactionId}</Text>
          </View>
        </View>

        {/* --- BOOKED SERVICES --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booked Services</Text>
          {MOCK_BOOKING.items.map((item, index) => (
            <View key={item.id}>
              <View style={styles.serviceRow}>
                <View style={styles.serviceEmoji}>
                  <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.serviceTopRow}>
                    <Text style={styles.serviceName}>{item.serviceName}</Text>
                    <Text style={styles.servicePrice}>₹ {item.price}</Text>
                  </View>
                  <View style={styles.serviceMetaRow}>
                    <Text style={styles.serviceAstro}>
                      by {item.astrologerName}
                    </Text>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{item.type}</Text>
                    </View>
                  </View>
                  <View style={styles.serviceDateRow}>
                    <Feather name="calendar" size={11} color="#9d0399" />
                    <Text style={styles.serviceDateText}>{item.date}</Text>
                    <Text style={styles.serviceQty}>Qty : 1</Text>
                  </View>
                </View>
              </View>
              {index < MOCK_BOOKING.items.length - 1 && (
                <View style={styles.itemDivider} />
              )}
            </View>
          ))}
        </View>

        {/* --- CUSTOMER DETAILS --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name : </Text>
            <Text style={styles.detailValue}>{MOCK_BOOKING.customer.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone : </Text>
            <Text style={styles.detailValue}>
              {MOCK_BOOKING.customer.phone}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email : </Text>
            <Text style={styles.detailValue}>
              {MOCK_BOOKING.customer.email}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address : </Text>
            <Text style={[styles.detailValue, { flex: 1 }]}>
              {MOCK_BOOKING.customer.address}
            </Text>
          </View>
        </View>

        {/* --- PRICE DETAILS --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Price details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Price ({MOCK_BOOKING.items.length} Items)
            </Text>
            <Text style={styles.priceValue}>
              ₹ {MOCK_BOOKING.originalPrice}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Discount</Text>
            <Text style={[styles.priceValue, styles.discountText]}>
              - ₹ {MOCK_BOOKING.discount}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={styles.priceLabel}>Platform Fee</Text>
              <Feather name="info" size={13} color="#9CA3AF" />
            </View>
            <Text style={styles.priceValue}>₹ {MOCK_BOOKING.platformFee}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping</Text>
            <Text style={styles.priceValue}>₹ {MOCK_BOOKING.shipping}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹ {total}</Text>
          </View>

          <Text style={styles.savingText}>
            You saved ₹{MOCK_BOOKING.discount} on this order 🎉
          </Text>
        </View>

        {/* --- ACTION BUTTONS --- */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push("/(user)/cart" as any)}
          >
            <Text style={styles.secondaryBtnText}>Return to cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/(user)/my-bookings" as any)}
          >
            <Text style={styles.primaryBtnText}>My bookings →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },
  listContent: { padding: 16, gap: 14 },

  // Success Banner
  successBanner: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 2,
    gap: 6,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  successSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  orderMetaRow: { marginTop: 4 },
  orderMetaText: { fontSize: 13, color: "#6B7280" },
  orderMetaBold: { color: "#1A1A2E", fontWeight: "700" },
  idRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  idLabel: { fontSize: 12, color: "#9CA3AF" },
  idValue: { fontSize: 12, color: "#9d0399", fontWeight: "700" },

  // Card
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 2,
    gap: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1F2937" },

  // Service items
  serviceRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  serviceEmoji: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  serviceTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
    flex: 1,
    marginRight: 8,
  },
  servicePrice: { fontSize: 14, fontWeight: "800", color: "#9d0399" },
  serviceMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  serviceAstro: { fontSize: 11, color: "#6B7280" },
  typeBadge: {
    backgroundColor: "#F3E8FF",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  typeBadgeText: { fontSize: 10, color: "#9d0399", fontWeight: "600" },
  serviceDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  serviceDateText: { fontSize: 11, color: "#9d0399", fontWeight: "500" },
  serviceQty: { fontSize: 11, color: "#9CA3AF", marginLeft: 8 },
  itemDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },

  // Customer details
  detailRow: { flexDirection: "row", alignItems: "flex-start" },
  detailLabel: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  detailValue: { fontSize: 13, color: "#1F2937", fontWeight: "600" },

  // Price
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  priceLabel: { fontSize: 13, color: "#6B7280" },
  priceValue: { fontSize: 13, fontWeight: "600", color: "#1A1A2E" },
  discountText: { color: "#22C55E" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 4 },
  totalLabel: { fontSize: 15, fontWeight: "700", color: "#1F2937" },
  totalValue: { fontSize: 17, fontWeight: "800", color: "#9d0399" },
  savingText: { fontSize: 12, color: "#22C55E", fontWeight: "500" },

  // Action buttons
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#9d0399",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#9d0399",
    fontSize: 14,
    fontWeight: "700",
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#9d0399",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    elevation: 2,
  },
  primaryBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
