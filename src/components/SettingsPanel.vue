<template>
  <div class="settings-panel">
    <div class="settings-header">
      <span class="settings-title"><AppIcon name="settings" :size="18" /> 设置</span>
    </div>

    <div class="settings-body">
      <!-- 番茄钟 -->
      <section class="settings-section">
        <div class="section-title"><AppIcon name="clock" :size="16" /> 番茄钟</div>

        <div class="setting-row">
          <span class="setting-label">专注时长</span>
          <div class="slider-row">
            <input type="range" :min="10" :max="60" :step="5"
              :value="s.workDuration" @change="set('workDuration', +($event.target as HTMLInputElement).value)" />
            <span class="slider-val">{{ s.workDuration }}分</span>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">休息时长</span>
          <div class="slider-row">
            <input type="range" :min="3" :max="15" :step="1"
              :value="s.breakDuration" @change="set('breakDuration', +($event.target as HTMLInputElement).value)" />
            <span class="slider-val">{{ s.breakDuration }}分</span>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">长休息时长</span>
          <div class="slider-row">
            <input type="range" :min="10" :max="30" :step="5"
              :value="s.longBreakDuration" @change="set('longBreakDuration', +($event.target as HTMLInputElement).value)" />
            <span class="slider-val">{{ s.longBreakDuration }}分</span>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">长休息间隔</span>
          <div class="slider-row">
            <input type="range" :min="2" :max="6" :step="1"
              :value="s.sessionsUntilLongBreak" @change="set('sessionsUntilLongBreak', +($event.target as HTMLInputElement).value)" />
            <span class="slider-val">{{ s.sessionsUntilLongBreak }}次</span>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">默认模式</span>
          <div class="toggle-pills">
            <button class="pill" :class="{ active: s.defaultMode === 'countdown' }"
              @click="set('defaultMode', 'countdown')">倒计时</button>
            <button class="pill" :class="{ active: s.defaultMode === 'countup' }"
              @click="set('defaultMode', 'countup')">正计时</button>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">自动开始休息</span>
          <button class="toggle-switch" :class="{ on: s.autoStartBreak }"
            @click="set('autoStartBreak', !s.autoStartBreak)">
            <span class="toggle-knob"></span>
          </button>
        </div>

        <div class="setting-row">
          <span class="setting-label">自动开始专注</span>
          <button class="toggle-switch" :class="{ on: s.autoStartWork }"
            @click="set('autoStartWork', !s.autoStartWork)">
            <span class="toggle-knob"></span>
          </button>
        </div>
      </section>

      <!-- 音效 -->
      <section class="settings-section">
        <div class="section-title"><AppIcon name="volumeOn" :size="16" /> 音效</div>

        <div class="setting-row">
          <span class="setting-label">音效</span>
          <button class="toggle-switch" :class="{ on: s.soundEnabled }"
            @click="set('soundEnabled', !s.soundEnabled)">
            <span class="toggle-knob"></span>
          </button>
        </div>

        <div class="setting-row">
          <span class="setting-label">音量</span>
          <div class="slider-row">
            <input type="range" :min="0" :max="100" :step="10"
              :value="s.soundVolume" @change="set('soundVolume', +($event.target as HTMLInputElement).value)" />
            <span class="slider-val">{{ s.soundVolume }}%</span>
          </div>
        </div>
      </section>

      <!-- 健康提醒 -->
      <section class="settings-section">
        <div class="section-title"><AppIcon name="heart" :size="16" /> 健康提醒</div>

        <div class="setting-row">
          <span class="setting-label"><AppIcon name="water" :size="16" /> 喝水提醒</span>
          <button class="toggle-switch" :class="{ on: s.waterEnabled }"
            @click="set('waterEnabled', !s.waterEnabled)">
            <span class="toggle-knob"></span>
          </button>
        </div>
        <div v-if="s.waterEnabled" class="setting-row sub">
          <span class="setting-label">每N个番茄钟</span>
          <div class="slider-row">
            <input type="range" :min="1" :max="5" :step="1"
              :value="s.waterInterval" @change="set('waterInterval', +($event.target as HTMLInputElement).value)" />
            <span class="slider-val">{{ s.waterInterval }}个</span>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label"><AppIcon name="exercise" :size="16" /> 运动提醒</span>
          <button class="toggle-switch" :class="{ on: s.exerciseEnabled }"
            @click="set('exerciseEnabled', !s.exerciseEnabled)">
            <span class="toggle-knob"></span>
          </button>
        </div>
        <div v-if="s.exerciseEnabled" class="setting-row sub">
          <span class="setting-label">每N个番茄钟</span>
          <div class="slider-row">
            <input type="range" :min="2" :max="8" :step="1"
              :value="s.exerciseInterval" @change="set('exerciseInterval', +($event.target as HTMLInputElement).value)" />
            <span class="slider-val">{{ s.exerciseInterval }}个</span>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label"><AppIcon name="eyeRest" :size="16" /> 用眼休息</span>
          <button class="toggle-switch" :class="{ on: s.eyeRestEnabled }"
            @click="set('eyeRestEnabled', !s.eyeRestEnabled)">
            <span class="toggle-knob"></span>
          </button>
        </div>
        <div v-if="s.eyeRestEnabled" class="setting-row sub">
          <span class="setting-label">间隔分钟</span>
          <div class="slider-row">
            <input type="range" :min="30" :max="120" :step="10"
              :value="s.eyeRestMinutes" @change="set('eyeRestMinutes', +($event.target as HTMLInputElement).value)" />
            <span class="slider-val">{{ s.eyeRestMinutes }}分</span>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label"><AppIcon name="sleep" :size="16" /> 睡眠提醒</span>
          <button class="toggle-switch" :class="{ on: s.sleepEnabled }"
            @click="set('sleepEnabled', !s.sleepEnabled)">
            <span class="toggle-knob"></span>
          </button>
        </div>
        <div v-if="s.sleepEnabled" class="setting-row sub">
          <span class="setting-label">提醒时间</span>
          <div class="slider-row">
            <input type="range" :min="21" :max="24" :step="1"
              :value="s.sleepAfterHour" @change="set('sleepAfterHour', +($event.target as HTMLInputElement).value)" />
            <span class="slider-val">{{ s.sleepAfterHour === 24 ? '次日0:00' : s.sleepAfterHour + ':00' }}</span>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">提醒方式</span>
          <div class="toggle-pills">
            <button class="pill" :class="{ active: s.reminderStyle === 'dialogue' }"
              @click="set('reminderStyle', 'dialogue')">对话</button>
            <button class="pill" :class="{ active: s.reminderStyle === 'toast' }"
              @click="set('reminderStyle', 'toast')">通知</button>
            <button class="pill" :class="{ active: s.reminderStyle === 'silent' }"
              @click="set('reminderStyle', 'silent')">静默</button>
          </div>
        </div>
      </section>

      <!-- 时段背景 -->
      <section class="settings-section">
        <div class="section-title"><AppIcon name="sun" :size="16" /> 时段背景</div>
        <div
          class="timeline-wrapper"
          ref="timelineRef"
        >
          <div class="timeline-bar">
            <div class="tl-segment tl-morning" :style="{ width: morningPct + '%' }"></div>
            <div class="tl-segment tl-afternoon" :style="{ width: afternoonPct + '%' }"></div>
            <div class="tl-segment tl-evening" :style="{ width: eveningPct + '%' }"></div>
            <div class="tl-segment tl-night" :style="{ width: nightPct + '%' }"></div>
          </div>
          <div
            v-for="h in handles"
            :key="h.key"
            class="tl-handle"
            :style="{ left: h.pct + '%' }"
            @pointerdown.prevent="startDrag(h.key, $event)"
          >
            <div class="tl-dot"></div>
            <span class="tl-hour">{{ h.hour }}:00</span>
          </div>
        </div>
        <div class="tl-labels">
          <span>早</span><span>午</span><span>晚</span><span>夜</span>
        </div>
      </section>

      <!-- 窗口设置 -->
      <section class="settings-section">
        <div class="section-title"><AppIcon name="window" :size="16" /> 窗口</div>
      </section>

      <!-- 数据管理 -->
      <section class="settings-section">
        <div class="section-title"><AppIcon name="download" :size="16" /> 数据管理</div>

        <div class="setting-row">
          <span class="setting-label">备份数据</span>
          <button class="btn-action" @click="handleBackup">导出备份</button>
        </div>

        <div class="setting-row">
          <span class="setting-label">恢复数据</span>
          <button class="btn-action" @click="triggerRestore">导入恢复</button>
        </div>
        <input ref="fileInputRef" type="file" accept=".json" style="display:none" @change="handleRestore" />

        <div class="setting-row">
          <span class="setting-label">重置设置</span>
          <button class="btn-action danger" @click="confirmReset">重置</button>
        </div>

        <div class="setting-row">
          <span class="setting-label danger-label">清空所有数据</span>
          <button class="btn-action danger" @click="confirmClearAll">清空</button>
        </div>
      </section>

      <div class="settings-footer">
        v0.1.0 · 陪伴式学习助手
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div v-if="dialogOpen" class="dialog-overlay" @click.self="dialogOpen = false">
      <div class="dialog-inner">
        <div class="dialog-title">{{ dialogTitle }}</div>
        <div class="dialog-hint" v-if="dialogHint">{{ dialogHint }}</div>
        <div class="dialog-btns">
          <button class="btn-dialog-cancel" @click="dialogOpen = false">取消</button>
          <button class="btn-dialog-ok" :class="{ danger: dialogDanger }" @click="dialogConfirm">{{ dialogOkText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { backupData, restoreData } from '@/services/storage/backup'
import { StorageService } from '@/services/storage'
import { toLocalDateStr } from '@/utils/date'
import AppIcon from '@/components/AppIcon.vue'
import type { StoreName } from '@/services/storage/schema'

const store = useSettingsStore()
const s = computed(() => store.settings)

const fileInputRef = ref<HTMLInputElement | null>(null)

// --- Timeline ---
const timelineRef = ref<HTMLElement | null>(null)
const draggingKey = ref<string | null>(null)

const morningPct = computed(() => (s.value.morningEnd / 24) * 100)
const afternoonPct = computed(() => ((s.value.afternoonEnd - s.value.morningEnd) / 24) * 100)
const eveningPct = computed(() => ((s.value.eveningEnd - s.value.afternoonEnd) / 24) * 100)
const nightPct = computed(() => ((24 - s.value.eveningEnd) / 24) * 100)

const handles = computed(() => [
  { key: 'morningEnd', hour: s.value.morningEnd, pct: (s.value.morningEnd / 24) * 100 },
  { key: 'afternoonEnd', hour: s.value.afternoonEnd, pct: (s.value.afternoonEnd / 24) * 100 },
  { key: 'eveningEnd', hour: s.value.eveningEnd, pct: (s.value.eveningEnd / 24) * 100 },
])

function startDrag(key: string, e: PointerEvent) {
  draggingKey.value = key
  const el = timelineRef.value
  if (el) el.setPointerCapture(e.pointerId)
}

function onDrag(e: PointerEvent) {
  if (!draggingKey.value || !timelineRef.value) return
  const rect = timelineRef.value.getBoundingClientRect()
  let pct = ((e.clientX - rect.left) / rect.width) * 100
  pct = Math.max(0, Math.min(100, pct))
  const hour = Math.round((pct / 100) * 24)
  const clamped = Math.max(0, Math.min(23, hour))
  store.updateSetting(draggingKey.value as keyof typeof s.value, clamped)
}

function endDrag() {
  draggingKey.value = null
}

function onTimelinePointerMove(e: PointerEvent) {
  if (draggingKey.value) onDrag(e)
}

onMounted(() => {
  window.addEventListener('pointermove', onTimelinePointerMove)
  window.addEventListener('pointerup', endDrag)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onTimelinePointerMove)
  window.removeEventListener('pointerup', endDrag)
})

// Dialog state
const dialogOpen = ref(false)
const dialogTitle = ref('')
const dialogHint = ref('')
const dialogOkText = ref('确认')
const dialogDanger = ref(false)
let dialogAction: (() => void) | null = null

function openDialog(title: string, hint: string, okText: string, danger: boolean, action: () => void) {
  dialogTitle.value = title
  dialogHint.value = hint
  dialogOkText.value = okText
  dialogDanger.value = danger
  dialogAction = action
  dialogOpen.value = true
}

function dialogConfirm() {
  dialogOpen.value = false
  dialogAction?.()
  dialogAction = null
}

function set<K extends keyof typeof s.value>(key: K, value: typeof s.value[K]) {
  store.updateSetting(key, value)
}

// Backup
async function handleBackup() {
  try {
    const blob = await backupData()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `learning-companion-backup-${toLocalDateStr(new Date())}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Backup failed:', e)
  }
}

// Restore
function triggerRestore() {
  fileInputRef.value?.click()
}

async function handleRestore(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  // Read file content immediately before browser may release the reference
  let fileBlob: Blob
  try {
    fileBlob = new Blob([await file.arrayBuffer()], { type: 'application/json' })
  } catch {
    return
  }
  openDialog(
    '恢复数据',
    '导入将覆盖当前所有数据，此操作不可撤销。确定继续？',
    '确认恢复',
    true,
    async () => {
      try {
        await restoreData(fileBlob)
        window.location.reload()
      } catch (err) {
        console.error('Restore failed:', err)
      }
    }
  )
  ;(e.target as HTMLInputElement).value = ''
}

// Reset
function confirmReset() {
  openDialog(
    '重置设置',
    '将恢复所有设置为默认值，数据不受影响。',
    '重置',
    true,
    () => store.resetToDefaults()
  )
}

// Clear all data
function confirmClearAll() {
  openDialog(
    '清空所有数据',
    '确定要清空所有进度和数据吗？此操作不可恢复！',
    '确认清空',
    true,
    async () => {
      const storage = new StorageService()
      const stores: StoreName[] = [
        'users', 'pets', 'memos', 'habits',
        'pomodoro_history', 'pomodoro_state', 'outfits',
        'health_records', 'achievements', 'settings',
      ]
      await Promise.allSettled(stores.map(s => storage.clearStore(s)))
      window.location.reload()
    }
  )
}

onMounted(() => {
  if (!store.isLoaded) store.load()
})
</script>

<style scoped>
.settings-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  overflow-y: auto;
  overflow-x: hidden;
}

.settings-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: clamp(8px, 2vmin, 12px) clamp(8px, 2vmin, 14px);
  border-bottom: 1px solid var(--c-border);
}

.settings-title {
  font-weight: 700;
  font-size: clamp(16px, 2.8vmin, 20px);
  color: var(--c-text-primary);
}

.settings-body {
  flex: 1;
  padding: 0 clamp(8px, 2vmin, 14px) clamp(8px, 2vmin, 12px);
}

/* ===== Section ===== */
.settings-section {
  margin-top: clamp(10px, 2.5vmin, 16px);
}

.section-title {
  font-size: clamp(12px, 1.8vmin, 15px);
  font-weight: 700;
  color: var(--c-text-primary);
  padding-bottom: clamp(4px, 1vmin, 6px);
  border-bottom: 1px solid var(--c-border);
  margin-bottom: clamp(4px, 1vmin, 6px);
}

/* ===== Setting Row ===== */
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(5px, 1.2vmin, 8px) 0;
  gap: clamp(6px, 1.5vmin, 10px);
}

.setting-row.sub {
  padding-left: clamp(12px, 3vmin, 20px);
}

.setting-label {
  font-size: clamp(11px, 1.6vmin, 14px);
  color: var(--c-text-primary);
  font-weight: 500;
  white-space: nowrap;
}

/* ===== Slider ===== */
.slider-row {
  display: flex;
  align-items: center;
  gap: clamp(4px, 1vmin, 8px);
  flex-shrink: 0;
}

.slider-val {
  font-size: clamp(10px, 1.3vmin, 12px);
  font-weight: 700;
  color: var(--c-primary);
  min-width: clamp(28px, 6vmin, 36px);
  text-align: right;
  white-space: nowrap;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: clamp(80px, 20vmin, 120px);
  height: clamp(4px, 0.8vmin, 6px);
  background: var(--c-border);
  border-radius: var(--radius-sm);
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: clamp(14px, 2.8vmin, 18px);
  height: clamp(14px, 2.8vmin, 18px);
  background: var(--c-primary);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid var(--c-bg-elevated);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

input[type="range"]::-moz-range-thumb {
  width: clamp(14px, 2.8vmin, 18px);
  height: clamp(14px, 2.8vmin, 18px);
  background: var(--c-primary);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid var(--c-bg-elevated);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

/* ===== Toggle Switch ===== */
.toggle-switch {
  flex-shrink: 0;
  width: clamp(36px, 7vmin, 44px);
  height: clamp(20px, 4vmin, 24px);
  background: var(--c-border);
  border-radius: 99px;
  border: none;
  padding: clamp(2px, 0.4vmin, 3px);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background var(--transition-base);
  box-sizing: border-box;
}

.toggle-switch.on {
  background: var(--c-secondary);
}

.toggle-knob {
  width: clamp(16px, 3.2vmin, 18px);
  height: clamp(16px, 3.2vmin, 18px);
  background: var(--c-bg-elevated);
  border-radius: 50%;
  transition: margin-left var(--transition-base);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  margin-left: 0;
}

.toggle-switch.on .toggle-knob {
  margin-left: auto;
}

.option-group {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.option-group button {
  padding: 4px 8px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-bg-elevated);
  font-size: clamp(9px, 1.3vmin, 11px);
  font-weight: 600;
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}
.option-group button:hover { border-color: var(--c-primary); color: var(--c-primary); }
.option-group button.active {
  background: linear-gradient(145deg, var(--c-primary), var(--c-primary-dark));
  color: var(--c-text-inverse);
  border-color: transparent;
  box-shadow: 0 1px 4px rgba(232, 149, 106, 0.3);
}

/* ===== Toggle Pills ===== */
.toggle-pills {
  display: flex;
  gap: clamp(2px, 0.4vmin, 3px);
  flex-shrink: 0;
}

.pill {
  padding: clamp(3px, 0.6vmin, 5px) clamp(8px, 2vmin, 14px);
  border: 1.5px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-bg-elevated);
  font-size: clamp(10px, 1.3vmin, 12px);
  font-family: inherit;
  font-weight: 600;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pill.active {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: var(--c-text-inverse);
}

.pill:not(.active):hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

/* ===== Action Buttons ===== */
.btn-action {
  flex-shrink: 0;
  padding: clamp(4px, 0.8vmin, 6px) clamp(10px, 2.5vmin, 16px);
  background: var(--c-bg-elevated);
  border: 1.5px solid var(--c-border);
  border-radius: var(--radius-md);
  font-size: clamp(10px, 1.3vmin, 12px);
  font-family: inherit;
  font-weight: 600;
  color: var(--c-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-action:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.btn-action.danger:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
}

.danger-label {
  color: var(--c-danger);
}

/* ===== Footer ===== */
.settings-footer {
  text-align: center;
  font-size: clamp(9px, 1.2vmin, 11px);
  color: var(--c-text-muted);
  padding: clamp(10px, 2.5vmin, 16px) 0 clamp(6px, 1.5vmin, 10px);
}

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
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: clamp(12px, 3vmin, 20px);
  width: clamp(220px, 60vmin, 280px);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 1.5vmin, 10px);
}

.dialog-title {
  font-size: clamp(14px, 2.2vmin, 17px);
  font-weight: 700;
  color: var(--c-text-primary);
}

.dialog-hint {
  font-size: clamp(10px, 1.4vmin, 13px);
  color: var(--c-text-secondary);
  line-height: 1.4;
}

.dialog-btns {
  display: flex;
  gap: clamp(6px, 1.5vmin, 10px);
}

.btn-dialog-cancel, .btn-dialog-ok {
  flex: 1;
  padding: clamp(5px, 1vmin, 7px);
  border-radius: var(--radius-sm);
  font-size: clamp(12px, 1.7vmin, 14px);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
}

.btn-dialog-cancel {
  background: var(--c-bg-subtle);
  color: var(--c-text-secondary);
}

.btn-dialog-ok {
  background: var(--c-primary);
  color: var(--c-text-inverse);
}

.btn-dialog-ok.danger {
  background: var(--c-danger);
}

/* ===== Night Mode ===== */
.night-mode .settings-panel {
  background: var(--c-bg);
}

.night-mode .settings-header {
  border-bottom-color: var(--c-border);
}

.night-mode .settings-title {
  color: var(--c-text-primary);
}

.night-mode .section-title {
  color: var(--c-text-primary);
  border-bottom-color: var(--c-border);
}

.night-mode .setting-label {
  color: var(--c-text-secondary);
}

.night-mode input[type="range"] {
  background: var(--c-border);
}

.night-mode .toggle-switch {
  background: var(--c-border);
}

.night-mode .pill {
  background: var(--c-bg-elevated);
  border-color: var(--c-border);
  color: var(--c-text-secondary);
}

.night-mode .pill.active {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: var(--c-text-inverse);
}

.night-mode .btn-action {
  background: var(--c-bg-elevated);
  border-color: var(--c-border);
  color: var(--c-text-secondary);
}

.night-mode .btn-action:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.night-mode .btn-action.danger:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
}

.night-mode .danger-label {
  color: var(--c-danger);
}

.night-mode .settings-footer {
  color: var(--c-text-muted);
}

/* ===== Timeline ===== */
.timeline-wrapper {
  position: relative;
  padding: clamp(28px, 6vmin, 36px) 0 clamp(14px, 3vmin, 18px);
  touch-action: none;
  user-select: none;
}

.timeline-bar {
  display: flex;
  height: clamp(10px, 1.8vmin, 14px);
  border-radius: clamp(5px, 1vmin, 7px);
  overflow: hidden;
}

.tl-segment {
  height: 100%;
  transition: width 0.1s ease;
}

.tl-morning { background: #FFD4A8; }
.tl-afternoon { background: #87CEEB; }
.tl-evening { background: #FF9A6C; }
.tl-night { background: #1a1a2e; }

.tl-handle {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: grab;
  z-index: 2;
}

.tl-handle:active { cursor: grabbing; }

.tl-dot {
  width: clamp(12px, 2.4vmin, 16px);
  height: clamp(12px, 2.4vmin, 16px);
  background: var(--c-bg-elevated);
  border: 2px solid var(--c-primary);
  border-radius: 50%;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.1s;
}

.tl-handle:active .tl-dot { transform: scale(1.2); }

.tl-hour {
  font-size: clamp(9px, 1.3vmin, 11px);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-top: clamp(14px, 3vmin, 20px);
}

.tl-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 clamp(4px, 1vmin, 8px);
  font-size: clamp(9px, 1.3vmin, 11px);
  font-weight: 600;
  color: var(--c-text-muted);
}
</style>
