import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface SessionModalProps {
  visible: boolean;
  title: string;
  description: string;
  instructions: string;
  warning?: string;
  onStart: () => void;
  onCancel: () => void;
}

/**
 * 会话模态窗组件
 * 用于显示放松模式的详细说明和开始/取消按钮
 */
const SessionModal = ({
  visible,
  title,
  description,
  instructions,
  warning,
  onStart,
  onCancel
}: SessionModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          <Text style={styles.modalDescription}>{description}</Text>
          
          <View style={styles.instructionBox}>
            <Text style={styles.instructionTitle}>使用方式：</Text>
            <Text style={styles.instructionText}>{instructions}</Text>
          </View>
          
          {warning && (
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>注意事项：</Text>
              <Text style={styles.warningText}>{warning}</Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={onStart}
              activeOpacity={0.7}
            >
              <Text style={styles.startButtonText}>开始训练</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    paddingTop: 20,
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
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
  },
  instructionBox: {
    marginBottom: 16,
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3a86ff',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  warningBox: {
    marginBottom: 16,
    backgroundColor: '#fff3f3',
    padding: 12,
    borderRadius: 8,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff3a6c',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#3a86ff',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginLeft: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SessionModal; 