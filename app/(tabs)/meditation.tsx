import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Platform } from 'react-native';

/**
 * 正念冥想训练页面
 * 阶段一为占位页面，未来将实现正念冥想训练功能
 */
export default function MeditationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f5ff"
        translucent={Platform.OS === 'android'}
      />
      <View style={styles.content}>
        <Text style={styles.title}>正念冥想</Text>
        <Text style={styles.subtitle}>功能正在开发中...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a86ff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
}); 