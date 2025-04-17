import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar, 
  Platform,
  Modal,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProgressBar from '../../components/common/ProgressBar';
import ControlButtons from '../../components/relax/ControlButtons';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import AudioService from '../../services/AudioService';
import { RELAX_SESSIONS, RelaxModeData } from '../../constants/relaxation';
import { formatCountdown, formatDurationChinese } from '../../utils/timeFormatter';

// 组件参数类型
interface RelaxSessionProps {
  modeId: string;
}

/**
 * 放松训练会话页面
 * 管理训练过程，音频播放和计时控制
 */
export default function RelaxSession({ modeId }: RelaxSessionProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isFirstPhase, setIsFirstPhase] = useState(true);

  // 根据modeId获取正确的会话数据
  const sessionData = modeId && RELAX_SESSIONS[modeId] ? 
    RELAX_SESSIONS[modeId] : RELAX_SESSIONS.full;
  
  // 音频文件路径
  const getAudioPath = (filename: string) => {
    try {
      // 根据不同的音频文件返回相应的资源
      if (filename === 'muscle_full_intro.mp3') {
        return require('../../assets/audio/muscle/muscle_full_intro.mp3');
      } else if (filename === 'muscle_tension_foot.mp3') {
        return require('../../assets/audio/muscle/muscle_tension_foot.mp3');
      }
      // 以此类推...为了示范，返回空音频或替代音频
      return require('../../assets/audio/muscle/muscle_full_intro.mp3');
    } catch (error) {
      console.error('音频文件加载失败:', error);
      return null;
    }
  };

  // 初始化计时器
  const { 
    isActive,
    isPaused,
    currentPhase,
    currentPhaseIndex,
    phaseTimeRemaining,
    progress,
    startTimer,
    togglePause,
    stopTimer
  } = useSessionTimer({
    phases: sessionData.phases,
    onComplete: () => {
      // 播放结束提示音
      const endAudio = getAudioPath(sessionData.endAudio);
      if (endAudio) {
        AudioService.playAudio(endAudio, () => {
          setShowCompletionModal(true);
          const endTime = Date.now();
          setSessionDuration(Math.floor((endTime - sessionStartTime) / 1000));
        });
      } else {
        setShowCompletionModal(true);
      }
    },
    onPhaseChange: (phase) => {
      // 播放当前阶段的音频
      const audioSource = getAudioPath(phase.audioFile);
      if (audioSource) {
        AudioService.playAudio(audioSource);
      }
      
      // 第一阶段特殊处理
      if (isFirstPhase) {
        setIsFirstPhase(false);
      }
    }
  });

  // 记录会话开始时间
  const sessionStartTime = React.useRef(Date.now()).current;

  // 初始化音频
  useEffect(() => {
    const setupAudio = async () => {
      const isReady = await AudioService.setupAudio();
      setIsAudioReady(isReady);
      
      if (isReady) {
        // 播放介绍音频
        const introAudio = getAudioPath(sessionData.introAudio);
        if (introAudio) {
          await AudioService.playAudio(introAudio, () => {
            // 介绍结束后开始训练
            startTimer();
          });
        } else {
          // 没有介绍音频直接开始
          startTimer();
        }
      } else {
        Alert.alert(
          '提示',
          '音频功能初始化失败，训练将没有语音提示。',
          [{ text: '我知道了', onPress: startTimer }]
        );
      }
    };
    
    setupAudio();
    
    return () => {
      // 退出时清理音频
      AudioService.cleanup();
    };
  }, [sessionData.introAudio, startTimer]);

  // 处理暂停/继续
  const handlePauseResume = useCallback(() => {
    togglePause();
    
    if (isPaused) {
      AudioService.resumeAudio();
    } else {
      AudioService.pauseAudio();
    }
  }, [isPaused, togglePause]);

  // 处理结束训练
  const handleEndTraining = useCallback(() => {
    stopTimer();
    AudioService.stopAudio();
    router.back();
  }, [stopTimer, router]);

  // 处理返回操作
  const handleBack = useCallback(() => {
    if (isActive) {
      Alert.alert(
        '确认返回',
        '训练尚未完成，确定要返回吗？',
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '确定', 
            style: 'destructive', 
            onPress: () => {
              stopTimer();
              AudioService.stopAudio();
              router.back();
            } 
          }
        ],
        { cancelable: true }
      );
    } else {
      router.back();
    }
  }, [isActive, stopTimer, router]);

  // 处理再次训练
  const handleTrainAgain = useCallback(() => {
    setShowCompletionModal(false);
    // 短暂延迟，确保UI更新完毕
    setTimeout(() => {
      stopTimer();
      setIsFirstPhase(true);
      
      // 重新播放介绍音频并开始训练
      const introAudio = getAudioPath(sessionData.introAudio);
      if (introAudio) {
        AudioService.playAudio(introAudio, startTimer);
      } else {
        startTimer();
      }
    }, 100);
  }, [sessionData.introAudio, startTimer, stopTimer]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f0f7ff"
        translucent={Platform.OS === 'android'}
      />
      
      {/* 返回按钮 */}
      <TouchableOpacity 
        style={[
          styles.backButton,
          { top: insets.top + 25 }
        ]}
        onPress={handleBack}
      >
        <Ionicons name="chevron-back" size={28} color="#3a86ff" />
      </TouchableOpacity>
      
      {/* 标题 */}
      <View style={[styles.header, { marginTop: insets.top + 20 }]}>
        <Text style={styles.title}>{sessionData.title}</Text>
      </View>
      
      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} />
      </View>
      
      {/* 阶段显示 */}
      <View style={styles.phaseContainer}>
        <Text style={styles.phaseName}>{currentPhase?.name || '准备开始'}</Text>
        <Text style={styles.countdown}>{formatCountdown(phaseTimeRemaining)}</Text>
      </View>
      
      {/* 控制按钮 */}
      <ControlButtons
        isPaused={isPaused}
        onPauseResume={handlePauseResume}
        onEnd={handleEndTraining}
      />
      
      {/* 完成训练弹窗 */}
      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>训练完成</Text>
            <Text style={styles.modalText}>
              您已完成本次"{sessionData.title}"训练，共耗时 {formatDurationChinese(sessionDuration)}。
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.againButton]}
                onPress={handleTrainAgain}
              >
                <Text style={styles.againButtonText}>再来一次</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.returnButton]}
                onPress={() => {
                  setShowCompletionModal(false);
                  router.back();
                }}
              >
                <Text style={styles.backButtonText}>返回放松</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff',
    alignItems: 'center',
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
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3a86ff',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  phaseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  phaseName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#3a86ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  countdown: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3a86ff',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  againButton: {
    backgroundColor: '#3a86ff',
  },
  returnButton: {
    backgroundColor: '#f0f0f0',
  },
  againButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
}); 