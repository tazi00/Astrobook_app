import Header from "@/components/header";
import { MOCK_ASTROLOGERS, MOCK_SERVICES, MOCK_SLOTS } from "@/mock/data";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DAYS_AHEAD = 7;
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDates() {
  const dates: Date[] = [];
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function groupSlots(slots: typeof MOCK_SLOTS) {
  const morning: typeof MOCK_SLOTS = [];
  const afternoon: typeof MOCK_SLOTS = [];
  const evening: typeof MOCK_SLOTS = [];
  slots.forEach((slot) => {
    const [timePart, period] = slot.time.split(" ");
    const hour = parseInt(timePart.split(":")[0]);
    if (period === "AM") morning.push(slot);
    else if (hour < 5) afternoon.push(slot);
    else evening.push(slot);
  });
  return { morning, afternoon, evening };
}

export default function BookSlotScreen() {
  const router = useRouter();
  const { astroId, serviceId } = useLocalSearchParams<{
    astroId: string;
    serviceId: string;
  }>();

  const astrologer =
    MOCK_ASTROLOGERS.find((a) => a.id === astroId) || MOCK_ASTROLOGERS[0];
  const service =
    MOCK_SERVICES.find((s) => s.id === serviceId) || MOCK_SERVICES[0];
  const dates = getDates();

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { morning, afternoon, evening } = groupSlots(MOCK_SLOTS);

  const handleProceedToCheckout = () => {
    if (!selectedSlot) return;
    router.push({
      pathname: "/(user)/checkout" as any,
      params: {
        astroId: astrologer.id,
        serviceId: service.id,
        date: dates[selectedDate].toISOString(),
        slot: selectedSlot,
      },
    });
  };

  const handleAddToCart = () => {
    if (!selectedSlot) return;
    router.push("/(user)/cart" as any);
  };

  const renderSlotGroup = (
    label: string,
    icon: string,
    slots: typeof MOCK_SLOTS,
  ) => {
    if (slots.length === 0) return null;
    const availableCount = slots.filter((s) => s.available).length;

    return (
      <View style={styles.slotGroup}>
        {/* Group Header */}
        <View style={styles.slotGroupHeader}>
          <Text style={styles.slotGroupIcon}>{icon}</Text>
          <Text style={styles.slotGroupLabel}>{label}</Text>
          <View
            style={
              availableCount > 0
                ? styles.availableBadge
                : styles.unavailableBadge
            }
          >
            <Text
              style={
                availableCount > 0
                  ? styles.availableBadgeText
                  : styles.unavailableBadgeText
              }
            >
              {availableCount > 0 ? `${availableCount} slots` : "Full"}
            </Text>
          </View>
        </View>

        {/* Slots */}
        <View style={styles.slotsGrid}>
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.time;
            const isUnavailable = !slot.available;
            return (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.slotPill,
                  isUnavailable && styles.slotPillUnavailable,
                  isSelected && styles.slotPillActive,
                ]}
                disabled={isUnavailable}
                onPress={() => setSelectedSlot(slot.time)}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <Feather
                    name="check-circle"
                    size={12}
                    color="#FFF"
                    style={{ marginRight: 5 }}
                  />
                )}
                <Text
                  style={[
                    styles.slotPillText,
                    isUnavailable && styles.slotPillTextUnavailable,
                    isSelected && styles.slotPillTextActive,
                  ]}
                >
                  {slot.time}
                </Text>
                {isUnavailable && <View style={styles.strikethrough} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header />

      {/* ── Service Summary Strip ── */}
      <View style={styles.serviceStrip}>
        <View
          style={[styles.stripAvatar, { backgroundColor: astrologer.color }]}
        >
          <Text style={{ fontSize: 20 }}>{astrologer.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.stripServiceName} numberOfLines={1}>
            {service.name}
          </Text>
          <Text style={styles.stripAstroName}>with {astrologer.name}</Text>
        </View>
        <View style={styles.stripRight}>
          <View style={styles.stripChip}>
            <Text style={styles.stripChipText}>
              {service.callType === "VIDEO" ? "📹" : "📞"} {service.callType}
            </Text>
          </View>
          <View style={styles.stripPriceChip}>
            <Text style={styles.stripPriceText}>₹{service.price}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Date Picker ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <Text style={styles.sectionSubtitle}>Next 7 days</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateRow}
          >
            {dates.map((date, index) => {
              const isSelected = selectedDate === index;
              const isToday = index === 0;
              const weekend = isWeekend(date);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    weekend && styles.dateCardWeekend,
                    isSelected && styles.dateCardActive,
                  ]}
                  onPress={() => {
                    setSelectedDate(index);
                    setSelectedSlot(null);
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.dateDayText,
                      weekend && !isSelected && styles.dateDayWeekend,
                      isSelected && styles.dateTextActive,
                    ]}
                  >
                    {isToday ? "Today" : DAY_LABELS[date.getDay()]}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumText,
                      isSelected && styles.dateTextActive,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonText,
                      isSelected && styles.dateTextActive,
                    ]}
                  >
                    {MONTH_LABELS[date.getMonth()]}
                  </Text>
                  {isToday && !isSelected && <View style={styles.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Selected Date Pill ── */}
        <View style={styles.selectedDatePill}>
          <Feather name="calendar" size={12} color="#7C3AED" />
          <Text style={styles.selectedDateText}>
            {dates[selectedDate].toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* ── Time Slots ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Available</Text>
              <View style={[styles.legendDot, styles.legendDotUnavailable]} />
              <Text style={styles.legendText}>Booked</Text>
            </View>
          </View>

          {renderSlotGroup("Morning", "🌅", morning)}
          {renderSlotGroup("Afternoon", "☀️", afternoon)}
          {renderSlotGroup("Evening", "🌙", evening)}
        </View>

        {/* Duration note */}
        <View style={styles.durationRow}>
          <Feather name="clock" size={12} color="#9d0399" />
          <Text style={styles.durationText}>
            Session ends {service.durationMins} mins after your selected slot
          </Text>
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* ── Sticky Bottom ── */}
      <View style={styles.bottomBar}>
        {/* Selected slot confirmation */}
        {selectedSlot ? (
          <View style={styles.selectedSlotConfirm}>
            <Feather name="check-circle" size={14} color="#9d0399" />
            <Text style={styles.selectedSlotConfirmText}>
              {dates[selectedDate].toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
              {" · "}
              {selectedSlot}
            </Text>
          </View>
        ) : (
          <Text style={styles.noSlotHint}>👆 Pick a date & time slot</Text>
        )}

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.cartBtn, !selectedSlot && styles.btnDisabled]}
            disabled={!selectedSlot}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Feather
              name="shopping-cart"
              size={15}
              color={selectedSlot ? "#9d0399" : "#CCC"}
            />
            <Text
              style={[
                styles.cartBtnText,
                !selectedSlot && styles.btnTextDisabled,
              ]}
            >
              Add to Cart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.proceedBtn,
              !selectedSlot && styles.btnDisabledFilled,
            ]}
            disabled={!selectedSlot}
            onPress={handleProceedToCheckout}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.proceedBtnText,
                !selectedSlot && styles.btnTextDisabled,
              ]}
            >
              Proceed • ₹{service.price}
            </Text>
            {selectedSlot && (
              <Feather
                name="arrow-right"
                size={15}
                color="#FFF"
                style={{ marginLeft: 4 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },

  // ── Service Strip ──
  serviceStrip: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDE9FF",
    elevation: 3,
    shadowColor: "#9d0399",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  stripAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  stripServiceName: { fontSize: 14, fontWeight: "700", color: "#1A1A2E" },
  stripAstroName: {
    fontSize: 11,
    color: "#9d0399",
    fontWeight: "500",
    marginTop: 1,
  },
  stripRight: { alignItems: "flex-end", gap: 4 },
  stripChip: {
    backgroundColor: "#F5F0FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stripChipText: { fontSize: 10, color: "#6B21A8", fontWeight: "600" },
  stripPriceChip: {
    backgroundColor: "#9d039912",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#9d039930",
  },
  stripPriceText: { fontSize: 12, fontWeight: "800", color: "#9d0399" },

  // ── Sections ──
  section: { paddingHorizontal: 16, paddingTop: 20, gap: 14 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: "#1A1A2E" },
  sectionSubtitle: { fontSize: 11, color: "#9CA3AF" },

  // ── Date Cards ──
  dateRow: { gap: 8, paddingVertical: 4, paddingRight: 4 },
  dateCard: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 14,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
    minWidth: 60,
    position: "relative",
  },
  dateCardWeekend: {
    backgroundColor: "#FDF4FF",
    borderColor: "#E9D5FF",
  },
  dateCardActive: {
    backgroundColor: "#9d0399",
    borderColor: "#9d0399",
    elevation: 6,
    shadowColor: "#9d0399",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  dateDayText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 2,
  },
  dateDayWeekend: { color: "#9d0399" },
  dateNumText: { fontSize: 20, fontWeight: "800", color: "#1A1A2E" },
  dateMonText: { fontSize: 10, color: "#9CA3AF", marginTop: 1 },
  dateTextActive: { color: "#FFF" },
  todayDot: {
    position: "absolute",
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#9d0399",
  },

  // ── Selected Date Pill ──
  selectedDatePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  selectedDateText: { fontSize: 12, color: "#7C3AED", fontWeight: "600" },

  // ── Slot Groups ──
  slotGroup: { gap: 10, marginBottom: 6 },
  slotGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  slotGroupIcon: { fontSize: 15 },
  slotGroupLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    flex: 1,
  },
  availableBadge: {
    backgroundColor: "#F0FDF4",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  availableBadgeText: { fontSize: 10, color: "#15803D", fontWeight: "700" },
  unavailableBadge: {
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  unavailableBadgeText: { fontSize: 10, color: "#DC2626", fontWeight: "700" },

  // ── Slot Pills ──
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slotPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
    elevation: 1,
    shadowColor: "#9d0399",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    position: "relative",
    overflow: "hidden",
  },
  slotPillUnavailable: {
    backgroundColor: "#F9FAFB",
    borderColor: "#F3F4F6",
    elevation: 0,
    shadowOpacity: 0,
  },
  slotPillActive: {
    backgroundColor: "#9d0399",
    borderColor: "#9d0399",
    elevation: 5,
    shadowColor: "#9d0399",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  slotPillText: { fontSize: 13, fontWeight: "600", color: "#1A1A2E" },
  slotPillTextUnavailable: { color: "#C4C4C4" },
  slotPillTextActive: { color: "#FFF" },
  strikethrough: {
    position: "absolute",
    left: 10,
    right: 10,
    height: 1.5,
    backgroundColor: "#D1D5DB",
    top: "50%",
  },

  // ── Duration Note ──
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFF7FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3E8FF",
  },
  durationText: { fontSize: 12, color: "#7C3AED", fontWeight: "500" },

  // ── Legend ──
  legendRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9d0399",
  },
  legendDotUnavailable: { backgroundColor: "#D1D5DB" },
  legendText: { fontSize: 10, color: "#9CA3AF", marginRight: 4 },

  // ── Bottom Bar ──
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#EDE9FF",
    gap: 10,
    elevation: 16,
    shadowColor: "#9d0399",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  selectedSlotConfirm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F9F0FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  selectedSlotConfirmText: {
    fontSize: 12,
    color: "#9d0399",
    fontWeight: "700",
  },
  noSlotHint: { fontSize: 12, color: "#9CA3AF", textAlign: "center" },

  btnRow: { flexDirection: "row", gap: 8 },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#9d0399",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  cartBtnText: { color: "#9d0399", fontSize: 13, fontWeight: "700" },
  proceedBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9d0399",
    borderRadius: 12,
    paddingVertical: 13,
    elevation: 4,
    shadowColor: "#9d0399",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  proceedBtnText: { color: "#FFF", fontSize: 14, fontWeight: "800" },
  btnDisabled: {
    borderColor: "#E5E7EB",
    backgroundColor: "transparent",
    elevation: 0,
  },
  btnDisabledFilled: {
    backgroundColor: "#E5E7EB",
    elevation: 0,
    shadowOpacity: 0,
  },
  btnTextDisabled: { color: "#C4C4C4" },
});
