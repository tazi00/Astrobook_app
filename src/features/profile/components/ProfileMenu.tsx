import {
  AstroColors,
  AstroRadius,
  AstroShadow,
  AstroType,
  MIN_TOUCH,
} from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ProfileMenuItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  route: string;
};

export default function ProfileMenu({
  items,
  onNavigate,
}: {
  items: ProfileMenuItem[];
  onNavigate: (route: string) => void;
}) {
  return (
    <View style={[styles.card, AstroShadow.soft]}>
      {items.map((item, i) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.row, i < items.length - 1 && styles.rowBorder]}
          activeOpacity={0.7}
          onPress={() => onNavigate(item.route)}
          accessibilityLabel={item.label}
        >
          <View style={styles.iconWrap}>
            <Feather name={item.icon} size={18} color={AstroColors.brand} />
          </View>
          <Text style={styles.label}>{item.label}</Text>
          <Feather name="chevron-right" size={20} color={AstroColors.offline} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.xl,
    overflow: "hidden",
  },
  row: {
    minHeight: MIN_TOUCH + 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: AstroColors.canvas },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: AstroRadius.md,
    backgroundColor: AstroColors.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { flex: 1, ...AstroType.body, fontWeight: "600", color: AstroColors.text },
});
