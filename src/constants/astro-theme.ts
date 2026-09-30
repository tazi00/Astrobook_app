// ─── Astrobook design tokens ────────────────────────────────────────────────
// App ka single source of truth: colors, spacing, radius, typography, shadows.
// Naye/badalte screens `#9d0399` jaise hex direct likhne ki jagah yahin se
// lein. (constants/theme.ts Expo template ka hai — themed-text/themed-view
// use karte hain — usse chhedna nahi.)
//
// Look: light lavender canvas + brand purple, gold sirf "special" cheezon
// ke liye (stars, Top Choice) — taaki gold ka matlab hamesha "khaas" rahe.

import { Platform, type TextStyle, type ViewStyle } from "react-native";

export const AstroColors = {
  // Brand
  brand: "#9D0399",
  brandDark: "#7A0480",
  brandLight: "#B4179F", // gradient ka shuruaati rang
  brandTint: "#F3E8FF", // halka purple fill (pills, icon bg)
  brandTintStrong: "#EDE9FF",

  // Surfaces
  canvas: "#F9F5FF", // screen background
  canvasHeader: "#FFF1FF", // top header/intro strip
  surface: "#FFFFFF", // cards
  border: "#EDE0F5",

  // Text
  ink: "#0B1D5B", // titles (navy)
  text: "#1A1A2E",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  onBrand: "#FFFFFF",

  // Status
  success: "#22C55E",
  successDark: "#15803D",
  successTint: "#DCFCE7",
  danger: "#DC2626",
  offline: "#C4B5E0",

  // Gold — stars & Top Choice
  gold: "#F5A623",
  goldDeep: "#B7791F",
  goldTint: "#FFF7E0",
  goldBorder: "#F6DFA4",
} as const;

export const AstroSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const AstroRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const AstroType = {
  title: { fontSize: 20, fontWeight: "800" } satisfies TextStyle,
  heading: { fontSize: 16, fontWeight: "800" } satisfies TextStyle,
  body: { fontSize: 14, fontWeight: "500" } satisfies TextStyle,
  caption: { fontSize: 12, fontWeight: "500" } satisfies TextStyle,
  micro: { fontSize: 11, fontWeight: "600" } satisfies TextStyle,
  button: { fontSize: 14, fontWeight: "800" } satisfies TextStyle,
} as const;

// Card shadow — iOS shadow* + Android elevation dono
export const AstroShadow = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#4C1D95",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    default: { elevation: 3, shadowColor: "#4C1D95" },
  }) as ViewStyle,
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#4C1D95",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
    },
    default: { elevation: 1, shadowColor: "#4C1D95" },
  }) as ViewStyle,
} as const;

// Kam-se-kam 44px touch target (accessibility / thumb-friendly)
export const MIN_TOUCH = 44;
