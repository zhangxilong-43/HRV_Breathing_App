import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Platform, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type BreathingExercise = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

/**
 * 呼吸训练列表页面
 * 显示多种可选的呼吸训练方法供用户选择
 */
export default function BreathingListScreen() {
  const router = useRouter();

  // 呼吸训练类型列表
  const breathingExercises: BreathingExercise[] = [
    {
      id: 'hrv',
      title: 'HRV 呼吸',
      description: '吸气4秒，屏息2秒，呼气4秒，增强心率变异性',
      icon: 'heart-outline',
      color: '#3a86ff',
    },
    {
      id: 'box',
      title: '盒式呼吸',
      description: '吸气4秒，屏息4秒，呼气4秒，屏息4秒，有助于镇静情绪',
      icon: 'square-outline',
      color: '#4cc9f0',
    },
    {
      id: '478',
      title: '4-7-8 呼吸',
      description: '吸气4秒，屏息7秒，呼气8秒，帮助入睡和减轻焦虑',
      icon: 'moon-outline',
      color: '#8338ec',
    },
    {
      id: 'custom',
      title: '自定义呼吸',
      description: '创建个性化的呼吸模式，自由设置吸气、屏息和呼气时长',
      icon: 'options-outline',
      color: '#ff006e',
    },
  ];

  // 导航到特定训练页面
  const navigateToExercise = (exerciseId: string) => {
    router.push(`/breathing/${exerciseId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f9ff"
        translucent={Platform.OS === 'android'}
      />
      <View style={styles.header}>
        <Text style={styles.title}>呼吸训练</Text>
        <Text style={styles.subtitle}>选择适合你的呼吸练习方式</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {breathingExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.card}
            onPress={() => navigateToExercise(exercise.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${exercise.color}20` }]}>
              <Ionicons name={exercise.icon} size={30} color={exercise.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{exercise.title}</Text>
              <Text style={styles.cardDescription}>{exercise.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3a86ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
