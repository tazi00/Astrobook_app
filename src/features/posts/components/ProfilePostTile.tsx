import { AstroColors, AstroRadius } from "@/constants/astro-theme";
import { colorForId } from "@/utils/colorUtils";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Post } from "../types/post.types";

// Profile ke Posts grid ka ek tile. Feed jaisa hi look: TEXT post apne
// bgColor/textColor mein, IMAGE post photo (+ sticker), VIDEO dark tile.
function dateLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function ProfilePostTile({
  post,
  width,
  onPress,
  showAuthor = false,
}: {
  post: Post;
  width: number;
  onPress: () => void;
  /** Explore jaisi mixed lists me astrologer ka naam dikhao */
  showAuthor?: boolean;
}) {
  const bg = post.bgColor ?? colorForId(post.astrologerId);
  const fg = post.textColor ?? "#FFFFFF";

  return (
    <TouchableOpacity
      style={{ width }}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Post: ${post.content}`}
    >
      <View style={[styles.visual, { width, height: width }]}>
        {post.mediaType === "IMAGE" && post.mediaUrl ? (
          <>
            <Image source={{ uri: post.mediaUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            {post.stickerText ? (
              <View
                style={[
                  styles.sticker,
                  {
                    backgroundColor: post.stickerBgColor ?? "#00000090",
                    left: `${Math.min(0.7, Number(post.stickerX ?? 0.5)) * 100}%`,
                    top: `${Math.min(0.85, Number(post.stickerY ?? 0.5)) * 100}%`,
                  },
                ]}
              >
                <Text style={[styles.stickerText, { color: post.stickerTextColor ?? "#FFF" }]} numberOfLines={1}>
                  {post.stickerText}
                </Text>
              </View>
            ) : null}
          </>
        ) : post.mediaType === "VIDEO" ? (
          <View style={[StyleSheet.absoluteFill, styles.videoFill]}>
            <View style={styles.play}>
              <Ionicons name="play" size={22} color="#FFF" />
            </View>
            {post.durationSeconds ? (
              <Text style={styles.duration}>
                {Math.floor(post.durationSeconds / 60)}:{String(post.durationSeconds % 60).padStart(2, "0")}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.textFill, { backgroundColor: bg }]}>
            <View style={styles.textCenter}>
              <Text style={[styles.textContent, { color: fg }]} numberOfLines={6}>
                {post.content}
              </Text>
            </View>
            <Text style={[styles.mark, { color: fg }]}>AstroBook</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {showAuthor ? (
          <Text style={styles.author} numberOfLines={1}>
            {post.astrologerName ?? "Astrologer"}
          </Text>
        ) : post.mediaType !== "TEXT" && post.content ? (
          <Text style={styles.caption} numberOfLines={1}>
            {post.content}
          </Text>
        ) : null}
        <View style={styles.statsRow}>
          <Text style={styles.date}>{dateLabel(post.createdAt)}</Text>
          <View style={styles.stat}>
            <Ionicons name="heart" size={11} color={AstroColors.brand} />
            <Text style={styles.statText}>{post.likesCount ?? 0}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble" size={10} color={AstroColors.textMuted} />
            <Text style={styles.statText}>{post.commentsCount ?? 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  visual: {
    borderRadius: AstroRadius.md,
    overflow: "hidden",
    backgroundColor: AstroColors.brandTint,
  },
  textFill: { padding: 14, justifyContent: "space-between" },
  textCenter: { flex: 1, justifyContent: "center" },
  textContent: { fontSize: 13.5, lineHeight: 20, fontWeight: "600", textAlign: "center" },
  mark: { fontSize: 9, fontWeight: "800", opacity: 0.6, letterSpacing: 0.5 },
  videoFill: { backgroundColor: "#1F1147", alignItems: "center", justifyContent: "center" },
  play: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  duration: { position: "absolute", right: 8, bottom: 8, color: "#FFF", fontSize: 11, fontWeight: "700" },
  sticker: { position: "absolute", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, maxWidth: "80%" },
  stickerText: { fontSize: 11, fontWeight: "700" },
  footer: { paddingTop: 6, gap: 2 },
  caption: { fontSize: 12, color: "#374151" },
  author: { fontSize: 12.5, fontWeight: "700", color: AstroColors.ink },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  date: { flex: 1, fontSize: 11, color: AstroColors.textMuted },
  stat: { flexDirection: "row", alignItems: "center", gap: 3 },
  statText: { fontSize: 11, color: AstroColors.textSecondary },
});
