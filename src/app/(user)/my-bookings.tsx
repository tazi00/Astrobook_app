import Header from '@/src/components/header';
import { MOCK_BOOKINGS } from '@/src/mock/data';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = [
  { key: 'CONFIRMED', label: 'Upcoming', color: '#6B21A8', emoji: '📅' },
  { key: 'COMPLETED', label: 'Completed', color: '#065F46', emoji: '✅' },
  { key: 'CANCELLED', label: 'Cancelled', color: '#991B1B', emoji: '❌' },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}

export default function MyBookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('CONFIRMED');

  const filtered = MOCK_BOOKINGS.filter((b) => b.status === activeTab);
  const activeTabInfo = TABS.find((t) => t.key === activeTab)!;

  return (
    <View style={styles.root}>
      <Header />

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { borderBottomColor: tab.color, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && { color: tab.color, fontWeight: '700' }]}>
              {tab.emoji} {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>📭</Text>
            <Text style={styles.emptyTitle}>No {activeTabInfo.label} Bookings</Text>
            <Text style={styles.emptySub}>
              {activeTab === 'CONFIRMED' ? 'Book a consultation to get started' : 'Your bookings will appear here'}
            </Text>
            {activeTab === 'CONFIRMED' && (
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => router.push('/(user)/explore' as any)}
              >
                <Text style={styles.browseBtnText}>Browse Astrologers</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map((booking) => {
            const { date, time } = formatDate(booking.scheduledAt);
            return (
              <View key={booking.id} style={styles.card}>
                <View style={[styles.cardStrip, { backgroundColor: activeTabInfo.color }]} />
                <View style={styles.cardInner}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardEmoji}>
                      <Text style={{ fontSize: 22 }}>🔮</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceName}>{booking.serviceName}</Text>
                      <Text style={styles.astroName}>by {booking.astrologerName}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: activeTabInfo.color + '18' }]}>
                      <Text style={[styles.statusText, { color: activeTabInfo.color }]}>
                        {activeTabInfo.emoji} {activeTabInfo.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.chips}>
                    <View style={styles.chip}><Text style={styles.chipText}>📅 {date}</Text></View>
                    <View style={styles.chip}><Text style={styles.chipText}>🕐 {time}</Text></View>
                    <View style={styles.chip}><Text style={styles.chipText}>⏱ {booking.durationMins} min</Text></View>
                    <View style={styles.chip}><Text style={styles.chipText}>{booking.callType === 'VIDEO' ? '📹' : '📞'} {booking.callType}</Text></View>
                  </View>

                  <View style={styles.cardBottom}>
                    <Text style={styles.price}>₹{booking.price}</Text>
                    {booking.status === 'CONFIRMED' && (
                      <TouchableOpacity style={styles.joinBtn}>
                        <Text style={styles.joinBtnText}>Join Session →</Text>
                      </TouchableOpacity>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <TouchableOpacity style={styles.reviewBtn}>
                        <Text style={styles.reviewBtnText}>Leave Review ⭐</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EDE9FF' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 12, color: '#888', fontWeight: '500' },
  content: { padding: 16, gap: 12 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  emptySub: { fontSize: 13, color: '#AAA', textAlign: 'center' },
  browseBtn: { marginTop: 16, backgroundColor: '#9d0399', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  browseBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#EDE9FF', overflow: 'hidden', flexDirection: 'row', elevation: 1 },
  cardStrip: { width: 5 },
  cardInner: { flex: 1, padding: 14, gap: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardEmoji: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center' },
  serviceName: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  astroName: { fontSize: 12, color: '#9d0399', fontWeight: '600', marginTop: 1 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#F5F0FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, color: '#6B21A8', fontWeight: '600' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: '800', color: '#9d0399' },
  joinBtn: { backgroundColor: '#065F46', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  joinBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  reviewBtn: { borderWidth: 1.5, borderColor: '#9d0399', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  reviewBtnText: { color: '#9d0399', fontSize: 11, fontWeight: '700' },
});
