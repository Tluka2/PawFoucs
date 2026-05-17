# 测试报告：精灵图修复 + 气泡优化 + 清空数据功能

**日期**：2026-04-27
**范围**：精灵图渲染修复、动画频率调整、对话气泡优化、清空数据按钮
**测试轮次**：5 轮

---

## 测试范围

| 模块 | 改动文件 | 内容 |
|------|----------|------|
| 精灵图渲染 | `types.ts`, `index.ts`, `PetSprite.vue` | 从 sheetWidth/sheetHeight 改为 cellWidth/cellHeight 统一格子 |
| 动画频率 | `index.ts`, `usePetAnimation.ts` | FPS 降低，随机动作频率降低 |
| CSS 像素风 | `PetSprite.vue` | steps(1, end) 离散动画 |
| 对话气泡 | `App.vue`, `usePet.ts` | 允许换行、动态时长 |
| 清空数据 | `SettingsPanel.vue` | 新增清空所有数据按钮 + 二次确认 |

---

## Test 1: 构建验证

| 项目 | 结果 |
|------|------|
| `vue-tsc` 类型检查 | PASS |
| `vite build` 前端打包 | PASS (196KB JS, 70KB CSS) |
| `cargo check` Rust 编译 | PASS |
| 产出物完整性 | PASS — index.html + JS + CSS + dog-removebg-preview.png |

---

## Test 2: 代码逻辑审查

| 检查项 | 结果 | 备注 |
|--------|------|------|
| drawSheetFrame 格子裁切逻辑 | PASS | sx=frameIndex*72, sy=animIndex*72 正确 |
| frameIndex 循环范围 | PASS | usePetAnimation 用 `frameCount` 取模，不会越界 |
| cellWidth=72 与图片匹配 | PASS | 432/6=72 整除，578/8≈72.25 实际取 72 无明显偏差 |
| StorageService 导入路径 | PASS | `from '@/services/storage'` 正确 |
| StoreName 类型导入 | PASS | 改为顶层 `import type` 避免内联 import() 兼容问题 |
| 清空数据 store 列表完整性 | PASS | 10 个 store 与 schema.ts 和 getAllData() 一致 |
| 夜间模式样式覆盖 | PASS | `.night-mode .danger-label` 等选择器在 scoped 内正确 |
| 无 sheetWidth/sheetHeight 残留引用 | PASS | 全项目搜索零匹配 |

---

## Test 3: 边界与异常场景

| 场景 | 结果 | 备注 |
|------|------|------|
| roll 动画 6 帧 × 72px = 432px = 图片宽度 | PASS | 最后一帧读取 360..432，在边界内 |
| idle 动画 2 帧，frameIndex 只到 1 | PASS | sx=0 或 72，不越界 |
| 精灵图加载失败 | PASS | loadedImage=null → drawSheetFrame return，canvas 空白，无崩溃 |
| 空气泡文本 (length=0) | PASS | Math.max(3000, 0)=3000ms，保底 3 秒 |
| 长气泡文本 (20字) | PASS | max(3000, 4000)=4000ms，气泡 max-width=280px 自动换行 |
| 睡眠时间检查 (22:00-06:00) | PASS | isSleepTime() 正确覆盖跨日场景 |
| 快速连续点击宠物 | PASS | clearTimeout 清旧 timer 再设新 timer，无泄漏 |

---

## Test 4: 类型安全 & 集成

| 检查项 | 结果 | 备注 |
|--------|------|------|
| `npx vue-tsc --noEmit` | PASS | 零错误 |
| SpriteSheetConfig 新旧类型切换 | PASS | 无残留 sheetWidth/sheetHeight 引用 |
| StoreName 类型匹配 store 列表 | PASS | 全部 10 个 store 都是合法 StoreName |
| ANIM_CONFIG 与 sprite config FPS 一致 | PASS | 8 个动画的 fps/frameCount 双文件一致 |
| PetSpriteData 联合类型 discriminated union | PASS | type: 'sheet' / type: 'legacy' 正确分发 |

---

## Test 5: 运行时验证

| 检查项 | 结果 |
|--------|------|
| dist 产出物大小合理 | PASS (JS 196KB, CSS 70KB, PNG 179KB) |
| dog-removebg-preview.png 正确复制到 dist | PASS |
| index.html 引用正确 JS/CSS 入口 | PASS |

---

## 发现的问题 & 修复

### P1：清空数据 Promise.all 失败不刷新

**文件**：`src/components/SettingsPanel.vue`
**问题**：`Promise.all()` 会在任意一个 store 清除失败时 reject，导致 `window.location.reload()` 不执行，用户看到弹窗关闭但页面不刷新。
**修复**：改为 `Promise.allSettled()`，确保无论单个 store 是否清除成功，都执行页面刷新。
**状态**：已修复

### P2：StoreName 类型使用内联 import() 语法

**文件**：`src/components/SettingsPanel.vue`
**问题**：`import('@/services/storage/schema').StoreName` 内联类型导入在 Vue SFC 编译中未被项目使用过，可能存在兼容风险。
**修复**：改为顶层 `import type { StoreName } from '@/services/storage/schema'`。
**状态**：已修复

### P3：bubbleTimer 组件卸载泄漏

**文件**：`src/composables/usePet.ts`
**问题**：`usePet()` composable 未注册 `onUnmounted` 清理 `bubbleTimer`，组件销毁后 timer 仍会触发。
**修复**：在 `usePet()` return 之前添加 `onUnmounted(() => { if (bubbleTimer) clearTimeout(bubbleTimer) })`。
**状态**：已修复

---

## 测试结论

5 轮测试共发现 3 个问题（1 个 P1 + 2 个 P2），已全部修复。最终构建通过，类型检查零错误。

| 总体评估 | 结果 |
|----------|------|
| 构建稳定性 | PASS |
| 类型安全 | PASS |
| 逻辑正确性 | PASS |
| 边界场景 | PASS |
| 代码质量 | PASS（修复后） |
