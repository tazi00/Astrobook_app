import { AstroColors, AstroRadius, AstroType } from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  hint?: string;
  /** Image URI ho to thumbnail dikhta hai */
  imageUri?: string;
  /** Image nahi par picked (jaise video) — chhota text dikhao */
  pickedLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  wide?: boolean;
  onPick: () => void;
  onClear: () => void;
};

// Upload ka ek compact card: khali = dashed + icon, bhara = thumbnail/label + hatane ka ✕
export default function MediaPickCard({
  icon, title, hint, imageUri, pickedLabel, loading, disabled, wide, onPick, onClear,
}: Props) {
  const filled = !!imageUri || !!pickedLabel;
  return (
    <View style={[styles.wrap, wide ? styles.wide : styles.half]}>
      <TouchableOpacity
        style={[styles.card, filled && styles.cardFilled]}
        onPress={onPick}
        disabled={disabled}
        activeOpacity={0.85}
        accessibilityLabel={filled ? `${title} badlo` : `${title} upload karo`}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.img} />
        ) : filled ? (
          <View style={styles.center}>
            <View style={[styles.icon, styles.iconOn]}>
              <Feather name="check" size={20} color={AstroColors.onBrand} />
            </View>
            <Text style={styles.title}>{pickedLabel}</Text>
            <Text style={styles.hint}>Badalne ke liye dabao</Text>
          </View>
        ) : loading ? (
          <ActivityIndicator color={AstroColors.brand} />
        ) : (
          <View style={styles.center}>
            <View style={styles.icon}>
              <Feather name={icon} size={20} color={AstroColors.brand} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {hint ? <Text style={styles.hint}>{hint}</Text> : null}
          </View>
        )}
      </TouchableOpacity>
      {filled ? (
        <TouchableOpacity style={styles.clear} onPress={onClear} hitSlop={8} accessibilityLabel={`${title} hatao`}>
          <Feather name="x" size={14} color={AstroColors.onBrand} />
        </TouchableOpacity>
      ) : null}
      {imageUri ? <Text style={styles.cap}>{title}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative" },
  half: { flex: 1 },
  wide: { alignSelf: "stretch" },
  card: {
    minHeight: 120,
    borderRadius: AstroRadius.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: AstroColors.offline,
    backgroundColor: AstroColors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardFilled: { borderStyle: "solid", borderColor: AstroColors.brand },
  img: { width: "100%", height: 120 },
  center: { alignItems: "center", gap: 4, padding: 12 },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: AstroColors.brandTint, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  iconOn: { backgroundColor: AstroColors.brand },
  title: { ...AstroType.body, fontWeight: "700", color: AstroColors.brand, textAlign: "center" },
  hint: { ...AstroType.micro, fontWeight: "500", color: AstroColors.textSecondary, textAlign: "center" },
  clear: { position: "absolute", top: -6, right: -6, width: 24, height: 24, borderRadius: 12, backgroundColor: AstroColors.danger, alignItems: "center", justifyContent: "center" },
  cap: { ...AstroType.caption, color: AstroColors.textSecondary, marginTop: 6, textAlign: "center" },
});
