# Slice 2.3 时段背景系统 - 测试报告

**日期**: 2026-04-26
**测试方法**: 静态代码分析 + 逻辑追踪
**测试范围**: useTimeOfDay.ts + AmbientBackground.vue + App.vue(夜间模式)

---

## 测试轮次

### Round 1: 模板 & 数据绑定

| 测试项 | 结果 | 备注 |
|--------|------|------|
| AmbientBackground v-if 条件 | PASS | `currentView === 'home' && hasPet` 正确限制 |
| :period prop 绑定 | PASS | 来自 useTimeOfDay() computed |
| :config prop 绑定 | PASS | ambientConfig 来自 useTimeOfDay() |
| period computed 逻辑 | PASS | `devOverride ?? getPeriod(hour)` 覆盖优先 |
| isNightMode computed | PASS | `isNight && hasPet && currentView === 'home'` 三重条件 |
| ambient-layer :class="period" | PASS | morning/afternoon/evening/night 正确绑定 |
| ambient-layer :style bgGradient | PASS | config.bgGradient 正确传入 |
| greeting text 绑定 | PASS | config.greeting 动态显示 |
| sun v-if + class 绑定 | PASS | showSun/sunGlow/sun-dim 三重条件 |
| moon v-if 绑定 | PASS | config.showMoon |
| cloud v-for 绑定 | PASS | config.cloudCount 正确生成 0-3 朵 |
| star computed 生成 | PASS | 50颗星，seededRandom 确定性位置 |
| devPeriodOverride toggle | PASS | 点击切换 override/null |

**结论**: PASS — 数据绑定全部正确

---

### Round 2: CSS 布局 & z-index 层级

| 测试项 | 结果 | 备注 |
|--------|------|------|
| .window-container position: relative | PASS | 为 absolute 子元素提供定位上下文 |
| .ambient-layer position: absolute, inset: 0 | PASS | 全屏覆盖窗口容器 |
| .ambient-layer z-index: 0 | PASS | 最底层 |
| .main-content z-index: 1 | PASS | 内容层在氛围层之上 |
| .bottom-nav z-index: 1 | PASS | 导航层在氛围层之上 |
| .dev-panel z-index: 50 | PASS | 最顶层 |
| 层级顺序 ambient(0) < content(1) < dev(50) | PASS | 无冲突 |
| .ambient-layer pointer-events: none | PASS | 点击穿透到内容层 |
| .window-container overflow: hidden | PASS | 圆角裁剪 + 防溢出 |
| .ambient-layer overflow: hidden | PASS | 星星/云朵不超出范围 |
| ambient 不影响 flex 布局 | PASS | absolute 定位，脱离文档流 |
| border-radius 裁剪效果 | PASS | 容器 overflow:hidden 裁剪氛围层圆角 |

**结论**: PASS — 布局层级全部正确

---

### Round 3: 过渡 & 动画

| 测试项 | 结果 | 备注 |
|--------|------|------|
| .ambient-layer background transition 2s | PASS | 时段切换平滑渐变 |
| sun background/box-shadow transition 2s | PASS | 颜色平滑变化 |
| moon moon-float 动画 6s | PASS | 轻柔上下浮动 |
| sun sun-pulse 动画 3s | PASS | 缩放+光晕脉动 |
| star twinkle 动画 | PASS | 随机延迟+持续时间的闪烁 |
| cloud cloud-drift 动画 | PASS | 25-35s 线性漂移 |
| cloud opacity transition 2s | PASS | 透明度平滑变化 |
| greeting panel transition 2s | PASS | 背景/边框/文字平滑过渡 |
| **傍晚 sun-pulse 颜色** | **FAIL** | 动画用黄色光晕覆盖了 sun-dim 的橙色 |
| sun/moon 切换过渡 | **WARN** | v-if 导致瞬间出现/消失，无淡入淡出 |
| cloud 出现/消失过渡 | **WARN** | v-if 导致瞬间出现/消失 |

**详细分析**:

**问题 1 (P2)**: 傍晚时段，sun-pulse 和 sun-dim 两个 class 同时生效。
- `sun-dim` 设置: `background: #FF9A6C; box-shadow: 0 0 16px 4px rgba(255, 154, 108, 0.3)` (橙色)
- `sun-pulse` 动画: `box-shadow: ... rgba(255, 217, 61, ...)` (黄色)
- CSS 动画优先级高于静态样式，导致 box-shadow 被动画覆盖
- **结果**: 傍晚太阳体色正确(橙色)，但光晕脉动颜色错误(黄色而非橙色)

**问题 2 (P3)**: sun 和 moon 使用 v-if 控制显示，时段切换时瞬间消失/出现。
例如 afternoon→night: 太阳瞬间消失，月亮瞬间出现。无 opacity 过渡。

**问题 3 (P3)**: cloud 使用 v-if 控制显示，时段切换时云朵瞬间出现/消失。
例如 morning→afternoon: 云朵瞬间消失。

