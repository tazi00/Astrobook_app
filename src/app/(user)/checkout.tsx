import Header from "@/components/header";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock order data — wire karna baad mein params/cart se
const MOCK_ORDER = {
  astrologerName: "Pt. Rajesh Sharma",
  astrologerEmoji: "🔮",
  serviceName: "Kundli Analysis",
  callType: "VIDEO",
  durationMins: 30,
  date: "25 June 2026",
  time: "11:00 AM",
  items: 1,
  originalPrice: 1200,
  discount: 200,
  platformFee: 20,
  couponDiscount: 0,
};

const VALID_COUPONS: Record<string, number> = {
  ASTRO10: 100,
  FIRST50: 50,
};

export default function CheckoutScreen() {
  const router = useRouter();

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const subtotal =
    MOCK_ORDER.originalPrice -
    MOCK_ORDER.discount -
    couponDiscount +
    MOCK_ORDER.platformFee;

  const totalSavings = MOCK_ORDER.discount + couponDiscount;

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setCouponDiscount(VALID_COUPONS[code]);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon("");
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponError("");
  };

  const handlePayment = () => {
    router.push("/(user)/booking-confirmation");
    // TODO: Razorpay integration
    // alert("Navigating to Payment Gateway...");
  };

  return (
    <View style={styles.root}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {/* --- ORDER SUMMARY CARD --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.orderRow}>
            <View style={styles.orderEmoji}>
              <Text style={{ fontSize: 28 }}>{MOCK_ORDER.astrologerEmoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderServiceName}>
                {MOCK_ORDER.serviceName}
              </Text>
              <Text style={styles.orderAstroName}>
                with {MOCK_ORDER.astrologerName}
              </Text>
              <View style={styles.orderChipsRow}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {MOCK_ORDER.callType === "VIDEO" ? "📹 Video" : "📞 Voice"}
                  </Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    ⏱ {MOCK_ORDER.durationMins} min
                  </Text>
                </View>
              </View>
              <View style={styles.slotRow}>
                <Feather name="calendar" size={12} color="#9d0399" />
                <Text style={styles.slotText}>
                  {MOCK_ORDER.date} • {MOCK_ORDER.time}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* --- CUSTOMER DETAILS CARD --- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Customer details</Text>
            <TouchableOpacity
              onPress={() => alert("Open Edit Address/Profile Modal")}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name : </Text>
            <Text style={styles.detailValue}>Ankush Sarkar</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone : </Text>
            <Text style={styles.detailValue}>+91 99968 47146</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email : </Text>
            <Text style={styles.detailValue}>ankush256@gmail.com</Text>
          </View>
        </View>

        {/* --- COUPON CARD --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Apply Coupon</Text>

          {couponApplied ? (
            <View style={styles.couponAppliedRow}>
              <View style={styles.couponAppliedLeft}>
                <Feather name="tag" size={14} color="#22C55E" />
                <Text style={styles.couponAppliedText}>
                  "{coupon.toUpperCase()}" applied — ₹{couponDiscount} off!
                </Text>
              </View>
              <TouchableOpacity onPress={handleRemoveCoupon}>
                <Text style={styles.couponRemoveText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter coupon code"
                  placeholderTextColor="#9CA3AF"
                  value={coupon}
                  onChangeText={(t) => {
                    setCoupon(t);
                    setCouponError("");
                  }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={[
                    styles.couponApplyBtn,
                    !coupon.trim() && styles.couponApplyBtnDisabled,
                  ]}
                  onPress={handleApplyCoupon}
                  disabled={!coupon.trim()}
                >
                  <Text style={styles.couponApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {couponError ? (
                <Text style={styles.couponErrorText}>{couponError}</Text>
              ) : null}
              <Text style={styles.couponHint}>Try: ASTRO10 or FIRST50</Text>
            </>
          )}
        </View>

        {/* --- PRICE DETAILS CARD --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Price details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Price ({MOCK_ORDER.items} item)
            </Text>
            <Text style={styles.priceValue}>₹ {MOCK_ORDER.originalPrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Discount</Text>
            <Text style={[styles.priceValue, styles.discountText]}>
              - ₹ {MOCK_ORDER.discount}
            </Text>
          </View>
          {couponApplied && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Coupon ({coupon.toUpperCase()})
              </Text>
              <Text style={[styles.priceValue, styles.discountText]}>
                - ₹ {couponDiscount}
              </Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={styles.priceLabel}>Platform Fee</Text>
              <Feather name="info" size={13} color="#9CA3AF" />
            </View>
            <Text style={styles.priceValue}>₹ {MOCK_ORDER.platformFee}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹ {subtotal}</Text>
          </View>

          <Text style={styles.savingText}>
            You will save ₹{totalSavings} on this order 🎉
          </Text>
        </View>

        {/* --- CANCELLATION POLICY --- */}
        <View style={styles.policyCard}>
          <View style={styles.policyHeaderRow}>
            <Feather name="alert-circle" size={14} color="#F59E0B" />
            <Text style={styles.policyTitle}>Cancellation Policy</Text>
          </View>
          <Text style={styles.policyText}>
            • Free cancellation up to{" "}
            <Text style={styles.policyBold}>1 hour</Text> before session.
          </Text>
          <Text style={styles.policyText}>
            • 50% refund if cancelled within 1 hour of session.
          </Text>
          <Text style={styles.policyText}>• No refund for no-shows.</Text>
        </View>

        {/* --- MAKE PAYMENT --- */}

        <View style={{ height: 70 }} />
      </ScrollView>
      <View style={styles.stickyBottom}>
        <TouchableOpacity style={styles.paymentBtn} onPress={handlePayment}>
          <Text style={styles.paymentBtnText}>Make Payment • ₹{subtotal}</Text>
        </TouchableOpacity>
        <View style={styles.securePaymentRow}>
          <Feather name="shield" size={16} color="#22C55E" />
          <Text style={styles.secureText}>Safe and Secure Payments</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },
  listContent: { padding: 16, gap: 14, paddingBottom: 40 },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    gap: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1F2937" },

  // Order Summary
  orderRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  orderEmoji: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  orderServiceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 2,
  },
  orderAstroName: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  orderChipsRow: { flexDirection: "row", gap: 6, marginBottom: 6 },
  chip: {
    backgroundColor: "#F5F0FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: { fontSize: 11, color: "#6B21A8", fontWeight: "600" },
  slotRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  slotText: { fontSize: 12, color: "#9d0399", fontWeight: "600" },

  // Customer Details
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editBtnText: { color: "#9d0399", fontSize: 13, fontWeight: "600" },
  detailRow: { flexDirection: "row", alignItems: "flex-start" },
  detailLabel: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  detailValue: { fontSize: 13, color: "#1F2937", fontWeight: "600", flex: 1 },

  // Coupon
  couponInputRow: { flexDirection: "row", gap: 8 },
  couponInput: {
    flex: 1,
    backgroundColor: "#F9F5FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1A1A2E",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
    letterSpacing: 1,
  },
  couponApplyBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  couponApplyBtnDisabled: { opacity: 0.4 },
  couponApplyText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  couponErrorText: { fontSize: 12, color: "#EF4444" },
  couponHint: { fontSize: 11, color: "#9CA3AF" },
  couponAppliedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  couponAppliedLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  couponAppliedText: { fontSize: 13, color: "#15803D", fontWeight: "600" },
  couponRemoveText: { fontSize: 12, color: "#EF4444", fontWeight: "600" },

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

  // Policy
  policyCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    gap: 5,
  },
  policyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  policyTitle: { fontSize: 13, fontWeight: "700", color: "#92400E" },
  policyText: { fontSize: 12, color: "#78350F", lineHeight: 18 },
  policyBold: { fontWeight: "700" },

  // Bottom
  bottomActionContainer: { marginTop: 4, alignItems: "center", gap: 10 },
  paymentBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 12,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    elevation: 3,
  },
  paymentBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  securePaymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  secureText: { fontSize: 12, color: "#6B7280" },
  stickyBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24, // safe area ke liye
    borderTopWidth: 1,
    borderTopColor: "#EDE9FF",
    gap: 8,
    elevation: 10,
  },
});
