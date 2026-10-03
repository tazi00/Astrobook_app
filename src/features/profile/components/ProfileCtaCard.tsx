import {
  AstroColors,
  AstroRadius,
  AstroShadow,
  AstroType,
} from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Gradient action card — "Go to Dashboard", "Astrologer bano" jaise bade CTA ke liye.
export default function ProfileCtaCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} accessibilityLabel={title}>
      <LinearGradient
        colors={[AstroColors.brandLight, AstroColors.brandDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.card, AstroShadow.card]}
      >
        <View style={styles.iconBox}>
          <Feather name={icon} size={22} color={AstroColors.onBrand} />
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Feather name="arrow-right" size={20} color={AstroColors.onBrand} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: AstroRadius.xl,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: AstroRadius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  texts: { flex: 1 },
  title: { ...AstroType.heading, color: AstroColors.onBrand },
  subtitle: { ...AstroType.caption, color: "rgba(255,255,255,0.85)", marginTop: 2 },
});
