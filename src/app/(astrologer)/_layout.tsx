import { CustomTabBar, type TabConfig } from "@/components/CustomTabBar";
import { ModeChip } from "@/components/ModeChip";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { View } from "react-native";

// Same shared tab bar jo (user) layout use karta hai — sirf items alag.
const TABS: TabConfig[] = [
  {
    name: "dashboard",
    icon: (color) => <Feather name="home" size={22} color={color} />,
  },
  {
    name: "services",
    icon: (color) => (
      <MaterialCommunityIcons
        name="briefcase-outline"
        size={22}
        color={color}
      />
    ),
  },
  {
    name: "availability",
    icon: (color) => <Feather name="calendar" size={22} color={color} />,
  },
  {
    name: "posts",
    icon: (color) => <Feather name="edit-3" size={22} color={color} />,
  },
];

export default function AstrologerLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} tabs={TABS} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="services" />
        <Tabs.Screen name="availability" />
        <Tabs.Screen name="posts" />
      </Tabs>

      {/* Dashboard se wapas user app mein jane ka chip */}
      <ModeChip mode="astrologer" />
    </View>
  );
}