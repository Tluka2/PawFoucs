<template>
  <div class="habit-panel">
    <!-- ===== 视图 A: 习惯列表 ===== -->
    <template v-if="!selectedHabit">
      <div class="habit-header">
        <span class="habit-title"><AppIcon name="habit" :size="18" /> 习惯打卡</span>
        <button class="btn-create-fab" @click="showCreateDialog = true">+</button>
      </div>

      <!-- 今日进度 -->
      <div class="progress-bar-section">
        <div class="progress-text">
          今日 <span class="progress-done">{{ habitStore.completedToday }}</span>/{{ habitStore.todayHabits.length }} 已完成
          <span v-if="habitStore.longestStreak > 0" class="streak-badge"><AppIcon name="flame" :size="14" />{{ habitStore.longestStreak }}连击</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- 习惯列表 -->
      <div class="habit-list">
        <div v-if="habitStore.habits.length === 0" class="habit-empty">
          还没有习惯，快来添加一个吧~
        </div>
        <div
          v-for="habit in habitStore.habits"
          :key="habit.id"
          class="habit-card"
          :class="{ done: isCheckedToday(habit), 'not-today': !habitStore.isTodayActive(habit) }"
        >
          <button
            class="check-btn"
            :class="{ checked: isCheckedToday(habit) }"
            @click.stop="quickCheckIn(habit)"
          >
            <AppIcon v-if="isCheckedToday(habit)" name="check" :size="14" />
          </button>
          <div class="habit-info" @click="selectedHabit = habit">
            <div class="habit-name" :class="{ 'line-through': isCheckedToday(habit) }">{{ habit.name }}</div>
            <div class="habit-meta">
              {{ freqLabel(habit.frequency, habit.frequencyConfig) }}
              <span v-if="habit.streak > 0"> · <AppIcon name="flame" :size="12" />{{ habit.streak }}天</span>
              <span v-if="!habitStore.isTodayActive(habit)" class="not-today-tag"> · 今日免打卡</span>
            </div>
          </div>
          <button class="btn-detail" @click="selectedHabit = habit">详情</button>
        </div>
      </div>

      <div class="habit-footer">
        共 {{ habitStore.habits.length }} 个习惯
      </div>
    </template>

    <!-- ===== 视图 B: 习惯详情 ===== -->
    <template v-else>
      <!-- 顶部导航 -->
      <div class="detail-header">
        <button class="btn-back" @click="selectedHabit = null">← 返回</button>
        <span class="detail-title">习惯详情</span>
      </div>

      <!-- 宠物 + 对话气泡 -->
      <div class="pet-section">
        <PetSprite
          :pet-type="petType"
          :animation-state="animation.currentState.value"
          :frame-index="animation.currentFrame.value"
          size="sm"
        />
        <Transition name="bubble">
          <div v-if="localShowBubble" class="pet-bubble">{{ localBubbleText }}</div>
        </Transition>
      </div>

      <!-- 习惯信息 -->
      <div class="info-section">
        <div class="info-name">{{ selectedHabit.name }}</div>
        <div class="info-freq">{{ freqLabel(selectedHabit.frequency, selectedHabit.frequencyConfig) }}</div>
        <div class="info-cards">
          <div class="info-card">
            <div class="info-card-label">当前连续</div>
            <div class="info-card-value">{{ selectedHabit.streak }} <small>天</small></div>
          </div>
          <div class="info-card">
            <div class="info-card-label">历史最高</div>
            <div class="info-card-value">{{ selectedHabit.bestStreak }} <small>天</small></div>
          </div>
        </div>
      </div>

      <!-- 打卡日历 -->
      <div class="calendar-section">
        <div class="cal-header">
          <button class="cal-nav" @click="prevMonth"><AppIcon name="chevronLeft" :size="14" /></button>
          <span class="cal-title">{{ calYear }}年{{ calMonth + 1 }}月</span>
          <button class="cal-nav" @click="nextMonth"><AppIcon name="chevronRight" :size="14" /></button>
        </div>
        <div class="cal-grid">
          <div class="cal-weekday" v-for="d in ['一','二','三','四','五','六','日']" :key="d">{{ d }}</div>
          <div
            v-for="(cell, idx) in calCells"
            :key="idx"
            class="cal-day"
            :class="{
              empty: !cell,
              'cal-done': cell && cell.status === 'done',
              'cal-partial': cell && cell.status === 'partial',
              'cal-today': cell && cell.date === todayStr,
            }"
            :title="cell ? (cell.date > todayStr ? '未来日期不可编辑' : cell.status === 'done' ? '已达标，点击切换' : cell.status === 'partial' ? '部分完成，点击切换' : '点击打卡') : ''"
            @click="cell && onCalDayClick(cell)"
          >
            <span v-if="cell">{{ cell.day }}</span>
          </div>
        </div>
        <div class="cal-legend">
          <span class="legend-item"><span class="legend-dot cal-done"></span>达标</span>
          <span class="legend-item"><span class="legend-dot cal-partial"></span>部分</span>
          <span class="legend-item"><span class="legend-dot"></span>未打卡</span>
        </div>
      </div>

      <!-- 操作区 -->
      <div class="action-section">
        <button
          class="btn-checkin-primary"
          :class="{ 'cancel-state': isDoneToday }"
          @click="doCheckIn('done')"
        >
          {{ isDoneToday ? '取消打卡' : '全部完成' }}
        </button>
        <button
          class="btn-checkin-secondary"
          :class="{ 'cancel-state': isPartialToday }"
          @click="doCheckIn('partial')"
        >
          {{ isPartialToday ? '取消打卡' : '部分完成' }}
        </button>
        <div class="action-btns">
          <button class="btn-edit" @click="showEditDialog = true">编辑</button>
          <button class="btn-delete" @click="confirmDelete">删除</button>
        </div>
      </div>

      <!-- 编辑弹窗 -->
      <div v-if="showEditDialog" class="dialog-overlay" @click.self="showEditDialog = false">
        <div class="dialog-inner">
          <div class="dialog-title">编辑习惯</div>
          <input v-model="editName" class="dialog-input" placeholder="习惯名称" maxlength="30" />
          <textarea v-model="editNote" class="dialog-textarea" placeholder="备注（选填）" rows="2" maxlength="200"></textarea>
          <div class="dialog-freq-section">
            <button v-if="editFreqMenu" class="freq-overlay" @click="editFreqMenu = false"></button>
            <button class="dialog-freq-btn" @click="editFreqMenu = !editFreqMenu">{{ freqLabel(editFreq) }} ▾</button>
            <div v-if="editFreqMenu" class="dialog-freq-dropdown">
              <button @click="editFreq = 'daily'; editFreqMenu = false">每日</button>
              <button @click="editFreq = 'weekdays'; editFreqMenu = false">工作日</button>
              <button @click="editFreq = 'every_n_days'; editFreqMenu = false">每N天</button>
              <button @click="editFreq = 'custom_days'; editFreqMenu = false">指定日期</button>
            </div>
          </div>
          <div v-if="editFreq === 'every_n_days'" class="dialog-freq-config">
            <span class="freq-config-label">每</span>
            <input type="number" v-model.number="editNDays" class="freq-num-input" min="1" max="30" />
            <span class="freq-config-label">天打卡一次</span>
          </div>
          <div v-if="editFreq === 'custom_days'" class="dialog-freq-config">
            <button
              v-for="(d, idx) in ['日','一','二','三','四','五','六']"
              :key="idx"
              class="day-pill"
              :class="{ active: editCustomDays.includes(idx) }"
              @click="toggleEditDay(idx)"
            >{{ d }}</button>
          </div>
          <div class="dialog-btns">
            <button class="btn-dialog-cancel" @click="showEditDialog = false">取消</button>
            <button class="btn-dialog-ok" @click="saveEdit">保存</button>
          </div>
        </div>
      </div>

      <!-- 删除确认 -->
      <div v-if="deletePending" class="dialog-overlay" @click.self="deletePending = false">
        <div class="dialog-inner">
          <div class="dialog-title">确认删除？</div>
          <div class="dialog-hint">删除后无法恢复，所有打卡记录将丢失。</div>
          <div class="dialog-btns">
            <button class="btn-dialog-cancel" @click="deletePending = false">取消</button>
            <button class="btn-dialog-delete" @click="doDelete">删除</button>
          </div>
        </div>
      </div>
    </template>

    <!-- 创建习惯弹窗 -->
    <div v-if="showCreateDialog" class="dialog-overlay" @click.self="showCreateDialog = false">
      <div class="dialog-inner">
        <div class="dialog-title">添加新习惯</div>
        <input v-model="dialogName" class="dialog-input" placeholder="习惯名称..." maxlength="30" @keydown.enter="handleDialogAdd" />
        <div class="dialog-freq-section">
          <button v-if="dialogFreqMenu" class="freq-overlay" @click="dialogFreqMenu = false"></button>
          <button class="dialog-freq-btn" @click="dialogFreqMenu = !dialogFreqMenu">{{ freqLabel(dialogFreq) }} ▾</button>
          <div v-if="dialogFreqMenu" class="dialog-freq-dropdown">
            <button @click="dialogFreq = 'daily'; dialogFreqMenu = false">每日</button>
            <button @click="dialogFreq = 'weekdays'; dialogFreqMenu = false">工作日</button>
            <button @click="dialogFreq = 'every_n_days'; dialogFreqMenu = false">每N天</button>
            <button @click="dialogFreq = 'custom_days'; dialogFreqMenu = false">指定日期</button>
          </div>
        </div>
        <div v-if="dialogFreq === 'every_n_days'" class="dialog-freq-config">
          <span class="freq-config-label">每</span>
          <input type="number" v-model.number="dialogNDays" class="freq-num-input" min="1" max="30" />
          <span class="freq-config-label">天打卡一次</span>
        </div>
        <div v-if="dialogFreq === 'custom_days'" class="dialog-freq-config">
          <button
            v-for="(d, idx) in ['日','一','二','三','四','五','六']"
            :key="idx"
            class="day-pill"
            :class="{ active: dialogCustomDays.includes(idx) }"
            @click="toggleDialogDay(idx)"
          >{{ d }}</button>
        </div>
        <div class="dialog-btns">
          <button class="btn-dialog-cancel" @click="showCreateDialog = false">取消</button>
          <button class="btn-dialog-ok" @click="handleDialogAdd" :disabled="!dialogName.trim()">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHabitStore } from '@/stores/habit'
