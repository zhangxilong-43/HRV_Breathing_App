import { Ionicons } from '@expo/vector-icons';

// 冥想模式类型定义
export interface MeditationMode {
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

// 冥想阶段类型定义
export interface MeditationPhase {
  id: string;
  name: string;
  duration: number;
  audioFile: string;
}

// 冥想模式数据定义
export interface MeditationModeData {
  id: string;
  title: string;
  introAudio: string;
  endAudio: string;
  phases: MeditationPhase[];
}

// 冥想模式列表 (占位数据，待未来完善)
export const MEDITATION_MODES: MeditationMode[] = [
  {
    id: 'focus',
    title: '专注冥想',
    description: '训练注意力集中能力',
    duration: '约 10 分钟',
    icon: 'flame-outline',
    color: '#8338ec',
    longDescription: '该训练将帮助你增强专注力，培养持续关注当下的能力。',
    instructions: '建议坐姿，保持脊柱挺直，闭眼或轻微睁眼。',
    warning: '',
  },
  // 将来添加更多模式...
]; 