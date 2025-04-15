import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import UsageGuide from './UsageGuide';

// 屏幕尺寸
const { width } = Dimensions.get('window');

// 呼吸练习参数
const INHALE_DURATION = 4000; // 吸气时间（ms）
const HOLD_DURATION = 2000; // 屏息时间（ms）
const EXHALE_DURATION = 4000; // 呼气时间（ms）
const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION; // 一个完整呼吸周期的时间
const DEFAULT_SESSION_DURATION = 60000; // 默认练习时长（1分钟）

/**
 * HRV呼吸练习组件
 * 用于引导用户按照特定的呼吸节奏进行练习
 */
const BreathingExercise = () => {
  // 状态管理
  const [isActive, setIsActive] = useState(false); // 练习是否正在进行
  const [currentPhase, setCurrentPhase] = useState('准备开始'); // 当前呼吸阶段
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_SESSION_DURATION); // 剩余时间（ms）
  const [isReady, setIsReady] = useState(false); // 语音模块是否准备好
  const [showGuide, setShowGuide] = useState(false); // 显示使用指南
  
  // 动画值
  const circleSize = useRef(new Animated.Value(1)).current;
  const circleOpacity = useRef(new Animated.Value(0.2)).current;
  const sessionTimer = useRef<NodeJS.Timeout | null>(null);
  const phaseTimer = useRef<NodeJS.Timeout | null>(null);

  // 初始化检查语音模块是否可用
  useEffect(() => {
    const checkSpeechAvailability = async () => {
      try {
        const available = await Speech.isAvailableAsync();
        console.log('语音模块可用:', available);
        setIsReady(available);
        
        if (!available) {
          Alert.alert(
            '提示',
            '您的设备不支持语音功能，呼吸练习将没有语音提示。',
            [{ text: '我知道了' }]
          );
        }
      } catch (error) {
        console.error('语音模块检查出错:', error);
        setIsReady(false);
        Alert.alert(
          '提示',
          '语音功能初始化失败，呼吸练习将没有语音提示。',
          [{ text: '我知道了' }]
        );
      }
    };
    
    checkSpeechAvailability();
    
    // 首次打开应用时自动显示使用指南
    setShowGuide(true);
  }, []);

  // 安全播放文本
  const speakText = (text: string) => {
    console.log('语音播报:', text);
    try {
      if (isReady) {
        Speech.speak(text, { 
          language: 'zh',
          onError: (error) => console.error('语音播报错误:', error),
          onStart: () => console.log('开始播报:', text),
          onDone: () => console.log('播报完成:', text)
        });
      }
    } catch (error) {
      console.error('语音播报异常:', error);
    }
  };

  // 更新呼吸阶段和动画
  const updateBreathingPhase = (elapsedTime: number) => {
    const cyclePosition = elapsedTime % CYCLE_DURATION;
    
    // 根据当前周期内的位置确定呼吸阶段
    if (cyclePosition < INHALE_DURATION) {
      // 吸气阶段
      if (currentPhase !== '吸气') {
        console.log('切换到吸气阶段');
        setCurrentPhase('吸气');
        speakText('吸气');
        
        // 圆形扩大动画和透明度变化
        Animated.parallel([
          Animated.timing(circleSize, {
            toValue: 2.2, // 增大扩张幅度
            duration: INHALE_DURATION,
            useNativeDriver: false,
          }),
          Animated.timing(circleOpacity, {
            toValue: 0.6, // 增加透明度
            duration: INHALE_DURATION,
            useNativeDriver: false,
          })
        ]).start();
      }
    } else if (cyclePosition < INHALE_DURATION + HOLD_DURATION) {
      // 屏息阶段
      if (currentPhase !== '屏息') {
        console.log('切换到屏息阶段');
        setCurrentPhase('屏息');
        speakText('屏住呼吸');
        
        // 保持圆形大小
        Animated.parallel([
          Animated.timing(circleSize, { toValue: 2.2, duration: 1, useNativeDriver: false }),
          Animated.timing(circleOpacity, { toValue: 0.6, duration: 1, useNativeDriver: false })
        ]).stop();
      }
    } else {
      // 呼气阶段
      if (currentPhase !== '呼气') {
        console.log('切换到呼气阶段');
        setCurrentPhase('呼气');
        speakText('呼气');
        
        // 圆形收缩动画和透明度变化
        Animated.parallel([
          Animated.timing(circleSize, {
            toValue: 1,
            duration: EXHALE_DURATION,
            useNativeDriver: false,
          }),
          Animated.timing(circleOpacity, {
            toValue: 0.2,
            duration: EXHALE_DURATION,
            useNativeDriver: false,
          })
        ]).start();
      }
    }
  };

  // 启动练习
  const startExercise = () => {
    console.log('开始练习');
    // 初始化状态
    setIsActive(true);
    setTimeRemaining(DEFAULT_SESSION_DURATION);
    
    // 播报开始练习
    speakText('开始练习');
    
    let startTime = Date.now();
    let lastUpdateTime = startTime;
    
    // 启动计时器跟踪练习时间
    sessionTimer.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSinceStart = currentTime - startTime;
      const elapsedSinceLastUpdate = currentTime - lastUpdateTime;
      
      // 更新剩余时间
      setTimeRemaining((prev: number) => Math.max(0, prev - elapsedSinceLastUpdate));
      
      // 更新呼吸阶段
      updateBreathingPhase(elapsedSinceStart);
      
      // 更新时间戳
      lastUpdateTime = currentTime;
      
      // 检查是否完成练习
      if (elapsedSinceStart >= DEFAULT_SESSION_DURATION) {
        stopExercise(true); // 练习完成
      }
    }, 100); // 更新频率（100ms）
  };

  // 停止练习
  const stopExercise = (completed = false) => {
    console.log('停止练习, 是否完成:', completed);
    // 清除计时器
    if (sessionTimer.current) {
      clearInterval(sessionTimer.current);
      sessionTimer.current = null;
    }
    
    // 重置状态
    setIsActive(false);
    setCurrentPhase('准备开始');
    
    // 重置计时器到1分钟
    setTimeRemaining(DEFAULT_SESSION_DURATION);
    
    // 动画重置
    Animated.parallel([
      Animated.timing(circleSize, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(circleOpacity, {
        toValue: 0.2,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
    
    // 如果是正常完成，播报结束语
    if (completed) {
      speakText('练习结束');
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (sessionTimer.current) {
        clearInterval(sessionTimer.current);
      }
      Speech.stop();
    };
  }, []);

  // 计算动态样式
  const circleStyle = {
    transform: [{ scale: circleSize }],
    opacity: circleOpacity,
    backgroundColor: circleOpacity.interpolate({
      inputRange: [0.2, 0.6],
      outputRange: ['rgba(58, 134, 255, 0.2)', 'rgba(58, 134, 255, 0.6)']
    })
  };

  // 格式化剩余时间为分:秒格式
  const formatTimeRemaining = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 按钮点击处理
  const handleButtonPress = () => {
    console.log('按钮被点击, 当前状态:', isActive ? '运行中' : '未运行');
    if (isActive) {
      stopExercise();
    } else {
      startExercise();
    }
  };
  
  // 打开使用指南
  const openGuide = () => {
    setShowGuide(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.helpButton}
        onPress={openGuide}
      >
        <Ionicons name="help-circle-outline" size={28} color="#3a86ff" />
      </TouchableOpacity>
      
      <Text style={styles.title}>HRV 呼吸训练</Text>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTimeRemaining(timeRemaining)}</Text>
      </View>
      
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.breathCircle, circleStyle]} />
        <Text style={styles.phaseText}>{currentPhase}</Text>
      </View>
      
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          按照提示进行呼吸：吸气 4 秒，屏息 2 秒，呼气 4 秒
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.button, isActive ? styles.stopButton : styles.startButton]}
        onPress={handleButtonPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{isActive ? '停止练习' : '开始练习'}</Text>
      </TouchableOpacity>
      
      {!isReady && (
        <Text style={styles.warningText}>
          注意：语音功能不可用，将无语音提示
        </Text>
      )}
      
      <UsageGuide
        visible={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </View>
  );
};

// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f9ff', // 舒缓背景颜色
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a86ff',
    marginBottom: 30,
  },
  timerContainer: {
    marginBottom: 20,
  },
  timer: {
    fontSize: 36,
    fontWeight: '200',
    color: '#333',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: width * 0.8,
    width: width * 0.8,
    marginVertical: 30,
  },
  breathCircle: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.5,
    backgroundColor: 'rgba(58, 134, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#3a86ff',
    position: 'absolute',
    shadowColor: '#3a86ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  phaseText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#3a86ff',
    textShadowColor: 'rgba(58, 134, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  instructionContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#3a86ff',
  },
  stopButton: {
    backgroundColor: '#ff3a6c',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  warningText: {
    marginTop: 10,
    color: '#ff3a6c',
    fontSize: 14,
    textAlign: 'center',
  },
  helpButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});

export default BreathingExercise; 