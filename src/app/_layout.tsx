import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

// TODO: Replace with real Zustand auth store
const MOCK_AUTH = {
  isLoggedIn: false,
  role: 'USER' as 'USER' | 'ASTROLOGER' | null,
};

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = (segments[0] as any) === '(auth)';
    if (!MOCK_AUTH.isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login' as any);
    } else if (MOCK_AUTH.isLoggedIn && inAuthGroup) {
      if (MOCK_AUTH.role === 'ASTROLOGER') {
        router.replace('/(astrologer)/dashboard' as any);
      } else {
        router.replace('/(user)/feed' as any);
      }
    }
  }, [segments]);

  return <Slot />;
}