import AppIcon from '@/components/AppIcon.vue'
import { usePet } from '@/composables/usePet'
import { usePetAnimation } from '@/composables/usePetAnimation'
import { useSound } from '@/composables/useSound'
import { toLocalDateStr } from '@/utils/date'
import PetSprite from '@/components/Pet/PetSprite.vue'
import type { Habit, CheckInStatus, Frequency, FrequencyConfig } from '@/types/habit'

const habitStore = useHabitStore()
const { petType } = usePet()
const animation = usePetAnimation(petType.value)
const { playCheckInSound } = useSound()

// Local bubble state — independent from App.vue's usePet bubble
const localShowBubble = ref(false)
const localBubbleText = ref('')

if (!habitStore.isLoaded) habitStore.load()

// --- List view state ---
const selectedHabit = ref<Habit | null>(null)

// --- Detail view state ---
const calMonth = ref(new Date().getMonth())
const calYear = ref(new Date().getFullYear())
const showEditDialog = ref(false)
const deletePending = ref(false)
const editName = ref('')
const editNote = ref('')
const editFreq = ref<Frequency>('daily')
const editFreqMenu = ref(false)
const editNDays = ref(2)
const editCustomDays = ref<number[]>([])

function initEditDialog() {
  if (!selectedHabit.value) return
  editName.value = selectedHabit.value.name
  editNote.value = selectedHabit.value.note
  editFreq.value = selectedHabit.value.frequency
  editNDays.value = selectedHabit.value.frequencyConfig?.nDays ?? 2
  editCustomDays.value = [...(selectedHabit.value.frequencyConfig?.customDays ?? [])]
}

