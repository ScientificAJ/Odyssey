import { Tabs } from 'expo-router';
import { CalendarDays, Compass, Map, UserRound } from 'lucide-react-native';

import { colors } from '@/design/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: 16,
          marginBottom: 12,
          height: 70,
          borderRadius: 28,
          backgroundColor: 'rgba(255,253,244,0.96)',
          borderTopWidth: 0,
          paddingTop: 8,
          shadowColor: colors.aqua,
          shadowOpacity: 0.2,
          shadowRadius: 18,
        },
        tabBarLabelStyle: { fontFamily: 'Manrope_700Bold', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <Compass color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <CalendarDays color={color} />,
        }}
      />
      <Tabs.Screen
        name="odyssey"
        options={{
          title: 'Odyssey',
          tabBarIcon: ({ color }) => <Map color={color} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color }) => <UserRound color={color} />,
        }}
      />
    </Tabs>
  );
}
