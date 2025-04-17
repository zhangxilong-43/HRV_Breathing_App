import { useState, useEffect, useRef } from 'react';

interface SessionPhase {
  id: string;
  name: string;
  duration: number;
  audioFile: string;
}

interface UseSessionTimerProps {
  phases: SessionPhase[];
  onComplete?: () => void;
  onPhaseChange?: (phase: SessionPhase) => void;
}

/**
 * 自定义会话计时器钩子
 * 管理会话计时、阶段切换、暂停/继续功能
 */
export const useSessionTimer = ({
  phases,
  onComplete,
  onPhaseChange,
}: UseSessionTimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(0);
  
  // 计算会话总时长
  const totalSessionTime = useRef(
    phases.reduce((total, phase) => total + phase.duration, 0)
  ).current;
  
  // 计时器引用
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 当前时间戳记录
  const lastTickRef = useRef<number>(0);

  // 初始化计时器
  useEffect(() => {
    // 初始化各阶段剩余时间
    if (phases.length > 0) {
      setPhaseTimeRemaining(phases[0].duration);
      setTotalTimeRemaining(totalSessionTime);
    }
    
    return () => {
      // 组件卸载时清理计时器
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [phases, totalSessionTime]);

  // 处理阶段变化
  useEffect(() => {
    if (currentPhaseIndex >= 0 && currentPhaseIndex < phases.length) {
      const currentPhase = phases[currentPhaseIndex];
      setPhaseTimeRemaining(currentPhase.duration);
      
      // 触发阶段变化回调
      if (onPhaseChange) {
        onPhaseChange(currentPhase);
      }
    }
  }, [currentPhaseIndex, phases, onPhaseChange]);

  // 启动计时器
  const startTimer = () => {
    if (isActive || phases.length === 0) return;
    
    setIsActive(true);
    setIsPaused(false);
    
    // 更新当前时间戳
    lastTickRef.current = Date.now();
    
    // 设置计时器以更新剩余时间
    timerRef.current = setInterval(() => {
      if (isPaused) return;
      
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      
      // 更新阶段剩余时间
      setPhaseTimeRemaining(prevTime => {
        const newTime = Math.max(0, prevTime - delta);
        
        // 当前阶段完成时
        if (newTime <= 0) {
          // 移动到下一阶段
          const nextPhaseIndex = currentPhaseIndex + 1;
          
          if (nextPhaseIndex < phases.length) {
            // 进入下一阶段
            setCurrentPhaseIndex(nextPhaseIndex);
            return phases[nextPhaseIndex].duration;
          } else {
            // 整个会话完成
            if (onComplete) {
              onComplete();
            }
            
            // 停止计时器
            stopTimer();
          }
        }
        
        return newTime;
      });
      
      // 更新总剩余时间
      setTotalTimeRemaining(prevTime => Math.max(0, prevTime - delta));
    }, 100); // 更新频率 (100ms)
  };

  // 暂停计时器
  const pauseTimer = () => {
    if (isActive && !isPaused) {
      setIsPaused(true);
    }
  };

  // 继续计时器
  const resumeTimer = () => {
    if (isActive && isPaused) {
      setIsPaused(false);
      lastTickRef.current = Date.now();
    }
  };

  // 停止计时器
  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 重置状态
    setCurrentPhaseIndex(0);
    if (phases.length > 0) {
      setPhaseTimeRemaining(phases[0].duration);
    }
    setTotalTimeRemaining(totalSessionTime);
  };

  // 切换暂停/继续状态
  const togglePause = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  // 计算总进度百分比 (0-1)
  const progress = 1 - totalTimeRemaining / totalSessionTime;

  return {
    isActive,
    isPaused,
    currentPhase: phases[currentPhaseIndex],
    currentPhaseIndex,
    phaseTimeRemaining,
    totalTimeRemaining,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    togglePause,
  };
}; 