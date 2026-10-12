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
  /** Optional badge count — positive number dikhaega red dot with count */
  badge?: number;
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
          {/* Badge — pending items ka count */}
          {item.badge != null && item.badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.badge > 99 ? "99+" : item.badge}
              </Text>
            </View>
          )}
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
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginRight: 6,
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#FFF" },
});
