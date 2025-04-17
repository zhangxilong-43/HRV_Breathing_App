import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, Platform, Modal } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import UsageGuide from './UsageGuide';

// 屏幕尺寸
const { width } = Dimensions.get('window');

// 音频文件
const AUDIO_FILES = {
  inhale: require('../../assets/audio/breathing/inhale.mp3'),
  hold: require('../../assets/audio/breathing/hold.mp3'),
  exhale: require('../../assets/audio/breathing/exhale.mp3'),
  complete: require('../../assets/audio/breathing/complete.mp3'),
};

interface BreathingExerciseProps {
  title: string;
  inhaleDuration: number;
  holdInDuration: number;
  exhaleDuration: number;
  holdOutDuration: number;
  cycles: number;
  tipText?: string;
}

/**
 * 呼吸练习组件
 * 用于引导用户按照特定的呼吸节奏进行练习
 */
const BreathingExercise = ({
  title = 'HRV 呼吸训练',
  inhaleDuration = 4000,
  holdInDuration = 2000,
  exhaleDuration = 4000,
  holdOutDuration = 0,
  cycles = 6,
  tipText,
}: BreathingExerciseProps) => {
  // 计算一个完整周期的时间
  const CYCLE_DURATION = inhaleDuration + holdInDuration + exhaleDuration + holdOutDuration;
  
  // 计算会话总时间（毫秒）
  const DEFAULT_SESSION_DURATION = CYCLE_DURATION * cycles;
  
  // 状态管理
  const [isActive, setIsActive] = useState(false); // 练习是否正在进行
  const [currentPhase, setCurrentPhase] = useState('准备开始'); // 当前呼吸阶段
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_SESSION_DURATION); // 剩余时间（ms）
  const [isReady, setIsReady] = useState(false); // 音频模块是否准备好
  const [showGuide, setShowGuide] = useState(false); // 显示使用指南
  
  // 音频对象引用
  const soundRef = useRef<Audio.Sound | null>(null);
  const isPlayingRef = useRef(false);
  const isLoadingRef = useRef(false);
  
  // 动画值
  const circleSize = useRef(new Animated.Value(1)).current;
  const circleOpacity = useRef(new Animated.Value(0.2)).current;
  const sessionTimer = useRef<NodeJS.Timeout | null>(null);
  const phaseTimer = useRef<NodeJS.Timeout | null>(null);

  // 初始化检查音频模块是否可用
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: 1,
          interruptionModeIOS: 1,
        });
        setIsReady(true);
      } catch (error) {
        console.error('音频模块初始化失败:', error);
        setIsReady(false);
        Alert.alert(
          '提示',
          '音频功能初始化失败，呼吸练习将没有语音提示。',
          [{ text: '我知道了' }]
        );
      }
    };
    
    setupAudio();
    
    // 首次打开应用时自动显示使用指南
    if (tipText) {
      setShowGuide(true);
    }

    // 清理函数
    return () => {
      cleanupAudio();
    };
  }, [tipText]);

  // 清理音频资源
  const cleanupAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      isPlayingRef.current = false;
      isLoadingRef.current = false;
    } catch (error) {
      console.error('清理音频资源失败:', error);
    }
  };

  let lastPlayedType = '';

  // 播放音频
  const playAudio = async (type: keyof typeof AUDIO_FILES) => {
    if (!isReady || isPlayingRef.current || isLoadingRef.current) return;
    if (lastPlayedType === type) return;
    lastPlayedType = type;
    
    try {
      isLoadingRef.current = true;

      // 清理当前音频
      await cleanupAudio();

      // 创建并加载新音频
      const { sound } = await Audio.Sound.createAsync(
        AUDIO_FILES[type],
        { shouldPlay: false },
        (status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              isPlayingRef.current = false;
              cleanupAudio();
            }
          }
        }
      );

      // 确保音频已加载
      if (!sound) {
        throw new Error('音频加载失败');
      }

      soundRef.current = sound;
      
      // 播放音频
      await sound.playAsync();
      isPlayingRef.current = true;
    } catch (error) {
      console.error('播放音频失败:', error);
      await cleanupAudio();
    } finally {
      isLoadingRef.current = false;
    }
  };

  // 更新呼吸阶段和动画
  const updateBreathingPhase = (elapsedTime: number) => {
    const cyclePosition = elapsedTime % CYCLE_DURATION;
    
    // 根据当前周期内的位置确定呼吸阶段
    if (cyclePosition < inhaleDuration) {
      // 吸气阶段
      if (currentPhase !== '吸气') {
        setCurrentPhase('吸气');
        playAudio('inhale');
        
        // 圆形扩大动画和透明度变化
        Animated.parallel([
          Animated.timing(circleSize, {
            toValue: 2.2,
            duration: inhaleDuration,
            useNativeDriver: false,
          }),
          Animated.timing(circleOpacity, {
            toValue: 0.6,
            duration: inhaleDuration,
            useNativeDriver: false,
          })
        ]).start();
      }
    } else if (cyclePosition < inhaleDuration + holdInDuration) {
      // 吸气后屏息阶段
      if (currentPhase !== '屏息') {
        setCurrentPhase('屏息');
        playAudio('hold');
        
        // 保持圆形大小
        Animated.parallel([
          Animated.timing(circleSize, { toValue: 2.2, duration: 1, useNativeDriver: false }),
          Animated.timing(circleOpacity, { toValue: 0.6, duration: 1, useNativeDriver: false })
        ]).stop();
      }
    } else if (cyclePosition < inhaleDuration + holdInDuration + exhaleDuration) {
      // 呼气阶段
      if (currentPhase !== '呼气') {
        setCurrentPhase('呼气');
        playAudio('exhale');
        
        // 圆形收缩动画和透明度变化
        Animated.parallel([
          Animated.timing(circleSize, {
            toValue: 1,
            duration: exhaleDuration,
            useNativeDriver: false,
          }),
          Animated.timing(circleOpacity, {
            toValue: 0.2,
            duration: exhaleDuration,
            useNativeDriver: false,
          })
        ]).start();
      }
    } else if (holdOutDuration > 0 && currentPhase !== '屏息(呼气后)') {
      // 呼气后屏息阶段 (仅当有呼气后屏息时间时)
      setCurrentPhase('屏息(呼气后)');
      playAudio('hold');
      
      // 保持圆形大小
      Animated.parallel([
        Animated.timing(circleSize, { toValue: 1, duration: 1, useNativeDriver: false }),
        Animated.timing(circleOpacity, { toValue: 0.2, duration: 1, useNativeDriver: false })
      ]).stop();
    }
  };

  // 启动练习
  const startExercise = () => {
    // 初始化状态
    setIsActive(true);
    setTimeRemaining(DEFAULT_SESSION_DURATION);
    
    let startTime = Date.now();
    let lastUpdateTime = startTime;
    
    // 启动计时器跟踪练习时间
    sessionTimer.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSinceStart = currentTime - startTime;
      const elapsedSinceLastUpdate = currentTime - lastUpdateTime;
      
      // 更新剩余时间
      setTimeRemaining((prev: number) => Math.max(0, prev - elapsedSinceLastUpdate));
      
      // 更新时间戳
      lastUpdateTime = currentTime;
      
      // 检查是否完成练习
      if (elapsedSinceStart >= DEFAULT_SESSION_DURATION) {
        stopExercise(true); // 练习完成
      } else {
        // 更新呼吸阶段
        updateBreathingPhase(elapsedSinceStart);
      }
    }, 10); // 更新频率（10ms）
  };

  // 停止练习
  const stopExercise = async (completed = false) => {
    // 清除计时器
    if (sessionTimer.current) {
      clearInterval(sessionTimer.current);
      sessionTimer.current = null;
    }
    
    // 重置状态
    setIsActive(false);
    setCurrentPhase('准备开始');
    
    // 重置计时器到默认时长
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
    
    // 如果是正常完成，播放结束语
    if (completed) {
      await playAudio('complete');
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (sessionTimer.current) {
        clearInterval(sessionTimer.current);
      }
      cleanupAudio();
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

  // 获取呼吸说明文本
  const getInstructionText = () => {
    let text = '按照提示进行呼吸：';
    
    if (inhaleDuration > 0) {
      text += `吸气 ${inhaleDuration/1000} 秒`;
    }
    
    if (holdInDuration > 0) {
      text += `，屏息 ${holdInDuration/1000} 秒`;
    }
    
    if (exhaleDuration > 0) {
      text += `，呼气 ${exhaleDuration/1000} 秒`;
    }
    
    if (holdOutDuration > 0) {
      text += `，屏息 ${holdOutDuration/1000} 秒`;
    }
    
    return text;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={openGuide}
        >
          <Ionicons name="help-circle-outline" size={26} color="#3a86ff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTimeRemaining(timeRemaining)}</Text>
      </View>
      
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.breathCircle, circleStyle]} />
        <Text style={styles.phaseText}>{currentPhase}</Text>
      </View>
      
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          {getInstructionText()}
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
          注意：音频功能不可用，将无语音提示
        </Text>
      )}
      
      <UsageGuide
        visible={showGuide}
        onClose={() => setShowGuide(false)}
        title={title}
        content={tipText || '遵循屏幕上的呼吸提示，专注于当前呼吸，让心情平静下来。'}
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
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 50, // 确保标题在适当的层级
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3a86ff',
    textAlign: 'center',
    marginLeft: 40, // 为左侧返回按钮留出空间
    marginRight: 40, // 保持对称
  },
  helpButton: {
    position: 'absolute',
    right: 5,
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
});

export default BreathingExercise; 