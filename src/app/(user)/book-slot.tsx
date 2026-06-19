import Header from "@/components/header";
import { MOCK_ASTROLOGERS, MOCK_SERVICES, MOCK_SLOTS } from "@/mock/data";
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

function getDates() {
  const dates = [];
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
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

  const handleAddToCart = () => {
    if (!selectedSlot) return;
    const date = dates[selectedDate];
    const [hours, minutesPart] = selectedSlot.split(":");
    const [minutes, ampm] = minutesPart.split(" ");
    let hour = parseInt(hours);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    date.setHours(hour, parseInt(minutes), 0, 0);

    // TODO: Add to cart store (Zustand)
    router.push("/(user)/my-bookings" as any);
  };

  return (
    <View style={styles.root}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Summary */}
        <View style={styles.serviceCard}>
          <View
            style={[
              styles.serviceAvatar,
              { backgroundColor: astrologer.color },
            ]}
          >
            <Text style={{ fontSize: 28 }}>{astrologer.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.astroName}>by {astrologer.name}</Text>
            <View style={styles.serviceChips}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  ⏱ {service.durationMins} min
                </Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  {service.callType === "VIDEO" ? "📹" : "📞"}{" "}
                  {service.callType}
                </Text>
              </View>
              <View style={[styles.chip, styles.priceChip]}>
                <Text style={styles.priceText}>₹{service.price}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Date Selection */}
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard,
                  selectedDate === index && styles.dateCardActive,
                ]}
                onPress={() => {
                  setSelectedDate(index);
                  setSelectedSlot(null);
                }}
              >
                <Text
                  style={[
                    styles.dateDay,
                    selectedDate === index && styles.dateTextActive,
                  ]}
                >
                  {date.toLocaleDateString("en-IN", { weekday: "short" })}
                </Text>
                <Text
                  style={[
                    styles.dateNum,
                    selectedDate === index && styles.dateTextActive,
                  ]}
                >
                  {date.getDate()}
                </Text>
                <Text
                  style={[
                    styles.dateMon,
                    selectedDate === index && styles.dateTextActive,
                  ]}
                >
                  {date.toLocaleDateString("en-IN", { month: "short" })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Slot Selection */}
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.slotsGrid}>
            {MOCK_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.slotBtn,
                  !slot.available && styles.slotBtnUnavailable,
                  selectedSlot === slot.time && styles.slotBtnActive,
                ]}
                disabled={!slot.available}
                onPress={() => setSelectedSlot(slot.time)}
              >
                <Text
                  style={[
                    styles.slotText,
                    !slot.available && styles.slotTextUnavailable,
                    selectedSlot === slot.time && styles.slotTextActive,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>₹{service.price}</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, !selectedSlot && styles.bookBtnDisabled]}
          disabled={!selectedSlot}
          onPress={handleAddToCart}
        >
          <Text style={styles.bookBtnText}>Add to Cart →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0FF" },
  serviceCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EDE9FF",
  },
  serviceAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 2,
  },
  astroName: {
    fontSize: 12,
    color: "#9d0399",
    fontWeight: "600",
    marginBottom: 6,
  },
  serviceChips: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  chip: {
    backgroundColor: "#F5F0FF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: { fontSize: 10, color: "#6B21A8", fontWeight: "600" },
  priceChip: {
    backgroundColor: "#9d039918",
    borderWidth: 1,
    borderColor: "#9d0399",
  },
  priceText: { fontSize: 12, fontWeight: "800", color: "#9d0399" },
  content: { padding: 16, gap: 12 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A2E",
    marginTop: 4,
  },
  dateScroll: { marginHorizontal: -4 },
  dateCard: {
    alignItems: "center",
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
    minWidth: 60,
  },
  dateCardActive: { backgroundColor: "#9d0399", borderColor: "#9d0399" },
  dateDay: { fontSize: 11, color: "#888", fontWeight: "500" },
  dateNum: { fontSize: 20, fontWeight: "800", color: "#1A1A2E" },
  dateMon: { fontSize: 11, color: "#888" },
  dateTextActive: { color: "#FFF" },
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slotBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
  },
  slotBtnUnavailable: { backgroundColor: "#F5F5F5", borderColor: "#EEE" },
  slotBtnActive: { backgroundColor: "#9d0399", borderColor: "#9d0399" },
  slotText: { fontSize: 13, fontWeight: "600", color: "#1A1A2E" },
  slotTextUnavailable: { color: "#CCC" },
  slotTextActive: { color: "#FFF" },
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
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#EDE9FF",
    elevation: 10,
  },
  totalLabel: { fontSize: 12, color: "#AAA" },
  totalPrice: { fontSize: 22, fontWeight: "800", color: "#1A1A2E" },
  bookBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  bookBtnDisabled: { backgroundColor: "#CCC" },
  bookBtnText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
});
