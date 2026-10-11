/**
 * ModeChip — right-edge se chipka hua floating tab-switcher.
 *
 * Design:
 *   Left side: fully rounded (pill shape)
 *   Right side: flat (flush with screen edge)
 *   Sirf icon — no text
 *
 * Modes:
 *   "user"       → briefcase icon (purple filled) — user app se dashboard pe
 *   "astrologer" → home icon (white bordered)     — dashboard se user app pe
 */

import { AstroColors } from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_HEIGHT = 64;
const CHIP_MARGIN    = 16;

type Props = { mode: "user" | "astrologer" };

export function ModeChip({ mode }: Props) {
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    if (mode === "user") {
      router.push("/(astrologer)/dashboard" as any);
    } else {
      router.push("/(user)/(tabs)/feed" as any);
    }
  };

  const isDashboard = mode === "user";

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        isDashboard ? styles.chipDashboard : styles.chipHome,
        { bottom: TAB_BAR_HEIGHT + insets.bottom + CHIP_MARGIN },
      ]}
    >
      <Feather
        name={isDashboard ? "briefcase" : "home"}
        size={20}
        color={isDashboard ? "#fff" : AstroColors.brand}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    position: "absolute",
    right: 0,                       // screen ke right edge se chipka hua
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    // Left rounded, right flat
    borderTopLeftRadius: 26,
    borderBottomLeftRadius: 26,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 999,
    shadowColor: "#9d0399",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },

  chipDashboard: {
    backgroundColor: AstroColors.brand,
  },

  chipHome: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderRightWidth: 0,            // right side pe border nahi (flush hai)
    borderColor: AstroColors.brand,
  },
});