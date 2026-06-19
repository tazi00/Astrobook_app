import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const INTERESTS = [
  'Numerology', 'Vastu', 'Past Life', 'Reiki',
  'Tarot', 'Astrology', 'Palmistry', 'Face Reading',
  'Kundli', 'Horoscope', 'Gemstones', 'Meditation',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [role, setRole] = useState<'USER' | 'ASTROLOGER'>('USER');
  const [loading, setLoading] = useState(false);

  const toggleInterest = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // TODO: Replace with real API call
  const handleComplete = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    setLoading(true);
    // Mock — simulate API delay
    setTimeout(() => {
      setLoading(false);
      if (role === 'ASTROLOGER') {
        router.replace('/(astrologer)/dashboard');
      } else {
        router.replace('/(user)/feed');
      }
    }, 800);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🌟</Text>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Help us personalize your cosmic journey</Text>
      </View>

      {/* Role Select */}
      <View style={styles.field}>
        <Text style={styles.label}>I am a *</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'USER' && styles.roleBtnActive]}
            onPress={() => setRole('USER')}
          >
            <Text style={[styles.roleBtnText, role === 'USER' && styles.roleBtnTextActive]}>
              👤 User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'ASTROLOGER' && styles.roleBtnActive]}
            onPress={() => setRole('ASTROLOGER')}
          >
            <Text style={[styles.roleBtnText, role === 'ASTROLOGER' && styles.roleBtnTextActive]}>
              🔮 Astrologer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#4A4468"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* DOB */}
      <View style={styles.field}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#4A4468"
          value={dob}
          onChangeText={setDob}
          keyboardType="number-pad"
        />
      </View>

      {/* Interests — only for users */}
      {role === 'USER' && (
        <View style={styles.field}>
          <Text style={styles.label}>Your Interests</Text>
          <Text style={styles.labelHint}>Select topics you're curious about</Text>
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
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.btn, loading && styles.btnLoading]}
        disabled={loading}
        onPress={handleComplete}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>{loading ? 'Setting up...' : 'Start My Journey 🚀'}</Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => router.replace('/(user)/feed')}
      >
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080617' },
  content: { padding: 24, paddingTop: 64, paddingBottom: 48 },
  header: { alignItems: 'center', marginBottom: 36 },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#F5ECD7', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B6485', textAlign: 'center' },
  field: { marginBottom: 24 },
  label: {
    fontSize: 14, color: '#C9A84C', fontWeight: '600',
    marginBottom: 8, letterSpacing: 0.3,
  },
  labelHint: { fontSize: 12, color: '#4A4468', marginBottom: 12, marginTop: -4 },
  input: {
    backgroundColor: '#0F0D22',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: '#F5ECD7',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1E1B38',
  },
  roleRow: { flexDirection: 'row', gap: 12 },
  roleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0F0D22',
    borderWidth: 1,
    borderColor: '#1E1B38',
    alignItems: 'center',
  },
  roleBtnActive: { backgroundColor: '#C9A84C18', borderColor: '#C9A84C' },
  roleBtnText: { color: '#6B6485', fontSize: 15, fontWeight: '600' },
  roleBtnTextActive: { color: '#C9A84C' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    backgroundColor: '#0F0D22', borderWidth: 1, borderColor: '#1E1B38',
  },
  chipActive: { backgroundColor: '#C9A84C18', borderColor: '#C9A84C' },
  chipText: { color: '#6B6485', fontSize: 13 },
  chipTextActive: { color: '#C9A84C', fontWeight: '600' },
  btn: {
    backgroundColor: '#C9A84C', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  btnLoading: { opacity: 0.7 },
  btnText: { color: '#080617', fontSize: 16, fontWeight: '700' },
  skipBtn: { alignItems: 'center', paddingVertical: 10 },
  skipText: { color: '#4A4468', fontSize: 14 },
});
