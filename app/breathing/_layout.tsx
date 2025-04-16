import React from 'react';
import { Stack } from 'expo-router';
// import { BREATHING_PATTERNS } from '../../constants/breathing';

export default function BreathingLayout() {
  // const { id } = useLocalSearchParams<{ id: string }>();
  // const currentTitle = BREATHING_PATTERNS[id as keyof typeof BREATHING_PATTERNS].title;

  return (
    <Stack screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="[id]" options={{ headerShown: false }}/>
    </Stack>
  );
}