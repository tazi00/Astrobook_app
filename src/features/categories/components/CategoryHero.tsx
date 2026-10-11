import { Feather } from "@expo/vector-icons";
import { useEvent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { starsFor } from "../utils/art";

const { width: W } = Dimensions.get("window");
const HERO_H = 320;

// ─── Video sub-component ─────────────────────────────────────────────────────

function HeroVideo({ uri, color, navy }: { uri: string; color: string; navy: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  // expo-video kabhi kabhi undefined payload ke saath statusChange fire karta
  // hai (jaise jab URI load nahi hoti) — direct destructure crash karta tha.
 useEvent(player, "statusChange", (payload: any) => {
  if (payload?.status === "readyToPlay") player.play();
})

  return (
    <>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        pointerEvents="none"
      />
      {/* Gradient overlay — neeche se fade to navy ─ Netflix style */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.25)", navy]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </>
  );
}

// ─── Fallback gradient (no video) ────────────────────────────────────────────

function HeroGradient({
  id,
  color,
  navy,
  pull,
  maxPull,
}: {
  id: string;
  color: string;
  navy: string;
  pull: Animated.Value;
  maxPull: number;
}) {
  const stars = starsFor(id, 14);
  const range = [0, maxPull];
  const ringScale = pull.interpolate({ inputRange: range, outputRange: [1, 1.5] });
  const ringOpacity = pull.interpolate({ inputRange: range, outputRange: [0.55, 1] });
  const starGlow = pull.interpolate({ inputRange: range, outputRange: [0.6, 1] });

  // shade helper inlined (avoid importing for small use)
  const shade = (hex: string, factor: number) => {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.round(((n >> 16) & 0xff) + (255 - ((n >> 16) & 0xff)) * factor));
    const g = Math.min(255, Math.round(((n >> 8) & 0xff) + (255 - ((n >> 8) & 0xff)) * factor));
    const b = Math.min(255, Math.round((n & 0xff) + (255 - (n & 0xff)) * factor));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  return (
    <>
      <LinearGradient
        colors={[shade(color, 0.08), color, navy]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Rings */}
      <Animated.View
        pointerEvents="none"
        style={[styles.ringWrap, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
      >
        <View style={[styles.ring, { width: 150, height: 150, borderRadius: 75, right: -40, top: -50 }]} />
        <View style={[styles.ring, { width: 240, height: 240, borderRadius: 120, right: -85, top: -95 }]} />
        <View style={[styles.ring, { width: 340, height: 340, borderRadius: 170, right: -135, top: -145 }]} />
      </Animated.View>
      {/* Stars */}
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
    </>
  );
}

// ─── Main CategoryHero ────────────────────────────────────────────────────────

export default function CategoryHero({
  id,
  label,
  description,
  color,
  navy,
  paddingTop,
  pull,
  maxPull,
  heroVideoUrl,
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
  /** ImageKit video URL — null means use the gradient fallback */
  heroVideoUrl?: string | null;
  onBack: () => void;
}) {
  const titleScale = pull.interpolate({
    inputRange: [0, maxPull],
    outputRange: [1, 1.14],
  });

  return (
    <Animated.View
      style={[
        styles.hero,
        { height: Animated.add(HERO_H, pull), overflow: "hidden" },
      ]}
    >
      {/* Background — video or gradient */}
      {heroVideoUrl ? (
        <HeroVideo uri={heroVideoUrl} color={color} navy={navy} />
      ) : (
        <HeroGradient id={id} color={color} navy={navy} pull={pull} maxPull={maxPull} />
      )}

      {/* Content overlay */}
      <View style={[styles.content, { paddingTop }]}>
        <Animated.Text
          style={[styles.title, { transform: [{ scale: titleScale }] }]}
          numberOfLines={2}
        >
          {label}
        </Animated.Text>
        <View style={styles.rule} />
        <Text style={styles.desc} numberOfLines={3}>
          {description}
        </Text>
      </View>

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: paddingTop - 42 }]}
        onPress={onBack}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Wapas jao"
      >
        <Feather name="arrow-left" size={22} color="#FFF" />
      </TouchableOpacity>

      {/* LIVE badge — sirf video pe */}
      {heroVideoUrl ? (
        <View style={[styles.videoBadge, { top: paddingTop - 38 }]}>
          <View style={styles.videoDot} />
          <Text style={styles.videoBadgeText}>LIVE PREVIEW</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hero: { width: W, overflow: "hidden" },
  ringWrap: { position: "absolute", inset: 0 },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  content: {
    paddingHorizontal: 28,
    alignItems: "center",
    // Push content to bottom of hero
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.3,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
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
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoBadge: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
  },
  videoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F87171",
  },
  videoBadgeText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.8,
  },
});