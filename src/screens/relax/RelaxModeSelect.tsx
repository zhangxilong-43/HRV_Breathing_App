import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import ModeCard from '../../components/relax/ModeCard';
import SessionModal from '../../components/relax/SessionModal';
import { RELAX_MODES, RelaxMode } from '../../constants/relaxation';

/**
 * 放松模式选择页面
 * 显示三种不同的肌肉放松训练模式供用户选择
 */
export default function RelaxModeSelectScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState<RelaxMode | null>(null);

  // 处理模式卡片点击
  const handleModePress = (mode: RelaxMode) => {
    setSelectedMode(mode);
    setModalVisible(true);
  };

  // 开始训练
  const handleStartTraining = () => {
    setModalVisible(false);
    if (selectedMode) {
      router.push(`/relax/${selectedMode.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f0f7ff"
        translucent={Platform.OS === 'android'}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>选择放松模式</Text>
        <Text style={styles.subtitle}>选择合适的方式开始肌肉放松训练</Text>
      </View>
      
      <FlatList
        data={RELAX_MODES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ModeCard
            title={item.title}
            description={item.description}
            duration={item.duration}
            icon={item.icon}
            color={item.color}
            onPress={() => handleModePress(item)}
          />
        )}
      />
      
      {selectedMode && (
        <SessionModal
          visible={modalVisible}
          title={selectedMode.title}
          description={selectedMode.longDescription}
          instructions={selectedMode.instructions}
          warning={selectedMode.warning}
          onStart={handleStartTraining}
          onCancel={() => setModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3a86ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
}); 