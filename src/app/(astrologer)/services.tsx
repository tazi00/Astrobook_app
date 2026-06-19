import { MOCK_MY_SERVICES } from '@/src/mock/data';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AstrologerServicesScreen() {
  const [services, setServices] = useState(MOCK_MY_SERVICES);

  const toggleActive = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>My Services</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Service</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {services.map((service) => (
          <View key={service.id} style={[styles.card, !service.isActive && styles.cardInactive]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc} numberOfLines={2}>{service.description}</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, service.isActive && styles.toggleActive]}
                onPress={() => toggleActive(service.id)}
              >
                <Text style={styles.toggleText}>{service.isActive ? 'Active' : 'Paused'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chips}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>⏱ {service.durationMins} min</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{service.callType === 'VIDEO' ? '📹 Video' : '📞 Voice'}</Text>
              </View>
              <View style={[styles.chip, styles.priceChip]}>
                <Text style={styles.priceText}>₹{service.price}</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnText}>✏️ Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080617' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#F5ECD7' },
  addBtn: { backgroundColor: '#C9A84C', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: '#080617', fontWeight: '800', fontSize: 13 },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: '#0F0D22', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E1B38', gap: 12 },
  cardInactive: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  cardLeft: { flex: 1 },
  serviceName: { fontSize: 15, fontWeight: '800', color: '#F5ECD7', marginBottom: 4 },
  serviceDesc: { fontSize: 12, color: '#6B6485', lineHeight: 18 },
  toggle: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#1E1B38', borderWidth: 1, borderColor: '#1E1B38' },
  toggleActive: { backgroundColor: '#C9A84C18', borderColor: '#C9A84C' },
  toggleText: { fontSize: 11, fontWeight: '700', color: '#C9A84C' },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { backgroundColor: '#1E1B38', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, color: '#C9A84C', fontWeight: '600' },
  priceChip: { backgroundColor: '#C9A84C18', borderWidth: 1, borderColor: '#C9A84C' },
  priceText: { fontSize: 13, fontWeight: '800', color: '#C9A84C' },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: { borderWidth: 1, borderColor: '#1E1B38', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  editBtnText: { color: '#F5ECD7', fontSize: 12 },
});
