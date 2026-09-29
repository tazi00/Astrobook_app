import ScreenHeader from "@/components/ScreenHeader";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LEGAL_EFFECTIVE_DATE,
  getLegalDocument,
  type LegalDocKey,
} from "../resolve";

const TABS: { key: LegalDocKey; label: string }[] = [
  { key: "terms", label: "Terms" },
  { key: "privacy", label: "Privacy Policy" },
];

export default function LegalScreen() {
  // ?tab=privacy se seedha Privacy tab khul sakta hai (baad mein signup
  // screen ke "Privacy Policy" link se use karne ke liye)
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [active, setActive] = useState<LegalDocKey>(
    tab === "privacy" ? "privacy" : "terms",
  );

  const doc = useMemo(() => getLegalDocument(active), [active]);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScreenHeader
        title="Terms & Privacy"
        subtitle={`Last updated ${LEGAL_EFFECTIVE_DATE}`}
        fallbackHref="/(user)/(tabs)/profile"
      />

      <View style={styles.tabs}>
        {TABS.map((t) => {
          const on = t.key === active;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, on && styles.tabOn]}
              activeOpacity={0.8}
              onPress={() => setActive(t.key)}
            >
              <Text style={[styles.tabText, on && styles.tabTextOn]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        key={active}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.docTitle}>{doc.title}</Text>
          <Text style={styles.para}>{doc.intro}</Text>

          {doc.sections.map((s, i) => (
            <View key={i} style={styles.section}>
              {s.heading ? <Text style={styles.heading}>{s.heading}</Text> : null}
              {s.body?.map((p, j) => (
                <Text key={j} style={styles.para}>
                  {p}
                </Text>
              ))}
              {s.bullets?.map((b, j) => (
                <View key={j} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={[styles.para, styles.bulletText]}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0FF" },
  tabs: {
    flexDirection: "row",
    margin: 16,
    marginBottom: 0,
    padding: 4,
    backgroundColor: "#EDE4FA",
    borderRadius: 12,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  tabOn: { backgroundColor: "#FFF" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  tabTextOn: { color: "#9d0399", fontWeight: "800" },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    padding: 18,
  },
  docTitle: { fontSize: 20, fontWeight: "800", color: "#1A1A2E", marginBottom: 10 },
  section: { marginTop: 18 },
  heading: { fontSize: 15, fontWeight: "800", color: "#1A1A2E", marginBottom: 6 },
  para: { fontSize: 13.5, color: "#4A4468", lineHeight: 21, marginBottom: 6 },
  bulletRow: { flexDirection: "row", gap: 8, paddingRight: 8 },
  bulletDot: { fontSize: 13.5, color: "#9d0399", lineHeight: 21 },
  bulletText: { flex: 1 },
});
