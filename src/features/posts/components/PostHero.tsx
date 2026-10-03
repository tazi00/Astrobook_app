import { AstroColors, AstroRadius, AstroShadow } from "@/constants/astro-theme";
import { shade, starsFor } from "@/features/categories/utils/art";
import { colorForId } from "@/utils/colorUtils";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Post } from "../types/post.types";

// Post detail ka media card — inset, rounded. Teen shakl: VIDEO, IMAGE (+ sticker),
// TEXT (astrologer ke chune rang ka night-sky card).

function DetailVideo({
  uri,
  size,
  playing,
  startMuted,
}: {
  uri: string;
  size: { w: number; h: number };
  playing: boolean;
  startMuted: boolean;
}) {
  const [muted, setMuted] = useState(startMuted);
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = startMuted;
  });
  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);
  useEffect(() => {
    if (playing) player.play();
    else player.pause();
  }, [playing, player]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setMuted((m) => !m)}
      style={{ width: size.w, height: size.h }}
      accessibilityLabel={muted ? "Awaaz chalu karo" : "Awaaz band karo"}
    >
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />
      <View style={styles.muteBadge}>
        <Feather
          name={muted ? "volume-x" : "volume-2"}
          size={14}
          color={AstroColors.onBrand}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function PostHero({
  post,
  width,
  aspect = 1.15,
  playing = true,
  startMuted = false,
  flat = false,
  square = false,
}: {
  post: Post;
  width: number;
  /** height = width × aspect (detail 1.15, feed 1.0) */
  aspect?: number;
  /** Video autoplay — feed me sirf visible card ka video chalta hai */
  playing?: boolean;
  startMuted?: boolean;
  /** Shadow nahi (card ke andar) */
  flat?: boolean;
  /** Edge-to-edge: corners nahi (feed) */
  square?: boolean;
}) {
  const h = Math.round(width * aspect);
  const bg = post.bgColor ?? colorForId(post.astrologerId);
  const fg = post.textColor ?? AstroColors.onBrand;

  return (
    <View
      style={[
        styles.card,
        !flat && AstroShadow.card,
        square && styles.square,
        { width, height: h },
      ]}
    >
      {post.mediaType === "VIDEO" && post.mediaUrl ? (
        <DetailVideo
          uri={post.mediaUrl}
          size={{ w: width, h }}
          playing={playing}
          startMuted={startMuted}
        />
      ) : post.mediaType === "IMAGE" && post.mediaUrl ? (
        <>
          <Image
            source={{ uri: post.mediaUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {post.stickerText ? (
            <View
              style={[
                styles.sticker,
                {
                  backgroundColor: post.stickerBgColor ?? AstroColors.mediaBadge,
                  left: `${Math.min(0.7, Number(post.stickerX ?? 0.5)) * 100}%`,
                  top: `${Math.min(0.85, Number(post.stickerY ?? 0.5)) * 100}%`,
                },
              ]}
            >
              <Text
                style={[
                  styles.stickerText,
                  { color: post.stickerTextColor ?? AstroColors.onBrand },
                ]}
              >
                {post.stickerText}
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <>
          <LinearGradient
            colors={[shade(bg, 0.08), shade(bg, -0.35)]}
            start={{ x: 0.9, y: 0 }}
            end={{ x: 0.1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.ring, { width: 200, height: 200, borderRadius: 100, right: -60, top: -70 }]} />
          <View style={[styles.ring, { width: 320, height: 320, borderRadius: 160, right: -120, top: -130 }]} />
          <View style={[styles.ring, { width: 120, height: 120, borderRadius: 60, left: -36, bottom: -44 }]} />
          {starsFor(post.id, 14).map((s, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                borderRadius: s.size,
                backgroundColor: AstroColors.onBrand,
                opacity: s.opacity,
              }}
            />
          ))}
          <View style={styles.textCenter}>
            <Text style={[styles.textContent, { color: fg }]}>{post.content}</Text>
          </View>
          <Text style={[styles.mark, { color: fg }]}>AstroBook</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    borderRadius: AstroRadius.xl,
    overflow: "hidden",
    backgroundColor: AstroColors.brandTint,
  },
  square: { borderRadius: 0 },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  textCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  textContent: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  mark: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    opacity: 0.55,
  },
  sticker: {
    position: "absolute",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: AstroRadius.pill,
    maxWidth: "70%",
    transform: [{ translateX: -20 }, { translateY: -14 }],
  },
  stickerText: { fontSize: 14, fontWeight: "700" },
  muteBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: AstroColors.mediaBadge,
    borderRadius: AstroRadius.pill,
    padding: 8,
  },
});
