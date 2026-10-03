import { AstroColors, AstroRadius, AstroType, MIN_TOUCH } from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { AvailabilityWindow } from "../../types";
import {
  TIME_PRESETS,
  dayName,
  displayTime,
  durationLabel,
  makeTime,
  shortDate,
  toApiDate,
  toApiTime,
  upcomingDays,
  validateSlot,
} from "../../utils/availability";

type Props = {
  visible: boolean;
  existing: AvailabilityWindow[];
  saving: boolean;
  onClose: () => void;
  /** true = save ho gaya, sheet band hogi */
  onSubmit: (dates: string[], startTime: string, endTime: string) => Promise<boolean>;
};

const QUICK_DAYS = 7;

export default function AddSlotSheet({ visible, existing, saving, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const quick = upcomingDays(QUICK_DAYS);

  const [dates, setDates] = useState<string[]>([quick[0]!]);
  const [start, setStart] = useState(makeTime(11, 0));
  const [end, setEnd] = useState(makeTime(13, 0));
  const [picker, setPicker] = useState<null | "start" | "end" | "date">(null);
  const [error, setError] = useState<string | null>(null);

  const startStr = toApiTime(start);
  const endStr = toApiTime(end);
  // Hafte ke baahar ki chuni hui dates bhi chips mein dikhti hain
  const extraDates = dates.filter((d) => !quick.includes(d)).sort();
  const dur = durationLabel(startStr, endStr);

  const toggleDate = (d: string) => {
    setError(null);
    setDates((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const save = async () => {
    if (saving) return;
    const problem = validateSlot(dates, startStr, endStr, existing);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    if (await onSubmit(dates, startStr, endStr)) onClose();
  };

  const onPick = (kind: "start" | "end" | "date") => (_: unknown, value?: Date) => {
    setPicker(Platform.OS === "ios" ? kind : null);
    if (!value) return;
    setError(null);
    if (kind === "start") setStart(value);
    else if (kind === "end") setEnd(value);
    else {
      const d = toApiDate(value);
      setDates((prev) => (prev.includes(d) ? prev : [...prev, d]));
    }
  };

  const summary = dates.length > 0 && dur ? `${dates.length} din · ${dur} har din` : null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Band karo" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.grab} />

        {/* Save upar — bottom/keyboard pe kabhi nahi chhupta */}
        <View style={styles.bar}>
          <TouchableOpacity style={styles.barBtn} onPress={onClose} accessibilityLabel="Band karo">
            <Feather name="x" size={22} color={AstroColors.ink} />
          </TouchableOpacity>
          <Text style={styles.barTitle}>Slot add karo</Text>
          <TouchableOpacity onPress={save} disabled={saving} activeOpacity={0.85} accessibilityLabel="Save">
            <LinearGradient colors={[AstroColors.brandLight, AstroColors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.save}>
              {saving ? <ActivityIndicator size="small" color={AstroColors.onBrand} /> : <Text style={styles.saveText}>Save</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
          <Text style={styles.label}>Kin dino ke liye?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {quick.map((d) => (
              <DayChip key={d} top={dayName(d)} bottom={shortDate(d)} on={dates.includes(d)} onPress={() => toggleDate(d)} />
            ))}
            {extraDates.map((d) => (
              <DayChip key={d} top={dayName(d)} bottom={shortDate(d)} on onPress={() => toggleDate(d)} />
            ))}
            <TouchableOpacity style={[styles.chip, styles.chipMore]} onPress={() => setPicker("date")} accessibilityLabel="Aur date chuno">
              <Feather name="calendar" size={16} color={AstroColors.brand} />
              <Text style={styles.moreText}>Aur</Text>
            </TouchableOpacity>
          </ScrollView>

          <Text style={[styles.label, { marginTop: 18 }]}>Kitne baje?</Text>
          <View style={styles.timeRow}>
            <TimeField label="Shuru" value={displayTime(startStr)} onPress={() => setPicker("start")} />
            <Feather name="arrow-right" size={16} color={AstroColors.textMuted} />
            <TimeField label="Khatam" value={displayTime(endStr)} onPress={() => setPicker("end")} />
          </View>

          <View style={styles.presets}>
            {TIME_PRESETS.map((p) => {
              const on = startStr === toApiTime(makeTime(p.start[0], p.start[1])) && endStr === toApiTime(makeTime(p.end[0], p.end[1]));
              return (
                <TouchableOpacity
                  key={p.label}
                  style={[styles.preset, on && styles.presetOn]}
                  onPress={() => {
                    setError(null);
                    setStart(makeTime(p.start[0], p.start[1]));
                    setEnd(makeTime(p.end[0], p.end[1]));
                  }}
                >
                  <Text style={[styles.presetText, on && styles.presetTextOn]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={14} color={AstroColors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : summary ? (
            <Text style={styles.summary}>{summary}</Text>
          ) : null}
        </ScrollView>

        {picker === "start" || picker === "end" ? (
          <DateTimePicker
            value={picker === "start" ? start : end}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onPick(picker)}
          />
        ) : null}
        {picker === "date" ? (
          <DateTimePicker value={new Date()} mode="date" display={Platform.OS === "ios" ? "inline" : "default"} minimumDate={new Date()} onChange={onPick("date")} />
        ) : null}
      </View>
    </Modal>
  );
}

function DayChip({ top, bottom, on, onPress }: { top: string; bottom: string; on: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, on && styles.chipOn]} onPress={onPress} accessibilityState={{ selected: on }}>
      <Text style={[styles.chipTop, on && styles.chipTextOn]}>{top}</Text>
      <Text style={[styles.chipBottom, on && styles.chipTextOn]}>{bottom}</Text>
    </TouchableOpacity>
  );
}

function TimeField({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.timeField} onPress={onPress} activeOpacity={0.8} accessibilityLabel={`${label} time`}>
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={styles.timeValue}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: AstroColors.scrim },
  sheet: { backgroundColor: AstroColors.surface, borderTopLeftRadius: AstroRadius.xl, borderTopRightRadius: AstroRadius.xl, maxHeight: "88%" },
  grab: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: AstroColors.border, marginTop: 8 },
  bar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 6, gap: 4 },
  barBtn: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: "center", justifyContent: "center" },
  barTitle: { flex: 1, ...AstroType.heading, color: AstroColors.ink },
  save: { height: 38, minWidth: 76, paddingHorizontal: 18, borderRadius: AstroRadius.pill, alignItems: "center", justifyContent: "center", marginRight: 8 },
  saveText: { ...AstroType.button, fontSize: 13, color: AstroColors.onBrand },
  body: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  label: { ...AstroType.caption, fontWeight: "700", color: AstroColors.textSecondary, marginBottom: 8 },
  chips: { gap: 8, paddingRight: 8 },
  chip: { width: 62, height: 58, borderRadius: AstroRadius.md, borderWidth: 1.5, borderColor: AstroColors.border, backgroundColor: AstroColors.surface, alignItems: "center", justifyContent: "center", gap: 1 },
  chipOn: { backgroundColor: AstroColors.brand, borderColor: AstroColors.brand },
  chipMore: { borderStyle: "dashed", borderColor: AstroColors.brand, gap: 3 },
  chipTop: { ...AstroType.micro, color: AstroColors.textSecondary },
  chipBottom: { ...AstroType.body, fontWeight: "800", color: AstroColors.text },
  chipTextOn: { color: AstroColors.onBrand },
  moreText: { ...AstroType.micro, color: AstroColors.brand },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  timeField: { flex: 1, minHeight: 60, borderRadius: AstroRadius.md, backgroundColor: AstroColors.canvas, borderWidth: 1.5, borderColor: AstroColors.border, paddingHorizontal: 14, paddingVertical: 8, justifyContent: "center" },
  timeLabel: { ...AstroType.micro, color: AstroColors.textMuted },
  timeValue: { ...AstroType.heading, color: AstroColors.text, marginTop: 1 },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  preset: { minHeight: 36, paddingHorizontal: 14, borderRadius: AstroRadius.pill, backgroundColor: AstroColors.brandTint, alignItems: "center", justifyContent: "center" },
  presetOn: { backgroundColor: AstroColors.brand },
  presetText: { ...AstroType.caption, fontWeight: "700", color: AstroColors.brand },
  presetTextOn: { color: AstroColors.onBrand },
  summary: { ...AstroType.caption, color: AstroColors.textSecondary, marginTop: 16, textAlign: "center" },
  errorBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 16, padding: 12, borderRadius: AstroRadius.md, backgroundColor: AstroColors.dangerTint },
  errorText: { flex: 1, ...AstroType.caption, color: AstroColors.danger, lineHeight: 17 },
});
