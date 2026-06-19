import AstroLogo from '@/assets/images/astro-icon.svg';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Header() {
  const router = useRouter();

  return (
    <View>
      <StatusBar barStyle="dark-content" backgroundColor="#fff1ff" />
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <AstroLogo width={160} height={40} />
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/(user)/my-bookings' as any)}
          >
            <AntDesign name="book" size={22} color="#9d0399" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="shopping-cart" size={22} color="#9d0399" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="search" size={22} color="#9d0399" />
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient
        colors={['rgba(255,255,255,0.4)', '#00000050', 'rgba(255,255,255,0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 2, width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: '#fff1ff',
    elevation: 2,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
