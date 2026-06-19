import Header from '@/src/components/header';
import { MOCK_ASTROLOGERS } from '@/src/mock/data';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FILTERS = [
  { id: 'all', label: '✨ All' },
  { id: 'Kundli', label: '🔮 Kundli' },
  { id: 'Tarot', label: '🃏 Tarot' },
  { id: 'Numerology', label: '🔢 Numerology' },
  { id: 'Palmistry', label: '✋ Palmistry' },
  { id: 'Vastu', label: '🏠 Vastu' },
  { id: 'Astrology', label: '⭐ Astrology' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: 11, color: i <= Math.floor(rating) ? '#F59E0B' : '#DDD' }}>★</Text>
      ))}
      <Text style={{ fontSize: 11, color: '#666', marginLeft: 3 }}>{rating}</Text>
    </View>
  );
}

export default function ExploreScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_ASTROLOGERS.filter((a) => {
    const matchFilter = activeFilter === 'all' || a.interests.includes(activeFilter);
    const matchSearch =
      search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.speciality.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <View style={styles.root}>
      <Header />

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search astrologers..."
          placeholderTextColor="#AAA"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: '#9d0399', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.chip, activeFilter === f.id && styles.chipActive]}
            onPress={() => setActiveFilter(f.id)}
          >
            <Text style={[styles.chipText, activeFilter === f.id && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.countText}>{filtered.length} Astrologers found</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.92}
            onPress={() => router.push({ pathname: '/(user)/astrologer-profile' as any, params: { id: item.id } })}
          >
            <View style={[styles.avatar, { backgroundColor: item.color }]}>
              <Text style={styles.avatarEmoji}>{item.emoji}</Text>
              <View style={[styles.onlineDot, { backgroundColor: item.online ? '#22C55E' : '#9CA3AF' }]} />
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followBtnText}>Follow +</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardSpeciality}>{item.speciality}</Text>
              <Text style={styles.cardMeta}>{item.languages}</Text>
              <Text style={styles.cardMeta}>Exp: {item.experience}</Text>
              <View style={styles.cardBottomRow}>
                <View>
                  <StarRating rating={item.rating} />
                  <Text style={styles.reviewCount}>{item.reviews} reviews</Text>
                </View>
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => router.push({ pathname: '/(user)/astrologer-profile' as any, params: { id: item.id } })}
                >
                  <Text style={styles.bookBtnPrice}>₹{item.price}</Text>
                  <Text style={styles.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1.5, borderColor: '#EDE9FF', gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A2E' },
  filtersRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#EDE9FF' },
  chipActive: { backgroundColor: '#9d0399', borderColor: '#9d0399' },
  chipText: { fontSize: 13, color: '#666', fontWeight: '500' },
  chipTextActive: { color: '#FFF', fontWeight: '700' },
  countText: { fontSize: 12, color: '#999', paddingHorizontal: 16, marginBottom: 8 },
  listContent: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  card: {
    flexDirection: 'row', backgroundColor: '#FFF', padding: 14, gap: 14,
    borderRadius: 16, borderWidth: 1, borderColor: '#EDE9FF', elevation: 2,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarEmoji: { fontSize: 32 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#FFF' },
  cardInfo: { flex: 1 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', flex: 1 },
  followBtn: { borderWidth: 1, borderColor: '#9d0399', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  followBtnText: { color: '#9d0399', fontSize: 11, fontWeight: '600' },
  cardSpeciality: { fontSize: 13, color: '#9d0399', fontWeight: '600', marginBottom: 2 },
  cardMeta: { fontSize: 12, color: '#888', marginBottom: 1 },
  cardBottomRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6 },
  reviewCount: { fontSize: 11, color: '#AAA', marginTop: 2 },
  bookBtn: { backgroundColor: '#9d0399', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center' },
  bookBtnPrice: { color: '#FFD700', fontSize: 11, fontWeight: '700' },
  bookBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
