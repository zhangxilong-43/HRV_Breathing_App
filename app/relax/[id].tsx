import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import RelaxSession from '../../src/screens/relax/RelaxSession';

/**
 * 放松训练会话页面 - 动态路由
 * 基于ID参数加载相应的训练模式
 */
export default function RelaxSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <View style={{ flex: 1 }}>
      <RelaxSession modeId={id || 'full'} />
    </View>
  );
} 