# Slice 3.2 测试报告 — 习惯打卡系统

**日期:** 2026-04-26
**测试范围:** HabitPanel.vue, stores/habit.ts, types/habit.ts, App.vue
**测试方法:** 4 轮代码审查（逻辑/边界/UI/持久化）

---

## 测试轮次总结

| 轮次 | 类型 | 发现问题数 |
|------|------|-----------|
| Round 1: 代码逻辑审查 | Store + 组件逻辑 | 5 |
| Round 2: 边界条件测试 | 日历、streak、状态切换 | 4 |
| Round 3: UI/UX 审查 | 样式、交互、动画 | 4 |
| Round 4: 持久化与兼容性 | 旧数据、共享状态 | 3 |
| **合计** | | **16** |

---

## 问题列表

### P0 — 必须修复（功能缺陷）

#### BUG-01: `usePet()` 的 bubble 状态是全局共享的，HabitPanel 直接写入会覆盖首页气泡
- **文件:** `src/components/HabitPanel.vue:257-258`
- **描述:** `usePet()` 内部的 `showBubble` / `bubbleText` 是模块级单例 ref。HabitPanel 中直接设置 `bubbleText.value = text` 和 `showBubble.value = true`，会与 App.vue 首页的宠物气泡冲突。如果用户从首页切到习惯页再切回来，首页气泡可能残留习惯页的文案。
- **影响:** 首页和习惯页宠物对话互相干扰。
- **修复:** 组件内使用独立的 `localBubbleText` / `localShowBubble` ref，不修改 usePet 的全局状态。

#### BUG-02: 日历月份导航没有边界保护，`calMonth` 可变为 -1 或 13
- **文件:** `src/components/HabitPanel.vue:111-113`
- **描述:** `calMonth--` 和 `calMonth++` 没有联动 `calYear`。当 `calMonth` 变为 -1 或 12 时，`new Date(calYear, calMonth, 1)` 仍然能正确计算（JS Date 自动进位），但显示的月份标题会变成 "2026年0月" 或 "2026年13月"。
- **影响:** 月份溢出时标题显示异常。
- **修复:** `calMonth--` 时如果变为 -1 则设为 11 并 `calYear--`；`calMonth++` 时如果变为 12 则设为 0 并 `calYear++`。

#### BUG-03: `completedToday` 使用模块级 `today` 常量，跨天不更新
- **文件:** `src/stores/habit.ts:14,20-22`
- **描述:** `const today = new Date().toISOString().slice(0, 10)` 在模块加载时计算一次，之后永不更新。如果用户在 23:59 打开应用，过了午夜后 `today` 仍是昨天的日期，导致 `completedToday` 计算错误。
- **影响:** 跨天后打卡数据不正确。
- **修复:** 将 `today` 改为 computed，或在每次使用时实时计算。

### P1 — 应该修复（体验问题）

#### BUG-04: `recalcStreak` 只计算从最近日期往前的连续天数，不考虑今天
- **文件:** `src/stores/habit.ts:119-142`
- **描述:** `recalcStreak` 从 `sorted[0]`（最晚日期）开始向前数连续天数。如果今天是 4/26，最近一次打卡是 4/25，那 `sorted[0]` = '2026-04-25'，streak 会从 4/25 开始算。这意味着如果今天还没打卡但之前有连续打卡，streak 会从昨天开始算，而不是 0。这在语义上可能有歧义。
- **影响:** 今天未打卡时 streak 可能仍显示旧值而非 0。
- **修复:** 可选 — 根据产品意图决定。如果 streak 含义是「当前正在进行的连续」，未打卡应为 0。如果含「历史最长连续到最近的」，当前逻辑可以接受。

