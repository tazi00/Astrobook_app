import { AstroColors, AstroRadius, AstroShadow, AstroType } from "@/constants/astro-theme";
import { StyleSheet, Text, View } from "react-native";

type Stat = { label: string; value: string; accent?: boolean };

// Teen numbers ek hi card mein, patli dividers ke saath — alag-alag teen
// boxes se kam shor.
export default function DashboardStats({ stats }: { stats: Stat[] }) {
  return (
    <View style={styles.card}>
      {stats.map((s, i) => (
        <View key={s.label} style={[styles.cell, i > 0 && styles.divider]}>
          <Text style={[styles.value, s.accent && styles.accent]}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.lg,
    paddingVertical: 16,
    ...AstroShadow.soft,
  },
  cell: { flex: 1, alignItems: "center", gap: 2 },
  divider: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: AstroColors.border },
  value: { fontSize: 22, fontWeight: "800", color: AstroColors.ink },
  accent: { color: AstroColors.brand },
  label: { ...AstroType.caption, color: AstroColors.textMuted },
});
