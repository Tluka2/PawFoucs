<template>
  <div
    ref="containerRef"
    class="window-container"
    :class="{ 'night-mode': isNightMode }"
    :style="windowOpacityStyle"
    @contextmenu.prevent="showContextMenu"
  >
    <!-- 全屏时段氛围背景 -->
    <AmbientBackground
      v-if="currentView === 'home' && hasPet"
      :period="period"
      :config="ambientConfig"
    />

    <!-- 主内容区（可拖拽） -->
    <div class="main-content" @mousedown="handleDragStart">

      <!-- 窗口控制按钮 -->
      <div class="window-controls" @mousedown.stop>
        <button class="win-btn" @click.stop="handleMinimize" title="最小化">—</button>
        <button class="win-btn close" @click.stop="handleClose" title="关闭"><AppIcon name="close" :size="12" /></button>
      </div>

      <!-- ====== 首页 ====== -->
      <template v-if="currentView === 'home'">

        <!-- 有宠物：专注页面 -->
        <template v-if="hasPet">
          <!-- 宠物形象 -->
          <div class="pet-wrapper" @click.stop="onPetInteraction()">
            <div class="pet-aura"></div>
            <PetSprite
              :pet-type="petType"
              :animation-state="animation.currentState.value"
              :frame-index="animation.currentFrame.value"
              size="md"
            />
            <div v-if="showBubble" class="pet-bubble">{{ bubbleText }}</div>
            <!-- Level-up flash (hidden, keep code for future use)
            <div v-if="showLevelUp" class="level-up-flash">
              <div class="level-up-text">⬆ 升级!</div>
              <div class="level-up-num">Lv.{{ petLevel }}</div>
            </div>
            -->
          </div>

          <!-- EXP bar (hidden, keep code for future use)
          <div class="exp-row">
            <span class="exp-label">Lv.{{ petLevel }}</span>
            <div class="exp-bar">
              <div class="exp-fill" :style="{ width: expPercent + '%' }"></div>
            </div>
            <span class="exp-ratio">{{ expPercent }}%</span>
          </div>
          -->

          <!-- 初始设置 / 计时显示 -->
          <template v-if="timerState === 'idle' && !isBreak">
            <!-- 正计时：只显示大按钮 -->
            <div v-if="isCountup" class="setup-panel countup-mode">
              <button @click.stop="startWithSettings" class="btn-start-big">开始专注</button>
            </div>
            <!-- 倒计时：原有设置面板 -->
            <div v-else class="setup-panel">
              <!-- 循环数 -->
              <div class="setup-row">
                <button class="setup-arrow" @click.stop="adjustLoop(-1)">‹</button>
                <span class="setup-label">循环 {{ localLoop }}</span>
                <button class="setup-arrow" @click.stop="adjustLoop(1)">›</button>
              </div>
              <!-- 专注 / 休息 -->
              <div class="setup-dual">
                <div class="setup-col">
                  <span class="setup-col-label">专注</span>
                  <div class="setup-row compact">
                    <button class="setup-arrow sm" @click.stop="adjustFocus(-1)">−</button>
                    <input
                      v-if="editingFocus"
                      ref="focusInputRef"
                      v-model.number="focusInput"
                      type="number"
                      class="setup-input"
                      min="5" max="120"
                      @keydown.enter="confirmFocusInput"
                      @blur="confirmFocusInput"
                    />
                    <span v-else class="setup-val" @dblclick="startEditFocus">{{ localFocus }}</span>
                    <button class="setup-arrow sm" @click.stop="adjustFocus(1)">+</button>
                  </div>
                </div>
                <div class="setup-col">
                  <span class="setup-col-label">休息</span>
                  <div class="setup-row compact">
                    <button class="setup-arrow sm" @click.stop="adjustBreak(-1)">−</button>
                    <input
                      v-if="editingBreak"
                      ref="breakInputRef"
                      v-model.number="breakInput"
                      type="number"
                      class="setup-input"
                      min="1" max="30"
                      @keydown.enter="confirmBreakInput"
                      @blur="confirmBreakInput"
                    />
                    <span v-else class="setup-val" @dblclick="startEditBreak">{{ localBreak }}</span>
                    <button class="setup-arrow sm" @click.stop="adjustBreak(1)">+</button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="timer-display">{{ formattedTime }}</div>
            <div class="timer-subtitle">
              <template v-if="isBreak">{{ pomStore.data.breakType === 'long' ? '长休息中' : '休息中' }}</template>
              <template v-else-if="isCompleted">专注完成!</template>
              <template v-else-if="isRunning">{{ mode === 'countup' ? '正计时中...' : '专注倒计时' }}</template>
              <template v-else-if="isPaused">已暂停</template>
              <span v-if="loopDisplay" class="loop-tag">{{ loopDisplay }}</span>
            </div>
          </template>

          <!-- 操作按钮 -->
          <div class="action-row" @mousedown.stop>
            <button v-if="isCompleted" @click.stop="claimReward" class="btn-warm btn-reward">
              领取奖励
            </button>
            <template v-else-if="isBreak">
              <button @click.stop="skipBreak" class="btn-warm">跳过休息</button>
            </template>
            <template v-else-if="isRunning || isPaused">
              <button v-if="isRunning && mode === 'countup'" @click.stop="manualComplete" class="btn-warm">完成</button>
              <button v-else-if="isRunning" @click.stop="pauseTimer" class="btn-warm">暂停</button>
              <button v-else @click.stop="resumeTimer" class="btn-warm">继续</button>
              <button @click.stop="giveUp" class="btn-ghost">放弃</button>
            </template>
            <template v-else>
              <button v-if="!isCountup" @click.stop="startWithSettings" class="btn-warm">开始专注</button>
            </template>
          </div>

          <!-- 今日重点待办区 -->
          <div class="task-card">
            <div class="task-header">
              <span class="task-title"><AppIcon name="target" :size="16" /> 今日重点</span>
            </div>

            <!-- 系统推荐：紧急备忘 -->
            <div
              v-if="todayFocusMemo && !todayFocusMemo.completed"
              class="task-item clickable"
              @click="goToMemo"
            >
              <button class="task-check-btn" @click.stop="completeFocusTask"></button>
              <div class="task-info">
                <div class="task-name">{{ todayFocusMemo.content }}</div>
                <div class="task-desc">
                  <span class="deadline-mark" :class="memoStore.getDeadlineStatus(todayFocusMemo)">{{ deadlineLabel }}</span>
                </div>
              </div>
            </div>

            <!-- 自定义待办列表 -->
            <div v-for="(task, idx) in todayTasks" :key="idx" class="task-item focus-item">
              <button class="task-check-btn" :class="{ done: task.done }" @click.stop="toggleTodayTask(idx)">
                <AppIcon v-if="task.done" name="check" :size="14" />
              </button>
              <div v-if="editingTaskIdx === idx" class="task-info" style="flex:1;min-width:0">
                <input
                  v-model="editingTaskText"
                  class="custom-task-input"
                  placeholder="任务内容..."
                  maxlength="50"
                  @keydown.enter="confirmEditTask"
                  @keydown.escape="editingTaskIdx = -1"
                  @blur="confirmEditTask"
                  :ref="(el: any) => { if (editingTaskIdx === idx) taskInputEl = el }"
                />
              </div>
              <div v-else class="task-info" style="flex:1;min-width:0" @click.stop="startEditTask(idx)">
                <div class="task-name" :class="{ 'line-through': task.done }">{{ task.text }}</div>
              </div>
              <button class="task-del-btn" @click.stop="removeTodayTask(idx)"><AppIcon name="close" :size="12" /></button>
            </div>

            <!-- 新增任务 -->
            <div v-if="showNewTask" class="task-item focus-item">
              <span class="task-check-btn placeholder">+</span>
              <div class="task-info" style="flex:1;min-width:0">
                <input
                  v-model="newTaskText"
                  class="custom-task-input"
                  placeholder="添加新任务..."
                  maxlength="50"
                  @keydown.enter="addTodayTask"
                  @keydown.escape="showNewTask = false"
                  @blur="addTodayTask"
                  ref="newTaskInputRef"
                />
              </div>
            </div>
            <button v-else class="add-task-btn" @click.stop="openNewTask">+ 添加任务</button>

            <div class="task-stats">
              <span><AppIcon name="coins" :size="14" /> {{ userStore.formattedCoins }}</span>
              <span><AppIcon name="clock" :size="14" /> 今日 {{ pomStore.data.todayCompleted }} 个</span>
            </div>
            <button class="btn-shop" @click.stop="showShop = true"><AppIcon name="catPaw" :size="14" /> 宠物商店</button>
          </div>
        </template>

        <!-- 无宠物：选择向导 -->
        <template v-else>
          <div class="wizard-area" @mousedown.stop>
            <PetWelcome v-if="wizardStep === 'welcome'" @next="wizardStep = 'select'" />
            <PetSelect v-else-if="wizardStep === 'select'" @selected="onPetSelected" />
            <PetNaming v-else :pet-type="selectedType" @confirm="onPetNamed" @back="wizardStep = 'select'" />
          </div>
        </template>
      </template>

      <!-- ====== 备忘录面板 ====== -->
      <HabitPanel v-else-if="currentView === 'habit'" />

      <!-- ====== 备忘录面板 ====== -->
      <MemoPanel v-else-if="currentView === 'memo'" />

      <!-- ====== 统计面板 ====== -->
      <StatsPanel v-else-if="currentView === 'stats'" />

      <!-- ====== 设置面板 ====== -->
      <SettingsPanel v-else-if="currentView === 'settings'" />
    </div>

    <!-- ====== 底部导航 ====== -->
    <div class="bottom-nav">
      <button
        v-for="nav in navItems"
        :key="nav.view"
        class="nav-item"
        :class="{ active: currentView === nav.view }"
        @click="currentView = nav.view"
      >
        <span class="nav-icon"><AppIcon :name="nav.icon" :size="20" :color="currentView === nav.view ? 'var(--c-primary)' : 'var(--c-text-secondary)'" :filled="currentView === nav.view" /></span>
        <span class="nav-label">{{ nav.label }}</span>
      </button>
    </div>

    <!-- 开发调试：时段切换 -->
    <div v-if="showDevPanel" class="dev-panel" @mousedown.stop>
      <div class="dev-row">
        <button
          v-for="opt in devPeriodOptions"
          :key="opt.value"
          class="dev-btn"
          :class="{ active: devOverride === opt.value }"
          @click="devOverride = devOverride === opt.value ? null : opt.value"
        >{{ opt.label }}</button>
      </div>
      <div class="dev-row">
        <button
          v-for="a in (['idle','walk','roll','beg','sleep','shake','drink','bark'] as const)"
          :key="a"
          class="dev-btn anim"
          :class="{ active: animation.currentState.value === a }"
          @click="animation.playAnimation(a)"
        >{{ a }}</button>
      </div>
    </div>

    <!-- 健康提醒弹窗 -->
    <HealthReminderDialog
      v-if="activeReminder"
      :reminder="activeReminder"
      @respond="(r: UserResponse) => healthRespond(r)"
      @dismiss="healthDismiss()"
    />

    <!-- 宠物商店弹窗 -->
    <div v-if="showShop" class="shop-overlay">
      <div class="shop-header-bar">
        <button class="btn-shop-back" @click="showShop = false">← 返回</button>
      </div>
      <PetShop />
    </div>

    <!-- 右键菜单 -->
    <ContextMenu
      :visible="ctxMenu.visible"
      :x="ctxMenu.x"
      :y="ctxMenu.y"
      :current-opacity="windowStore.currentOpacity"
      :is-on-top="windowStore.isOnTop"
      :is-locked="windowStore.isLocked"
      @close="hideContextMenu"
      @set-opacity="windowStore.setOpacity($event)"
      @toggle-on-top="windowStore.toggleOnTop()"
      @toggle-lock="windowStore.toggleLock()"
      @exit="handleExit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { toLocalDateStr } from '@/utils/date'
