import Header from "@/components/header";
import { MOCK_ASTROLOGERS, MOCK_SERVICES } from "@/mock/data";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AstrologerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"about" | "services">("about");

  const astrologer =
    MOCK_ASTROLOGERS.find((a) => a.id === id) || MOCK_ASTROLOGERS[0];
  const services = MOCK_SERVICES.filter(
    (s) => s.astrologerId === astrologer.id,
  );

  return (
    <View style={styles.root}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Banner */}
        <View style={[styles.banner, { backgroundColor: astrologer.color }]}>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 48 }}>{astrologer.emoji}</Text>
          </View>
          <Text style={styles.name}>{astrologer.name}</Text>
          <Text style={styles.speciality}>{astrologer.speciality}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{astrologer.rating}⭐</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{astrologer.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{astrologer.experience}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.tabActive]}
            onPress={() => setActiveTab("about")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "about" && styles.tabTextActive,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "services" && styles.tabActive]}
            onPress={() => setActiveTab("services")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "services" && styles.tabTextActive,
              ]}
            >
              Services ({services.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeTab === "about" ? (
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{astrologer.bio}</Text>
              <Text style={styles.sectionTitle}>Languages</Text>
              <Text style={styles.bio}>{astrologer.languages}</Text>
              <Text style={styles.sectionTitle}>Specializations</Text>
              <View style={styles.tags}>
                {astrologer.interests.map((interest) => (
                  <View key={interest} style={styles.tag}>
                    <Text style={styles.tagText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.servicesSection}>
              {services.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.serviceDesc} numberOfLines={2}>
                        {service.description}
                      </Text>
                    </View>
                    <Text style={styles.servicePrice}>₹{service.price}</Text>
                  </View>
                  <View style={styles.serviceChips}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>
                        ⏱ {service.durationMins} min
                      </Text>
                    </View>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>
                        {service.callType === "VIDEO" ? "📹 Video" : "📞 Voice"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/(user)/book-slot" as any,
                        params: {
                          astroId: astrologer.id,
                          serviceId: service.id,
                        },
                      })
                    }
                  >
                    <Text style={styles.bookBtnText}>Book This Service →</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0FF" },
  banner: { paddingTop: 24, paddingBottom: 32, alignItems: "center", gap: 8 },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 22, fontWeight: "800", color: "#FFF" },
  speciality: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  statsRow: { flexDirection: "row", gap: 32, marginTop: 8 },
  stat: { alignItems: "center" },
  statValue: { fontSize: 16, fontWeight: "800", color: "#FFF" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDE9FF",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#9d0399" },
  tabText: { fontSize: 14, color: "#888", fontWeight: "500" },
  tabTextActive: { color: "#9d0399", fontWeight: "700" },
  content: { padding: 16 },
  aboutSection: { gap: 12 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A2E",
    marginTop: 8,
  },
  bio: { fontSize: 14, color: "#555", lineHeight: 22 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#F3E8FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#9d0399",
  },
  tagText: { color: "#9d0399", fontSize: 12, fontWeight: "600" },
  servicesSection: { gap: 12 },
  serviceCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    gap: 10,
    elevation: 1,
  },
  serviceTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  serviceName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  serviceDesc: { fontSize: 12, color: "#666", lineHeight: 18 },
  servicePrice: { fontSize: 18, fontWeight: "800", color: "#9d0399" },
  serviceChips: { flexDirection: "row", gap: 8 },
  chip: {
    backgroundColor: "#F5F0FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: { fontSize: 11, color: "#6B21A8", fontWeight: "600" },
  bookBtn: {
    backgroundColor: "#9d0399",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  bookBtnText: { color: "#FFF", fontWeight: "800", fontSize: 14 },
});
