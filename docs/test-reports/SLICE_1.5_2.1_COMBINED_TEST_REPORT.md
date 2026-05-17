# Slice 1.5 (Pet Growth + Onboarding) & Slice 2.1 (Health Reminder) 综合测试报告

> Date: 2026-04-26
> Scope: Slice 1.5 (宠物成长 + 新手引导) + Slice 2.1 (健康提醒系统)
> Rounds: 5 (Build + TS / Logic / Integration / Data Flow / Regression)

---

## 测试结果概览

| Round | 内容 | 状态 |
|-------|------|------|
| 1 | Build + TypeScript 编译 | PASS - 83 modules, 零错误 |
| 2 | 健康提醒逻辑深度分析 | 发现 4 P0 / 6 P1 / 6 P2 |
| 3 | 组件集成检查 | 发现 0 P0 / 4 P1 / 10 P2 |
| 4 | 数据流与 Store 一致性 | 发现 3 P0 / 4 P1 / 5 P2 |
| 5 | 回归测试 (build + vue-tsc) | PASS - 零错误 |

---

## P0 关键问题 (共 5 个)

### P0-1: health.ts 中 `today` 变量在 store 创建时固定

**文件:** `src/stores/health.ts:19`
**问题:** `const today = new Date().toISOString().slice(0, 10)` 是普通 const，只在执行时计算一次。如果 app 跨过午夜，所有健康记录都关联到错误的日期。
**影响:** 跨午夜后，`todayRecord`, `todayWaterCount`, `todayExerciseCount`, `todayEyeRestCount` 都返回前一天的数据。

### P0-2: `'later'` 响应错误地递增健康记录计数

**文件:** `src/composables/useHealthReminder.ts:119-137`
**问题:** `respond('later')` 和 `respond('done')` 走相同 switch 路径，都调用 `healthStore.recordWater()` 等。"稍后"应该只隐藏弹窗，不应记录完成。
**影响:** 喝水/运动/休息计数虚增。

### P0-3: pomodoro.ts 的 `streak` 和 `lastCompletedDate` 未持久化

**文件:** `src/stores/pomodoro.ts`
**问题:** `load()` 只从历史记录重建 `todayCompleted`，不重建 `streak` 和 `lastCompletedDate`。这两字段只在 `completePomodoro()` 时设置，app 关闭后丢失。
**影响:** 每次重启 app，连续天数统计归零。

### P0-4: 健康提醒 reward 的金币未持久化

**文件:** `src/composables/useHealthReminder.ts:119-121`
**问题:** `respond()` 调用 `userStore.addCoins(5)` 但从未调用 `userStore.save()`。
**影响:** 健康提醒赚取的金币在 app 关闭后丢失。

### P0-5: health.ts `recordSleepReminder` 对 'later' 也递增计数

**文件:** `src/stores/health.ts:82-86`
**问题:** `sleepReminderCount` 无论 'done' 还是 'later' 都递增。
**影响:** 睡眠提醒统计不准确。

---

## P1 重要问题 (共 8 个)

| # | 文件 | 问题 |
|---|------|------|
| P1-1 | useHealthReminder.ts:152-156 | `sessionStart` 在 timer 停止时不重置，eye rest 计时从第一次开始一直累计 |
| P1-2 | useHealthReminder.ts:48-49 | `lastWaterPomCount`/`lastExercisePomCount` 是局部变量，composable 销毁重建后丢失 |
| P1-3 | useHealthReminder.ts:59-62 | 同一 pomodoro 同时触发 water + exercise 时，第二个被静默丢弃 |
| P1-4 | App.vue:256/277 | `showGreeting()` 可能被双重调用 (watch + onMounted) |
| P1-5 | App.vue:260-273 | `levelUpTimer` 在组件卸载时不清理 (Vue 警告) |
| P1-6 | pomodoro.ts:92-100 | Streak 计算依赖未持久化的 lastCompletedDate，导致连续计算总是重置 |
| P1-7 | health.ts `load()` | `stats` 从过期的 `todayRecord` 同步，与 P0-1 问题联动 |
| P1-8 | PetSprite.vue:72 | watch 不监听 size 变化，切换尺寸后不重绘 |

---

## P2 次要问题 (共 10 个 - 选取主要)