// --- Create dialog state ---
const showCreateDialog = ref(false)
const dialogName = ref('')
const dialogFreq = ref<Frequency>('daily')
const dialogFreqMenu = ref(false)
const dialogNDays = ref(2)
const dialogCustomDays = ref<number[]>([])

const todayStr = toLocalDateStr(new Date())

// --- Computed ---
const progressPercent = computed(() => {
  if (habitStore.todayHabits.length === 0) return 0
  return Math.round((habitStore.completedToday / habitStore.todayHabits.length) * 100)
})

const isDoneToday = computed(() => {
  if (!selectedHabit.value) return false
  const ci = selectedHabit.value.checkins.find(c => c.date === todayStr)
  return ci?.status === 'done'
})

const isPartialToday = computed(() => {
  if (!selectedHabit.value) return false
  const ci = selectedHabit.value.checkins.find(c => c.date === todayStr)
  return ci?.status === 'partial'
})

const calCells = computed(() => {
  if (!selectedHabit.value) return []

  const firstDay = new Date(calYear.value, calMonth.value, 1)
  const daysInMonth = new Date(calYear.value, calMonth.value + 1, 0).getDate()
  // Monday = 0 offset
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const cells: { day: number; date: string; status: CheckInStatus | null }[] = []

  for (let i = 0; i < startOffset; i++) {
    cells.push(null as any)
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${calYear.value}-${String(calMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const status = habitStore.getCheckInStatus(selectedHabit.value.id, date)
    cells.push({ day: d, date, status })
  }

  return cells
})

// --- Pet dialog based on streak ---
watch(selectedHabit, (h) => {
  if (!h) return
  updateBubble(h)
})

watch(isDoneToday, () => {
  if (selectedHabit.value) updateBubble(selectedHabit.value)
})

watch(isPartialToday, () => {
  if (selectedHabit.value) updateBubble(selectedHabit.value)
})

let bubbleTimer = 0
function updateBubble(h: Habit) {
  clearTimeout(bubbleTimer)
  localBubbleText.value = getStreakDialog(h)
  localShowBubble.value = true
  bubbleTimer = window.setTimeout(() => { localShowBubble.value = false }, 4000)
}

function getStreakDialog(h: Habit): string {
  const ci = h.checkins.find(c => c.date === todayStr)
  if (ci?.status === 'done') {
    if (h.streak >= 7) return `哇！连续${h.streak}天！你是自律达人！`
    return `太棒了！你已连续${h.streak}天！`
  }
  if (ci?.status === 'partial') return `已经坚持${h.streak}天啦！继续加油~`
  return '今天还没打卡哦，快来开始吧~'
}

// --- Actions ---
function isCheckedToday(h: Habit): boolean {
  return h.checkins.some(c => c.date === todayStr)
}

function quickCheckIn(h: Habit) {
  if (isCheckedToday(h)) {
    habitStore.removeDayCheckIn(h.id, todayStr)
  } else {
    habitStore.checkIn(h.id, 'done')
    playCheckInSound()
  }
}

function handleDialogAdd() {
  if (!dialogName.value.trim()) return
  let freqConfig: FrequencyConfig | undefined
  if (dialogFreq.value === 'every_n_days') {
    freqConfig = { nDays: Math.max(1, Math.min(30, dialogNDays.value || 2)) }
  } else if (dialogFreq.value === 'custom_days') {
    if (dialogCustomDays.value.length === 0) return
    freqConfig = { customDays: [...dialogCustomDays.value] }
  }
  habitStore.addHabit(dialogName.value.trim(), dialogFreq.value, '', freqConfig)
  dialogName.value = ''
  dialogFreq.value = 'daily'
  dialogNDays.value = 2
  dialogCustomDays.value = []
  showCreateDialog.value = false
}

function toggleDialogDay(day: number) {
  const idx = dialogCustomDays.value.indexOf(day)
  if (idx >= 0) dialogCustomDays.value.splice(idx, 1)
  else dialogCustomDays.value.push(day)
}

function toggleEditDay(day: number) {
  const idx = editCustomDays.value.indexOf(day)
  if (idx >= 0) editCustomDays.value.splice(idx, 1)
  else editCustomDays.value.push(day)
}

function doCheckIn(status: CheckInStatus) {
  if (!selectedHabit.value) return
  const ci = selectedHabit.value.checkins.find(c => c.date === todayStr)
  if (ci?.status === status) {
    // 已处于该状态 → 取消打卡
    habitStore.removeDayCheckIn(selectedHabit.value.id, todayStr)
  } else {
    habitStore.checkIn(selectedHabit.value.id, status)
    playCheckInSound()
  }
  // Refresh selectedHabit reference
  const id = selectedHabit.value.id
  selectedHabit.value = habitStore.habits.find(h => h.id === id) || null
}

function onCalDayClick(cell: { day: number; date: string; status: CheckInStatus | null }) {
  if (!selectedHabit.value) return
  if (cell.date > todayStr) return // can't modify future
  if (cell.status === null) {
    habitStore.toggleDayCheckIn(selectedHabit.value.id, cell.date, 'done')
  } else if (cell.status === 'done') {
    habitStore.toggleDayCheckIn(selectedHabit.value.id, cell.date, 'partial')
  } else {
    habitStore.removeDayCheckIn(selectedHabit.value.id, cell.date)
  }
  // Refresh
  const id = selectedHabit.value.id
  selectedHabit.value = habitStore.habits.find(h => h.id === id) || null
}

watch(showEditDialog, (v) => {
  if (v) initEditDialog()
})

function saveEdit() {
  if (!selectedHabit.value || !editName.value.trim()) return
  let freqConfig: FrequencyConfig | undefined
  if (editFreq.value === 'every_n_days') {
    freqConfig = { nDays: Math.max(1, Math.min(30, editNDays.value || 2)) }
  } else if (editFreq.value === 'custom_days') {
    if (editCustomDays.value.length === 0) {
      // 保持原来的 customDays，不改成空
      freqConfig = selectedHabit.value.frequencyConfig
    } else {
      freqConfig = { customDays: [...editCustomDays.value] }
    }
  }
  habitStore.updateHabit(selectedHabit.value.id, {
    name: editName.value.trim(),
    note: editNote.value.trim(),
    frequency: editFreq.value,
    frequencyConfig: freqConfig,
  })
  const id = selectedHabit.value.id
  selectedHabit.value = habitStore.habits.find(h => h.id === id) || null
  showEditDialog.value = false
}

function confirmDelete() {
  deletePending.value = true
}

function doDelete() {
  if (!selectedHabit.value) return
  habitStore.deleteHabit(selectedHabit.value.id)
  selectedHabit.value = null
  deletePending.value = false
}

function freqLabel(f: Frequency, config?: FrequencyConfig): string {
  switch (f) {
    case 'daily': return '每日'
    case 'weekdays': return '工作日'
    case 'every_n_days': {
      const n = config?.nDays
      return n ? `每${n}天` : '每N天'
    }
    case 'custom_days': {
      const days = config?.customDays
      if (!days?.length) return '自定义'
      const labels = ['日','一','二','三','四','五','六']
      return '周' + days.map(d => labels[d]).join('/')
    }
    default: return ''
  }
}

function prevMonth() {
  calMonth.value--
  if (calMonth.value < 0) { calMonth.value = 11; calYear.value-- }
}

function nextMonth() {
  calMonth.value++
  if (calMonth.value > 11) { calMonth.value = 0; calYear.value++ }
}
</script>

<style scoped>
.habit-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  overflow-y: auto;
  overflow-x: hidden;
}

/* ===== Header ===== */
.habit-header, .detail-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--c-border);
}

