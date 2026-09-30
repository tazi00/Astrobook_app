import { AstroShadow } from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Category } from "../types";
import { shade, starsFor } from "../utils/art";

// Explore ka category card — emoji/logo nahi. Background: agar category ki
// `imageUrl` ho to photo (neeche dark scrim ke saath), warna generated
// "night-sky" art: rang ka gradient + tare + halke rings. Upar sirf naam.
export default function CategoryCard({
  category,
  width,
  height,
  onPress,
}: {
  category: Category;
  width: number;
  height: number;
  onPress: () => void;
}) {
  const stars = starsFor(category.id);

  const art = category.imageUrl ? (
    <ImageBackground
      source={{ uri: category.imageUrl }}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    />
  ) : (
    <>
      <LinearGradient
        colors={[shade(category.color, 0.1), shade(category.color, -0.5)]}
        start={{ x: 0.9, y: 0 }}
        end={{ x: 0.1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.ring, { width: 120, height: 120, borderRadius: 60, right: -34, top: -38 }]} />
      <View style={[styles.ring, { width: 190, height: 190, borderRadius: 95, right: -70, top: -74 }]} />
      <View style={[styles.ring, { width: 70, height: 70, borderRadius: 35, left: -20, bottom: -26 }]} />
      {stars.map((s, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: s.size,
            backgroundColor: "#FFF",
            opacity: s.opacity,
          }}
        />
      ))}
    </>
  );

  return (
    <TouchableOpacity
      style={[styles.card, { width, height }]}
      activeOpacity={0.88}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={category.label}
    >
      {art}
      {/* Text ke peeche halka scrim — kisi bhi background pe padhne layak */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.38)"]}
        style={styles.scrim}
        pointerEvents="none"
      />
      <View style={styles.arrow}>
        <Feather name="arrow-up-right" size={14} color="#FFF" />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 14,
    ...AstroShadow.card,
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  scrim: { position: "absolute", left: 0, right: 0, bottom: 0, height: "60%" },
  arrow: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 16, fontWeight: "800", color: "#FFF", letterSpacing: 0.2 },
});
