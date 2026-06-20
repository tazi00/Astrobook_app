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
const GAP = 8;
const PADDING = 16;
const CARD_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP * 2) / 3;

const ALL_CATEGORIES = [
  { id: "love-reading", label: "Love Reading", emoji: "💕", color: "#9D174D" },
  { id: "reiki", label: "Reiki", emoji: "✨", color: "#065F46" },
  { id: "numerology", label: "Numerology", emoji: "🔢", color: "#1E40AF" },
  { id: "kundli", label: "Kundli", emoji: "🔮", color: "#6B21A8" },
  { id: "tarot", label: "Tarot", emoji: "🃏", color: "#92400E" },
  { id: "palmistry", label: "Palmistry", emoji: "✋", color: "#065F46" },
  { id: "vastu", label: "Vastu", emoji: "🏠", color: "#1E3A5F" },
  { id: "astrology", label: "Astrology", emoji: "⭐", color: "#4C1D95" },
  { id: "face-reading", label: "Face Reading", emoji: "👁️", color: "#7C2D12" },
  { id: "past-life", label: "Past Life", emoji: "🌀", color: "#134E4A" },
  { id: "meditation", label: "Meditation", emoji: "🧘", color: "#1E40AF" },
  { id: "gemstones", label: "Gemstones", emoji: "💎", color: "#6B21A8" },
];

const INITIAL_COUNT = 9;

export default function ExploreScreen() {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const categories = showAll
    ? ALL_CATEGORIES
    : ALL_CATEGORIES.slice(0, INITIAL_COUNT);

  // Group into rows of 3
  const rows = [];
  for (let i = 0; i < categories.length; i += 3) {
    rows.push(categories.slice(i, i + 3));
  }

  return (
    <View style={styles.root}>
      <Header />
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
          </View>
        ))}

        {!showAll && (
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
  content: { padding: PADDING, gap: GAP },
  row: {
    flexDirection: "row",
    gap: GAP,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
  },
  cardEmoji: { fontSize: 30 },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    paddingHorizontal: 6,
  },
  showMoreBtn: { alignItems: "center", paddingVertical: 16, gap: 4 },
  showMoreText: { fontSize: 14, color: "#9d0399", fontWeight: "600" },
  showMoreArrow: { fontSize: 16, color: "#9d0399" },
});