#### BUG-05: `isPartialToday` 判断为 true 时，「全部完成」按钮不禁用
- **文件:** `src/components/HabitPanel.vue:141,144`
- **描述:** 当今日状态为 'partial' 时，`isDoneToday` = false（「全部完成」可点击），`isPartialToday` = true（「部分完成」禁用）。但点击「全部完成」后，store 的 `checkIn()` 会找到已有记录并更新 status 为 'done'，这是正确行为。但按钮逻辑看起来应该是：已完成→两个都禁用，部分→只能点全部完成，未打卡→两个都能点。当前逻辑正确但不够直观。
- **影响:** 轻微 UX 问题。
- **修复:** 无需修改，当前行为正确。

#### BUG-06: 气泡对话在打卡后不会更新
- **文件:** `src/components/HabitPanel.vue:254-260`
- **描述:** `watch(selectedHabit)` 只在切换选中习惯时触发。用户在详情页打卡后，streak 变化但气泡文案不会刷新，仍显示进入详情时的文案。
- **影响:** 打卡后气泡文案不更新。
- **修复:** 额外 watch `isDoneToday` 和 `isPartialToday`，打卡后更新气泡。

#### BUG-07: `calCells` 的 computed 中使用 `selectedHabit.value!.id` 非空断言
- **文件:** `src/components/HabitPanel.vue:246`
- **描述:** `calCells` 在 `selectedHabit` 为 null 时也会被 Vue computed 计算（虽然 template 中不会访问）。如果 `selectedHabit` 为 null，`selectedHabit.value!.id` 会抛出运行时错误。
- **影响:** Vue computed 内部求值时可能报错。
- **修复:** 在 `calCells` 开头加 `if (!selectedHabit.value) return []`。

#### BUG-08: 详情视图日历点击"部分完成"状态再点击应回到"未打卡"，但实际走的是 `removeDayCheckIn` 后 `recalcStreak`
- **文件:** `src/stores/habit.ts:110-117`
- **描述:** `removeDayCheckIn` 会删除 checkin 记录并重新计算 streak。如果用户删除的是最近的打卡记录，streak 会从中间某天重新算起。这个行为是正确的，但 `recalcStreak` 中 `new Date(sorted[0])` 解析 YYYY-MM-DD 格式时可能有 UTC 时区问题（与 Slice 2.2 中修复的同类 bug）。
- **影响:** 在 UTC+8 时区，`new Date('2026-04-25')` 可能被解析为 `2026-04-24T16:00:00Z`，导致 `toISOString().slice(0,10)` 返回 '2026-04-24'。
- **修复:** 使用 `new Date(sorted[0] + 'T00:00:00')` 避免时区偏移。

### P2 — 建议修复（代码质量）

#### BUG-09: `petStore` import 了但只在 `mood` computed 中使用
- **文件:** `src/components/HabitPanel.vue:183,191`
- **描述:** `usePetStore()` 被导入和实例化，仅用于 `const mood = computed(() => petStore.currentPet?.mood || 'normal')`。这是 `usePetAnimation` 的必要参数，不算真正的浪费。
- **影响:** 无。
- **修复:** 无需修改。

#### BUG-10: 列表视图中已打卡习惯仍然显示勾选框可点击（无视觉反馈）
- **文件:** `src/components/HabitPanel.vue:31-36`
- **描述:** 已打卡习惯的勾选框有 `if (isCheckedToday(h)) return` 守卫，点击后不会重复打卡。但视觉上已打卡的绿色勾选框点击时没有任何反馈（没有 cursor 提示不可点击）。
- **影响:** 轻微 UX 问题。
- **修复:** 给 `.check-btn.checked` 添加 `cursor: default`。

#### BUG-11: `.action-section` CSS 声明了两次
- **文件:** `src/components/HabitPanel.vue:790-801`
- **描述:** `.action-section` 选择器出现了两次（lines 790-794 和 796-801），第一次设置了 padding 和 border-top，第二次设置了 flexbox 布局。虽然 CSS 合并后功能正确，但代码冗余。
- **影响:** 代码可读性。
- **修复:** 合并为一个声明块。

