import AstroLogo from "@/assets/images/astro-icon.svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INTERESTS = [
  "Numerology",
  "Vastu",
  "Past Life",
  "Reiki",
  "Tarot",
  "Astrology",
  "Palmistry",
  "Face Reading",
  "Kundli",
  "Horoscope",
  "Gemstones",
  "Meditation",
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDob(selectedDate);
  };

  const handleComplete = () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your name");
      return;
    }
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setLoading(false);
      router.replace("/(user)/feed" as any);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoRow}>
            <AstroLogo width={140} height={50} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome! 🌟</Text>
            <Text style={styles.subtitle}>
              Tell us a little about yourself to get started
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* DOB */}
            <View style={styles.field}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.dateBtnText, !dob && styles.datePlaceholder]}
                >
                  {dob ? formatDate(dob) : "Select your date of birth"}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
              <Text style={styles.fieldHint}>
                Optional — helps us give better cosmic insights
              </Text>
            </View>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={dob || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1940, 0, 1)}
            />
          )}

          {/* Interests */}
          <View style={styles.interestsSection}>
            <Text style={styles.interestsTitle}>Your Interests</Text>
            <Text style={styles.interestsSubtitle}>
              Select topics you're curious about
            </Text>
            <View style={styles.chips}>
              {INTERESTS.map((item) => {
                const active = selected.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleInterest(item)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {selected.length > 0 && (
            <Text style={styles.selectedCount}>
              {selected.length} interest{selected.length > 1 ? "s" : ""}{" "}
              selected ✨
            </Text>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnLoading]}
            disabled={loading}
            onPress={handleComplete}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>
              {loading ? "Setting up your profile..." : "Start My Journey 🚀"}
            </Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => router.replace("/(user)/feed" as any)}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F5FF" },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  logoRow: { alignItems: "center", marginBottom: 24 },
  header: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "800", color: "#1A1A2E", marginBottom: 6 },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    elevation: 2,
  },
  field: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: "#F9F5FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A2E",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
  },
  dateBtn: {
    backgroundColor: "#F9F5FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateBtnText: { fontSize: 15, color: "#1A1A2E", fontWeight: "500" },
  datePlaceholder: { color: "#9CA3AF", fontWeight: "400" },
  calendarIcon: { fontSize: 18 },
  fieldHint: { fontSize: 11, color: "#9CA3AF", marginTop: 6 },
  interestsSection: { marginBottom: 16 },
  interestsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  interestsSubtitle: { fontSize: 13, color: "#6B7280", marginBottom: 14 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#EDE9FF",
  },
  chipActive: { backgroundColor: "#F3E8FF", borderColor: "#9d0399" },
  chipText: { color: "#6B7280", fontSize: 13, fontWeight: "500" },
  chipTextActive: { color: "#9d0399", fontWeight: "700" },
  selectedCount: {
    textAlign: "center",
    fontSize: 13,
    color: "#9d0399",
    fontWeight: "600",
    marginBottom: 16,
  },
  btn: {
    backgroundColor: "#9d0399",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },
  btnLoading: { opacity: 0.7 },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  skipBtn: { alignItems: "center", paddingVertical: 10 },
  skipText: { color: "#9CA3AF", fontSize: 14 },
});
