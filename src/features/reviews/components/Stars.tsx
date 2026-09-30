import { AstroColors } from "@/constants/astro-theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/** Sirf dikhane ke liye — poore (filled) stars */
export function StarsRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? "star" : "star-outline"}
          size={size}
          color={i <= Math.round(rating) ? AstroColors.gold : AstroColors.border}
        />
      ))}
    </View>
  );
}

const LABELS = ["", "Bura laga", "Theek-thaak", "Accha tha", "Bahut accha", "Kamaal!"];
export const ratingLabel = (r: number) => LABELS[r] ?? "";

/** Tap karke rating chuno */
export function StarPicker({
  value,
  onChange,
  size = 38,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  return (
    <View style={[styles.row, { gap: 8 }]}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity
          key={i}
          hitSlop={6}
          onPress={() => onChange(i)}
          accessibilityRole="button"
          accessibilityLabel={`${i} star`}
          accessibilityState={{ selected: i <= value }}
        >
          <Ionicons
            name={i <= value ? "star" : "star-outline"}
            size={size}
            color={i <= value ? AstroColors.gold : AstroColors.offline}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 2 },
});