#### BUG-12: 缺少 `every_n_days` 频率的配置 UI
- **文件:** `src/components/HabitPanel.vue:58-63`
- **描述:** 下拉菜单有「每N天」和「自定义」选项，但选择后没有输入 N 值或选择星期的 UI。`frequencyConfig` 永远不会被设置。
- **影响:** 用户选择「每N天」后无法配置间隔天数，习惯以 `frequencyConfig: undefined` 保存，`todayHabits` 过滤时不包含这类习惯。
- **修复:** 至少在选择「每N天」时显示一个数字输入框。或者简化为只支持「每日」和「工作日」两种频率。

#### BUG-13: `test-suite.ts` 中的 habit 测试数据不匹配新接口
- **文件:** `src/services/storage/test-suite.ts:107`
- **描述:** `storage.save('habits', { id: 'habit-1', name: 'Read', streak: 0 })` 缺少 `completed`、`bestStreak`、`checkins`、`userId`、`note`、`frequency`、`createdAt` 等必填字段。
- **影响:** 测试数据不完整，但测试只验证通用存储功能，不影响核心逻辑。
- **修复:** 补全测试数据。

#### BUG-14: 列表视图缺少「每N天」和「自定义星期」习惯的今日过滤逻辑
- **文件:** `src/stores/habit.ts:16-18`
- **描述:** `todayHabits` 只过滤 `daily` 和 `weekdays`，不处理 `every_n_days` 和 `custom_days` 频率的习惯。但 `completedToday` 统计的是所有习惯中今日有 checkin 的数量，而非 `todayHabits` 中有 checkin 的数量。
- **影响:** 进度条显示的是「所有习惯中今日打卡数/所有习惯总数」，但 `todayHabits` 没被使用。对于 `every_n_days` 的习惯，不需要每天打卡，但仍然计入分母。
- **修复:** 可选 — 统一进度计算口径，或排除非每日习惯。

#### BUG-15: 打卡后没有动画反馈
- **文件:** `src/components/HabitPanel.vue`
- **描述:** 点击勾选框打卡后，勾选框瞬间从空心变为绿色实心，没有过渡动画。
- **影响:** 体验略显生硬。
- **修复:** 可选 — 添加缩放过渡动画。

#### BUG-16: `checkIn` store 方法的 streak 计算只检查昨天，不处理多日空缺后重新打卡的情况
- **文件:** `src/stores/habit.ts:84-88`
- **描述:** 新打卡时只判断 `hasYesterday`，如果昨天没���卡就设 streak=1。这是正确行为——断连后 streak 重置。
- **影响:** 功能正确。
- **修复:** 无需修改。

---

## 修复优先级

| 优先级 | Bug ID | 描述 |
|--------|--------|------|
| P0 | BUG-01 | 气泡状态全局冲突 |
| P0 | BUG-02 | 日历月份溢出 |
| P0 | BUG-03 | `today` 跨天不更新 |
| P1 | BUG-06 | 打卡后气泡不刷新 |
| P1 | BUG-07 | calCells 非空断言 |
| P1 | BUG-08 | recalcStreak 时区问题 |
| P2 | BUG-10 | 勾选框 cursor |
| P2 | BUG-11 | CSS 重复声明 |
| P2 | BUG-12 | 频率配置 UI 缺失 |
| P2 | BUG-13 | 测试数据不完整 |

---

## 本轮修复计划

**P0 全部修复 + P1 全部修复 + P2 关键项**

| Bug | 修复方案 |
|-----|---------|
| BUG-01 | 组件内使用独立 bubble ref，不污染 usePet 全局状态 |
| BUG-02 | calMonth 加减时联动 calYear 进退位 |
| BUG-03 | `today` 改为每次实时计算 |
| BUG-06 | watch isDoneToday/isPartialToday 更新气泡 |
| BUG-07 | calCells 开头加 null guard |
| BUG-08 | recalcStreak 中用 `T00:00:00` 避免时区偏移 |
| BUG-10 | `.check-btn.checked` 添加 cursor: default |
| BUG-11 | 合并 `.action-section` CSS |
| BUG-13 | 补全测试数据 |
