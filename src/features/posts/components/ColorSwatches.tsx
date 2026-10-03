import { AstroColors, AstroType } from "@/constants/astro-theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ColorSwatches({
  label,
  colors,
  value,
  onChange,
}: {
  label: string;
  colors: string[];
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {colors.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => onChange(c)}
            accessibilityLabel={`${label} ${c}`}
            style={[styles.ring, value === c && styles.ringActive]}
          >
            <View style={[styles.swatch, { backgroundColor: c }]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { ...AstroType.caption, fontWeight: "700", color: AstroColors.textSecondary },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  ring: {
    padding: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  ringActive: { borderColor: AstroColors.brand },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AstroColors.border,
  },
});
