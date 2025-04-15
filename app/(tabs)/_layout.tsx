import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * 底部导航栏布局
 * 简化为仅显示首页的HRV呼吸练习
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3a86ff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '呼吸练习',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
