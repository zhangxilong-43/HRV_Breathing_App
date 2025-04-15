# HRV呼吸调节应用 (MVP)

这是一款帮助用户在情绪波动或焦虑时，通过呼吸训练快速恢复平静状态的App。App引导用户按照科学的HRV（心率变异性）呼吸节奏进行练习，提升副交感神经活性，缓解胸闷、心悸、压力大等情绪反应。

## 功能特色

- **HRV呼吸引导**: 吸气4秒 - 屏息2秒 - 呼气4秒的科学呼吸节奏
- **语音播报**: 使用中文语音引导呼吸过程
- **视觉动画**: 圆形视觉提示随呼吸节奏扩张/收缩
- **自动计时**: 默认练习时长1分钟（可自定义）
- **竖屏设计**: 专为手机用户优化的界面

## 技术栈

- React Native / Expo
- TypeScript
- React Navigation
- Expo Speech API

## 开始使用

### 前提条件

- Node.js (推荐使用v18.x或更高版本)
- npm或yarn
- iOS环境需要Xcode
- Android环境需要Android Studio
- Expo Go应用（手机上快速预览）

### 本地运行

1. 克隆项目后，进入项目目录：

```bash
cd HRV_Breathing_App
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm start
# 或
npx expo start
```

4. 运行iOS模拟器（需要Mac环境）：

```bash
npm run ios
```

5. 运行Android模拟器：

```bash
npm run android
```

### 使用Expo Go直接预览

1. 在手机上安装Expo Go应用
2. 启动项目后，使用Expo Go扫描终端中显示的二维码

## 发布到TestFlight

1. 构建iOS应用：

```bash
eas build --platform ios
```

2. 提交到TestFlight：

```bash
eas submit --platform ios
```

## 项目结构

- `/components` - 可复用组件
- `/app` - 应用主界面
- `/assets` - 静态资源（图片、图标等）

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！
