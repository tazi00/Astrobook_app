import {
  AstroColors,
  AstroRadius,
  AstroType,
  MIN_TOUCH,
} from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function LogoutButton({
  loading,
  onPress,
}: {
  loading: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.btn, loading && styles.loading]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.75}
      accessibilityLabel="Logout"
    >
      {loading ? (
        <ActivityIndicator size="small" color={AstroColors.danger} />
      ) : (
        <Feather name="log-out" size={18} color={AstroColors.danger} />
      )}
      <Text style={styles.text}>{loading ? "Logging out..." : "Logout"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: MIN_TOUCH + 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: AstroRadius.pill,
    backgroundColor: AstroColors.dangerTint,
  },
  loading: { opacity: 0.6 },
  text: { ...AstroType.button, color: AstroColors.danger },
});