import { useUserStore } from '@/stores/user'
import { usePetStore } from '@/stores/pet'
import { useWindowStore } from '@/stores/window'
import { usePomodoroStore } from '@/stores/pomodoro'
import { useSettingsStore } from '@/stores/settings'
import { useHabitStore } from '@/stores/habit'
import { useMemoStore } from '@/stores/memo'
import { appWindow } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/tauri'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import { startDrag, hideToTray, showMiniTimer, updateTrayTooltip, closeWindow } from '@/composables/useWindow'
import { useTimer } from '@/composables/useTimer'
import { usePet } from '@/composables/usePet'
import { usePetAnimation } from '@/composables/usePetAnimation'
import { useHealthReminder } from '@/composables/useHealthReminder'
import { useTimeOfDay, devPeriodOverride } from '@/composables/useTimeOfDay'
import { useSound } from '@/composables/useSound'
import type { TimePeriod } from '@/composables/useTimeOfDay'
import type { PetType } from '@/types/pet'
import type { UserResponse } from '@/types/health'
import ContextMenu from '@/components/Window/ContextMenu.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import HabitPanel from '@/components/HabitPanel.vue'
import MemoPanel from '@/components/MemoPanel.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import PetSelect from '@/components/Pet/PetSelect.vue'
import PetNaming from '@/components/Pet/PetNaming.vue'
import PetWelcome from '@/components/Pet/PetWelcome.vue'
import PetSprite from '@/components/Pet/PetSprite.vue'
import PetShop from '@/components/Pet/PetShop.vue'
import HealthReminderDialog from '@/components/Health/HealthReminderDialog.vue'
import AmbientBackground from '@/components/Ambient/AmbientBackground.vue'
import AppIcon from '@/components/AppIcon.vue'

