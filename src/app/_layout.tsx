import { useAuthStore } from "@/features/auth/store/auth.store";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const { restoreSession, isLoading } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      const restored = await restoreSession();
      if (!restored) {
        router.replace("/(auth)/login" as any);
        return;
      }
      const currentUser = useAuthStore.getState().user;
      router.replace(
        currentUser?.role === "astrologer"
          ? ("/(astrologer)/dashboard" as any)
          : ("/(user)/feed" as any),
      );
    };
    init();
  }, []);

  if (isLoading) {
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
