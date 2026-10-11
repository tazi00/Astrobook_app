// Post composer ke choices — astrologer ye colours chunta hai (user-facing palette).
export const BG_COLORS = [
  "#6B21A8",
  "#1E3A5F",
  "#92400E",
  "#065F46",
  "#9D174D",
  "#4C1D95",
  "#0369A1",
  "#B45309",
];
export const TEXT_COLORS = ["#FFFFFF", "#F5F5F5", "#FDE68A", "#FBCFE8", "#BFDBFE"];
export const STICKER_BG_COLORS = ["#00000090", "#9d0399", "#FFFFFF", "#065F46"];
export const STICKER_TEXT_COLORS = ["#FFFFFF", "#1A1A2E", "#FDE68A"];

// ── Sticker packs — emoji / text stickers jo image pe lagaye ja sakte hain ──
export const STICKER_PACKS: { label: string; stickers: string[] }[] = [
  {
    label: "🪐 Astro",
    stickers: ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🔮", "🌙", "⭐", "🌟", "✨", "💫", "🪐", "☀️"],
  },
  {
    label: "🙏 Bhakti",
    stickers: ["🙏", "🕉️", "☸️", "🪔", "🌺", "🌸", "🌼", "🔱", "📿", "🛕", "🪷", "🌹", "✡️", "☪️", "✝️", "🕯️", "🌿", "🍃", "🎐", "🎋"],
  },
  {
    label: "😊 Vibe",
    stickers: ["😊", "🥰", "😍", "🤩", "😌", "🧘", "💆", "🌈", "🦋", "❤️", "💜", "💛", "💙", "🌻", "🌊", "🔥", "⚡", "💎", "🌺", "🎯"],
  },
  {
    label: "💬 Text",
    stickers: ["Jai Shree Ram", "Jai Mata Di", "Om Namah Shivay", "Jai Hanuman", "Radhe Radhe", "Blessings ✨", "Good Vibes 🌟", "Stay Blessed 🙏", "Divine Energy 🔮", "Cosmic Love 💫"],
  },
];

export const MAX_VIDEO_DURATION_SEC = 300; // 5 minute max
export const MAX_VIDEO_SIZE_MB = 100;      // compressed 720p ke baad bhi 100MB safe limit hai
export const MAX_CONTENT = 2000;
export const MAX_TAGS = 3;         // prebuilt category chips
export const MAX_CUSTOM_TAGS = 3;  // user ke apne free-text tags