---

### Round 4: 夜间模式适配

| 测试项 | 结果 | 备注 |
|--------|------|------|
| isNightMode 三重条件 | PASS | isNight + hasPet + home |
| .main-content background: transparent | PASS | 让夜间氛围背景显示 |
| .timer-display 夜间颜色 | PASS | #FFD4A8 暖金色 |
| .timer-subtitle 夜间颜色 | PASS | rgba(255,255,255,0.5) |
| .exp-row 夜间适配 | PASS | label/bar/ratio 三项全部适配 |
| .task-card 玻璃拟态 | PASS | backdrop-filter: blur(12px) |
| .btn-warm 夜间适配 | PASS | 调整阴影 |
| .btn-ghost 夜间适配 | PASS | 玻璃拟态 |
| .mode-row / .dur-btn 夜间适配 | PASS | 深色半透明 |
| .bottom-nav 玻璃拟态 | PASS | backdrop-filter: blur(12px) |
| .pet-bubble 玻璃拟态 | PASS | 深色半透明 + 箭头适配 |
| .level-up 夜间适配 | PASS | 暖金色文字 |
| .dev-panel 夜间适配 | PASS | 深色半透明面板 + 按钮 |
| .night .greeting-panel (Ambient) | PASS | 深色玻璃风格 |
| StatsPanel 不受夜间影响 | PASS | 切换到统计时 ambient 隐藏，保持亮色 |

**结论**: PASS — 夜间模式覆盖全面

---

### Round 5: 边界场景 & 集成

| 测试项 | 结果 | 备注 |
|--------|------|------|
| 无宠物 → ambient 隐藏 | PASS | v-if hasPet 条件正确 |
| 非首页视图 → ambient 隐藏 | PASS | v-if currentView==='home' |
| dev override 切换 | PASS | 点击切换 override/null |
| dev override null → 自动检测 | PASS | computed fallback |
| useTimeOfDay timer 60s | PASS | 每分钟检查时段变化 |
| onUnmounted 清理 timer | PASS | clearInterval 正确调用 |
| 50颗星 + 3朵云 性能 | PASS | 全 CSS 动画，无 JS 计算 |
| 响应式 clamp() + vmin | PASS | 所有尺寸自适应 |
| seededRandom 确定性 | PASS | 同一 seed 总是产生相同位置 |
| cloud 起始位置 off-screen | PASS | left: -15%/-20%/-10% |
| cloud 漂移终点 off-screen | PASS | translateX(100vw + 100px) |
| devPeriodOverride 模块级共享 | PASS | 跨组件状态一致 |
| **showDevPanel 硬编码 true** | **WARN** | 无生产环境隐藏机制 |
| **PetSprite 无夜间模式** | **WARN** | 像素画精灵在深色背景上可能对比度不足 |

**详细分析**:

**问题 4 (P3)**: `showDevPanel = ref(true)` 硬编码，没有 toggle 开关。
在生产环境中，调试面板始终可见。应使用 `import.meta.env.DEV` 或添加关闭按钮。

**问题 5 (P3)**: PetSprite.vue 无夜间模式样式。
宠物精灵是 canvas 像素画，背景透明。在夜间深色背景上，浅色像素画应该可辨，
但 `anim-sleep` 的 `brightness(0.8)` 滤镜可能让宠物在深色背景上更难辨识。

---

## 问题汇总

### P2 - 应该修复

| # | 问题 | 位置 | 描述 |
|---|------|------|------|
| 1 | 傍晚太阳光晕颜色错误 | AmbientBackground.vue | sun-pulse 动画覆盖 sun-dim 的橙色 box-shadow |

### P3 - 可以改进

| # | 问题 | 位置 | 描述 |
|---|------|------|------|
| 2 | Dev panel 无生产隐藏 | App.vue:265 | showDevPanel 硬编码 true |
| 3 | sun/moon 切换无淡入淡出 | AmbientBackground.vue | v-if 导致瞬间出现/消失 |
| 4 | cloud 出现/消失无过渡 | AmbientBackground.vue | v-if 导致瞬间出现/消失 |
| 5 | PetSprite 无夜间对比度优化 | PetSprite.vue | 睡眠亮度滤镜在深色背景上可能降低可见度 |

---

## 修复计划

1. **修复 P2-1**: 新增 `sun-pulse-dim` 关键帧动画，当 sun-dim + sun-pulse 同时生效时使用橙色光晕
2. **修复 P3-2**: 添加 `import.meta.env.DEV` 条件控制 dev panel 可见性

---

## 修复结果

| # | 问题 | 修复 | 文件 |
|---|------|------|------|
| 1 | 傍晚太阳光晕 | 新增 `.sun-dim.sun-pulse` 规则使用橙色关键帧 | AmbientBackground.vue |
| 2 | Dev panel 生产隐藏 | `showDevPanel = import.meta.env.DEV` | App.vue |

**构建验证**: `npm run build` 通过，零错误。
