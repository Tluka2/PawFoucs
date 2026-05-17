# Mini Timer 代码逻辑分析报告

**日期**: 2026-05-06
**范围**: mini-timer 同步、claim-reward、时段背景、Rust 转发
**分析轮数**: 4 轮

---

## 1. 测试范围

| 文件 | 角色 |
|------|------|
| `src/App.vue` (L673-702) | 主窗口广播逻辑 |
| `src/composables/useTimer.ts` | 番茄钟状态机 |
| `src/composables/useWindow.ts` | 窗口操作封装 |
| `src/composables/useTimeOfDay.ts` | 时段计算 |
| `src-tauri/src/mini_timer.rs` | Rust 命令转发 |
| `public/mini-timer.html` | 小窗口 UI + 事件监听 |
| `src-tauri/tauri.conf.json` | 窗口配置 |

---

## 2. Round 1 — 数据流完整性

### 数据流路径

```
App.vue emitTimerToMin()  →  invoke('broadcast_timer_state', { time, state, label, period })
       ↓
Rust mini_timer.rs        →  app.emit_all("timer-update", json!({...}))
       ↓
mini-timer.html           →  window.__TAURI__.event.listen('timer-update', cb)
       ↓
update(data)              →  更新 UI
```

### 验证结果

- **参数完整性**: App.vue 传递 4 个参数 (time/state/label/period)，Rust 接收 4 个参数 (time/state/label/period)，mini-timer.html 使用全部 4 个字段。**通过**。
- **广播时机**: `startMiniBroadcast()` 在 timerState 变为 running/break/paused/completed 时启动 1s 间隔广播。idle 时发送一次后停止。**通过**。
- **初始同步**: `showMiniTimer()` 后立即调用 `emitTimerToMini()`，确保窗口显示后有首帧数据。**通过**。

---

## 3. Round 2 — 状态切换边界情况

### 状态转换矩阵

| 转换 | mini-timer 表现 | 结果 |
|------|----------------|------|
| idle → running | 🍅 + 倒计时 + "专注中..." | **通过** |
| running → paused | ⏸ + 暂停时间 + "已暂停" | **通过** |
| paused → running | 🍅 + 恢复计时 | **通过** |
| running → completed | 🎁 + ✓ + "点击领取" + 可点击 | **通过** |
| completed → break | ☕ + 休息倒计时 | **通过** |
| completed → idle | 🍅 + --:-- | **通过** |
| break → running | 🍅 + 新专注计时 | **通过** |
| break → idle | 🍅 + --:-- | **通过** |

### 时段背景

| 时段 | 背景 | 夜间文字色 | 结果 |
|------|------|-----------|------|
| morning | 柔和蓝黄渐变 | — | **通过** |
| afternoon | 浅蓝渐变 | — | **通过** |
| evening | 暖橙紫渐变 | — | **通过** |
| night | 深蓝暗色 + 白色边框 | 金色时间 / 半透明标签 | **通过** |

---

## 4. Round 3 — claim-reward 事件闭环

### 事件流

```
mini-timer.html click → window.__TAURI__.event.emit('mini-claim-reward', {})
       ↓ (Tauri IPC → app.emit_all)
App.vue listener      → if (isCompleted.value) claimReward()
       ↓
useTimer.claimReward() → startBreak() 或 resetToIdle()
```

### 验证结果

- **防重复领取**: App.vue 检查 `isCompleted.value` 守卫，JS 单线程无竞态。**通过**。
- **主窗口隐藏时可领取**: `appWindow.hide()` 不销毁 WebView，JS 上下文保持运行。**通过**。
- **双端领取安全**: 主窗口按钮和 mini-timer 共用同一个 `claimReward()` 函数，状态守卫一致。**通过**。

---

## 5. Round 4 — 类型安全 & 构建兼容性

| 检查项 | 结果 |
|--------|------|
| TypeScript 类型检查 (`vue-tsc --noEmit`) | **通过** — 无错误 |
| Rust 编译检查 (`cargo check`) | **通过** |
| JS→Rust 参数名匹配 | **通过** — time/state/label/period 全部对应 |
| `withGlobalTauri: true` 配置 | **通过** — mini-timer.html 可使用 `window.__TAURI__` |
| WebView2 CSS 兼容性 | **通过** — 标准 CSS + webkit 前缀 |
| `data-tauri-drag-region` 动态切换 | **通过** — completed 时移除，其余状态设置 |

---

## 6. 发现的问题

### 问题 1 (Minor) — `useWindow.ts` 死代码过期

**位置**: `src/composables/useWindow.ts:73-76`
**描述**: `broadcastTimerState()` 函数签名缺少 `period` 参数，且未被任何代码引用。App.vue 直接使用 `invoke()` 而非此封装。
**影响**: 无运行时影响，但存在维护隐患（如果未来有人使用该封装会丢失 period 数据）。
**修复**: 更新函数签名以包含 `period` 参数。

### 问题 2 (Minor) — mini-timer.html 初始时段硬编码

**位置**: `public/mini-timer.html:146-148`
**描述**: 初始显示使用硬编码时段范围 (6-11/11-17/17-21)，而主窗口使用用户可配置的范围。在首次广播到达前，小窗口背景可能与主窗口不一致。
**影响**: 仅影响首帧显示（<1 秒），首次广播后自动修正。
**风险评估**: 低 — 用户几乎不可感知。

### 问题 3 (Minor) — idle 状态下时段背景不更新

**位置**: `src/App.vue:692-702` watch 逻辑
**描述**: 当 timer 处于 idle 状态时，`startMiniBroadcast()` 不会启动，意味着即使跨越了时段边界（如 6:00 AM night→morning），mini-timer 的背景也不会更新，直到下一次 timer 状态变化。
**影响**: timer idle 时小窗口时段背景可能过时。由于 idle 状态显示 "--:--"，用户关注点较低。
**风险评估**: 低。

---

## 7. 结论

| 级别 | 数量 |
|------|------|
| P0 (Critical) | 0 |
| P1 (Medium) | 0 |
| P2 (Minor) | 3 |

**核心功能（数据同步、claim-reward、时段背景、状态切换）全部通过验证。** 发现的 3 个问题均为低优先级，不影响核心用户体验。

建议仅修复问题 1（死代码更新），问题 2 和 3 可在后续迭代中处理。
