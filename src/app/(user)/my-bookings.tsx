import Header from "@/components/header";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data — wire karna baad mein API se
const MOCK_BOOKINGS = {
  upcoming: [
    {
      id: "1",
      serviceName: "Couples Harmony",
      astrologerName: "Astro Book",
      time: "10:00 AM",
      date: "9th Dec 2025, Tue",
      emoji: "💑",
      rating: 4,
      color: "#4C1D95",
    },
    {
      id: "2",
      serviceName: "Kundli Analysis",
      astrologerName: "Pt. Rajesh Sharma",
      time: "11:30 AM",
      date: "10th Dec 2025, Wed",
      emoji: "🔮",
      rating: 0,
      color: "#1E3A5F",
    },
  ],
  completed: [
    {
      id: "3",
      serviceName: "Couples Harmony",
      astrologerName: "Astro Book",
      time: "10:00 AM",
      date: "9th Dec 2025, Tue",
      emoji: "💑",
      rating: 4,
      color: "#4C1D95",
      completedOn: "9th Dec 2025, Tue",
    },
  ],
  cancelled: [],
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{ fontSize: size, color: i <= rating ? "#F59E0B" : "#E5E7EB" }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

type Booking = {
  id: string;
  serviceName: string;
  astrologerName: string;
  time: string;
  date: string;
  emoji: string;
  rating: number;
  color: string;
  completedOn?: string;
};

function BookingCard({
  item,
  type,
}: {
  item: Booking;
  type: "upcoming" | "completed" | "cancelled";
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.bookingCard}
      activeOpacity={0.88}
      onPress={() =>
        router.push({
          pathname: "/(user)/booking-detail" as any,
          params: { id: item.id },
        })
      }
    >
      <View style={styles.cardInner}>
        {/* Emoji thumbnail */}
        <View style={[styles.thumbnail, { backgroundColor: item.color }]}>
          <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.serviceName}
            </Text>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </View>

          <Text style={styles.cardAstro}>by {item.astrologerName}</Text>

          {type === "completed" && item.completedOn && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>Completed On</Text>
            </View>
          )}

          <View style={styles.cardMeta}>
            <Feather name="clock" size={11} color="#9d0399" />
            <Text style={styles.cardMetaText}>{item.time}</Text>
          </View>
          <View style={styles.cardMeta}>
            <Feather name="calendar" size={11} color="#9d0399" />
            <Text style={styles.cardMetaText}>{item.date}</Text>
          </View>

          {type === "upcoming" && (
            <TouchableOpacity style={styles.rescheduleRow}>
              <Text style={styles.rescheduleText}>Reschedule</Text>
              <Feather name="info" size={11} color="#9d0399" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Rating row */}
      <View style={styles.ratingRow}>
        <StarRating rating={item.rating} />
        <TouchableOpacity>
          <Text style={styles.writeReviewText}>Write a review</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function SectionBlock({
  title,
  count,
  items,
  type,
}: {
  title: string;
  count: number;
  items: Booking[];
  type: "upcoming" | "completed" | "cancelled";
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title} <Text style={styles.sectionCount}>({count})</Text>
      </Text>

      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            No {title.toLowerCase()} bookings
          </Text>
        </View>
      ) : (
        items.map((item) => (
          <BookingCard key={item.id} item={item} type={type} />
        ))
      )}
    </View>
  );
}

const TABS = [
  { key: "consultations", label: "Consultations", enabled: true },
  { key: "courses", label: "Courses", enabled: false },
  { key: "products", label: "Products", enabled: false },
];

export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState("consultations");

  return (
    <View style={styles.root}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Page Title */}
        <View style={styles.pageTitleRow}>
          <View style={styles.pageTitleBadge}>
            <Text style={styles.pageTitleText}>My bookings</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.tabActive,
                !tab.enabled && styles.tabDisabled,
              ]}
              onPress={() => tab.enabled && setActiveTab(tab.key)}
              disabled={!tab.enabled}
              activeOpacity={tab.enabled ? 0.8 : 1}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                  !tab.enabled && styles.tabTextDisabled,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === "consultations" && (
          <View>
            <SectionBlock
              title="Upcoming"
              count={MOCK_BOOKINGS.upcoming.length}
              items={MOCK_BOOKINGS.upcoming}
              type="upcoming"
            />
            <SectionBlock
              title="Completed"
              count={MOCK_BOOKINGS.completed.length}
              items={MOCK_BOOKINGS.completed}
              type="completed"
            />
            <SectionBlock
              title="Cancelled"
              count={MOCK_BOOKINGS.cancelled.length}
              items={MOCK_BOOKINGS.cancelled}
              type="cancelled"
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },
  content: { paddingBottom: 32 },

  pageTitleRow: { paddingHorizontal: 16, paddingTop: 20, marginBottom: 16 },
  pageTitleBadge: {
    borderRadius: 8,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  pageTitleText: {
    color: "#ffffffff",
    fontSize: 35,
    fontWeight: "900",
  },

  // Tabs
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#9d0399" },
  tabDisabled: { opacity: 0.4 },
  tabText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#9d0399" },
  tabTextDisabled: { color: "#9CA3AF" },

  // Section
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#9d0399",
    marginBottom: 12,
  },
  sectionCount: { color: "#9d0399", fontWeight: "700" },

  emptyBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDE9FF",
  },
  emptyText: { fontSize: 13, color: "#9CA3AF" },

  // Booking Card
  bookingCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 2,
    overflow: "hidden",
  },
  cardInner: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardInfo: { flex: 1 },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
    flex: 1,
  },
  cardAstro: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  completedBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  completedBadgeText: { fontSize: 10, color: "#15803D", fontWeight: "700" },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  cardMetaText: { fontSize: 11, color: "#6B7280" },
  rescheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  rescheduleText: { fontSize: 11, color: "#9d0399", fontWeight: "600" },

  // Rating row
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FAFAFA",
  },
  writeReviewText: {
    fontSize: 12,
    color: "#9d0399",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
