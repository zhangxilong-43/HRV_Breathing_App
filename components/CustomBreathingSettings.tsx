import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

interface CustomBreathingSettingsProps {
  initialSettings: {
    inhaleDuration: number;
    holdInDuration: number;
    exhaleDuration: number;
    holdOutDuration: number;
    cycles: number;
  };
  onConfirm: (settings: CustomBreathingSettingsProps['initialSettings']) => void;
  onCancel: () => void;
}

/**
 * 自定义呼吸设置组件
 * 允许用户配置呼吸训练的各个阶段时长和循环次数
 */
export default function CustomBreathingSettings({ 
  initialSettings, 
  onConfirm, 
  onCancel 
}: CustomBreathingSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);

  // 更新设置项的工具函数
  const updateSetting = (key: keyof typeof settings, value: number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 将毫秒转换为秒（用于显示）
  const msToSeconds = (ms: number) => ms / 1000;

  // 将秒转换为毫秒（用于内部存储）
  const secondsToMs = (seconds: number) => seconds * 1000;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>自定义呼吸设置</Text>
        <Text style={styles.subtitle}>设置每个呼吸阶段的时长</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>吸气时长: {msToSeconds(settings.inhaleDuration)}秒</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            minimumTrackTintColor="#3a86ff"
            maximumTrackTintColor="#d1d1d1"
            thumbTintColor="#3a86ff"
            value={msToSeconds(settings.inhaleDuration)}
            onValueChange={(value: number) => updateSetting('inhaleDuration', secondsToMs(value))}
          />
        </View>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>吸气后屏息: {msToSeconds(settings.holdInDuration)}秒</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            minimumTrackTintColor="#3a86ff"
            maximumTrackTintColor="#d1d1d1"
            thumbTintColor="#3a86ff"
            value={msToSeconds(settings.holdInDuration)}
            onValueChange={(value: number) => updateSetting('holdInDuration', secondsToMs(value))}
          />
        </View>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>呼气时长: {msToSeconds(settings.exhaleDuration)}秒</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            minimumTrackTintColor="#3a86ff"
            maximumTrackTintColor="#d1d1d1"
            thumbTintColor="#3a86ff"
            value={msToSeconds(settings.exhaleDuration)}
            onValueChange={(value: number) => updateSetting('exhaleDuration', secondsToMs(value))}
          />
        </View>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>呼气后屏息: {msToSeconds(settings.holdOutDuration)}秒</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            minimumTrackTintColor="#3a86ff"
            maximumTrackTintColor="#d1d1d1"
            thumbTintColor="#3a86ff"
            value={msToSeconds(settings.holdOutDuration)}
            onValueChange={(value: number) => updateSetting('holdOutDuration', secondsToMs(value))}
          />
        </View>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>循环次数: {settings.cycles}次</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={12}
            step={1}
            minimumTrackTintColor="#3a86ff"
            maximumTrackTintColor="#d1d1d1"
            thumbTintColor="#3a86ff"
            value={settings.cycles}
            onValueChange={(value: number) => updateSetting('cycles', value)}
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            呼吸一个完整周期大约需要 {Math.round(
              (settings.inhaleDuration + settings.holdInDuration + 
              settings.exhaleDuration + settings.holdOutDuration) / 1000
            )} 秒。
            {(() => {
              // 计算总秒数
              const totalSeconds = (settings.inhaleDuration + settings.holdInDuration + 
                settings.exhaleDuration + settings.holdOutDuration) * settings.cycles / 1000;
              // 如果小于60秒，显示秒数
              if (totalSeconds < 60) {
                return `总训练时间约 ${Math.round(totalSeconds)} 秒。`;
              }
              // 否则显示分钟数
              return `总训练时间约 ${Math.round(totalSeconds / 60)} 分钟。`;
            })()}
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={() => onConfirm(settings)}
        >
          <Text style={styles.confirmButtonText}>开始练习</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a86ff',
    marginBottom: 8,
    textAlign: 'center',
    marginLeft: 40, // 为左侧返回按钮留出空间
    marginRight: 40, // 保持对称
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(58, 134, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: Platform.OS === 'android' ? 20 : 40,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#3a86ff',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 