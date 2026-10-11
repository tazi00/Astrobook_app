/**
 * EditSlotSheet — existing slot ka time change karne ke liye.
 * Backend mein update endpoint nahi hai, isliye save = delete old + create new.
 * Parent yeh kaam karta hai; sheet sirf naya start/end time leti hai.
 */
import { AstroColors, AstroRadius, AstroType, MIN_TOUCH } from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { displayTime, timeToMinutes } from "../../utils/availability";

/** HH:MM string (24h) */
function toHM(h: number, m: number): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

type Props = {
  visible: boolean;
  /** Current slot times (HH:MM 24h) */
  initialStart: string;
  initialEnd: string;
  /** Label shown in header, e.g. "Mon recurring" or "Tue 13 Oct" */
  label: string;
  saving: boolean;
  onSave: (newStart: string, newEnd: string) => Promise<void>;
  onClose: () => void;
};

/** HH:MM string → Date object (today's date, just for the picker) */
function hmToDate(hm: string): Date {
  const [h, m] = hm.split(":").map(Number);
  const d = new Date();
  d.setHours(h!, m!, 0, 0);
  return d;
}

/** Date → HH:MM string */
function dateToHm(d: Date): string {
  return toHM(d.getHours(), d.getMinutes());
}

export default function EditSlotSheet({
  visible, initialStart, initialEnd, label, saving, onSave, onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const [startDate, setStartDate] = useState(() => hmToDate(initialStart));
  const [endDate, setEndDate] = useState(() => hmToDate(initialEnd));
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const newStart = dateToHm(startDate);
  const newEnd = dateToHm(endDate);
  const valid =
    newStart !== initialStart || newEnd !== initialEnd
      ? timeToMinutes(newEnd) > timeToMinutes(newStart)
      : false; // koi change nahi hua

  const handleSave = async () => {
    if (!valid) return;
    await onSave(newStart, newEnd);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Slot edit karo</Text>
            <Text style={styles.subtitle}>{label}</Text>
          </View>
          <TouchableOpacity onPress={onClose} hitSlop={8} style={styles.closeBtn}>
            <Feather name="x" size={20} color={AstroColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Time selectors */}
        <View style={styles.timeRow}>
          {/* Start time */}
          <TouchableOpacity
            style={[styles.timeBox, showStart && styles.timeBoxActive]}
            onPress={() => { setShowStart(true); setShowEnd(false); }}
            activeOpacity={0.7}
          >
            <Text style={styles.timeLabel}>Shuru</Text>
            <Text style={styles.timeValue}>{displayTime(newStart)}</Text>
          </TouchableOpacity>

          <Feather name="arrow-right" size={16} color={AstroColors.textMuted} />

          {/* End time */}
          <TouchableOpacity
            style={[styles.timeBox, showEnd && styles.timeBoxActive]}
            onPress={() => { setShowEnd(true); setShowStart(false); }}
            activeOpacity={0.7}
          >
            <Text style={styles.timeLabel}>Khatam</Text>
            <Text style={styles.timeValue}>{displayTime(newEnd)}</Text>
          </TouchableOpacity>
        </View>

        {/* Duration hint */}
        {timeToMinutes(newEnd) > timeToMinutes(newStart) ? (
          <Text style={styles.durHint}>
            {(() => {
              const mins = timeToMinutes(newEnd) - timeToMinutes(newStart);
              const h = Math.floor(mins / 60), m = mins % 60;
              return h > 0 && m > 0 ? `${h} ghanta ${m} min` : h > 0 ? `${h} ghanta` : `${m} min`;
            })()}
          </Text>
        ) : (
          <Text style={[styles.durHint, { color: AstroColors.danger }]}>
            End time, start time se baad hona chahiye
          </Text>
        )}

        {/* Inline pickers (iOS always visible; Android shows as popup after tap) */}
        {showStart && (
          <DateTimePicker
            value={startDate}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, d) => {
              if (d) setStartDate(d);
              if (Platform.OS === "android") setShowStart(false);
            }}
            style={styles.picker}
          />
        )}
        {showEnd && (
          <DateTimePicker
            value={endDate}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, d) => {
              if (d) setEndDate(d);
              if (Platform.OS === "android") setShowEnd(false);
            }}
            style={styles.picker}
          />
        )}

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, (!valid || saving) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!valid || saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Feather name="check" size={16} color="#fff" />
              <Text style={styles.saveBtnText}>Save karo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    backgroundColor: AstroColors.canvas,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  handle: {
    width: 36, height: 4,
    backgroundColor: AstroColors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 },
  title: { ...AstroType.heading, color: AstroColors.ink, fontWeight: "700" },
  subtitle: { ...AstroType.caption, color: AstroColors.textMuted, marginTop: 2 },
  closeBtn: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: "center", justifyContent: "center", marginRight: -8 },

  timeRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  timeBox: {
    flex: 1,
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.md ?? 10,
    borderWidth: 1.5,
    borderColor: AstroColors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  timeBoxActive: { borderColor: AstroColors.brand },
  timeLabel: { ...AstroType.micro, color: AstroColors.textMuted, marginBottom: 4 },
  timeValue: { ...AstroType.heading, color: AstroColors.text, fontWeight: "700" },

  durHint: { ...AstroType.caption, color: AstroColors.textMuted, textAlign: "center", marginBottom: 12 },

  picker: { marginBottom: 8 },

  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: AstroColors.brand,
    borderRadius: AstroRadius.pill,
    height: 48,
    marginTop: 12,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { ...AstroType.button, color: "#fff" },
});