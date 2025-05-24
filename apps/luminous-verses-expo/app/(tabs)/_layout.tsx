// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native'; // Add Platform import
import { useTheme } from 'styled-components/native';
// We'll create a proper Icon component later
// For now, a simple text placeholder for icons
const TabBarIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color, fontSize: focused ? 12 : 10, fontWeight: focused ? 'bold' : 'normal' }}>
      {name.substring(0, 3)}
    </Text>
  </View>
);

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      // tabBar prop removed to use default
      screenOptions={{
        headerShown: false, // Hide the header
        tabBarActiveTintColor: theme.colors.activeTabIcon,
        tabBarInactiveTintColor: theme.colors.inactiveTabIcon,
        tabBarStyle: {
          backgroundColor: 'transparent', // Make tab bar background transparent
          borderTopColor: 'transparent', // Remove top border
          position: 'absolute', // Make it float
          left: 0,
          right: 0,
          bottom: 0,
          height: Platform.OS === 'ios' ? 90 : 70, // Adjust height for different platforms
          paddingBottom: Platform.OS === 'ios' ? 30 : 10, // Adjust padding for safe area on iOS
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.typography.fonts.englishMedium,
          marginBottom: Platform.OS === 'ios' ? -10 : 5, // Adjust label position
        },
        // headerStyle, headerTintColor, headerTitleStyle are no longer needed as header is hidden
      }}
    >
      <Tabs.Screen
        name="index" // This corresponds to app/(tabs)/index.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="Home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="surahs" // This corresponds to app/(tabs)/surahs.tsx
        options={{
          title: 'Surahs',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="Surahs" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reader" // This corresponds to app/(tabs)/reader.tsx
        options={{
          title: 'Reader',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="Reader" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks" // This corresponds to app/(tabs)/bookmarks.tsx
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="Marks" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings" // This corresponds to app/(tabs)/settings.tsx
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="Prefs" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}