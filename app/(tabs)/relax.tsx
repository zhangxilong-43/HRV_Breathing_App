import React from 'react';
import { StyleSheet, View } from 'react-native';
import RelaxModeSelect from '../../src/screens/relax/RelaxModeSelect';

/**
 * 肌肉放松训练页面
 * 显示肌肉放松训练的不同模式选项
 */
export default function RelaxScreen() {
  return (
    <View style={styles.container}>
      <RelaxModeSelect />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
}); 