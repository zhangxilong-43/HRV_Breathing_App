import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * 底部导航栏布局
 * 展示三个主要功能Tab: 阳光(呼吸训练)、放松(肌肉放松)、冥想(正念冥想)
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
          title: '阳光',
          tabBarIcon: ({ color }) => <Ionicons name="sunny-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="relax"
        options={{
          title: '放松',
          tabBarIcon: ({ color }) => <Ionicons name="body-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meditation"
        options={{
          title: '冥想',
          tabBarIcon: ({ color }) => <Ionicons name="leaf-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
