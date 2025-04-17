import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ControlButtonsProps {
  isPaused: boolean;
  onPauseResume: () => void;
  onEnd: () => void;
}

/**
 * 控制按钮组件
 * 提供暂停/继续和结束训练按钮
 */
const ControlButtons = ({ isPaused, onPauseResume, onEnd }: ControlButtonsProps) => {
  // 点击结束按钮时确认
  const handleEndPress = () => {
    Alert.alert(
      '确认结束',
      '确定要结束当前训练吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', style: 'destructive', onPress: onEnd }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.pauseButton]}
        onPress={onPauseResume}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isPaused ? 'play' : 'pause'} 
          size={22} 
          color="white" 
        />
        <Text style={styles.buttonText}>
          {isPaused ? '继续' : '暂停'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.endButton]}
        onPress={handleEndPress}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={22} color="white" />
        <Text style={styles.buttonText}>结束训练</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  pauseButton: {
    backgroundColor: '#3a86ff',
    minWidth: 110,
  },
  endButton: {
    backgroundColor: '#ff3a6c',
    minWidth: 140,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ControlButtons; 