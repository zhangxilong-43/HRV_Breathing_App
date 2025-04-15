import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';

interface UsageGuideProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * 使用指南组件
 * 向用户展示如何使用呼吸练习App
 */
const UsageGuide: React.FC<UsageGuideProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>如何使用HRV呼吸调节</Text>
          
          <ScrollView style={styles.scrollView}>
            <Text style={styles.sectionTitle}>1. 基本操作</Text>
            <Text style={styles.guideText}>
              - 点击<Text style={styles.highlight}>开始练习</Text>按钮启动呼吸引导{'\n'}
              - 跟随屏幕上的动画和语音提示进行呼吸{'\n'}
              - 如需中断练习，点击<Text style={styles.highlight}>停止练习</Text>按钮{'\n'}
              - 默认练习时间为1分钟，结束后会自动停止
            </Text>
            
            <Text style={styles.sectionTitle}>2. 呼吸节奏</Text>
            <Text style={styles.guideText}>
              - <Text style={styles.highlight}>吸气4秒</Text>：圆圈扩大，缓慢吸气{'\n'}
              - <Text style={styles.highlight}>屏息2秒</Text>：圆圈保持，屏住呼吸{'\n'}
              - <Text style={styles.highlight}>呼气4秒</Text>：圆圈缩小，缓慢呼气{'\n'}
              - 一个完整呼吸周期为10秒
            </Text>
            
            <Text style={styles.sectionTitle}>3. 使用建议</Text>
            <Text style={styles.guideText}>
              - 选择安静、舒适的环境进行练习{'\n'}
              - 坐姿或躺姿都可以，保持身体放松{'\n'}
              - 通过鼻子吸气，嘴巴呼气效果更佳{'\n'}
              - 每天坚持1-3次，每次1-5分钟{'\n'}
              - 感到焦虑或压力大时，立即进行练习
            </Text>
            
            <Text style={styles.sectionTitle}>4. 注意事项</Text>
            <Text style={styles.guideText}>
              - 如果感到不适，请立即停止练习{'\n'}
              - 呼吸应自然舒适，不要强制过深或过浅{'\n'}
              - 保持注意力集中在呼吸和动画上{'\n'}
              - 如无语音提示，请确认设备是否打开声音{'\n'}
              - 若有严重心脏或呼吸系统疾病，请在医生指导下使用
            </Text>
          </ScrollView>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeText}>我知道了</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    justifyContent: 'space-around',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3a86ff',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
    maxHeight: '80%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  guideText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 10,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#3a86ff',
  },
  closeButton: {
    backgroundColor: '#3a86ff',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '50%',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UsageGuide; 