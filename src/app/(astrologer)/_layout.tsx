import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function AstrologerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0F0D22',
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
          elevation: 8,
        },
        tabBarActiveTintColor: '#C9A84C',
        tabBarInactiveTintColor: '#4A4468',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="services"
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="briefcase-outline" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="availability"
        options={{ tabBarIcon: ({ color }) => <Feather name="calendar" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="posts"
        options={{ tabBarIcon: ({ color }) => <Feather name="edit-3" size={22} color={color} /> }}
      />
    </Tabs>
  );
}