.habit-title, .detail-title {
  font-weight: 700;
  font-size: 18px;
  color: var(--c-text-primary);
}

.btn-create-fab {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, var(--c-primary), var(--c-danger));
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  transition: transform 0.15s;
  line-height: 1;
}
.btn-create-fab:hover { transform: scale(1.1); }

.btn-back {
  background: none;
  border: none;
  font-size: 13px;
  font-family: inherit;
  color: var(--c-primary);
  cursor: pointer;
  padding: 0 8px 0 0;
  font-weight: 600;
}

/* ===== Progress bar ===== */
.progress-bar-section {
  flex-shrink: 0;
  padding: 10px 12px;
}

.progress-text {
  font-size: 12px;
  color: var(--c-text-primary);
  margin-bottom: 5px;
}

.progress-done {
  color: var(--c-secondary);
  font-weight: 700;
}

.streak-badge {
  margin-left: 6px;
  color: var(--c-danger);
  font-weight: 600;
}

.progress-track {
  height: 7px;
  background: var(--c-border);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-secondary), var(--c-secondary-dark, #5DAF60));
  border-radius: 5px;
  transition: width 0.4s ease;
}

/* ===== Habit list ===== */
.habit-list {
  flex: 1;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 0;
  overflow-y: auto;
}

.habit-empty {
  text-align: center;
  color: var(--c-text-muted);
  font-size: 13px;
  padding: 20px 0;
}