const containerRef = ref<HTMLElement | null>(null)
const userStore = useUserStore()
const petStore = usePetStore()
const windowStore = useWindowStore()
const pomStore = usePomodoroStore()
const settingsStore = useSettingsStore()
const habitStore = useHabitStore()
const memoStore = useMemoStore()

// --- 番茄钟 ---
const {
  formattedTime, timerState, isRunning, isPaused, isCompleted, isBreak,
  mode, loopDisplay, timerLabel,
  startTimer, pauseTimer, resumeTimer, giveUp, manualComplete, claimReward, skipBreak,
} = useTimer()

// Local setup state (synced from settings on mount)
const localLoop = ref(settingsStore.settings.workDuration ? 4 : 4)
const localFocus = ref(settingsStore.settings.workDuration)
const localBreak = ref(settingsStore.settings.breakDuration)
const isCountup = computed(() => settingsStore.settings.defaultMode === 'countup')

// Double-click inline editing
const editingFocus = ref(false)
const editingBreak = ref(false)
const focusInput = ref(0)
const breakInput = ref(0)
const focusInputRef = ref<HTMLInputElement | null>(null)
const breakInputRef = ref<HTMLInputElement | null>(null)

function startEditFocus() {
  focusInput.value = localFocus.value
  editingFocus.value = true
  nextTick(() => { focusInputRef.value?.focus(); focusInputRef.value?.select() })
}
function confirmFocusInput() {
  if (!editingFocus.value) return
  const raw = focusInput.value
  const v = Math.max(1, isNaN(raw) ? 25 : Math.round(raw))
  localFocus.value = v
  editingFocus.value = false
}
function startEditBreak() {
  breakInput.value = localBreak.value
  editingBreak.value = true
  nextTick(() => { breakInputRef.value?.focus(); breakInputRef.value?.select() })
}
function confirmBreakInput() {
  if (!editingBreak.value) return
  const raw = breakInput.value
  const v = Math.max(1, Math.min(30, isNaN(raw) ? 5 : Math.round(raw)))
  localBreak.value = v
  editingBreak.value = false
}

function adjustLoop(delta: number) {
  localLoop.value = Math.max(1, Math.min(8, localLoop.value + delta))
}
function adjustFocus(delta: number) {
  localFocus.value = Math.max(1, localFocus.value + delta)
}
function adjustBreak(delta: number) {
  localBreak.value = Math.max(1, Math.min(30, localBreak.value + delta))
}
function startWithSettings() {
  const m = settingsStore.settings.defaultMode
  pomStore.setMode(m)
  if (m !== 'countup') pomStore.setLoopTarget(localLoop.value)
  pomStore.setDuration(localFocus.value * 60)
  settingsStore.updateSetting('workDuration', localFocus.value)
  settingsStore.updateSetting('breakDuration', localBreak.value)
  startTimer()
}

// --- 导航 ---
const currentView = ref('home')
const navItems = [
  { view: 'home', icon: 'pixelHome', label: '首页' },
  { view: 'habit', icon: 'pixelHabit', label: '习惯' },
  { view: 'memo', icon: 'pixelMemo', label: '备忘' },
  { view: 'stats', icon: 'pixelStats', label: '统计' },
  { view: 'settings', icon: 'pixelSettings', label: '设置' },
]

// --- 宠物 ---
const {
  petType, /* petLevel, expPercent: _expPercent, */ hasPet, showBubble, bubbleText,
  showGreeting, showPomodoroComplete, showBreakTime, showSpeciesAction,
  showCustomBubble, showHabitReminder, showMemoReminder, showTodayTodo,
} = usePet()
const { playPetClickSound, playCoinSound } = useSound()
const animation = usePetAnimation(petType)

// --- 健康提醒 ---
const { activeReminder, respond: healthRespond, dismiss: healthDismiss } = useHealthReminder()

watch(activeReminder, (reminder) => {
  if (!hasPet.value || animation.currentState.value === 'sleep') return
  if (reminder?.type === 'water') {
    animation.playAnimation('drink')
    showCustomBubble('要多喝水呦~')
  } else if (reminder?.type === 'exercise') {
    const action = Math.random() < 0.5 ? 'roll' : 'walk'
    animation.playAnimation(action)
  }
})

// --- 时段背景 ---
const { period, config: ambientConfig, isNight } = useTimeOfDay()
const isNightMode = computed(() => isNight.value && hasPet.value && currentView.value === 'home')

// --- 开发调试 ---
const showDevPanel = ref(false)
const devOverride = devPeriodOverride
const devPeriodOptions: { label: string; value: TimePeriod }[] = [
  { label: '早', value: 'morning' },
  { label: '午', value: 'afternoon' },
  { label: '晚', value: 'evening' },
  { label: '夜', value: 'night' },
]

let lastPetClickTime = 0

