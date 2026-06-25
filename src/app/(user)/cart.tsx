import Header from "@/components/header";
import { Feather } from "@expo/vector-icons";
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

// Mock Cart Items (Aap API ya State se replace kar sakte hain)
const MOCK_CART_ITEMS = [
  {
    id: "1",
    serviceName: "Couples Harmony",
    astrologerName: "Suprio Karmakar",
    price: 4000,
    emoji: "🔮",
    color: "#6B21A8",
    slotConfirmed: false,
  },
  {
    id: "2",
    serviceName: "Love Healing",
    astrologerName: "Ananya Sharma",
    price: 1000,
    emoji: "⭐",
    color: "#BE185D",
    slotConfirmed: false,
  },
  {
    id: "3",
    serviceName: "Career Guidance",
    astrologerName: "Rohit Verma",
    price: 3000,
    emoji: "🌙",
    color: "#1D4ED8",
    slotConfirmed: false,
  },
];

export default function CartScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("consultancy");
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  // --- LOGIC FOR PRICE CALCULATIONS ---
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = 2000; // Mock discount
  const platformFee = 20;
  const shipping = 100;
  const grandTotal = totalPrice - discount + platformFee + shipping;

  // --- LOGIC: CHECK IF ALL SLOTS ARE CONFIRMED ---
  const isAllSlotsConfirmed = cartItems.every((item) => item.slotConfirmed);

  // --- HANDLERS ---
  const toggleSlotConfirmation = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, slotConfirmed: !item.slotConfirmed } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.root}>
      {/* --- HEADER --- */}
      <Header />

      {/* --- TABS --- */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.tabActive]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.tabTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "consultancy" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("consultancy")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "consultancy" && styles.tabTextActive,
              ]}
            >
              Consultancy
            </Text>
          </TouchableOpacity>
          {/* Disabled Tabs */}
          <TouchableOpacity
            style={[styles.tab, styles.tabDisabled]}
            disabled={true}
          >
            <Text style={[styles.tabText, styles.tabTextDisabled]}>
              Courses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, styles.tabDisabled]}
            disabled={true}
          >
            <Text style={[styles.tabText, styles.tabTextDisabled]}>
              Products
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {/* --- CART ITEMS --- */}
        {cartItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Your cart is empty.</Text>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <View style={styles.cardLeft}>
                {/* Checkbox / Selection */}
                <TouchableOpacity style={styles.checkbox}>
                  <Feather name="square" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Image / Icon */}
                <View
                  style={[
                    styles.itemImage,
                    { backgroundColor: item.color + "20" },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                </View>
              </View>

              <View style={styles.cardRight}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.serviceName}</Text>
                    <Text style={styles.itemSubtitle}>
                      By {item.astrologerName} · Consultancy
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Feather name="x" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardFooterRow}>
                  <Text style={styles.itemPrice}>₹ {item.price}</Text>

                  {/* Slot Confirmation Button */}
                  {item.slotConfirmed ? (
                    <View style={styles.slotConfirmedBtn}>
                      <Feather name="check-circle" size={14} color="#FFF" />
                      <Text style={styles.slotConfirmedText}>
                        Slot Confirmed
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.slotConfirmBtn}
                      onPress={() => toggleSlotConfirmation(item.id)}
                    >
                      <Text style={styles.slotConfirmText}>Confirm Slot</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}

        {/* --- PRICE DETAILS --- */}
        <View style={styles.priceDetailsCard}>
          <Text style={styles.sectionTitle}>Price details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Price ({cartItems.length} Items)
            </Text>
            <Text style={styles.priceValue}>₹ {totalPrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Discount</Text>
            <Text style={[styles.priceValue, styles.discountText]}>
              - ₹ {discount}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={styles.priceLabel}>Platform Fee</Text>
              <Feather name="info" size={14} color="#9CA3AF" />
            </View>
            <Text style={styles.priceValue}>₹ {platformFee}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping</Text>
            <Text style={styles.priceValue}>₹ {shipping}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹ {grandTotal}</Text>
          </View>

          <Text style={styles.savingText}>
            You will save ₹{discount} on this order
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- BOTTOM BAR (MAKE PAYMENT) --- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.paymentBtn,
            { opacity: isAllSlotsConfirmed && cartItems.length > 0 ? 1 : 0.6 },
          ]}
          disabled={!isAllSlotsConfirmed || cartItems.length === 0}
          onPress={() => {
            // TODO: Navigate to Checkout Page
            alert("Navigating to Checkout Page!");
          }}
        >
          <Text style={styles.paymentBtnText}>Make Payment</Text>
        </TouchableOpacity>

        {/* Secure Payment Footer */}
        <View style={styles.securePaymentRow}>
          <Feather name="shield" size={18} color="#22C55E" />
          <Text style={styles.secureText}>Safe and Secure Payments.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },

  // --- TABS ---
  tabsWrapper: {
    borderBottomColor: "#EDE9FF",
  },
  tabsRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: "auto",
    borderWidth: 1,
    borderColor: "#e3e3e3ff",
    marginTop: 10,
    width: "92%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#F9F5FF",
    borderWidth: 1,
    borderColor: "#e3e3e3ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabActive: { backgroundColor: "#9d0399", borderColor: "#9d0399" },
  tabDisabled: { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
  tabText: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  tabTextActive: { color: "#FFF", fontWeight: "700" },
  tabTextDisabled: { color: "#D1D5DB" },

  // --- LIST ---
  listContent: { padding: 16, gap: 16, paddingBottom: 40 },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 15, color: "#9CA3AF" },

  // --- CART ITEM CARD ---
  cartCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: { padding: 4 },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardRight: { flex: 1 },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  itemTitle: { fontSize: 14, fontWeight: "700", color: "#1A1A2E" },
  itemSubtitle: { fontSize: 11, color: "#6B7280" },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  itemPrice: { fontSize: 15, fontWeight: "700", color: "#9d0399" },

  // --- SLOT BUTTONS ---
  slotConfirmBtn: {
    borderWidth: 1.5,
    borderColor: "#9d0399",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  slotConfirmText: { fontSize: 11, color: "#9d0399", fontWeight: "600" },
  slotConfirmedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#22C55E", // Green for confirmed
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  slotConfirmedText: { fontSize: 11, color: "#FFF", fontWeight: "600" },

  // --- PRICE DETAILS CARD ---
  priceDetailsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: { fontSize: 13, color: "#6B7280" },
  priceValue: { fontSize: 13, fontWeight: "600", color: "#1A1A2E" },
  discountText: { color: "#22C55E" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 4 },
  totalLabel: { fontSize: 14, fontWeight: "700", color: "#1F2937" },
  totalValue: { fontSize: 15, fontWeight: "800", color: "#9d0399" },
  savingText: { fontSize: 12, color: "#22C55E", marginTop: 4 },

  // --- BOTTOM BAR ---
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EDE9FF",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    alignItems: "center",
    gap: 10,
  },
  paymentBtn: {
    width: "100%",
    backgroundColor: "#9d0399",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  paymentBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  securePaymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  secureText: { fontSize: 12, color: "#6B7280" },
});
