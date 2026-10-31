import { ModeChip } from "@/components/ModeChip";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; // star-four-points (AstroVerse)
import { Tabs, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

// All tabs — icon route name se match hoga (index pe nahi), toh href:null
// se koi tab hide ho toh baki sab ke icons theek rehenge.
const ALL_TABS = [
  {
    name: "feed",
    icon: (color: string) => <Feather name="home" size={22} color={color} />,
  },
  {
    name: "explore",
    icon: (color: string) => <Feather name="compass" size={22} color={color} />,
  },
  {
    name: "astroverse",
    icon: (color: string) => (
      <MaterialCommunityIcons name="star-four-points" size={22} color={color} />
    ),
  },
  {
    name: "astrologers",
    icon: (color: string) => <Feather name="users" size={22} color={color} />,
  },
  {
    name: "profile",
    icon: (color: string) => <Feather name="user" size={22} color={color} />,
  },
];

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  // Visible routes ke hisaab se dynamic width — href:null wale automatically
  // state.routes mein nahi aate, isliye count aur width wahan se lo.
  const tabCount = state.routes.length;
  const tabWidth = SCREEN_WIDTH / tabCount;

  const dotX = useRef(new Animated.Value(state.index * tabWidth)).current;

  useEffect(() => {
    Animated.spring(dotX, {
      toValue: state.index * tabWidth + tabWidth / 2 - 3,
      useNativeDriver: true,
      tension: 70,
      friction: 12,
    }).start();
  }, [state.index, tabWidth]);

  return (
    <View
      style={[
        styles.tabBar,
        { height: 64 + insets.bottom, paddingBottom: 8 + insets.bottom },
      ]}
    >
      {/* Animated dot */}
      <Animated.View
        style={[styles.dot, { transform: [{ translateX: dotX }] }]}
      />

      {/* Tab items — route.name se icon dhundho, index se nahi */}
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const tab = ALL_TABS.find((t) => t.name === route.name);
        const color = isFocused ? "#9d0399" : "#4A4468";

        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, { width: tabWidth }]}
            activeOpacity={1}
            onPress={() => {
              // Same tab dubara press ho toh uska internal stack root pe pop
              // karo (standard tab-bar behavior) — warna sirf switch karo.
              if (!isFocused) {
                navigation.navigate(route.name);
              } else {
                navigation.emit({
                  type: "tabPress",
                  target: route.key,
                });
              }
            }}
          >
            {tab?.icon(color)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const isAstrologer = useAuthStore((s) => s.user?.role === "astrologer");
  const pathname     = usePathname();

  // Profile page pe "Go to Dashboard" button pehle se hai —
  // chip wahan hide karo taaki do duplicate buttons na dikhen
  const isOnProfile = pathname.endsWith("/profile");

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="feed" />
        {/* Explore ka apna nested stack hai (index -> [category]). Tab chhodte hi
            usse root pe pop karo, warna Home se wapas aane par purani category
            detail page hi khulta tha. */}
        <Tabs.Screen name="explore" options={{ popToTopOnBlur: true }} />
        {/* Astrologers ke liye AstroVerse abhi nahi — sirf user role ke liye */}
        <Tabs.Screen
          name="astroverse"
          options={isAstrologer ? { href: null } : undefined}
        />
        <Tabs.Screen name="astrologers" />
        <Tabs.Screen name="profile" />
      </Tabs>

      {/* Astrologer ke liye floating Dashboard chip — profile pe nahi dikhta */}
      {isAstrologer && !isOnProfile && <ModeChip mode="user" />}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff1ff",
    height: 64,
    paddingBottom: 8,
    paddingTop: 10,
    elevation: 12,
    shadowColor: "#9d0399",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    position: "relative",
  },
  tabItem: {
    // width is set dynamically inline (tabWidth) — static value hata diya
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9d0399",
    left: 0,
  },
});