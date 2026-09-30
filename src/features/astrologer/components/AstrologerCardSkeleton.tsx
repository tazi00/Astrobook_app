import { AstroColors, AstroRadius, AstroSpacing } from "@/constants/astro-theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

// List load hote waqt spinner ki jagah card jaisi shape — screen "khaali"
// nahi lagti aur layout jump nahi karta.
export default function AstrologerCardSkeleton({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const pulse = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.55, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (variant === "compact") {
    return (
      <Animated.View style={[styles.card, styles.compact, { opacity: pulse }]}>
        <View style={styles.compactAvatar} />
        <View style={styles.lines}>
          <View style={[styles.line, { width: "55%", height: 14 }]} />
          <View style={[styles.line, { width: "40%" }]} />
          <View style={[styles.line, { width: "48%", height: 16 }]} />
        </View>
        <View style={[styles.button, { width: 62, height: 32, borderRadius: 16 }]} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.card, { opacity: pulse }]}>
      <View style={styles.top}>
        <View style={styles.avatar} />
        <View style={styles.lines}>
          <View style={[styles.line, { width: "60%", height: 16 }]} />
          <View style={[styles.line, { width: "42%" }]} />
          <View style={[styles.line, { width: "70%" }]} />
          <View style={[styles.line, { width: "52%", height: 18 }]} />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.bottom}>
        <View style={[styles.line, { width: "38%", height: 16 }]} />
        <View style={styles.button} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.lg,
    borderWidth: 1,
    borderColor: AstroColors.border,
    padding: AstroSpacing.md,
  },
  compact: { flexDirection: "row", alignItems: "center", gap: AstroSpacing.md },
  compactAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: AstroColors.brandTintStrong,
  },
  top: { flexDirection: "row", gap: AstroSpacing.md },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: AstroColors.brandTintStrong,
  },
  lines: { flex: 1, gap: 9, justifyContent: "center" },
  line: { height: 11, borderRadius: 6, backgroundColor: AstroColors.brandTintStrong },
  divider: { height: 1, backgroundColor: AstroColors.border, marginVertical: AstroSpacing.md },
  bottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  button: {
    width: 108,
    height: 40,
    borderRadius: AstroRadius.md,
    backgroundColor: AstroColors.brandTintStrong,
  },
});
