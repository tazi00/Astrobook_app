import { AstroColors, AstroRadius, AstroShadow, AstroType, MIN_TOUCH } from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { AvailabilityWindow } from "../../types";
import { displayTime, durationLabel, type DayGroup } from "../../utils/availability";

const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-13" → { dow: "Tue", date: "13 Oct" } */
function parseDateLabel(s: string): { dow: string; date: string } {
  const d = new Date(`${s}T00:00:00`);
  return { dow: DOW_SHORT[d.getDay()]!, date: `${d.getDate()} ${MON_SHORT[d.getMonth()]!}` };
}

type Props = { group: DayGroup; onDelete: (w: AvailabilityWindow) => void };

// Ek din ka card — compact single-line layout, date left + time right
export default function DayCard({ group, onDelete }: Props) {
  const { dow, date } = parseDateLabel(group.date);
  return (
    <View style={styles.card}>
      {group.windows.map((w, i) => (
        <View key={w.id} style={[styles.row, i > 0 && styles.rowDivider]}>
          {/* Left: date label */}
          <View style={styles.dateCol}>
            <Text style={styles.dayNum}>{dow}</Text>
            <Text style={styles.month}>{date}</Text>
          </View>
          {/* Right: time + duration */}
          <View style={styles.flex}>
            <Text style={styles.time}>
              {displayTime(w.startTime ?? '')} – {displayTime(w.endTime ?? '')}
            </Text>
            <Text style={styles.dur}>{durationLabel(w.startTime ?? '', w.endTime ?? '')}</Text>
          </View>
          <TouchableOpacity style={styles.del} onPress={() => onDelete(w)} accessibilityLabel="Slot hatao" hitSlop={4}>
            <Feather name="trash-2" size={16} color={AstroColors.danger} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { backgroundColor: AstroColors.surface, borderRadius: AstroRadius.lg, overflow: "hidden", ...AstroShadow.soft },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: AstroColors.border },
  dateCol: { width: 48, marginRight: 12 },
  dayNum: { ...AstroType.micro, fontWeight: "700", color: AstroColors.brand, textTransform: "uppercase", letterSpacing: 0.5 },
  month: { ...AstroType.micro, color: AstroColors.textMuted, marginTop: 1 },
  time: { ...AstroType.body, color: AstroColors.text, fontWeight: "600" },
  dur: { ...AstroType.caption, color: AstroColors.textMuted, marginTop: 1 },
  del: { width: MIN_TOUCH, height: MIN_TOUCH, borderRadius: MIN_TOUCH / 2, alignItems: "center", justifyContent: "center", marginRight: -8 },
});