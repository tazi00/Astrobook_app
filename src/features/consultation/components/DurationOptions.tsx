import {
  AstroColors,
  AstroRadius,
  AstroShadow,
  AstroType,
  MIN_TOUCH,
} from "@/constants/astro-theme";
import { formatPrice } from "@/features/astrologer/utils/cardFormat";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  VARIANT_DURATION_LABELS,
  type ConsultationServiceVariant,
  type VariantDurationMinutes,
} from "../types";

type Props = {
  variants: ConsultationServiceVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// Radio-style list: ek row = ek duration. Chhote chips ke grid se padhna
// aur dabana dono aasaan (poori row tappable, 52px+).
export default function DurationOptions({ variants, selectedId, onSelect }: Props) {
  return (
    <View style={styles.card} accessibilityRole="radiogroup">
      {variants.map((v, i) => {
        const selected = v.id === selectedId;
        const label =
          VARIANT_DURATION_LABELS[v.durationMinutes as VariantDurationMinutes] ??
          `${v.durationMinutes} min`;
        return (
          <Pressable
            key={v.id}
            onPress={() => onSelect(v.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${label}, ${formatPrice(v.price) ?? ""}`}
            style={({ pressed }) => [
              styles.row,
              i > 0 && styles.divider,
              selected && styles.rowSelected,
              pressed && !selected && styles.rowPressed,
            ]}
          >
            <View style={[styles.radio, selected && styles.radioOn]}>
              {selected ? <View style={styles.radioDot} /> : null}
            </View>
            <Text style={[styles.duration, selected && styles.durationOn]}>
              {label}
            </Text>
            {v.isDefault ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>Popular</Text>
              </View>
            ) : null}
            <View style={styles.flex} />
            <Text style={[styles.price, selected && styles.priceOn]}>
              {formatPrice(v.price) ?? "—"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.lg,
    overflow: "hidden",
    ...AstroShadow.soft,
  },
  row: {
    minHeight: MIN_TOUCH + 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AstroColors.border,
  },
  rowSelected: { backgroundColor: AstroColors.brandTint },
  rowPressed: { backgroundColor: AstroColors.canvas },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AstroColors.offline,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: { borderColor: AstroColors.brand },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AstroColors.brand,
  },
  duration: { ...AstroType.body, fontWeight: "700", color: AstroColors.text },
  durationOn: { color: AstroColors.brandDark },
  tag: {
    backgroundColor: AstroColors.goldTint,
    borderRadius: AstroRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { ...AstroType.micro, color: AstroColors.goldDeep },
  price: { ...AstroType.heading, color: AstroColors.ink },
  priceOn: { color: AstroColors.brand },
});
