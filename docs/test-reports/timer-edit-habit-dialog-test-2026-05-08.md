# 全量测试报告：专注时间双击编辑 + 习惯创建弹窗

**日期**: 2026-05-08
**范围**: App.vue 专注/休息时间双击编辑、HabitPanel.vue 创建弹窗、死代码清理
**测试轮数**: 5 轮

---

## 1. 测试范围

| 文件 | 变更类型 |
|------|---------|
| `src/App.vue` | 新增双击编辑专注/休息时间（editingFocus/editingBreak + input） |
| `src/components/HabitPanel.vue` | 新增「+」按钮 + 创建弹窗，删除底部创建栏，清理死 CSS |

---

## 2. Round 1 — 专注/休息双击编辑数据流

### 场景 A: 双击专注时间 → 输入 → 回车

```
dblclick "25" → startEditFocus() → focusInput=25, editingFocus=true, input 出现, focus()+select()
type "45" → focusInput=45
Enter → confirmFocusInput() → isNaN(45)?否 → Math.round(45)=45 → Math.max(5,Math.min(120,45))=45
→ localFocus=45, editingFocus=false → span 显示 "45"
```

**结果: 通过**

### 场景 B: 双击休息时间 → 输入 → 失焦

```
dblclick "5" → startEditBreak() → breakInput=5, editingBreak=true
type "15" → breakInput=15
blur → confirmBreakInput() → Math.max(1,Math.min(30,15))=15 → localBreak=15
```

**结果: 通过**

### 场景 D: 状态持久化

```
编辑 focus=45 → 点击开始 → startWithSettings()
→ settingsStore.updateSetting('workDuration', 45)  // 同步赋值
→ startTimer() → settingsStore.settings.workDuration*60 = 2700秒
下次加载 → localFocus = settingsStore.settings.workDuration = 45
```

**结果: 通过**

### 场景 E: 编辑中点击 +/- 按钮

+/- 按钮修改 localFocus（非 focusInput），编辑确认时 focusInput 覆盖 localFocus。
不影响功能，用户编辑完毕后 +/- 的中间修改会被丢弃。

**结果: 通过（已知行为，非 Bug）**

---

## 3. Round 2 — HabitPanel 弹窗创建全流程

### 场景 A: 弹窗打开/关闭

| 操作 | 结果 |
|------|------|
| 点击「+」按钮 | showCreateDialog=true → 弹窗出现 ✅ |
| 点击遮罩背景 | @click.self → showCreateDialog=false → 关闭 ✅ |
| 点击「取消」 | showCreateDialog=false → 关闭 ✅ |

### 场景 B: 创建每日习惯

```
输入 "跑步" → dialogName="跑步"
点击 "添加" → handleDialogAdd() → habitStore.addHabit("跑步","daily","",undefined)
→ 重置 dialogName/dialogFreq/dialogNDays/dialogCustomDays → 关闭弹窗
```

**结果: 通过**

### 场景 C: 创建指定日期习惯

```
选择 "指定日期" → dialogFreq="custom_days" → 星期按钮出现
不选任何天 → 点击"添加" → dialogCustomDays.length===0 → return（不创建）✅
选 周一(1),周三(3),周五(5) → dialogCustomDays=[1,3,5]
点击"添加" → freqConfig={customDays:[1,3,5]} → habitStore.addHabit(...)  ✅
```

**结果: 通过**

### 场景 D: 创建每N天习惯

```
选择 "每N天" → dialogFreq="every_n_days" → N 输入框出现（默认 2）
输入 7 → dialogNDays=7
点击"添加" → freqConfig={nDays:7} → habitStore.addHabit(...)  ✅
```

**结果: 通过**

### 场景 E: 验证

| 检查项 | 结果 |
|--------|------|
| 空名称 → 按钮禁用 | ✅ `:disabled="!dialogName.trim()"` |
| 纯空格名称 → 按钮禁用 | ✅ `.trim()` 返回空 |
| 成功后重置所有字段 | ✅ dialogName/dialogFreq/dialogNDays/dialogCustomDays 全部重置 |

---

## 4. Round 3 — 边界值与异常输入

### 专注时间边界值

