import React from 'react';
import { Stack } from 'expo-router';

/**
 * 放松会话路由布局
 * 提供堆栈导航以便在模式选择和会话页面之间切换
 */
export default function RelaxLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
} 