.habit-card {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1.5px solid var(--c-border);
  border-radius: 12px;
  padding: 9px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: opacity 0.3s ease;
}

.habit-card.done { opacity: 0.6; }
.habit-card.done:hover { opacity: 0.8; }
.habit-card.not-today { opacity: 0.65; }

.not-today-tag { color: var(--c-secondary-light); font-weight: 600; }

.check-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 2px solid var(--c-border);
  border-radius: 7px;
  background: white;
  font-size: 13px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.check-btn.checked {
  background: var(--c-secondary);
  border-color: var(--c-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.check-btn.checked:hover {
  background: var(--c-danger);
  border-color: var(--c-danger);
  transform: scale(1.05);
}

.habit-info {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.habit-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.habit-name.line-through {
  text-decoration: line-through;
  text-decoration-color: var(--c-text-muted);
  color: var(--c-text-secondary);
}

.habit-meta {
  font-size: 10px;
  color: var(--c-text-muted);
  margin-top: 2px;
}

.btn-detail {
  flex-shrink: 0;
  padding: 4px 10px;
  background: white;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  font-size: 11px;
  font-family: inherit;
  font-weight: 600;
  color: var(--c-primary);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-detail:hover { background: var(--c-bg); }

/* ===== Frequency config ===== */
.freq-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: transparent;
  border: none;
  padding: 0;
}

.freq-config-label {
  font-size: 11px;
  color: var(--c-text-primary);
  font-weight: 600;
}

.freq-num-input {
  width: 42px;
  padding: 3px 5px;
  border: 1.5px solid var(--c-border);
  border-radius: 5px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  color: var(--c-text-primary);
  text-align: center;
}

.freq-num-input:focus { border-color: var(--c-primary); }

.day-pill {
  padding: 3px 6px;
  border: 1.5px solid var(--c-border);
  border-radius: 7px;
  background: white;
  font-size: 11px;
  font-family: inherit;
  font-weight: 600;
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.day-pill.active {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: white;
}

.day-pill:hover { border-color: var(--c-primary); }

/* ===== Footer ===== */
.habit-footer {
  flex-shrink: 0;
  text-align: center;
  padding: 8px;
  font-size: 11px;
  color: var(--c-text-muted);
  border-top: 1px solid var(--c-border);
}

/* ===== Detail: Pet section ===== */
.pet-section {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.pet-bubble {
  flex: 1;
  background: white;
  border: 1.5px solid var(--c-border);
  border-radius: 12px;
  padding: 7px 9px;
  font-size: 11px;
  color: var(--c-text-primary);
  line-height: 1.4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.pet-bubble::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 12px;
  border: 5px solid transparent;
  border-right-color: white;
}

.bubble-enter-active { transition: all 0.3s ease; }
.bubble-leave-active { transition: all 0.2s ease; }
.bubble-enter-from { opacity: 0; transform: translateY(-6px); }
.bubble-leave-to { opacity: 0; transform: translateY(-4px); }

/* ===== Detail: Info section ===== */
.info-section {
  flex-shrink: 0;
  padding: 6px 12px;
}

.info-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--c-text-primary);
}

.info-freq {
  font-size: 11px;
  color: var(--c-text-muted);
  margin-top: 2px;
}

.info-cards {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.info-card {
  flex: 1;
  background: white;
  border: 1.5px solid var(--c-border);
  border-radius: 12px;
  padding: 10px;
  text-align: center;
}

.info-card-label {
  font-size: 10px;
  color: var(--c-text-muted);
  font-weight: 600;
}

.info-card-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--c-primary);
  margin-top: 3px;
}

.info-card-value small {
  font-size: 11px;
  color: var(--c-text-muted);
  font-weight: 400;
}

/* ===== Detail: Calendar ===== */
.calendar-section {
  flex-shrink: 0;
  padding: 6px 12px;
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.cal-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text-primary);
}

.cal-nav {
  background: none;
  border: none;
  font-size: 13px;
  color: var(--c-text-muted);
  cursor: pointer;
  padding: 4px;
}

.cal-nav:hover { color: var(--c-primary); }

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-weekday {
  text-align: center;
  font-size: 10px;
  color: var(--c-text-muted);
  font-weight: 600;
  padding: 3px 0;
}

.cal-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 11px;
  color: var(--c-text-primary);
  cursor: pointer;
  background: white;
  border: 1.5px solid var(--c-border);
  transition: background 0.25s ease, border-color 0.25s ease;
}