| # | 文件 | 问题 |
|---|------|------|
| P2-1 | types/health.ts | `ReminderConfig` 接口定义但从未使用 (死代码) |
| P2-2 | useHealthReminder.ts:115-140 | "later" 按钮暗示延迟重新弹出但永远不再来 |
| P2-3 | App.vue | `wizardStep` 在宠物创建后不重置 (不影响功能) |
| P2-4 | PetSprite.vue | `onMounted` draw 与 watch `{immediate: true}` 重复 |
| P2-5 | App.vue | 物种行为间隔 (25s) 即使 timer 运行中也不暂停检查 |
| P2-6 | pet.ts | `selectPet()` 串行保存所有宠物，性能优化空间 |
| P2-7 | App.vue | 初始 petLevel > 1 时可能错误触发升级动画 (1 → 实际等级) |
| P2-8 | HealthReminderDialog | `position: absolute` 依赖父元素定位 |
| P2-9 | useHealthReminder.ts:174 | `computed(() => ref.value)` 不必要包装 |
| P2-10 | pomodoro.ts | `timerState = 'completed'` 在 pomodoro store 和 useTimer 都设置 |

---

## 修复计划

本次修复将处理 P0 全部 (5个) + P1 全部 (8个)。P2 作为后续优化。

---

## 修复记录

### 已修复

| Issue | 修改文件 | 修复内容 |
|-------|---------|---------|
| P0-1 | `src/stores/health.ts` | `today` 改为 `ref` + 60s 定时器检查日期变化 (`destroy()` 方法清理) |
| P0-2 | `src/composables/useHealthReminder.ts` | `respond()` 中 switch 移到 `if (response === 'done')` 块内，只有 "done" 才记录完成 |
| P0-3 | `src/stores/pomodoro.ts` | 新增 `save()`/`loadState()` 方法持久化 `streak`, `lastCompletedDate`, `loopCompleted` 等状态；`load()` 从历史记录重建 streak |
| P0-4 | `src/composables/useHealthReminder.ts` | `respond()` 中 `addCoins(5)` 后增加 `await userStore.save()` |
| P0-5 | `src/composables/useHealthReminder.ts` | 作为 P0-2 修复的附带效果，`recordSleepReminder` 只对 'done' 调用 |
| P0-5 | `src/stores/health.ts` | `recordSleepReminder` 的 `sleepReminderCount` 只在 'done' 时递增 |
| P1-1 | `src/composables/useHealthReminder.ts` | timerState watcher 增加 idle/completed/break 时重置 `sessionStart = null` |
| P1-2 | - | 保持原样：composable 在 App.vue setup 只调用一次，变量不会意外丢失 |
| P1-3 | `src/composables/useHealthReminder.ts` | 新增 `pendingReminder` 队列，同时触发两个提醒时第二个排队等待第一个完成 |
| P1-4 | `src/App.vue` | 移除 `onMounted` 中的重复 `showGreeting()` 调用 |
| P1-5 | `src/App.vue` | `onUnmounted` 中增加 `levelUpTimer` 清理 |
| P1-6 | `src/stores/pomodoro.ts` | 通过 `load()` 从历史记录重建 streak 和 `lastCompletedDate` |
| P1-7 | `src/stores/health.ts` | 作为 P0-1 修复的附带效果，`todayRecord` 现在是响应式的 |
| P1-8 | `src/components/Pet/PetSprite.vue` | watch 增加 `() => props.size` 依赖，size 改变后重绘 |
| P2-4 | `src/components/Pet/PetSprite.vue` | 移除冗余的 `onMounted` draw 调用 |
| P2-7 | `src/App.vue` | 增加 `petLevelWatchReady` flag 防止首次加载误触发升级动画 |

### 新增文件/存储

| 变更 | 说明 |
|------|------|
| `pomodoro_state` IndexedDB store | 新增存储，持久化 streak/lastCompletedDate/loopCompleted/loopTarget/mode |
| `src/services/storage/schema.ts` | 注册 `pomodoro_state` store |
| `src/services/storage/index.ts` | `getAllData()` 包含 `pomodoro_state` |
| `src/main.ts` | 初始化时调用 `pomodoroStore.loadState()` |
| `docs/test-reports/SLICE_1.5_2.1_COMBINED_TEST_REPORT.md` | 本报告 |

### 最终验证

- [x] `npm run build` 通过 - 83 modules, 零 TypeScript 错误
- [x] `vue-tsc --noEmit` 通过
