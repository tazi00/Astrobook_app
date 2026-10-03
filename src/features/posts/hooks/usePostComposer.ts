import * as FileSystemLegacy from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import {
  BG_COLORS,
  MAX_TAGS,
  MAX_VIDEO_DURATION_SEC,
  MAX_VIDEO_SIZE_MB,
  STICKER_BG_COLORS,
  STICKER_TEXT_COLORS,
  TEXT_COLORS,
} from "../constants";
import { postsService } from "../services/posts.service";
import type { MediaType, Post } from "../types/post.types";
import { useCreatePost, useImageKitUpload } from "./usePosts";
import { useInvalidatePosts } from "./useMyPosts";

const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

type Media = { uri: string; type: Exclude<MediaType, "TEXT">; duration?: number };

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

// Post banane ka saara state + logic (UI PostComposer me hai).
// Sticker ki position PostHero ke hisaab se: x,y = chip ka anchor (0..1),
// feed me bilkul isi jagah dikhta hai.
//
// `editing` diya ho to edit mode: media wahi rehta hai, sirf caption,
// categories aur (TEXT post ke) colours badalte hain.
export function usePostComposer(onPublished: () => void, editing?: Post) {
  const [content, setContent] = useState(editing?.content ?? "");
  const [tags, setTags] = useState<string[]>(editing?.tags ?? []);
  const [media, setMedia] = useState<Media | null>(null);
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);

  const [bgColor, setBgColor] = useState(editing?.bgColor ?? BG_COLORS[0]!);
  const [textColor, setTextColor] = useState(editing?.textColor ?? TEXT_COLORS[0]!);

  const [stickerOn, setStickerOn] = useState(false);
  const [stickerText, setStickerText] = useState("");
  const [stickerBg, setStickerBg] = useState(STICKER_BG_COLORS[0]!);
  const [stickerFg, setStickerFg] = useState(STICKER_TEXT_COLORS[0]!);
  const [stickerPos, setStickerPos] = useState({ x: 0.35, y: 0.45 });

  const { uploadImage, uploading, progress } = useImageKitUpload();
  const { createPost, loading: posting } = useCreatePost();
  const invalidate = useInvalidatePosts();

  const type: MediaType = editing ? editing.mediaType : (media?.type ?? "TEXT");
  const busy = uploading || posting || saving;
  const sameTags =
    tags.length === (editing?.tags ?? []).length &&
    tags.every((t) => editing?.tags?.includes(t));
  const isDirty = editing
    ? content !== editing.content ||
      !sameTags ||
      (type === "TEXT" &&
        (bgColor !== (editing.bgColor ?? BG_COLORS[0]) ||
          textColor !== (editing.textColor ?? TEXT_COLORS[0])))
    : content.trim().length > 0 || !!media || tags.length > 0;
  const canPublish =
    content.trim().length > 0 && !busy && !picking && (editing ? isDirty : true);

  const reset = () => {
    setContent("");
    setTags([]);
    setMedia(null);
    setStickerOn(false);
    setStickerText("");
    setStickerPos({ x: 0.35, y: 0.45 });
  };

  const toggleTag = (id: string) =>
    setTags((prev) => {
      if (prev.includes(id)) return prev.filter((t) => t !== id);
      if (prev.length >= MAX_TAGS) {
        Alert.alert("Limit", `Max ${MAX_TAGS} categories select kar sakte ho`);
        return prev;
      }
      return [...prev, id];
    });

  // Photo = feed jaisa square crop, Video = trim (max duration ke liye zaroori)
  const pick = async (kind: "image" | "video") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [kind === "image" ? "images" : "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      videoMaxDuration: MAX_VIDEO_DURATION_SEC,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];

    if (kind === "image") {
      setMedia({ uri: asset.uri, type: "IMAGE" });
      return;
    }

    setPicking(true); // size-check me thoda time lag sakta hai
    try {
      const durationSec = asset.duration ? Math.round(asset.duration / 1000) : 0;
      if (durationSec > MAX_VIDEO_DURATION_SEC) {
        Alert.alert(
          "Video Bahut Lambi Hai",
          `Max ${MAX_VIDEO_DURATION_SEC / 60} minute ki video allowed hai — thodi chhoti chuno.`,
        );
        return;
      }
      // fileSize kabhi missing hota hai (trimmed videos) — FileSystem se fallback
      let sizeBytes = (asset as any).fileSize ?? (asset as any).filesize;
      if (!sizeBytes) {
        const info = await FileSystemLegacy.getInfoAsync(asset.uri, { size: true } as any);
        sizeBytes = (info as any).size ?? 0;
      }
      if (sizeBytes > MAX_VIDEO_SIZE_BYTES) {
        Alert.alert(
          "Video Bahut Badi Hai",
          `Max ${MAX_VIDEO_SIZE_MB}MB tak ki video allowed hai — thodi chhoti quality mein try karo.`,
        );
        return;
      }
      setMedia({ uri: asset.uri, type: "VIDEO", duration: durationSec });
    } finally {
      setPicking(false);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setStickerOn(false);
    setStickerText("");
  };

  const moveSticker = (x: number, y: number) =>
    setStickerPos({ x: clamp(x, 0, 0.7), y: clamp(y, 0, 0.85) });

  const save = async () => {
    if (!editing || !canPublish) return;
    setSaving(true);
    try {
      await postsService.updatePost(editing.id, {
        content,
        tags,
        ...(type === "TEXT" ? { bgColor, textColor } : {}),
      });
      invalidate(editing.id);
      onPublished();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Post save nahi hua");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (editing) return save();
    if (!canPublish) return;
    let mediaUrl: string | undefined;
    if (media) {
      const isVideo = media.type === "VIDEO";
      const url = await uploadImage(
        media.uri,
        `post_${Date.now()}.${isVideo ? "mp4" : "jpg"}`,
        "/astrobook/posts",
        isVideo ? "video/mp4" : "image/jpeg",
      );
      if (!url) return; // uploadImage khud Alert dikha chuka hai
      mediaUrl = url;
    }

    const post = await createPost({
      content,
      mediaUrl,
      mediaType: type,
      tags,
      ...(type === "TEXT" ? { bgColor, textColor } : {}),
      ...(media?.type === "VIDEO" && media.duration
        ? { durationSeconds: media.duration }
        : {}),
      ...(media?.type === "IMAGE" && stickerOn && stickerText.trim()
        ? {
            stickerText: stickerText.trim(),
            stickerX: stickerPos.x,
            stickerY: stickerPos.y,
            stickerTextColor: stickerFg,
            stickerBgColor: stickerBg,
          }
        : {}),
    });
    if (!post) return; // useCreatePost ne error dikha diya
    invalidate();
    reset();
    onPublished();
  };

  return {
    content, setContent,
    tags, toggleTag,
    media, type, picking, pick, removeMedia,
    bgColor, setBgColor, textColor, setTextColor,
    stickerOn, setStickerOn, stickerText, setStickerText,
    stickerBg, setStickerBg, stickerFg, setStickerFg,
    stickerPos, moveSticker,
    uploading, posting, progress, busy,
    canPublish, isDirty, publish, reset,
  };
}
