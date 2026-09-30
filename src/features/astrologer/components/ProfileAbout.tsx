import { AstroColors, AstroRadius, AstroType } from "@/constants/astro-theme";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Header card ke neeche: Expertise chips + About. Lean rakha — bio 3 line
// tak, zyada ho to "Aur padho" se khulti hai (sirf tab dikhta hai jab bio
// waqai lambi ho).
const COLLAPSED_LINES = 3;

export default function ProfileAbout({
  expertise,
  bio,
}: {
  expertise: string[];
  bio?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  // Onlayout se overflow pata karna platform-dependent hai; length se andaza
  // kaafi hai (~3 lines ≈ 150 chars)
  const isLong = !!bio && bio.length > 150;
  if (expertise.length === 0 && !bio) return null;

  return (
    <View style={styles.wrap}>
      {expertise.length > 0 && (
        <View style={styles.block}>
          <Text style={styles.label}>Expertise</Text>
          <View style={styles.chips}>
            {expertise.map((e) => (
              <View key={e} style={styles.chip}>
                <Text style={styles.chipText}>{e}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {bio ? (
        <View style={styles.block}>
          <Text style={styles.label}>About</Text>
          <Text
            style={styles.bio}
            numberOfLines={expanded ? undefined : COLLAPSED_LINES}
          >
            {bio}
          </Text>
          {isLong && (
            <TouchableOpacity
              hitSlop={8}
              onPress={() => setExpanded((v) => !v)}
              accessibilityRole="button"
            >
              <Text style={styles.more}>{expanded ? "Kam dikhao" : "Aur padho"}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: AstroColors.brandTint,
    gap: 14,
  },
  block: { gap: 8 },
  label: { ...AstroType.micro, color: AstroColors.textMuted, textTransform: "uppercase", letterSpacing: 0.6 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: AstroColors.brandTint,
    borderRadius: AstroRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 12, fontWeight: "700", color: AstroColors.brandDark },
  bio: { fontSize: 13.5, lineHeight: 21, color: "#374151" },
  more: { fontSize: 13, fontWeight: "700", color: AstroColors.brand },
});
