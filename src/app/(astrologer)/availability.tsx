import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

type DayAvailability = {
  enabled: boolean;
  startTime: string;
  endTime: string;
};

export default function AvailabilityScreen() {
  const [availability, setAvailability] = useState<Record<number, DayAvailability>>({
    0: { enabled: false, startTime: '10:00', endTime: '18:00' },
    1: { enabled: true, startTime: '10:00', endTime: '18:00' },
    2: { enabled: true, startTime: '10:00', endTime: '18:00' },
    3: { enabled: true, startTime: '11:00', endTime: '16:00' },
    4: { enabled: true, startTime: '10:00', endTime: '18:00' },
    5: { enabled: true, startTime: '10:00', endTime: '18:00' },
    6: { enabled: false, startTime: '10:00', endTime: '14:00' },
  });

  const toggleDay = (day: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>My Availability</Text>
        <Text style={styles.subtitle}>Set your weekly schedule</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {DAYS.map((day, index) => {
          const avail = availability[index];
          return (
            <View key={index} style={[styles.dayCard, !avail.enabled && styles.dayCardDisabled]}>
              <View style={styles.dayHeader}>
                <TouchableOpacity
                  style={[styles.dayToggle, avail.enabled && styles.dayToggleActive]}
                  onPress={() => toggleDay(index)}
                >
                  <View style={[styles.toggleDot, avail.enabled && styles.toggleDotActive]} />
                </TouchableOpacity>
                <Text style={[styles.dayName, avail.enabled && styles.dayNameActive]}>{day}</Text>
                {!avail.enabled && <Text style={styles.offText}>Off</Text>}
              </View>

              {avail.enabled && (
                <View style={styles.timeRow}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>From</Text>
                    <Text style={styles.timeValue}>{avail.startTime}</Text>
                  </View>
                  <Text style={styles.timeSep}>→</Text>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>To</Text>
                    <Text style={styles.timeValue}>{avail.endTime}</Text>
                  </View>
                  <TouchableOpacity style={styles.editTimeBtn}>
                    <Text style={styles.editTimeBtnText}>✏️ Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Availability</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080617' },
  header: { padding: 20, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#F5ECD7' },
  subtitle: { fontSize: 13, color: '#6B6485', marginTop: 4 },
  content: { padding: 16, gap: 10 },
  dayCard: { backgroundColor: '#0F0D22', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1E1B38' },
  dayCardDisabled: { opacity: 0.5 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dayToggle: { width: 40, height: 22, borderRadius: 11, backgroundColor: '#1E1B38', justifyContent: 'center', paddingHorizontal: 2 },
  dayToggleActive: { backgroundColor: '#C9A84C' },
  toggleDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#6B6485' },
  toggleDotActive: { backgroundColor: '#FFF', alignSelf: 'flex-end' },
  dayName: { fontSize: 16, fontWeight: '700', color: '#6B6485', flex: 1 },
  dayNameActive: { color: '#F5ECD7' },
  offText: { fontSize: 12, color: '#4A4468' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  timeBlock: { backgroundColor: '#1E1B38', borderRadius: 10, padding: 10, alignItems: 'center', flex: 1 },
  timeLabel: { fontSize: 10, color: '#6B6485', marginBottom: 2 },
  timeValue: { fontSize: 16, fontWeight: '800', color: '#C9A84C' },
  timeSep: { color: '#6B6485', fontSize: 16 },
  editTimeBtn: { backgroundColor: '#1E1B38', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  editTimeBtnText: { color: '#F5ECD7', fontSize: 12 },
  saveBtn: { backgroundColor: '#C9A84C', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#080617', fontSize: 16, fontWeight: '800' },
});
