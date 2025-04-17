import { Audio } from 'expo-av';

/**
 * 音频服务类
 * 负责管理音频播放和相关回调处理
 */
class AudioService {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;
  private isLoading: boolean = false;

  /**
   * 设置音频模式，使其适用于背景播放
   */
  async setupAudio(): Promise<boolean> {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1, // INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
        interruptionModeIOS: 1, // INTERRUPTION_MODE_IOS_DO_NOT_MIX
      });
      return true;
    } catch (error) {
      console.error('音频模块初始化失败:', error);
      return false;
    }
  }

  /**
   * 播放音频
   * @param audioSource 音频资源
   * @param onComplete 播放完成回调
   */
  async playAudio(
    audioSource: any,
    onComplete?: () => void
  ): Promise<void> {
    if (this.isPlaying || this.isLoading) {
      await this.stopAudio();
    }

    try {
      this.isLoading = true;

      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            this.isPlaying = false;
            if (onComplete) {
              onComplete();
            }
          }
        }
      );

      this.sound = sound;
      this.isPlaying = true;
      this.isLoading = false;
    } catch (error) {
      console.error('播放音频失败:', error);
      this.isPlaying = false;
      this.isLoading = false;
    }
  }

  /**
   * 停止当前音频播放
   */
  async stopAudio(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
      this.isPlaying = false;
    } catch (error) {
      console.error('停止音频失败:', error);
    }
  }

  /**
   * 暂停当前音频播放
   */
  async pauseAudio(): Promise<void> {
    try {
      if (this.sound && this.isPlaying) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('暂停音频失败:', error);
    }
  }

  /**
   * 恢复暂停的音频播放
   */
  async resumeAudio(): Promise<void> {
    try {
      if (this.sound && !this.isPlaying) {
        await this.sound.playAsync();
        this.isPlaying = true;
      }
    } catch (error) {
      console.error('恢复音频失败:', error);
    }
  }

  /**
   * 检查是否正在播放
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * 清理音频资源
   */
  async cleanup(): Promise<void> {
    await this.stopAudio();
  }
}

// 导出单例实例
export default new AudioService(); 