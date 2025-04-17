import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BreathingExercise from '../../src/components/breathing/BreathingExercise';
import CustomBreathingSettings from '../../src/components/breathing/CustomBreathingSettings';
import { BREATHING_PATTERNS } from '../../constants/breathing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BreathingSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets(); // 获取安全区域信息
  const [customSettings, setCustomSettings] = useState({
    inhaleDuration: 4000,
    holdInDuration: 2000,
    exhaleDuration: 4000,
    holdOutDuration: 0,
    cycles: 6
  });
  const [showSettings, setShowSettings] = useState(id === 'custom');

  // 返回上一页
  const handleBack = () => {
    router.back();
  };

  // 如果 id 无效则返回列表页面
  useEffect(() => {
    if (!id || !BREATHING_PATTERNS[id as keyof typeof BREATHING_PATTERNS]) {
      router.replace('/');
    }
  }, [id, router]);

  // 确保 id 有效
  if (!id || !BREATHING_PATTERNS[id as keyof typeof BREATHING_PATTERNS]) {
    return null;
  }

  // 获取当前呼吸模式的配置
  const currentPattern = id === 'custom' && !showSettings 
    ? { ...BREATHING_PATTERNS.custom, ...customSettings }
    : BREATHING_PATTERNS[id as keyof typeof BREATHING_PATTERNS];

  // 处理自定义设置确认
  const handleCustomSettingsConfirm = (settings: typeof customSettings) => {
    setCustomSettings(settings);
    setShowSettings(false);
  };

  return (
    <SafeAreaView style={styles.container} testID="breathing-session-container">
      {/* 状态栏 */}
      {/* <View testID="breathing-header-area" style={{width: '100%'}}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#f5f9ff"
          translucent={Platform.OS === 'android'}
        />
      </View> */}
      
      {/* 自定义返回按钮 - 使用动态计算的位置 */}
      <TouchableOpacity 
        style={[
          styles.backButton,
          { top: insets.top + 25 } // 动态设置顶部距离(安全区域顶部 + 25px的额外间距)
        ]} 
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color="#3a86ff" />
      </TouchableOpacity>
      
      {id === 'custom' && showSettings ? (
        <CustomBreathingSettings
          initialSettings={customSettings}
          onConfirm={handleCustomSettingsConfirm}
          onCancel={handleBack}
        />
      ) : (
        <BreathingExercise
          title={currentPattern.title}
          inhaleDuration={currentPattern.inhaleDuration}
          holdInDuration={currentPattern.holdInDuration}
          exhaleDuration={currentPattern.exhaleDuration}
          holdOutDuration={currentPattern.holdOutDuration}
          cycles={currentPattern.cycles}
          tipText={currentPattern.tipText}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});