function onPetInteraction() {
  const now = Date.now()
  if (now - lastPetClickTime < 500) return
  lastPetClickTime = now
  if (animation.currentState.value === 'sleep') {
    animation.triggerClick()
    showCustomBubble('呼噜呼噜...')
    return
  }
  playPetClickSound()
  if (timerState.value === 'running') {
    animation.triggerClick()
    showCustomBubble('主人好好专注，不要分心哦~')
  } else {
    animation.triggerClick()
    showCustomBubble('再摸摸我！')
  }
}

const wizardStep = ref<'welcome' | 'select' | 'naming'>('welcome')
const selectedType = ref<PetType>('cat')
const showShop = ref(false)
const onPetSelected = (type: PetType) => { selectedType.value = type; wizardStep.value = 'naming' }

// --- 今日重点任务 ---
interface TodayTask { text: string; done: boolean }

const TODAY_TASKS_KEY = 'today_focus_tasks'

function loadTodayTasks(): TodayTask[] {
  try {
    const raw = localStorage.getItem(TODAY_TASKS_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (data.date !== toLocalDateStr(new Date())) return []
    return data.tasks || []
  } catch { return [] }
}

function saveTodayTasks(tasks: TodayTask[]) {
  localStorage.setItem(TODAY_TASKS_KEY, JSON.stringify({ date: toLocalDateStr(new Date()), tasks }))
}

const todayTasks = ref<TodayTask[]>(loadTodayTasks())
watch(todayTasks, (v) => saveTodayTasks(v), { deep: true })

const showNewTask = ref(false)
const newTaskText = ref('')
const newTaskInputRef = ref<HTMLInputElement | null>(null)
const editingTaskIdx = ref(-1)
const editingTaskText = ref('')
const taskInputEl = ref<HTMLInputElement | null>(null)

const todayFocusMemo = computed(() => {
  const reminders = memoStore.todayReminders
  return reminders.length > 0 ? reminders[0] : null
})

const deadlineLabel = computed(() => {
  const m = todayFocusMemo.value
  if (!m?.deadline) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dl = new Date(m.deadline + 'T00:00:00')
  const diff = Math.ceil((dl.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return `已过期${Math.abs(diff)}天`
  if (diff === 0) return '今天到期'
  if (diff === 1) return '明天到期'
  return `${diff}天后到期`
})

function openNewTask() {
  newTaskText.value = ''
  showNewTask.value = true
  nextTick(() => newTaskInputRef.value?.focus())
}

function addTodayTask() {
  if (!showNewTask.value) return
  const text = newTaskText.value.trim()
  showNewTask.value = false
  newTaskText.value = ''
  if (text) {
    todayTasks.value.push({ text, done: false })
  }
}

function toggleTodayTask(idx: number) {
  const task = todayTasks.value[idx]
  if (!task) return
  task.done = !task.done
  if (task.done) {
    // petStore.addExp(5)  // 升级系统已暂停
    userStore.addCoins(5)
    playCoinSound()
    userStore.save()
  }
}

function removeTodayTask(idx: number) {
  todayTasks.value.splice(idx, 1)
  if (editingTaskIdx.value === idx) editingTaskIdx.value = -1
}

function startEditTask(idx: number) {
  editingTaskIdx.value = idx
  editingTaskText.value = todayTasks.value[idx]?.text || ''
  nextTick(() => taskInputEl.value?.focus())
}

function confirmEditTask() {
  if (editingTaskIdx.value < 0) return
  const text = editingTaskText.value.trim()
  if (text && todayTasks.value[editingTaskIdx.value]) {
    todayTasks.value[editingTaskIdx.value].text = text
  }
  editingTaskIdx.value = -1
}

async function completeFocusTask() {
  const m = todayFocusMemo.value
  if (!m || !m.id) return
  await memoStore.toggleCompleted(m.id)
  // petStore.addExp(10)  // 升级系统已暂停
  userStore.addCoins(10)
  playCoinSound()
  await userStore.save()
}

function goToMemo() {
  currentView.value = 'memo'
}
const onPetNamed = async (name: string) => {
  try {
    userStore.initNewUser(name)
    await petStore.addInitialPet(selectedType.value, name)
    wizardStep.value = 'welcome'
  } catch (e) { console.error('创建宠物失败:', e) }
}

// --- 宠物对话上下文触发 ---
watch(isCompleted, (val) => { if (val && hasPet.value && animation.currentState.value !== 'sleep') showPomodoroComplete() })
watch(isBreak, (val) => { if (val && hasPet.value && animation.currentState.value !== 'sleep') showBreakTime() })
watch(hasPet, (val) => { if (val) setTimeout(() => { if (animation.currentState.value !== 'sleep') showGreeting() }, 800) })

// --- 首页待办汇总 ---
let todoSummaryTimer: ReturnType<typeof setTimeout> | null = null
watch(currentView, (view) => {
  if (todoSummaryTimer) { clearTimeout(todoSummaryTimer); todoSummaryTimer = null }
  if (view !== 'home' || !hasPet.value) return

  // Delay to avoid conflicting with greeting
  todoSummaryTimer = setTimeout(() => {
    if (showBubble.value || animation.currentState.value === 'sleep') return

    const todayStr = toLocalDateStr(new Date())
    const unchecked = habitStore.todayHabits.filter(
      h => !h.checkins.some(c => c.date === todayStr)
    )
    const reminders = memoStore.todayReminders

    if (unchecked.length === 0 && reminders.length === 0) return

    showTodayTodo()
  }, 3500)
})

// --- Level-up detection (paused) ---
/*
const showLevelUp = ref(false)
let levelUpTimer: ReturnType<typeof setTimeout> | null = null
let petLevelWatchReady = false
watch(petLevel, (newLevel, oldLevel) => {
  if (!petLevelWatchReady) {
    petLevelWatchReady = true
    return
  }
  if (newLevel > oldLevel) {
    showLevelUp.value = true
    animation.triggerClick()
    bubbleText.value = `升级到 Lv.${newLevel} 啦！`
    showBubble.value = true
    if (levelUpTimer) clearTimeout(levelUpTimer)
    levelUpTimer = setTimeout(() => {
      showLevelUp.value = false
      showBubble.value = false
    }, 3000)
  }
})
*/

let speciesInterval: ReturnType<typeof setInterval> | null = null
let habitReminderInterval: ReturnType<typeof setInterval> | null = null
let memoReminderInterval: ReturnType<typeof setInterval> | null = null
let closeUnlisten: (() => void) | null = null
let claimRewardUnlisten: UnlistenFn | null = null
onMounted(async () => {
  if (!habitStore.isLoaded) habitStore.load()
  if (!memoStore.isLoaded) memoStore.load()
  speciesInterval = setInterval(() => {
    if (hasPet.value && !showBubble.value && timerState.value === 'idle' && animation.currentState.value !== 'sleep') showSpeciesAction()
  }, 25000)

  // 定时检查未打卡习惯
  habitReminderInterval = setInterval(() => {
    if (!hasPet.value || showBubble.value || animation.currentState.value === 'sleep') return
    const todayStr = toLocalDateStr(new Date())
    const unchecked = habitStore.todayHabits.filter(h => !h.checkins.some(c => c.date === todayStr))
    if (unchecked.length > 0) showHabitReminder()
  }, 45 * 60 * 1000)

  // 定时检查快到期备忘
  memoReminderInterval = setInterval(() => {
    if (!hasPet.value || showBubble.value || animation.currentState.value === 'sleep') return
    if (memoStore.todayReminders.length > 0) showMemoReminder()
  }, 30 * 60 * 1000)

  // Listen for claim-reward from mini timer window
  try {
    claimRewardUnlisten = await listen('mini-claim-reward', () => {
      if (isCompleted.value) claimReward()
    })
  } catch {}

  // Window close button → just exit
  try {
    closeUnlisten = await appWindow.onCloseRequested(async () => {
      // default behavior: close the window
    })
  } catch {}

  updateTooltip()
})
onUnmounted(() => {
  if (speciesInterval) clearInterval(speciesInterval)
  if (habitReminderInterval) clearInterval(habitReminderInterval)
  if (memoReminderInterval) clearInterval(memoReminderInterval)
  // if (levelUpTimer) clearTimeout(levelUpTimer)  // 升级系统已暂停
  if (closeUnlisten) closeUnlisten()
  if (claimRewardUnlisten) claimRewardUnlisten()
  if (trayTimerInterval) clearInterval(trayTimerInterval)
})

// --- 窗口拖动 ---
const handleDragStart = (e: MouseEvent) => {
  if (e.button !== 0) return
  if (!windowStore.isLocked) {
    const target = e.target as HTMLElement
    if (target.closest('button, a, [role="button"], .select-card, .memo-content, .memo-edit-area, .memo-card-actions, .edit-overlay, .cal-overlay, .cat-dialog, .pet-wrapper, .setup-val, .setup-input')) return
    startDrag()
  }
}

// --- 右键菜单 ---
const ctxMenu = ref({ visible: false, x: 0, y: 0 })
const showContextMenu = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = Math.min(e.clientX - rect.left, rect.width - 130)
  const y = Math.min(e.clientY - rect.top, rect.height - 220)
  ctxMenu.value = { visible: true, x: Math.max(0, x), y: Math.max(0, y) }
}
const hideContextMenu = () => { ctxMenu.value.visible = false }
const windowOpacityStyle = computed(() => ({ opacity: windowStore.currentOpacity / 100 }))

// --- 窗口控制 ---
async function handleMinimize() {
  await hideToTray()
  await showMiniTimer()
  emitTimerToMini()
}

async function handleClose() {
  await closeWindow()
}

async function handleExit() {
  await handleMinimize()
}

function updateTooltip() {
  const coins = userStore.coins
  const poms = pomStore.todayCompleted
  const time = formattedTime.value
  const label = timerLabel.value
  if (timerState.value === 'idle') {
    updateTrayTooltip(`PawFocus | 金币: ${coins} | 今日: ${poms}`)
  } else {
    updateTrayTooltip(`${label} ${time} | 金币: ${coins} | 今日: ${poms}`)
  }
}

let trayTimerInterval: ReturnType<typeof setInterval> | null = null
watch(() => formattedTime.value, updateTooltip)
watch(() => userStore.coins, updateTooltip)
watch(() => pomStore.todayCompleted, updateTooltip)

function emitTimerToMini() {
  if (window.__TAURI__) {
    invoke('broadcast_timer_state', {
      time: formattedTime.value,
      state: timerState.value,
      label: timerLabel.value,
      period: period.value,
      petType: petType.value,
    })
  }
}

function startMiniBroadcast() {
  if (trayTimerInterval) { clearInterval(trayTimerInterval); trayTimerInterval = null }
  trayTimerInterval = setInterval(() => {
    updateTooltip()
    emitTimerToMini()
  }, 1000)
}

watch(timerState, (state) => {
  updateTooltip()
  emitTimerToMini()
  if (state === 'running' || state === 'break' || state === 'paused' || state === 'completed') {
    startMiniBroadcast()
  } else {
    // idle: send one final update then stop
    emitTimerToMini()
    if (trayTimerInterval) { clearInterval(trayTimerInterval); trayTimerInterval = null }
  }
})
</script>

<style scoped>
/* ===== 整体布局 ===== */
.window-container {
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  align-items: center;
  justify-content: safe center;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 6px 14px 3px;
  gap: 4px;
  min-height: 0;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
.window-controls {
  position: absolute;
  top: clamp(2px, 0.5vmin, 4px);
  right: clamp(2px, 0.5vmin, 4px);
  display: flex;
  gap: 2px;
  z-index: 50;
}
.win-btn {
  width: clamp(20px, 4vmin, 26px);
  height: clamp(20px, 4vmin, 26px);
  border-radius: 50%;
  border: none;
  background: var(--c-bg-subtle);
  color: var(--c-text-muted);
  font-size: clamp(10px, 1.6vmin, 13px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  padding: 0;
  line-height: 1;
}
.win-btn:hover {
  background: var(--c-border);
  color: var(--c-text-secondary);
}
.win-btn.close:hover {
  background: var(--c-danger);
  color: var(--c-text-inverse);
}

/* ===== ��物圆形头像 ===== */
.pet-wrapper {
  position: relative;
  cursor: pointer;
  flex-shrink: 1;
  min-height: 0;
  transition: transform 0.2s ease;
  margin-top: clamp(6px, 1.5vmin, 16px);
}

.pet-wrapper:hover { transform: scale(1.05); }
.pet-wrapper:active { transform: scale(0.96); }

/* Pet aura glow effect */
.pet-aura {
  position: absolute;
  width: 140%;
  height: 140%;
  top: -20%;
  left: -20%;
  background: radial-gradient(circle, var(--c-primary-glow) 0%, transparent 70%);
  animation: glow-breathe 3s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

/* ===== EXP 经验条 ===== */
.exp-row {
  display: flex;
  align-items: center;
  gap: clamp(3px, 0.8vw, 6px);
  width: 100%;
  max-width: 240px;
  flex-shrink: 0;
}
.exp-label {
  font-size: clamp(9px, 1.2vmin, 10px);
  font-weight: 700;
  color: var(--c-primary);
  white-space: nowrap;
}
.exp-bar {
  flex: 1;
  height: clamp(4px, 0.8vmin, 6px);
  background: var(--c-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
  border-radius: var(--radius-sm);
  transition: width var(--transition-slow);
}
.exp-ratio {
  font-size: clamp(8px, 1vmin, 9px);
  font-weight: 600;
  color: var(--c-text-muted);
  white-space: nowrap;
}

/* ===== Level-up 升级提示 ===== */
.level-up-flash {
  position: absolute;
  top: clamp(-30px, -5vmin, -40px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  animation: levelup-pop 0.4s ease-out;
}
.level-up-text {
  font-size: clamp(10px, 1.5vmin, 12px);
  font-weight: 800;
  color: var(--c-primary);
}
.level-up-num {
  font-size: clamp(9px, 1.3vmin, 11px);
  font-weight: 700;
  color: var(--c-primary-dark);
}
@keyframes levelup-pop {
  0% { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.8); }
  60% { transform: translateX(-50%) translateY(-4px) scale(1.1); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

.pet-bubble {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: clamp(4px, 1vmin, 8px);
  width: auto;
  min-width: clamp(90px, 22vmin, 120px);
  max-width: clamp(150px, 38vmin, 200px);
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: clamp(6px, 1.2vmin, 10px) clamp(8px, 1.5vmin, 14px);
  font-size: clamp(10px, 1.6vmin, 12px);
  line-height: 1.4;
  font-weight: 600;
  color: var(--c-text-primary);
  white-space: normal;
  word-break: break-word;
  text-align: center;
  box-shadow: var(--shadow-md);
  animation: bubble-pop 0.3s ease-out;
  pointer-events: none;
}
.pet-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 7px solid var(--c-bg-elevated);
}
@keyframes bubble-pop {
  from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.9); }
  to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

/* ===== 倒计时 ===== */
.timer-display {
  font-size: clamp(40px, 14vmin, 68px);
  font-weight: 850;
  color: var(--c-primary-dark);
  line-height: 1;
  letter-spacing: clamp(1px, 0.3vmin, 2px);
  text-shadow: 0 2px 10px var(--c-primary-glow);
  flex-shrink: 0;
}
.timer-subtitle {
  font-size: clamp(8px, 1.2vmin, 10px);
  font-weight: 600;
  color: var(--c-text-secondary);
  text-shadow: 0 1px 4px rgba(255, 200, 160, 0.2);
  margin-top: clamp(2px, 0.6vmin, 4px);
  display: flex;
  align-items: center;
  gap: clamp(3px, 0.8vmin, 6px);
  flex-shrink: 0;
}
.loop-tag {
  font-size: clamp(8px, 1.2vmin, 10px);
  background: var(--c-primary-soft);
  color: var(--c-primary);
  padding: 1px clamp(3px, 0.8vmin, 6px);
  border-radius: var(--radius-sm);
  font-weight: 700;
}

/* ===== Setup Panel ===== */
.setup-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(4px, 1vmin, 10px);
  flex-shrink: 0;
  padding: clamp(4px, 1vmin, 10px) 0;
}
.setup-row {
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vmin, 14px);
}
.setup-row.compact { gap: clamp(4px, 1vmin, 8px); }
.setup-label {
  font-size: clamp(10px, 1.5vmin, 12px);
  font-weight: 500;
  color: var(--c-text-secondary);
  min-width: auto;
  text-align: center;
}
.setup-dual {
  display: flex;
  gap: clamp(12px, 4vmin, 28px);
}
.setup-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(2px, 0.5vmin, 4px);
}
.setup-col-label {
  font-size: clamp(9px, 1.3vmin, 11px);
  font-weight: 600;
  color: var(--c-text-muted);
}
.setup-val {
  font-size: clamp(28px, 6vmin, 38px);
  font-weight: 800;
  color: var(--c-primary-dark);
  min-width: clamp(40px, 8vmin, 56px);
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.setup-input {
  width: clamp(44px, 9vmin, 60px);
  padding: 2px 4px;
  border: 1.5px solid var(--c-primary);
  border-radius: var(--radius-sm);
  font-size: clamp(20px, 4.5vmin, 28px);
  font-weight: 800;
  font-family: inherit;
  color: var(--c-primary-dark);
  text-align: center;
  outline: none;
  background: var(--c-bg-elevated);
  -moz-appearance: textfield;
}
.setup-input::-webkit-inner-spin-button,
.setup-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.setup-arrow {
  width: clamp(20px, 4vmin, 24px);
  height: clamp(20px, 4vmin, 24px);
  border-radius: 50%;
  border: 1.5px solid var(--c-border);
  background: var(--c-bg-elevated);
  font-size: clamp(12px, 2vmin, 16px);
  font-weight: 700;
  color: var(--c-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  line-height: 1;
}
.setup-arrow.sm {
  width: clamp(28px, 5.5vmin, 34px);
  height: clamp(28px, 5.5vmin, 34px);
  font-size: clamp(16px, 3vmin, 20px);
}
.setup-arrow:hover { border-color: var(--c-primary); color: var(--c-primary); }
.setup-arrow:active { transform: scale(0.92); }

.night-mode .setup-label { color: var(--c-text-secondary); }
.night-mode .setup-col-label { color: var(--c-text-muted); }
.night-mode .setup-val { color: var(--c-primary); }
.night-mode .setup-arrow { background: var(--c-bg-elevated); border-color: var(--c-border); color: var(--c-text-secondary); }
.night-mode .setup-arrow:hover { border-color: var(--c-primary); color: var(--c-primary); }

/* ===== 按钮 ===== */
.action-row {
  display: flex;
  gap: clamp(4px, 1vmin, 8px);
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: center;
}
.btn-warm {
  background: linear-gradient(145deg, var(--c-primary), var(--c-primary-dark));
  color: var(--c-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  padding: clamp(5px, 1vmin, 8px) clamp(16px, 4vmin, 28px);
  font-size: clamp(11px, 1.8vmin, 14px);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(232, 149, 106, 0.3);
  transition: all var(--transition-base);
  white-space: nowrap;
}
.btn-warm:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(232, 149, 106, 0.4); }
.btn-start-big {
  background: linear-gradient(145deg, var(--c-primary), var(--c-primary-dark));
  color: var(--c-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  padding: clamp(5px, 1vmin, 8px) clamp(16px, 4vmin, 28px);
  font-size: clamp(11px, 1.8vmin, 14px);
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 3px 12px rgba(232, 149, 106, 0.3);
  transition: all var(--transition-base);
  white-space: nowrap;
}
.btn-start-big:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(232, 149, 106, 0.4); }
.btn-warm:active { transform: translateY(1px); box-shadow: 0 1px 4px rgba(232, 149, 106, 0.2); }
.btn-reward {
  background: linear-gradient(145deg, var(--c-accent), var(--c-accent));
  color: var(--c-text-primary);
  animation: reward-pulse 1s ease-in-out infinite alternate;
}
@keyframes reward-pulse {
  from { transform: scale(1); }
  to { transform: scale(1.03); }
}
.btn-ghost {
  background: var(--c-bg-elevated);
  color: var(--c-text-secondary);
  border: 1.5px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: clamp(5px, 1vmin, 8px) clamp(14px, 3vmin, 24px);
  font-size: clamp(11px, 1.8vmin, 14px);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}
.btn-ghost:hover { background: var(--c-bg-subtle); border-color: var(--c-primary-light); color: var(--c-text-primary); }
.btn-ghost:active { transform: scale(0.97); }

/* ===== 任务卡片 ===== */
.task-item.clickable { cursor: pointer; }
.task-item.clickable:hover .task-name { color: var(--c-primary); }

.focus-item {
  padding: clamp(2px, 0.5vmin, 4px) 0;
  gap: clamp(4px, 1vmin, 6px);
}

.task-check-btn {
  flex-shrink: 0;
  width: clamp(14px, 2.5vmin, 18px);
  height: clamp(14px, 2.5vmin, 18px);
  border-radius: var(--radius-sm);
  border: 2px solid var(--c-border);
  background: var(--c-bg-elevated);
  font-size: clamp(10px, 1.6vmin, 12px);
  color: var(--c-text-inverse);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.task-check-btn:hover { border-color: var(--c-secondary); }
.task-check-btn.done { background: var(--c-secondary); border-color: var(--c-secondary); }
.task-check-btn.placeholder {
  color: var(--c-border);
  font-weight: 700;
  font-size: clamp(12px, 2vmin, 16px);
  border-style: dashed;
  cursor: default;
}

.task-del-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--c-border);
  font-size: clamp(10px, 1.4vmin, 12px);
  cursor: pointer;
  padding: 0 2px;
  opacity: 0;
  transition: opacity var(--transition-fast), color var(--transition-fast);
}

.focus-item:hover .task-del-btn { opacity: 0.6; }
.task-del-btn:hover { opacity: 1 !important; color: var(--c-danger); }

.deadline-mark {
  font-weight: 700;
  padding: 0 clamp(3px, 0.6vmin, 4px);
  border-radius: clamp(3px, 0.4vmin, 4px);
  font-size: clamp(8px, 1.1vmin, 10px);
}

.deadline-mark.urgent { color: var(--c-primary); background: var(--c-primary-soft); }
.deadline-mark.overdue { color: var(--c-danger); background: var(--c-danger-soft); }
.deadline-mark.normal { color: var(--c-text-secondary); background: var(--c-bg-subtle); }

.task-name.line-through {
  text-decoration: line-through;
  text-decoration-color: var(--c-text-muted);
  color: var(--c-text-secondary);
}

.custom-task-input {
  width: 100%;
  padding: clamp(2px, 0.4vmin, 4px) clamp(6px, 1.5vmin, 8px);
  border: 1.5px solid var(--c-primary);
  border-radius: var(--radius-sm);
  font-size: clamp(10px, 1.5vmin, 12px);
  font-family: inherit;
  outline: none;
  color: var(--c-text-primary);
  background: var(--c-bg-elevated);
  box-sizing: border-box;
  min-width: 0;
}

.add-task-btn {
  width: 100%;
  padding: clamp(3px, 0.6vmin, 5px) 0;
  background: none;
  border: 1.5px dashed var(--c-border);
  border-radius: var(--radius-sm);
  font-size: clamp(10px, 1.4vmin, 12px);
  font-family: inherit;
  font-weight: 600;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: clamp(2px, 0.5vmin, 4px);
}

.add-task-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }
.task-card {
  width: 100%;
  max-width: 320px;
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: clamp(6px, 1.2vmin, 10px) clamp(8px, 1.5vmin, 12px);
  box-shadow: var(--shadow-md);
  flex-shrink: 1;
  min-height: 0;
  transition: box-shadow var(--transition-base);
}
.task-card:hover {
  box-shadow: var(--shadow-lg);
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(4px, 1vmin, 8px);
}
.task-title {
  font-size: clamp(11px, 1.6vmin, 13px);
  font-weight: 700;
  color: var(--c-text-primary);
}
.task-badge {
  font-size: clamp(8px, 1.2vmin, 10px);
  background: var(--c-primary-soft);
  color: var(--c-primary);
  padding: 1px clamp(4px, 1vmin, 8px);
  border-radius: var(--radius-sm);
  font-weight: 700;
}
.task-item {
  display: flex;
  align-items: flex-start;
  gap: clamp(3px, 0.6vmin, 6px);
  padding: clamp(2px, 0.5vmin, 5px) 0;
  border-bottom: 1px solid var(--c-border-light);
}
.task-check {
  width: clamp(14px, 2.5vmin, 18px);
  height: clamp(14px, 2.5vmin, 18px);
  border-radius: var(--radius-sm);
  background: var(--c-primary-soft);
  color: var(--c-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(9px, 1.3vmin, 11px);
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 1px;
}
.task-info { flex: 1; min-width: 0; }
.task-name {
  font-size: clamp(10px, 1.5vmin, 12px);
  font-weight: 700;
  color: var(--c-text-primary);
}
.task-desc {
  font-size: clamp(8px, 1.2vmin, 10px);
  color: var(--c-text-muted);
  margin-top: 1px;
}
.task-stats {
  display: flex;
  justify-content: space-between;
  font-size: clamp(8px, 1.2vmin, 10px);
  color: var(--c-text-muted);
  padding-top: clamp(3px, 0.8vmin, 6px);
}

.btn-shop {
  margin-top: clamp(4px, 1vmin, 6px);
  padding: clamp(4px, 0.8vmin, 6px) 0;
  width: 100%;
  background: var(--c-bg-elevated);
  border: 1.5px solid var(--c-border);
  border-radius: var(--radius-md);
  font-size: clamp(10px, 1.5vmin, 13px);
  font-weight: 700;
  font-family: inherit;
  color: var(--c-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-shop:hover { background: var(--c-bg-soft); border-color: var(--c-primary); }

.shop-overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  animation: shop-fade 0.2s ease-out;
}

@keyframes shop-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.shop-header-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: clamp(6px, 1.5vmin, 10px) clamp(8px, 2vmin, 14px);
  border-bottom: 1px solid var(--c-border);
}

.btn-shop-back {
  background: none;
  border: none;
  font-size: clamp(12px, 1.8vmin, 15px);
  font-family: inherit;
  color: var(--c-primary);
  cursor: pointer;
  padding: 0;
  font-weight: 600;
}

/* ===== 向导区域 ===== */
.wizard-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 clamp(8px, 2vw, 16px);
}

/* ===== 面板占位 ===== */
.panel-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 1vmin, 6px);
}
.panel-icon { font-size: clamp(24px, 6vmin, 36px); }
.panel-name { font-size: clamp(12px, 2vmin, 15px); font-weight: 700; color: var(--c-text-secondary); }
.panel-hint { font-size: clamp(9px, 1.3vmin, 11px); color: var(--c-text-muted); }

/* ===== 底部导航 ===== */
.bottom-nav {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: clamp(40px, 8vmin, 56px);
  background: var(--c-bg-elevated);
  border-top: 1px solid var(--c-border);
  position: relative;
  z-index: 1;
}
.nav-item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.nav-icon { font-size: clamp(14px, 3vmin, 18px); line-height: 1; }
.nav-label { font-size: clamp(7px, 1.2vmin, 9px); font-weight: 700; color: var(--c-text-muted); transition: color var(--transition-fast); }
.nav-item.active .nav-label { color: var(--c-primary); }
.nav-item:hover .nav-label { color: var(--c-primary); }

/* ===== Dev Panel ===== */
.dev-panel {
  position: absolute;
  bottom: clamp(44px, 9vmin, 60px);
  right: clamp(4px, 1vmin, 8px);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: clamp(3px, 0.8vmin, 5px);
  background: var(--c-bg-soft);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-sm);
}

