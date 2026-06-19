import { MOCK_ASTROLOGER_USER, MOCK_MY_BOOKINGS_AS_ASTROLOGER } from '@/src/mock/data';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}

export default function AstrologerDashboard() {
  const upcoming = MOCK_MY_BOOKINGS_AS_ASTROLOGER.filter(b => b.status === 'CONFIRMED');
  const completed = MOCK_MY_BOOKINGS_AS_ASTROLOGER.filter(b => b.status === 'COMPLETED');
  const earnings = completed.reduce((sum, b) => sum + b.price, 0);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Namaste 🙏</Text>
            <Text style={styles.name}>{MOCK_ASTROLOGER_USER.name}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 28 }}>🔮</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{upcoming.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completed.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#C9A84C' }]}>₹{earnings}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>

        {/* Upcoming Sessions */}
        <Text style={styles.sectionTitle}>📅 Upcoming Sessions</Text>
        {upcoming.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming sessions</Text>
          </View>
        ) : (
          upcoming.map((booking) => {
            const { date, time } = formatDate(booking.scheduledAt);
            return (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingStrip} />
                <View style={styles.bookingInner}>
                  <Text style={styles.bookingService}>{booking.serviceName}</Text>
                  <Text style={styles.bookingUser}>User: {booking.userId}</Text>
                  <View style={styles.bookingChips}>
                    <View style={styles.chip}><Text style={styles.chipText}>📅 {date}</Text></View>
                    <View style={styles.chip}><Text style={styles.chipText}>🕐 {time}</Text></View>
                    <View style={styles.chip}><Text style={styles.chipText}>⏱ {booking.durationMins} min</Text></View>
                  </View>
                  <Text style={styles.bookingPrice}>₹{booking.price}</Text>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080617' },
  content: { padding: 20, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  greeting: { fontSize: 14, color: '#6B6485' },
  name: { fontSize: 22, fontWeight: '800', color: '#F5ECD7' },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#1E1B38', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: '#0F0D22', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1E1B38' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#F5ECD7' },
  statLabel: { fontSize: 11, color: '#6B6485', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#F5ECD7' },
  emptyCard: { backgroundColor: '#0F0D22', borderRadius: 14, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1E1B38' },
  emptyText: { color: '#6B6485', fontSize: 14 },
  bookingCard: { backgroundColor: '#0F0D22', borderRadius: 14, borderWidth: 1, borderColor: '#1E1B38', overflow: 'hidden', flexDirection: 'row' },
  bookingStrip: { width: 4, backgroundColor: '#C9A84C' },
  bookingInner: { flex: 1, padding: 14, gap: 8 },
  bookingService: { fontSize: 15, fontWeight: '800', color: '#F5ECD7' },
  bookingUser: { fontSize: 12, color: '#6B6485' },
  bookingChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#1E1B38', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, color: '#C9A84C', fontWeight: '600' },
  bookingPrice: { fontSize: 16, fontWeight: '800', color: '#C9A84C' },
});
