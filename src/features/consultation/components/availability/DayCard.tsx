import { AstroColors, AstroRadius, AstroShadow, AstroType, MIN_TOUCH } from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { AvailabilityWindow } from "../../types";
import { dayTitle, displayTime, durationLabel, type DayGroup } from "../../utils/availability";

type Props = { group: DayGroup; onDelete: (w: AvailabilityWindow) => void };

// Ek din ka card — saare slots seedha dikhte hain (collapse nahi), delete ek tap door.
export default function DayCard({ group, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.day}>{dayTitle(group.date)}</Text>
      {group.windows.map((w, i) => (
        <View key={w.id} style={[styles.row, i > 0 && styles.rowDivider]}>
          <View style={styles.flex}>
            <Text style={styles.time}>
              {displayTime(w.startTime)} – {displayTime(w.endTime)}
            </Text>
            <Text style={styles.dur}>{durationLabel(w.startTime, w.endTime)}</Text>
          </View>
          <TouchableOpacity style={styles.del} onPress={() => onDelete(w)} accessibilityLabel="Slot hatao" hitSlop={4}>
            <Feather name="trash-2" size={18} color={AstroColors.danger} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { backgroundColor: AstroColors.surface, borderRadius: AstroRadius.lg, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, ...AstroShadow.soft },
  day: { ...AstroType.micro, color: AstroColors.brand, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", minHeight: 56 },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: AstroColors.border },
  time: { ...AstroType.heading, color: AstroColors.text },
  dur: { ...AstroType.caption, color: AstroColors.textMuted, marginTop: 1 },
  del: { width: MIN_TOUCH, height: MIN_TOUCH, borderRadius: MIN_TOUCH / 2, alignItems: "center", justifyContent: "center", marginRight: -8 },
});