.dev-btn {
  width: clamp(22px, 4vmin, 28px);
  height: clamp(22px, 4vmin, 28px);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-bg-elevated);
  color: var(--c-text-secondary);
  font-size: clamp(8px, 1.2vmin, 11px);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.dev-btn.anim { width: auto; padding: 0 clamp(4px, 0.8vmin, 6px); }
.dev-row { display: flex; gap: 3px; }
.dev-row + .dev-row { margin-top: 3px; }

.dev-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }
.dev-btn.active { background: var(--c-primary); border-color: var(--c-primary); color: var(--c-text-inverse); }

.night-mode .dev-panel {
  background: var(--c-bg-soft);
  border-color: var(--c-border);
}
.night-mode .dev-btn {
  background: var(--c-bg-elevated);
  border-color: var(--c-border);
  color: var(--c-text-secondary);
}
.night-mode .dev-btn:hover { color: var(--c-primary); border-color: var(--c-border-focus); }
.night-mode .dev-btn.active { background: var(--c-primary-soft); border-color: var(--c-primary); color: var(--c-primary); }

/* ===== Night Mode ===== */
.night-mode .main-content {
  background: transparent;
}

.night-mode .timer-display { color: var(--c-primary); text-shadow: 0 2px 10px var(--c-primary-glow); }
.night-mode .timer-subtitle { color: var(--c-text-secondary); text-shadow: 0 1px 4px rgba(255, 200, 160, 0.15); }
.night-mode .loop-tag { background: var(--c-primary-soft); color: var(--c-primary); }