.cal-day.empty {
  background: transparent;
  border-color: transparent;
  cursor: default;
}

.cal-day:not(.empty):hover { border-color: var(--c-primary); }

.cal-day.cal-done {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: white;
  font-weight: 700;
}

.cal-day.cal-partial {
  background: rgba(242, 158, 109, 0.25);
  border-color: rgba(242, 158, 109, 0.4);
  color: var(--c-danger);
}

.cal-day.cal-today {
  border-color: var(--c-secondary);
  border-width: 2px;
}

.cal-legend {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--c-text-muted);
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: white;
  border: 1.5px solid var(--c-border);
}

.legend-dot.cal-done {
  background: var(--c-primary);
  border-color: var(--c-primary);
}

.legend-dot.cal-partial {
  background: rgba(242, 158, 109, 0.25);
  border-color: rgba(242, 158, 109, 0.4);
}

/* ===== Detail: Actions ===== */
.action-section {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid var(--c-border);
}

.btn-checkin-primary {
  padding: 7px 17px;
  background: linear-gradient(145deg, var(--c-secondary), var(--c-secondary-dark, #5DAF60));
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-checkin-primary:hover { transform: translateY(-1px); }

.btn-checkin-primary.cancel-state {
  background: linear-gradient(145deg, var(--c-danger), #C06050);
}

.btn-checkin-secondary {
  padding: 7px 15px;
  background: white;
  color: var(--c-accent);
  border: 1.5px solid var(--c-border);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-checkin-secondary:hover { border-color: var(--c-accent); }

.btn-checkin-secondary.cancel-state {
  color: var(--c-danger);
  border-color: var(--c-danger);
}
.btn-checkin-secondary.cancel-state:hover {
  background: var(--c-danger-soft);
}

.action-btns {
  margin-left: auto;
  display: flex;
  gap: 5px;
}

.btn-edit, .btn-delete {
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-edit {
  background: white;
  border: 1px solid var(--c-border);
  color: var(--c-text-muted);
}

.btn-edit:hover { color: var(--c-text-primary); border-color: var(--c-text-muted); }

.btn-delete {
  background: white;
  border: 1px solid var(--c-border);
  color: var(--c-text-muted);
}

.btn-delete:hover { color: var(--c-danger); border-color: var(--c-danger); }

/* ===== Dialog ===== */
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-inner {
  background: white;
  border-radius: 14px;
  padding: 16px;
  width: 250px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.dialog-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: 10px;
}

.dialog-hint {
  font-size: 11px;
  color: var(--c-text-muted);
  margin-bottom: 10px;
  line-height: 1.4;
}

.dialog-input {
  width: 100%;
  padding: 6px 9px;
  border: 1.5px solid var(--c-border);
  border-radius: 7px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  color: var(--c-text-primary);
  box-sizing: border-box;
  margin-bottom: 7px;
}

.dialog-input:focus { border-color: var(--c-primary); }

.dialog-textarea {
  width: 100%;
  padding: 6px 9px;
  border: 1.5px solid var(--c-border);
  border-radius: 7px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  color: var(--c-text-primary);
  box-sizing: border-box;
  resize: none;
  line-height: 1.4;
}

.dialog-textarea:focus { border-color: var(--c-primary); }

.dialog-btns {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn-dialog-cancel, .btn-dialog-ok, .btn-dialog-delete {
  flex: 1;
  padding: 6px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
}

.btn-dialog-cancel {
  background: var(--c-border);
  color: var(--c-text-secondary);
}

.btn-dialog-ok {
  background: var(--c-primary);
  color: white;
}

.btn-dialog-delete {
  background: var(--c-danger);
  color: white;
}

.btn-dialog-ok:disabled { opacity: 0.4; cursor: not-allowed; }

/* ===== Create dialog ===== */
.dialog-freq-section {
  position: relative;
  margin-bottom: 5px;
}

.dialog-freq-btn {
  width: 100%;
  padding: 6px 9px;
  border: 1.5px solid var(--c-border);
  border-radius: 7px;
  font-size: 13px;
  font-family: inherit;
  font-weight: 600;
  color: var(--c-text-primary);
  background: white;
  cursor: pointer;
  text-align: left;
}

.dialog-freq-btn:hover { border-color: var(--c-primary); }

.dialog-freq-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 11;
  background: white;
  border: 1.5px solid var(--c-border);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  margin-top: 4px;
}

.dialog-freq-dropdown button {
  display: block;
  width: 100%;
  padding: 6px 12px;
  background: none;
  border: none;
  font-size: 13px;
  font-family: inherit;
  color: var(--c-text-primary);
  cursor: pointer;
  text-align: left;
}

.dialog-freq-dropdown button:hover {
  background: var(--c-bg);
  color: var(--c-primary);
}

.dialog-freq-config {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}
</style>