| 输入 | Math.round | isNaN? | Math.max(5,min(120,...)) | 结果 |
|------|-----------|--------|--------------------------|------|
| 0 | 0 | 否 | max(5,0) = **5** | ✅ 正确钳制到最小值 |
| 200 | 200 | 否 | min(120,200) = **120** | ✅ 正确钳制到最大值 |
| -10 | -10 | 否 | max(5,-10) = **5** | ✅ |
| NaN (清空) | NaN | **是** → 回退 25 | max(5,25) = **25** | ✅ |
| 2.5 | 3 | 否 | **3** → max(5,3) = **5** | ✅ |

### 休息时间边界值

| 输入 | 结果 | 正确 |
|------|------|------|
| 0 | max(1,0) = **1** | ✅ |
| 50 | min(30,50) = **30** | ✅ |
| NaN | 回退 5 → **5** | ✅ |

---

## 5. Round 4 — CSS 清理验证

### 删除的死 CSS（约 111 行）

| CSS 类 | 原行号 | 模板中引用 | 状态 |
|--------|--------|-----------|------|
| `.add-area` | 629-635 | 无 | **已删除** |
| `.add-input` + `:focus` | 637-650 | 无 | **已删除** |
| `.freq-dropdown-wrapper` | 652-655 | 无 | **已删除** |
| `.freq-btn` + `:hover` | 666-679 | 无 | **已删除** |
| `.freq-dropdown` + 子选择器 | 681-712 | 无 | **已删除** |
| `.btn-add` + 修饰符 | 714-729 | 无 | **已删除** |
| `.freq-config-row` | 732-739 | 无 | **已删除** |

### 保留的 CSS（弹窗仍在使用）

| CSS 类 | 模板引用位置 |
|--------|-------------|
| `.freq-overlay` | 弹窗频率下拉遮罩 |
| `.freq-config-label` | 弹窗 N 天配置标签 |
| `.freq-num-input` | 弹窗 N 天输入框 |
| `.day-pill` + `.active` | 弹窗星期选择按钮 |

---

## 6. Round 5 — 跨组件回归测试

| 检查项 | 结果 |
|--------|------|
| `useTimer.ts` startTimer() 正确读取 settingsStore | ✅ updateSetting 同步赋值，startTimer 读到新值 |
| `settings.ts` 持久化 workDuration/breakDuration | ✅ reactive 赋值同步 + async save |
| `habitStore.addHabit()` 参数匹配 | ✅ 签名 (name, frequency, note, frequencyConfig?) 完全匹配 |
| 狗/猫精灵动画未受影响 | ✅ 无文件变更 |
| 宠物商店未受影响 | ✅ 无文件变更 |

---

## 7. 发现并修复的问题

### Bug 1 (P2) — 输入 0 时 `||` 运算符跳过最小值钳制

**位置**: `src/App.vue` confirmFocusInput / confirmBreakInput
**问题**: `Math.round(0) || 25` → 0 是 falsy → 回退到 25（默认值），而不是 Math.max 钳制到 5
**修复**: 改用 `isNaN(raw) ? 25 : Math.round(raw)` — 只在 NaN 时回退，0 交给 Math.max 处理
**修复后**: 输入 0 → max(5, 0) = 5 ✅

### Bug 2 (P2) — 双击后输入框未获取焦点

**位置**: `src/App.vue` startEditFocus / startEditBreak
**问题**: `nextTick(() => focusInputRef.value?.select())` 只选中文字但未 focus，用户无法直接打字
**修复**: 改为 `nextTick(() => { focusInputRef.value?.focus(); focusInputRef.value?.select() })`

### Bug 3 (P3) — HabitPanel 约 111 行死 CSS

**位置**: `src/components/HabitPanel.vue` CSS 部分
**问题**: 删除底部创建栏后，.add-area/.add-input/.freq-btn/.freq-dropdown/.btn-add/.freq-config-row 等样式不再使用
**修复**: 删除全部死 CSS，保留弹窗仍在使用的 .freq-overlay/.freq-config-label/.freq-num-input/.day-pill

---

## 8. 结论

| 级别 | 数量 | 全部已修复 |
|------|------|-----------|
| P0 (Critical) | 0 | — |
| P1 (Medium) | 0 | — |
| P2 (Minor) | 2 | ✅ |
| P3 (Info) | 1 | ✅ |

**核心功能（双击编辑、弹窗创建、边界值处理、状态持久化）全部通过验证。** 发现 2 个 P2 级 Bug（0 值处理、focus 缺失）和 1 个 P3 级清理（死 CSS），均已修复。
