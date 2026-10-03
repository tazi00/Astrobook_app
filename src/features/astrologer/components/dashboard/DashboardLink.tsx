import { AstroColors, AstroRadius, AstroShadow, AstroType, MIN_TOUCH } from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  highlight?: boolean;
};

// Ek line ka row: icon + text + chevron. Manage links aur Bank CTA dono yehi.
export default function DashboardLink({ icon, title, subtitle, onPress, highlight }: Props) {
  return (
    <TouchableOpacity
      style={[styles.row, highlight && styles.highlight]}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={[styles.icon, highlight && styles.iconHl]}>
        <Feather name={icon} size={18} color={highlight ? AstroColors.onBrand : AstroColors.brand} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      <Feather name="chevron-right" size={18} color={AstroColors.brand} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: MIN_TOUCH + 12,
    padding: 12,
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.lg,
    ...AstroShadow.soft,
  },
  highlight: { backgroundColor: AstroColors.brandTint },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AstroColors.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },
  iconHl: { backgroundColor: AstroColors.brand },
  title: { ...AstroType.body, fontWeight: "700", color: AstroColors.text },
  sub: { ...AstroType.caption, color: AstroColors.textSecondary, marginTop: 1 },
});
