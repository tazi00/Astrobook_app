import AstroGradient from '@/assets/images/astro-gradient.svg';
import AstroLogo from '@/assets/images/astro-icon.svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VIDEOS = [
  { id: '1', title: 'রাশি অনুযায়ী\nধনতেরাস টিপস!', color: '#4C1D95', emoji: '🎬' },
  { id: '2', title: 'Mercury\nRetrograde Tips', color: '#1E3A5F', emoji: '🪐' },
  { id: '3', title: 'Daily\nHoroscope', color: '#1A3320', emoji: '⭐' },
];

const links = [
  { label: 'About Us', url: 'https://astrobook-vert.vercel.app/about' },
  { label: 'Contact Us', url: 'https://astrobook-vert.vercel.app/contact' },
  { label: 'Policy', url: 'https://astrobook-vert.vercel.app/policy' },
  { label: 'Blog', url: 'https://astrobook-vert.vercel.app/blog' },
  { label: 'Help', url: 'https://astrobook-vert.vercel.app/help' },
];

// Mock config
const MOCK_OTP = '1234';
const MOCK_IS_NEW_USER = true; // change to false to test existing user flow

export default function OtpScreen() {
  const router = useRouter();
  const { contact } = useLocalSearchParams<{ contact: string }>();

  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // TODO: Replace with real API call
  const handleVerify = () => {
    if (otp.length !== 4) return;
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      if (otp === MOCK_OTP) {
        if (MOCK_IS_NEW_USER) {
          router.replace('/(auth)/onboarding');
        } else {
          // TODO: check role from API response
          router.replace('/(user)/feed');
        }
      } else {
        alert('Wrong OTP! Use ' + MOCK_OTP);
      }
    }, 800);
  };

  const onSlideChange = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH * 0.85));
    setActiveSlide(index);
  };

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <View style={styles.root}>
      <AstroGradient width="100%" height="100%" style={StyleSheet.absoluteFill} />

      <View style={styles.container}>
        {/* Card */}
        <View style={styles.card}>
          <AstroLogo width={220} height={100} />

          <Text style={styles.subtitle}>OTP bheja gaya {contact} pe</Text>
          <Text style={styles.mockHint}>Mock mode: use "{MOCK_OTP}" as OTP</Text>

          {/* Hidden input */}
          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={(text) => {
              if (/^\d*$/.test(text) && text.length <= 4) setOtp(text);
            }}
            keyboardType="number-pad"
            maxLength={4}
            style={{ position: 'absolute', opacity: 0 }}
          />

          {/* OTP Boxes */}
          <TouchableOpacity
            style={styles.otpContainer}
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
          >
            {[...Array(4)].map((_, i) => (
              <View key={i} style={[styles.otpBox, otp.length === i && styles.otpBoxActive]}>
                <Text style={styles.otpText}>{otp[i] || ''}</Text>
              </View>
            ))}
          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.submitBtn, (otp.length !== 4 || verifying) && { opacity: 0.5 }]}
            disabled={otp.length !== 4 || verifying}
            onPress={handleVerify}
          >
            <Text style={styles.submitText}>{verifying ? 'Verifying...' : 'Verify OTP'}</Text>
          </TouchableOpacity>
        </View>

        {/* Video Slider */}
        <View style={styles.sliderSection}>
          <FlatList
            ref={flatListRef}
            data={VIDEOS}
            horizontal
            pagingEnabled={false}
            snapToInterval={SCREEN_WIDTH * 0.62}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sliderContent}
            onMomentumScrollEnd={onSlideChange}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.videoCard,
                  index === activeSlide && styles.videoCardActive,
                  { backgroundColor: item.color },
                ]}
                activeOpacity={0.9}
              >
                <Text style={styles.videoEmoji}>{item.emoji}</Text>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <View style={styles.playBtn}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={styles.dotsRow}>
            {VIDEOS.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerLinks}>
          {links.map((item, i) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity onPress={() => openLink(item.url)}>
                <Text style={styles.footerLink}>{item.label}</Text>
              </TouchableOpacity>
              {i < links.length - 1 && <Text style={styles.footerSep}> | </Text>}
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#121943' },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 50,
    flexDirection: 'column',
    gap: 20,
  },
  card: {
    width: '96%',
    marginHorizontal: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#9d0399',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    marginTop: 30,
  },
  subtitle: { fontSize: 13, color: '#6B6485', marginTop: 8, marginBottom: 4 },
  mockHint: { fontSize: 11, color: '#9d0399', marginBottom: 20, fontStyle: 'italic' },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 10,
  },
  otpBox: {
    width: 52,
    height: 52,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxActive: { borderColor: '#9d0399' },
  otpText: { fontSize: 24, fontWeight: '600', color: '#1A1A2E' },
  submitBtn: {
    width: '100%',
    backgroundColor: '#9d0399',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sliderSection: { width: '100%', marginBottom: 12 },
  sliderContent: { paddingHorizontal: 12, gap: 10 },
  videoCard: {
    width: SCREEN_WIDTH * 0.7,
    height: 200,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    opacity: 0.75,
  },
  videoCardActive: { opacity: 1, transform: [{ scale: 1.03 }] },
  videoEmoji: { fontSize: 22 },
  videoTitle: { color: '#FFF', fontSize: 11, fontWeight: '600', lineHeight: 16 },
  playBtn: {
    alignSelf: 'flex-end',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { color: '#FFF', fontSize: 10 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 30 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF40' },
  dotActive: { backgroundColor: '#FFF', width: 20 },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerLink: { color: '#E9D5FF', fontSize: 16 },
  footerSep: { color: '#C4B5FD', fontSize: 16 },
});
