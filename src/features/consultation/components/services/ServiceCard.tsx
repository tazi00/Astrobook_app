import { AstroColors, AstroRadius, AstroShadow, AstroType, MIN_TOUCH } from "@/constants/astro-theme";
import { formatPrice } from "@/features/astrologer/utils/cardFormat";
import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SERVICE_TAGS, type ConsultationService } from "../../types";

type Props = {
  service: ConsultationService;
  onEdit: () => void;
  onDelete?: () => void;
};

function startingPrice(s: ConsultationService) {
  const def = s.variants?.find((v) => v.isDefault);
  return formatPrice(def?.price ?? s.price);
}

export default function ServiceCard({ service, onEdit, onDelete }: Props) {
  const price = startingPrice(service);
  const tags = service.tags.slice(0, 2).map((t) => SERVICE_TAGS.find((x) => x.id === t)?.label ?? t);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onEdit} accessibilityLabel={`${service.title} edit karo`}>
      {service.isBasic ? (
        <View style={[styles.thumb, styles.thumbBasic]}>
          <Feather name="star" size={24} color={AstroColors.goldDeep} />
        </View>
      ) : service.coverImage ? (
        <Image source={{ uri: service.coverImage }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbBasic]}>
          <Feather name="image" size={22} color={AstroColors.textMuted} />
        </View>
      )}

      <View style={styles.flex}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {service.title}
          </Text>
          {service.isBasic ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Basic</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.desc} numberOfLines={1}>
          {service.shortDescription}
        </Text>
        <View style={styles.metaRow}>
          {price ? <Text style={styles.price}>{price} se</Text> : null}
          {tags.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      {onDelete ? (
        <TouchableOpacity style={styles.del} onPress={onDelete} hitSlop={6} accessibilityLabel={`${service.title} delete karo`}>
          <Feather name="trash-2" size={18} color={AstroColors.textMuted} />
        </TouchableOpacity>
      ) : (
        <Feather name="chevron-right" size={18} color={AstroColors.brand} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, backgroundColor: AstroColors.surface, borderRadius: AstroRadius.lg, ...AstroShadow.soft },
  thumb: { width: 64, height: 64, borderRadius: AstroRadius.md, backgroundColor: AstroColors.brandTint },
  thumbBasic: { alignItems: "center", justifyContent: "center", backgroundColor: AstroColors.goldTint },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { flexShrink: 1, ...AstroType.body, fontWeight: "800", color: AstroColors.text },
  badge: { backgroundColor: AstroColors.goldTint, borderRadius: AstroRadius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { ...AstroType.micro, color: AstroColors.goldDeep },
  desc: { ...AstroType.caption, color: AstroColors.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6, marginTop: 6 },
  price: { ...AstroType.caption, fontWeight: "800", color: AstroColors.brand },
  tag: { backgroundColor: AstroColors.brandTint, borderRadius: AstroRadius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { ...AstroType.micro, color: AstroColors.brandDark },
  del: { width: MIN_TOUCH - 4, height: MIN_TOUCH - 4, alignItems: "center", justifyContent: "center" },
});
