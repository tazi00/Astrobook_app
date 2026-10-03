import { AstroColors, AstroRadius, AstroShadow, AstroType, MIN_TOUCH } from "@/constants/astro-theme";
import { toast } from "@/components/toast";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddSlotSheet from "../components/availability/AddSlotSheet";
import DayCard from "../components/availability/DayCard";
import { useAvailabilityManager } from "../hooks/useAvailabilityManager";
import { displayTime, groupUpcoming } from "../utils/availability";
import type { AvailabilityWindow } from "../types";

export default function AvailabilityScreen() {
  const { windows, loading, refreshing, error, refetch, create, remove } = useAvailabilityManager();
  const [sheetOpen, setSheetOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const groups = useMemo(() => groupUpcoming(windows), [windows]);
  const slotCount = groups.reduce((n, g) => n + g.windows.length, 0);

  const confirmDelete = (w: AvailabilityWindow) =>
    Alert.alert("Slot hataayein?", `${displayTime(w.startTime)} – ${displayTime(w.endTime)} ka slot hat jaayega.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Hatao",
        style: "destructive",
        onPress: () => remove.mutate(w.id, { onError: () => toast.show("Slot hata nahi paaye, dobara try karo", "error") }),
      },
    ]);

  const submit = async (dates: string[], startTime: string, endTime: string) => {
    try {
      const { created, failed } = await create.mutateAsync({ dates, startTime, endTime });
      if (created > 0) {
        toast.show(failed ? `${created} din ke slot ban gaye, ${failed} nahi bane` : "Slot add ho gaya", failed ? "error" : "success");
        return true;
      }
      toast.show("Slot save nahi hua, dobara try karo", "error");
    } catch {
      toast.show("Slot save nahi hua, dobara try karo", "error");
    }
    return false;
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <LinearGradient colors={[AstroColors.canvasHeader, AstroColors.canvas]} style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.title}>Meri availability</Text>
          <Text style={styles.sub}>
            {slotCount > 0 ? `${slotCount} slot · ${groups.length} din` : "Users inhi ghanton mein book karenge"}
          </Text>
        </View>
        <TouchableOpacity style={styles.addWrap} onPress={() => setSheetOpen(true)} activeOpacity={0.85} accessibilityLabel="Slot add karo">
          <LinearGradient colors={[AstroColors.brandLight, AstroColors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.add}>
            <Feather name="plus" size={16} color={AstroColors.onBrand} />
            <Text style={styles.addText}>Slot</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={AstroColors.brand} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => refetch()} tintColor={AstroColors.brand} colors={[AstroColors.brand]} />}
        >
          {error ? (
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: AstroColors.dangerTint }]}>
                <Feather name="wifi-off" size={22} color={AstroColors.danger} />
              </View>
              <Text style={styles.emptyTitle}>Availability load nahi hui</Text>
              <Text style={styles.emptyText}>Internet check karke dobara try karo.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => refetch()}>
                <Text style={styles.emptyBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : groups.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Feather name="calendar" size={22} color={AstroColors.brand} />
              </View>
              <Text style={styles.emptyTitle}>Koi slot khula nahi hai</Text>
              <Text style={styles.emptyText}>Jin ghanton mein tum available ho wo add karo — users sirf unhi mein book kar paayenge.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => setSheetOpen(true)}>
                <Text style={styles.emptyBtnText}>Slot add karo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            groups.map((g) => <DayCard key={g.date} group={g} onDelete={confirmDelete} />)
          )}
        </ScrollView>
      )}

      {sheetOpen ? (
        <AddSlotSheet visible existing={windows} onClose={() => setSheetOpen(false)} onSubmit={submit} saving={create.isPending} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AstroColors.canvas },
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  title: { ...AstroType.title, color: AstroColors.ink },
  sub: { ...AstroType.caption, color: AstroColors.textSecondary, marginTop: 2 },
  addWrap: { borderRadius: AstroRadius.pill, overflow: "hidden", ...AstroShadow.soft },
  add: { height: 40, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 4 },
  addText: { ...AstroType.button, fontSize: 13, color: AstroColors.onBrand },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  empty: { alignItems: "center", backgroundColor: AstroColors.surface, borderRadius: AstroRadius.lg, padding: 24, gap: 6, marginTop: 8, ...AstroShadow.soft },
  emptyIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: AstroColors.brandTint, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { ...AstroType.body, fontWeight: "800", color: AstroColors.text },
  emptyText: { ...AstroType.caption, color: AstroColors.textSecondary, textAlign: "center", lineHeight: 18 },
  emptyBtn: { minHeight: MIN_TOUCH, paddingHorizontal: 20, marginTop: 8, borderRadius: AstroRadius.pill, borderWidth: 1.5, borderColor: AstroColors.brand, alignItems: "center", justifyContent: "center" },
  emptyBtnText: { ...AstroType.button, fontSize: 13, color: AstroColors.brand },
});
