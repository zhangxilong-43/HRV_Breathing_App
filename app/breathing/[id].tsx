import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BreathingExercise from '../../components/BreathingExercise';
import CustomBreathingSettings from '../../components/CustomBreathingSettings';

// 定义不同呼吸模式的配置参数
const BREATHING_PATTERNS = {
  hrv: {
    title: 'HRV 呼吸',
    inhaleDuration: 4000,
    holdInDuration: 2000,
    exhaleDuration: 4000,
    holdOutDuration: 0,
    cycles: 6,
    tipText: `HRV(心率变异性)呼吸训练是一种通过特定节律呼吸来提高心率变异性的方法，有助于调节自主神经系统平衡。

【科学原理】
• 心率变异性(HRV)是指相邻心跳之间时间间隔的微小变化
• 较高的HRV表示心脏对内外环境变化的适应能力更强
• 当我们以4-2-4的节奏呼吸时，可促进迷走神经活动，提高副交感神经张力

【健康益处】
• 降低压力和焦虑水平
• 改善情绪调节能力
• 提高注意力和认知功能
• 增强身体的应对压力能力
• 改善睡眠质量

【适用场景】
• 工作或学习前的准备
• 压力较大时的快速调节
• 提高专注力的日常练习
• 缓解焦虑发作

坚持每天练习，效果更佳。`
  },
  box: {
    title: '盒式呼吸',
    inhaleDuration: 4000,
    holdInDuration: 4000,
    exhaleDuration: 4000,
    holdOutDuration: 4000,
    cycles: 4,
    tipText: `盒式呼吸法(又称方块呼吸法)是一种平衡且结构化的呼吸技巧，因其四个相等时长的阶段而得名。

【呼吸特点】
• 吸气4秒：完全吸满肺部
• 保持4秒：屏住呼吸，感受氧气循环
• 呼气4秒：缓慢完全呼出
• 保持4秒：屏住呼吸，准备下一轮

【效果与应用】
• 迅速平静紊乱的思绪
• 舒缓交感神经系统
• 帮助放松肌肉紧张
• 降低血压和心率
• 增强专注力和意志力

【使用场景】
• 公开演讲或重要会议前
• 紧张局势或压力场景中
• 冥想前的准备
• 失眠时帮助入睡

该方法被海豹突击队和特种部队训练用于高压情境下保持冷静，平民同样适用。`
  },
  '478': {
    title: '4-7-8 呼吸',
    inhaleDuration: 4000,
    holdInDuration: 7000,
    exhaleDuration: 8000,
    holdOutDuration: 0,
    cycles: 3,
    tipText: `4-7-8呼吸法是由安德鲁·威尔(Andrew Weil)医生开发的强大呼吸技巧，被称为"自然镇静剂"。

【呼吸节奏】
• 吸气4秒：通过鼻子安静地吸气
• 屏息7秒：保持呼吸，让氧气充分循环
• 呼气8秒：通过嘴巴缓慢完全呼出，发出"嘘"的声音

【科学原理】
• 延长的呼气与短促的吸气形成对比，迅速激活副交感神经系统
• 强制性的呼吸控制转移注意力，缓解焦虑思维
• 增加血液中的氧气水平，放松肌肉组织

【主要功效】
• 在60秒内降低焦虑
• 改善入睡速度和睡眠质量
• 控制急性压力反应
• 辅助血压管理
• 缓解慢性疼痛

【建议使用方式】
• 每日练习2次，每次4个循环
• 睡前练习特别有效
• 空腹时效果更佳
• 初学者可能会感到轻微头晕，属正常现象

坚持6-8周可见明显效果，是最简单有效的放松技巧之一。`
  },
  custom: {
    title: '自定义呼吸',
    inhaleDuration: 4000,
    holdInDuration: 2000,
    exhaleDuration: 4000,
    holdOutDuration: 0,
    cycles: 6,
    tipText: `自定义呼吸模式让你能根据个人需求调整呼吸节奏，创建最适合自己的呼吸练习。

【可调节参数】
• 吸气时长：控制吸入空气的速度与充盈度(1-10秒)
• 吸气后屏息：让氧气充分扩散到血液(0-10秒) 
• 呼气时长：控制排出二氧化碳的速度(1-10秒)
• 呼气后屏息：帮助完全排空肺部，增强下次吸入(0-10秒)
• 循环次数：决定训练总时长(1-12次)

【个性化建议】
• 放松效果：尝试延长呼气时间(呼气>吸气)
• 提神效果：尝试延长吸气时间(吸气>呼气)
• 深度放松：增加呼气后的屏息时间
• 增加氧气摄入：增加吸气后的屏息时间
• 平衡调节：设置相等的吸气与呼气时间

【适用场景】
• 根据身体状况调整呼吸节奏
• 针对特定情绪状态定制训练
• 逐步提升呼吸控制能力
• 尝试不同节奏找到最适合自己的模式

自定义呼吸是呼吸训练的进阶方式，可以随着练习的深入不断调整和优化。`
  }
};

export default function BreathingSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
      <View testID="breathing-header-area" style={{width: '100%'}}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#f5f9ff"
          translucent={Platform.OS === 'android'}
        />
      </View>
      
      {/* 自定义返回按钮 */}
      <TouchableOpacity 
        style={styles.backButton} 
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
    top: Platform.OS === 'ios' ? 50 : 30,
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