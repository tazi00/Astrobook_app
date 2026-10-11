import { AstroColors, AstroRadius, AstroType } from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DOW_HEADER = ["S", "M", "T", "W", "T", "F", "S"];
const MON_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type DayMark = "recurring" | "override" | "both";

type Props = {
  /** YYYY-MM-DD → mark type */
  markedDates: Map<string, DayMark>;
  /** Currently selected YYYY-MM-DD (can be null) */
  selected: string | null;
  onSelect: (date: string) => void;
};

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function MonthCalendar({ markedDates, selected, onSelect }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const rows: (string | null)[][] = [];
    let week: (string | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(toKey(viewYear, viewMonth, d));
      if (week.length === 7) { rows.push(week); week = []; }
    }
    if (week.length > 0) rows.push([...week, ...Array(7 - week.length).fill(null)]);
    return rows;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  return (
    <View style={styles.root}>
      {/* Month nav */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={prevMonth} hitSlop={8} style={styles.navBtn}>
          <Feather name="chevron-left" size={20} color={AstroColors.brand} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {MON_NAMES[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} hitSlop={8} style={styles.navBtn}>
          <Feather name="chevron-right" size={20} color={AstroColors.brand} />
        </TouchableOpacity>
      </View>

      {/* Day-of-week headers */}
      <View style={styles.row}>
        {DOW_HEADER.map((h, i) => (
          <View key={i} style={styles.cell}>
            <Text style={styles.dowHdr}>{h}</Text>
          </View>
        ))}
      </View>

      {/* Date grid */}
      {cells.map((week, wi) => (
        <View key={wi} style={styles.row}>
          {week.map((key, di) => {
            if (!key) return <View key={di} style={styles.cell} />;
            const day = parseInt(key.slice(8), 10);
            const mark = markedDates.get(key);
            const isSelected = key === selected;
            const isToday = key === todayKey;

            return (
              <TouchableOpacity
                key={key}
                style={styles.cell}
                onPress={() => onSelect(key)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.dateCircle,
                  isSelected && styles.dateCircleSelected,
                  !isSelected && isToday && styles.dateCircleToday,
                ]}>
                  <Text style={[
                    styles.dateText,
                    isSelected && styles.dateTextSelected,
                    !isSelected && isToday && styles.dateTextToday,
                  ]}>
                    {day}
                  </Text>
                </View>
                {/* Availability dots */}
                {mark && (
                  <View style={styles.dots}>
                    {(mark === "recurring" || mark === "both") && (
                      <View style={[styles.dot, styles.dotRecurring]} />
                    )}
                    {(mark === "override" || mark === "both") && (
                      <View style={[styles.dot, styles.dotOverride]} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotRecurring]} />
          <Text style={styles.legendText}>Recurring</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotOverride]} />
          <Text style={styles.legendText}>Override</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: AstroColors.border,
  },

  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  navBtn: { padding: 4 },
  monthLabel: { ...AstroType.heading, color: AstroColors.ink, fontWeight: "700" },

  row: { flexDirection: "row" },
  cell: { flex: 1, alignItems: "center", paddingVertical: 4 },
  dowHdr: { ...AstroType.micro, color: AstroColors.textMuted, fontWeight: "600", marginBottom: 4 },

  dateCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  dateCircleSelected: { backgroundColor: AstroColors.brand },
  dateCircleToday: { borderWidth: 1.5, borderColor: AstroColors.brand },
  dateText: { ...AstroType.body, color: AstroColors.text, fontWeight: "500" },
  dateTextSelected: { color: "#fff", fontWeight: "700" },
  dateTextToday: { color: AstroColors.brand, fontWeight: "700" },

  dots: { flexDirection: "row", gap: 2, marginTop: 2, height: 5 },
  dot: { width: 4, height: 4, borderRadius: 2 },

  legend: { flexDirection: "row", gap: 16, marginTop: 12, justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendText: { ...AstroType.micro, color: AstroColors.textMuted },

  // Dot variants — clearly distinct colors
  dotRecurring: { backgroundColor: AstroColors.brand },       // purple
  dotOverride:  { backgroundColor: "#F59E0B" },               // amber/gold
});