import Header from "@/components/header";
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
const GAP = 12;
const PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 0.75;

// Top filter tabs
const FILTERS = [
  { id: "all", label: "All" },
  { id: "numerology", label: "Numerology" },
  { id: "vastu", label: "Vastu" },
  { id: "vedic", label: "Vedic" },
  { id: "tarot", label: "Tarot" },
  { id: "palmistry", label: "Palmistry" },
  { id: "reiki", label: "Reiki" },
  { id: "meditation", label: "Meditation" },
];

// All categories with parent filter
const ALL_CATEGORIES = [
  {
    id: "numerology",
    label: "Numerology",
    emoji: "🔢",
    color: "#1E40AF",
    filter: "numerology",
  },
  {
    id: "vastu",
    label: "Vastu",
    emoji: "🏠",
    color: "#1E3A5F",
    filter: "vastu",
  },
  {
    id: "vedic-astrology",
    label: "Vedic Astrology",
    emoji: "⭐",
    color: "#4C1D95",
    filter: "vedic",
  },
  {
    id: "kundli",
    label: "Kundli",
    emoji: "🔮",
    color: "#6B21A8",
    filter: "vedic",
  },
  {
    id: "tarot",
    label: "Tarot",
    emoji: "🃏",
    color: "#92400E",
    filter: "tarot",
  },
  {
    id: "tarot-love",
    label: "Tarot Love",
    emoji: "💕",
    color: "#9D174D",
    filter: "tarot",
  },
  {
    id: "palmistry",
    label: "Palmistry",
    emoji: "✋",
    color: "#065F46",
    filter: "palmistry",
  },
  {
    id: "face-reading",
    label: "Face Reading",
    emoji: "👁️",
    color: "#7C2D12",
    filter: "palmistry",
  },
  {
    id: "reiki",
    label: "Reiki",
    emoji: "✨",
    color: "#065F46",
    filter: "reiki",
  },
  {
    id: "past-life",
    label: "Past Life",
    emoji: "🌀",
    color: "#134E4A",
    filter: "reiki",
  },
  {
    id: "meditation",
    label: "Meditation",
    emoji: "🧘",
    color: "#1E40AF",
    filter: "meditation",
  },
  {
    id: "gemstones",
    label: "Gemstones",
    emoji: "💎",
    color: "#6B21A8",
    filter: "meditation",
  },
  {
    id: "numerology-name",
    label: "Name Analysis",
    emoji: "📛",
    color: "#1E3A5F",
    filter: "numerology",
  },
  {
    id: "vastu-home",
    label: "Home Vastu",
    emoji: "🏡",
    color: "#065F46",
    filter: "vastu",
  },
];

const INITIAL_COUNT = 6;

export default function ExploreScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const filtered =
    activeFilter === "all"
      ? ALL_CATEGORIES
      : ALL_CATEGORIES.filter((c) => c.filter === activeFilter);

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  // Group into rows of 2
  const rows: (typeof ALL_CATEGORIES)[number][][] = [];
  for (let i = 0; i < displayed.length; i += 2) {
    rows.push(displayed.slice(i, i + 2));
  }

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
              onPress={() => {
                setActiveFilter(f.id);
                setShowAll(false);
              }}
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

      {/* Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.card, { backgroundColor: cat.color }]}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/(user)/explore/[category]" as any,
                    params: { category: cat.id, label: cat.label },
                  })
                }
              >
                <Text style={styles.cardEmoji}>{cat.emoji}</Text>
                <Text style={styles.cardLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
            {/* Empty placeholder if odd number */}
            {row.length === 1 && <View style={styles.cardEmpty} />}
          </View>
        ))}

        {/* Show More */}
        {!showAll && filtered.length > INITIAL_COUNT && (
          <TouchableOpacity
            style={styles.showMoreBtn}
            onPress={() => setShowAll(true)}
          >
            <Text style={styles.showMoreText}>Show more</Text>
            <Text style={styles.showMoreArrow}>↓</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },

  // Filter tabs
  filterWrapper: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDE9FF",
  },
  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F9F5FF",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
  },
  filterChipActive: {
    backgroundColor: "#9d0399",
    borderColor: "#9d0399",
  },
  filterChipText: { fontSize: 13, color: "#666", fontWeight: "500" },
  filterChipTextActive: { color: "#FFF", fontWeight: "700" },

  // Grid
  content: { padding: PADDING, gap: GAP },
  row: { flexDirection: "row", gap: GAP },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
  },
  cardEmpty: { width: CARD_WIDTH },
  cardEmoji: { fontSize: 36 },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    paddingHorizontal: 8,
  },

  // Show more
  showMoreBtn: { alignItems: "center", paddingVertical: 16, gap: 4 },
  showMoreText: { fontSize: 14, color: "#9d0399", fontWeight: "600" },
  showMoreArrow: { fontSize: 16, color: "#9d0399" },
});
