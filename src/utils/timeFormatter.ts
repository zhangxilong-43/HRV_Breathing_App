/**
 * 时间格式化工具
 * 提供各种时间显示格式的格式化函数
 */

/**
 * 将毫秒格式化为 mm:ss 格式
 * @param ms 毫秒数
 * @returns 格式化的时间字符串，例如 "05:30"
 */
export const formatTimeMMSS = (ms: number): string => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * 将毫秒格式化为倒计时格式（只显示秒数）
 * @param ms 毫秒数
 * @returns 格式化的倒计时字符串，例如 "00:05"
 */
export const formatCountdown = (ms: number): string => {
  const seconds = Math.ceil(ms / 1000);
  return `00:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * 将秒数格式化为中文时长描述
 * @param seconds 秒数
 * @returns 格式化的中文时长，例如 "5 分 30 秒"
 */
export const formatDurationChinese = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins === 0) {
    return `${secs} 秒`;
  } else if (secs === 0) {
    return `${mins} 分`;
  } else {
    return `${mins} 分 ${secs} 秒`;
  }
}; 