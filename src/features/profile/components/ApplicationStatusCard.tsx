import {
  AstroColors,
  AstroRadius,
  AstroType,
} from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// "Astrologer application" ka status — pending (gold tint) ya rejected (red tint)
export default function ApplicationStatusCard({
  kind,
  reason,
  onReapply,
}: {
  kind: "pending" | "rejected";
  reason?: string | null;
  onReapply: () => void;
}) {
  const pending = kind === "pending";
  return (
    <View style={[styles.card, pending ? styles.pending : styles.rejected]}>
      <View style={styles.head}>
        <Feather
          name={pending ? "clock" : "x-circle"}
          size={18}
          color={pending ? AstroColors.goldDeep : AstroColors.danger}
        />
        <Text style={[styles.title, { color: pending ? AstroColors.goldDeep : AstroColors.danger }]}>
          {pending ? "Application review mein hai" : "Application reject hui"}
        </Text>
      </View>
      <Text style={styles.text}>
        {pending
          ? "Verify hote hi aapko notification mil jayega."
          : reason
            ? `Wajah: ${reason}`
            : "Details sudhaar kar dobara apply kar sakte hain."}
      </Text>
      {!pending ? (
        <TouchableOpacity style={styles.reapply} onPress={onReapply} activeOpacity={0.8}>
          <Text style={styles.reapplyText}>Dobara apply karo</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: AstroRadius.lg, borderWidth: 1, padding: 16 },
  pending: { backgroundColor: AstroColors.goldTint, borderColor: AstroColors.goldBorder },
  rejected: { backgroundColor: AstroColors.dangerTint, borderColor: "#FECACA" },
  head: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { ...AstroType.body, fontWeight: "800" },
  text: { ...AstroType.body, color: AstroColors.textSecondary, lineHeight: 20, marginTop: 6 },
  reapply: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: AstroRadius.pill,
    borderWidth: 1.5,
    borderColor: AstroColors.danger,
  },
  reapplyText: { ...AstroType.caption, fontWeight: "800", color: AstroColors.danger },
});
