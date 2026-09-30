import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { shade, starsFor } from "../utils/art";

// Category page ka banner. Default hamesha ek jaisa; `pull` (usePullStretch)
// badhne par khulta hai: neeche extra jagah, rings phailte hain, tare chamakte
// hain, title thoda bada. Aage yahan video ki jagah bhi isi extra space me hai.
export default function CategoryHero({
  id,
  label,
  description,
  color,
  navy,
  paddingTop,
  pull,
  maxPull,
  onBack,
}: {
  id: string;
  label: string;
  description: string;
  color: string;
  navy: string;
  paddingTop: number;
  pull: Animated.Value;
  maxPull: number;
  onBack: () => void;
}) {
  const stars = starsFor(id, 14);
  const range = [0, maxPull];

  const ringScale = pull.interpolate({ inputRange: range, outputRange: [1, 1.5] });
  const ringOpacity = pull.interpolate({ inputRange: range, outputRange: [0.55, 1] });
  const titleScale = pull.interpolate({ inputRange: range, outputRange: [1, 1.14] });
  const starGlow = pull.interpolate({ inputRange: range, outputRange: [0.6, 1] });
  const bottomSpace = Animated.add(32, pull);

  return (
    <Animated.View style={{ paddingBottom: bottomSpace, overflow: "hidden" }}>
      <LinearGradient
        colors={[shade(color, 0.08), color, navy]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Rings — kone se phailte hain */}
      <Animated.View
        pointerEvents="none"
        style={[styles.ringWrap, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
      >
        <View style={[styles.ring, { width: 150, height: 150, borderRadius: 75, right: -40, top: -50 }]} />
        <View style={[styles.ring, { width: 240, height: 240, borderRadius: 120, right: -85, top: -95 }]} />
        <View style={[styles.ring, { width: 340, height: 340, borderRadius: 170, right: -135, top: -145 }]} />
      </Animated.View>

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: starGlow }]}>
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
      </Animated.View>

      <View style={[styles.content, { paddingTop }]}>
        <Animated.Text style={[styles.title, { transform: [{ scale: titleScale }] }]}>
          {label}
        </Animated.Text>
        <View style={styles.rule} />
        <Text style={styles.desc}>{description}</Text>
      </View>

      <TouchableOpacity
        style={[styles.backBtn, { top: paddingTop - 38 }]}
        onPress={onBack}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Wapas jao"
      >
        <Feather name="arrow-left" size={22} color="#FFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ringWrap: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  content: { paddingHorizontal: 28, alignItems: "center" },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  rule: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
    marginVertical: 10,
  },
  desc: {
    fontSize: 13.5,
    color: "rgba(255,255,255,0.86)",
    lineHeight: 20,
    textAlign: "center",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
});
