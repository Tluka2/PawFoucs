<div align="center">

# 🐾 PawFocus-学习伙伴

一款常驻桌面的番茄钟应用，搭配像素风宠物陪伴。专注学习赚取金币，解锁更多宠物伙伴。

[![Version](https://img.shields.io/github/v/release/Tluka2/PawFoucs?style=flat-square&color=E8956A)](../../releases)
[![License](https://img.shields.io/github/license/Tluka2/PawFoucs?style=flat-square&color=7CB89A)](LICENSE)
[![Stars](https://img.shields.io/github/stars/Tluka2/PawFoucs?style=flat-square&color=E8B85C)](../../stargazers)

[![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)]()
[![Tauri](https://img.shields.io/badge/Tauri_v1-24C8D8?style=flat-square&logo=tauri&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)]()

</div>

---

<div align="center">

![主界面](docs/screenshots/main.png)

</div>

---

## 功能

| | |
| :--- | :--- |
| ⏱️ **番茄钟** | 倒计时 / 正计时双模式，短休息 / 长休息循环，迷你悬浮窗随时可见 |
| 💰 **金币系统** | 完成专注获得金币，完美专注额外加成，连击触发倍数奖励 |
| 🐕 **宠物系统** | 领养小猫或小狗，用金币解锁更多宠物，随时改名切换 |
| ✅ **习惯打卡** | 每日 / 工作日 / 每 N 天 / 指定星期几，日历视图回溯编辑 |
| 📝 **备忘便签** | 分类标签 + 截止日期，拖拽排序，双击编辑 |
| 📊 **数据统计** | 今日 / 累计专注时长，本周柱状图，连续打卡天数 |
| ⚙️ **个性化设置** | 调整工作 / 休息时长，开关音效、通知、健康提醒 |
| 🔔 **贴心提醒** | 系统托盘常驻，喝水 / 护眼 / 起身健康提醒，完成推送通知 |

![迷你悬浮窗](docs/screenshots/mini-timer.png)

---

## 下载

| 平台 | 下载 |
| ---- | ---- |
| Windows x64 | [PawFocus_0.1.0_x64-setup.exe](../../releases/latest) |

完整安装包请在 [Releases](../../releases) 页面获取最新版本。

---

## 开发

### 环境要求

- Node.js 18+
- Rust

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run tauri dev
```

### 构建

```bash
npm run tauri build
```

构建后的安装包位于 `src-tauri/target/release/bundle/nsis/`。

---

## 技术栈

| 领域 | 技术 |
| ---- | ---- |
| 前端框架 | Vue 3 + Composition API |
| 语言 | TypeScript |
| 构建工具 | Vite |
| 桌面端 | Tauri v1 (Rust) |
| 状态管理 | Pinia |
| 样式 | CSS Variables |
| 图标 | 手绘像素风格 SVG |

---

## License

[MIT](LICENSE)
