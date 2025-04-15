import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import BreathingExercise from '../../components/BreathingExercise';

/**
 * 应用主屏幕
 * 显示HRV呼吸练习界面
 */
export default function TabOneScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f9ff"
        translucent={Platform.OS === 'android'}
      />
      <BreathingExercise />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
});
