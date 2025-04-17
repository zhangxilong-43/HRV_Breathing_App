import { Ionicons } from '@expo/vector-icons';

// 放松模式类型定义
export interface RelaxMode {
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

// 阶段类型定义
export interface RelaxPhase {
  id: string;
  name: string;
  duration: number;
  audioFile: string;
}

// 模式数据定义
export interface RelaxModeData {
  id: string;
  title: string;
  introAudio: string;
  endAudio: string;
  phases: RelaxPhase[];
}

// 放松模式列表
export const RELAX_MODES: RelaxMode[] = [
  {
    id: 'full',
    title: '全身渐进式放松',
    description: '依次对 11 组肌肉紧张→放松',
    duration: '约 10 分钟',
    icon: 'body-outline',
    color: '#3a86ff',
    longDescription: '本训练将依次引导你对脚部、腿部、臀部、背部、腹部、胸部、肩膀、手臂、颈部、面部进行"紧张→放松"练习，帮助全身肌肉彻底释放。',
    instructions: '建议坐姿或仰卧，保持呼吸自然；按"开始训练"后请静心聆听语音提示。',
    warning: '如有严重心脏病、高血压，请在医生指导下使用。',
  },
  {
    id: 'segment',
    title: '分区深度放松',
    description: '针对单一区域深度放松',
    duration: '约 5 分钟',
    icon: 'fitness-outline',
    color: '#4cc9f0',
    longDescription: '本训练将针对肩颈、背部和下肢三个常见疲劳区域进行重点放松，每个区域进行"紧张→放松"训练。',
    instructions: '选择一个舒适的姿势，可坐可躺；全程保持自然呼吸，避免憋气。',
    warning: '颈椎有伤者请在医生指导下谨慎使用。',
  },
  {
    id: 'quick',
    title: '快速全身放松',
    description: '一次性全身紧张→放松',
    duration: '约 2 分钟',
    icon: 'flash-outline',
    color: '#ff006e',
    longDescription: '本训练适合忙碌时刻的短暂放松，通过一次性全身肌肉紧张再放松，快速缓解紧绷感。',
    instructions: '可坐姿进行，保持自然呼吸；聆听语音提示，跟随进行全身肌肉的紧张与放松。',
    warning: '',
  },
];

// 训练模式数据
export const RELAX_SESSIONS: { [key: string]: RelaxModeData } = {
  // 全身渐进式放松
  full: {
    id: 'full',
    title: '全身渐进式放松',
    introAudio: 'muscle_full_intro.mp3',
    endAudio: 'muscle_full_end.mp3',
    phases: [
      {
        id: 'foot_tension',
        name: '脚部 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_foot.mp3',
      },
      {
        id: 'foot_relax',
        name: '脚部 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_foot.mp3',
      },
      {
        id: 'calf_tension',
        name: '小腿 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_calf.mp3',
      },
      {
        id: 'calf_relax',
        name: '小腿 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_calf.mp3',
      },
      {
        id: 'thigh_tension',
        name: '大腿 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_thigh.mp3',
      },
      {
        id: 'thigh_relax',
        name: '大腿 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_thigh.mp3',
      },
      {
        id: 'buttocks_tension',
        name: '臀部 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_buttocks.mp3',
      },
      {
        id: 'buttocks_relax',
        name: '臀部 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_buttocks.mp3',
      },
      {
        id: 'back_tension',
        name: '背部 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_back.mp3',
      },
      {
        id: 'back_relax',
        name: '背部 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_back.mp3',
      },
      {
        id: 'abdomen_tension',
        name: '腹部 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_abdomen.mp3',
      },
      {
        id: 'abdomen_relax',
        name: '腹部 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_abdomen.mp3',
      },
      {
        id: 'chest_tension',
        name: '胸部 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_chest.mp3',
      },
      {
        id: 'chest_relax',
        name: '胸部 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_chest.mp3',
      },
      {
        id: 'shoulders_tension',
        name: '肩膀 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_shoulders.mp3',
      },
      {
        id: 'shoulders_relax',
        name: '肩膀 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_shoulders.mp3',
      },
      {
        id: 'arms_tension',
        name: '手臂 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_arms.mp3',
      },
      {
        id: 'arms_relax',
        name: '手臂 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_arms.mp3',
      },
      {
        id: 'neck_tension',
        name: '颈部 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_neck.mp3',
      },
      {
        id: 'neck_relax',
        name: '颈部 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_neck.mp3',
      },
      {
        id: 'face_tension',
        name: '面部 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_face.mp3',
      },
      {
        id: 'face_relax',
        name: '面部 — 放松',
        duration: 10000,
        audioFile: 'muscle_relax_face.mp3',
      },
    ],
  },
  
  // 分区深度放松
  segment: {
    id: 'segment',
    title: '分区深度放松',
    introAudio: 'muscle_segment_intro.mp3',
    endAudio: 'muscle_segment_end.mp3',
    phases: [
      {
        id: 'shoulder_neck_tension',
        name: '肩颈 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_segment_shoulder_neck.mp3',
      },
      {
        id: 'shoulder_neck_relax',
        name: '肩颈 — 放松',
        duration: 15000,
        audioFile: 'muscle_relax_segment_shoulder_neck.mp3',
      },
      {
        id: 'back_tension',
        name: '背部 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_segment_back.mp3',
      },
      {
        id: 'back_relax',
        name: '背部 — 放松',
        duration: 15000,
        audioFile: 'muscle_relax_segment_back.mp3',
      },
      {
        id: 'lower_limb_tension',
        name: '下肢 — 紧张',
        duration: 5000,
        audioFile: 'muscle_tension_segment_lower_limb.mp3',
      },
      {
        id: 'lower_limb_relax',
        name: '下肢 — 放松',
        duration: 15000,
        audioFile: 'muscle_relax_segment_lower_limb.mp3',
      },
    ],
  },
  
  // 快速全身放松
  quick: {
    id: 'quick',
    title: '快速全身放松',
    introAudio: 'muscle_quick_intro.mp3',
    endAudio: 'muscle_quick_end.mp3',
    phases: [
      {
        id: 'quick_tension',
        name: '全身 — 紧张',
        duration: 10000,
        audioFile: 'muscle_quick_tension.mp3',
      },
      {
        id: 'quick_relax',
        name: '全身 — 放松',
        duration: 50000,
        audioFile: 'muscle_quick_relax.mp3',
      },
    ],
  },
}; 