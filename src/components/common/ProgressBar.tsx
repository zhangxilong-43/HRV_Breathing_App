import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
}

/**
 * 进度条组件
 * 显示会话进度，使用动画效果平滑过渡
 */
const ProgressBar = ({
  progress,
  color = '#3a86ff',
  height = 8
}: ProgressBarProps) => {
  // 限制进度值在 0-1 之间
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  
  // 获取屏幕宽度
  const screenWidth = Dimensions.get('window').width;
  
  // 计算进度条宽度
  const progressWidth = screenWidth * 0.92 * normalizedProgress;

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View
        style={[
          styles.progress,
          {
            width: progressWidth,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '92%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 15,
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 4,
  },
});

export default ProgressBar; 