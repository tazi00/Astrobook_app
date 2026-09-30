import { AstroColors, AstroRadius, AstroShadow } from "@/constants/astro-theme";
import { formatDuration, formatPrice } from "@/features/astrologer/utils/cardFormat";
import { shade, starsFor } from "@/features/categories/utils/art";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { BrowsedService } from "../types";

// Explore category ke "Consultancies" slider ka card. Tap → seedha service
// detail (booking) page — astrologer profile ke consultation card jaisa hi.
export default function ServiceSlideCard({
  service,
  width,
  accent,
}: {
  service: BrowsedService;
  width: number;
  accent: string;
}) {
  const router = useRouter();
  const price = formatPrice(service.price);
  const duration = formatDuration(service.durationMinutes);
  const imageH = Math.round(width * 0.58);

  const open = () =>
    router.push({
      pathname: "/(user)/service/[id]" as any,
      params: { id: service.id, astroId: service.astrologerId },
    });

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`${service.title}, ${service.astrologerName}${price ? `, ${price}` : ""}`}
      style={({ pressed }) => [styles.card, { width }, pressed && { opacity: 0.92 }]}
    >
      <View style={{ height: imageH, backgroundColor: shade(accent, -0.3) }}>
        {service.coverImage ? (
          <Image source={{ uri: service.coverImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <>
            <LinearGradient
              colors={[shade(accent, 0.05), shade(accent, -0.55)]}
              style={StyleSheet.absoluteFill}
            />
            {starsFor(service.id, 7).map((s, i) => (
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
        )}
        {duration ? (
          <View style={styles.durationPill}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {service.title}
        </Text>
        <Text style={styles.by} numberOfLines={1}>
          by {service.astrologerName}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{price ?? "—"}</Text>
          <View style={styles.bookBtn}>
            <Text style={styles.bookText}>Book</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.lg,
    borderWidth: 1,
    borderColor: AstroColors.border,
    overflow: "hidden",
    ...AstroShadow.soft,
  },
  durationPill: {
    position: "absolute",
    left: 10,
    bottom: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: AstroRadius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  durationText: { color: "#FFF", fontSize: 11, fontWeight: "700" },
  body: { padding: 12, gap: 2 },
  title: { fontSize: 14.5, fontWeight: "800", color: AstroColors.ink, minHeight: 36 },
  by: { fontSize: 12, color: AstroColors.textSecondary },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  price: { fontSize: 16, fontWeight: "900", color: AstroColors.ink },
  bookBtn: {
    backgroundColor: AstroColors.brand,
    borderRadius: AstroRadius.pill,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  bookText: { color: "#FFF", fontSize: 12, fontWeight: "800" },
});
