import { AstroColors, AstroRadius } from "@/constants/astro-theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

// Feed load hote waqt spinner ki jagah card-shaped placeholders (halka pulse).
export default function FeedSkeleton({ count = 2 }: { count?: number }) {
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

  return (
    <View>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.head}>
            <Animated.View style={[styles.avatar, { opacity: pulse }]} />
            <View style={styles.lines}>
              <Animated.View style={[styles.line, { width: "42%", opacity: pulse }]} />
              <Animated.View style={[styles.line, { width: "26%", opacity: pulse }]} />
            </View>
          </View>
          <Animated.View style={[styles.hero, { opacity: pulse }]} />
          <View style={styles.actions}>
            <Animated.View style={[styles.pill, { opacity: pulse }]} />
            <Animated.View style={[styles.pill, { opacity: pulse }]} />
            <Animated.View style={[styles.book, { opacity: pulse }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: AstroColors.surface,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AstroColors.brandTint,
  },
  lines: { flex: 1, gap: 8 },
  line: { height: 10, borderRadius: 5, backgroundColor: AstroColors.brandTint },
  hero: {
    height: 360,
    backgroundColor: AstroColors.brandTint,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 12,
  },
  pill: {
    width: 64,
    height: 40,
    borderRadius: AstroRadius.pill,
    backgroundColor: AstroColors.brandTint,
  },
  book: {
    marginLeft: "auto",
    width: 104,
    height: 40,
    borderRadius: AstroRadius.pill,
    backgroundColor: AstroColors.brandTint,
  },
});
