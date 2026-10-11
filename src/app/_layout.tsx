import { ToastHost } from "@/components/toast";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { usePushNotifications } from "@/features/notifications/hooks/usePushNotifications";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * Ek post deep link URL se post ID nikalta hai.
 * Supports both:
 *   astrobook:///post/123           (custom URI scheme — direct in-app links)
 *   https://astrobook.in/share/post/123  (Android App Links / share page)
 *   https://astrobook.in/post/123       (future App Link path)
 */
function extractPostIdFromUrl(url: string): string | null {
  try {
    // Custom scheme: astrobook:///post/UUID
    if (url.startsWith("astrobook://")) {
      const match = url.match(/\/post\/([a-zA-Z0-9_-]+)/);
      return match?.[1] ?? null;
    }
    // HTTPS share page: https://astrobook.in/share/post/UUID
    //              or:  https://astrobook.in/post/UUID
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/(?:share\/)?post\/([a-zA-Z0-9_-]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppGate />
        {/* Root ke bahar, ek hi baar mounted — kahin se bhi toast.show() call
            karke non-blocking message dikha sakte hain (Alert.alert() ki
            jagah), poori app ke upar overlay ki tarah render hota hai */}
        <ToastHost />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function AppGate() {
  const router = useRouter();
  const { restoreSession } = useAuthStore();
  const [ready, setReady] = useState(false);
  const user = useAuthStore((s) => s.user);
  const sessionExpired = useAuthStore((s) => s.sessionExpired);

  // Sirf logged-in user ke liye register karo — logged-out state mein
  // backend call 401 dega (harmless, catch ho jaata hai), lekin gate laga
  // dena zyada saaf hai
  usePushNotifications(ready && !!user);

  useEffect(() => {
    const init = async () => {
      // Deep link URL grab karo PEHLE — Linking.getInitialURL() sirf ek baar
      // kaam karta hai; baad mein call karne pe null milta hai.
      const initialUrl = await Linking.getInitialURL();

      const restored = await restoreSession();
      if (!restored) {
        // Login nahi hai — pehle login karo. Login ke baad user feed pe
        // land karega; deep link wahan se manually nahi handle hoga, lekin
        // yeh edge case bahut rare hai (app cold-start from share link by
        // unauthenticated user). Post detail publicly visible nahi hai, so
        // login wall is the right behavior.
        router.replace("/(auth)/login" as any);
      } else {
        const freshUser = useAuthStore.getState().user;
        if (freshUser && !freshUser.isOnboarded) {
          router.replace("/(auth)/onboarding" as any);
        } else if (initialUrl) {
          // Deep link check — agar URL se post ID nikli toh directly wahan jao.
          const postId = extractPostIdFromUrl(initialUrl);
          if (postId) {
            // replace() se feed history mein nahi jaati — back press karne pe
            // user bahar hi jayega (correct behavior for cold-start deep link).
            router.replace({
              pathname: "/(user)/post/[id]" as any,
              params: { id: postId },
            });
          } else {
            // Koi aur deep link / unknown URL — feed pe bhejo.
            router.replace("/(user)/feed" as any);
          }
        } else {
          // Normal cold start — feed.
          // User ho ya astrologer — dono hamesha feed pe hi land karte hain.
          // Astrologer apni profile se explicitly Dashboard pe navigate karta hai.
          router.replace("/(user)/feed" as any);
        }
      }
      setReady(true);
    };
    init();
  }, []);

  // Beech mein session expire hua (backend ne refresh token reject kiya) —
  // login pe bhejo. Normal logout apna redirect khud karta hai.
  useEffect(() => {
    if (!ready || !sessionExpired) return;
    useAuthStore.getState().clearSessionExpired();
    router.replace("/(auth)/login" as any);
  }, [ready, sessionExpired]);

  // Init chal raha hai ya redirect abhi commit nahi hua — kuch mat dikhao
  // (SafeAreaProvider ab RootLayout mein top-level pe hai, poori app ko cover karta hai)
  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#121943",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#9d0399" size="large" />
      </View>
    );
  }

  return <Slot />;
}