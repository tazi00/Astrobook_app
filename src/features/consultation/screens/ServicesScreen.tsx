import { AstroColors, AstroRadius, AstroShadow, AstroType, MIN_TOUCH } from "@/constants/astro-theme";
import { useAstrologerProfile } from "@/features/astrologer/hooks/useAstrologerProfile";
import { useUser } from "@/features/auth/store/auth.store";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from "../components/services/ServiceCard";
import ServiceEditor from "../components/services/ServiceEditor";
import { useMyServices } from "../hooks/useConsultancyServices";
import type { ConsultationService } from "../types";

export default function ServicesScreen() {
  const me = useUser();
  const { astrologer: profile } = useAstrologerProfile(me?.id);
  const commission = profile?.meta?.commissionPercentage ?? 0;

  const { services, loading, refreshing, fetchServices, deleteService } = useMyServices();
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ConsultationService | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchServices().finally(() => setLoadedOnce(true));
    }, []),
  );

  const basic = services.find((s) => s.isBasic) ?? null;
  const others = services.filter((s) => !s.isBasic);

  const openNew = () => {
    setEditing(null);
    setEditorOpen(true);
  };
  const openEdit = (s: ConsultationService) => {
    setEditing(s);
    setEditorOpen(true);
  };
  const confirmDelete = (s: ConsultationService) =>
    Alert.alert("Service delete karein?", `"${s.title}" hamesha ke liye hat jaayegi.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteService(s.id) },
    ]);

  const showSpinner = !loadedOnce && loading;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <LinearGradient colors={[AstroColors.canvasHeader, AstroColors.canvas]} style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.title}>Meri services</Text>
          <Text style={styles.sub}>Users inhi ko dekh kar book karte hain</Text>
        </View>
        <TouchableOpacity style={styles.addWrap} onPress={openNew} activeOpacity={0.85} accessibilityLabel="Nayi service banao">
          <LinearGradient colors={[AstroColors.brandLight, AstroColors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.add}>
            <Feather name="plus" size={16} color={AstroColors.onBrand} />
            <Text style={styles.addText}>Nayi</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {showSpinner ? (
        <View style={styles.center}>
          <ActivityIndicator color={AstroColors.brand} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchServices(true)} tintColor={AstroColors.brand} colors={[AstroColors.brand]} />
          }
        >
          {basic ? <ServiceCard service={basic} onEdit={() => openEdit(basic)} /> : null}

          {others.length > 0 ? (
            <>
              <Text style={styles.section}>Tumhari services</Text>
              {others.map((s) => (
                <ServiceCard key={s.id} service={s} onEdit={() => openEdit(s)} onDelete={() => confirmDelete(s)} />
              ))}
            </>
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Feather name="briefcase" size={22} color={AstroColors.brand} />
              </View>
              <Text style={styles.emptyTitle}>Apni pehli service banao</Text>
              <Text style={styles.emptyText}>Kundli, Tarot, Vastu… jo bhi tum karte ho. Cover, description aur prices ek hi jagah set ho jaate hain.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={openNew}>
                <Text style={styles.emptyBtnText}>Service banao</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {editorOpen ? (
        <ServiceEditor
          key={editing?.id ?? "new"}
          visible
          service={editing}
          commissionPercentage={commission}
          onClose={() => setEditorOpen(false)}
          onSaved={() => {
            setEditorOpen(false);
            fetchServices();
          }}
        />
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
  section: { ...AstroType.heading, color: AstroColors.ink, marginTop: 12 },
  empty: { alignItems: "center", backgroundColor: AstroColors.surface, borderRadius: AstroRadius.lg, padding: 24, gap: 6, marginTop: 8, ...AstroShadow.soft },
  emptyIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: AstroColors.brandTint, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { ...AstroType.body, fontWeight: "800", color: AstroColors.text },
  emptyText: { ...AstroType.caption, color: AstroColors.textSecondary, textAlign: "center", lineHeight: 18 },
  emptyBtn: { minHeight: MIN_TOUCH, paddingHorizontal: 20, marginTop: 8, borderRadius: AstroRadius.pill, borderWidth: 1.5, borderColor: AstroColors.brand, alignItems: "center", justifyContent: "center" },
  emptyBtnText: { ...AstroType.button, fontSize: 13, color: AstroColors.brand },
});