.night-mode .exp-label { color: var(--c-primary); }
.night-mode .exp-bar { background: var(--c-border); }
.night-mode .exp-ratio { color: var(--c-text-muted); }

.night-mode .task-card {
  background: var(--c-bg-elevated);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-lg);
}
.night-mode .task-title,
.night-mode .task-name { color: var(--c-text-primary); }
.night-mode .task-desc,
.night-mode .task-stats { color: var(--c-text-secondary); }
.night-mode .task-badge { background: var(--c-primary-soft); color: var(--c-primary); }
.night-mode .task-check { background: var(--c-primary-soft); color: var(--c-primary); }
.night-mode .task-item { border-bottom-color: var(--c-border); }

.night-mode .btn-warm {
  box-shadow: 0 3px 12px rgba(232, 149, 106, 0.25);
}
.night-mode .btn-ghost {
  background: var(--c-bg-elevated);
  border-color: var(--c-border);
  color: var(--c-text-secondary);
}
.night-mode .btn-ghost:hover { background: var(--c-bg-subtle); border-color: var(--c-border-focus); }

.night-mode .bottom-nav {
  background: var(--c-bg-elevated);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top-color: var(--c-border);
}
.night-mode .nav-label { color: var(--c-text-muted); }
.night-mode .nav-item.active .nav-label { color: var(--c-primary); }
.night-mode .nav-item:hover .nav-label { color: var(--c-primary); }

.night-mode .pet-bubble {
  background: var(--c-bg-elevated);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--c-text-primary);
  box-shadow: var(--shadow-lg);
}
.night-mode .pet-bubble::after { border-top-color: var(--c-bg-elevated); }

.night-mode .level-up-text { color: var(--c-primary); }
.night-mode .level-up-num { color: var(--c-primary-dark); }
</style>
