import { Ionicons } from '@expo/vector-icons';

/**
 * 训练会话阶段的通用接口
 */
export interface SessionPhase {
  id: string;
  name: string;
  duration: number;
  audioFile: string;
}

/**
 * 训练模式的基本接口
 */
export interface TrainingMode {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  longDescription: string;
  instructions: string;
  warning?: string;
}

/**
 * 训练会话数据的通用接口
 */
export interface SessionData {
  id: string;
  title: string;
  introAudio: string;
  endAudio: string;
  phases: SessionPhase[];
} 