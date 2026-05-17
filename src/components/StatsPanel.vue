<template>
  <div class="stats-panel">
    <div class="stats-header">
      <span class="stats-title"><AppIcon name="stats" :size="18" /> 统计</span>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ pomStore.todayCompleted }}</div>
        <div class="stat-label">今日完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ pomStore.todayMinutes }}</div>
        <div class="stat-label">今日(分钟)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ pomStore.streak }}</div>
        <div class="stat-label">连续天数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ pomStore.averageSessionDuration }}</div>
        <div class="stat-label">平均(分钟)</div>
      </div>
    </div>

    <div class="weekly-section">
      <div class="section-title">专注趋势</div>
      <div class="chart-container">
        <div
          v-for="day in weekDays" :key="day.label"
          class="chart-col"
          @mouseenter="showTooltip(day.tooltip, ($event.target as HTMLElement).closest('.chart-col')!)"
          @mouseleave="hideTooltip"
        >
          <div class="chart-bar-wrapper">
            <div
              class="chart-bar"
              :style="{ height: day.height + '%' }"
              :class="{ 'has-data': day.count > 0 }"
            ></div>
          </div>
          <div class="chart-count">{{ day.count }}</div>
          <div class="chart-label">{{ day.label }}</div>
        </div>
      </div>
    </div>

    <div class="total-section">
      <span>累计 {{ pomStore.data.totalCompleted }} 次</span>
      <span>共 {{ pomStore.data.totalMinutes }} 分钟</span>
    </div>

    <!-- Tooltip -->
    <div v-if="tooltipVisible" class="chart-tooltip" :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }">{{ tooltipText }}</div>

    <!-- 健康统计 -->
    <div class="section-divider"></div>

    <div class="stats-header health-header">
      <span class="stats-title"><AppIcon name="heart" :size="18" /> 健康</span>
    </div>

    <div class="stats-grid">
      <div class="stat-card health-card">
        <div class="health-icon"><AppIcon name="water" :size="20" /></div>
        <div class="stat-value">{{ healthStore.todayWaterCount }}</div>
        <div class="stat-label">喝水</div>
      </div>
      <div class="stat-card health-card">
        <div class="health-icon"><AppIcon name="exercise" :size="20" /></div>
        <div class="stat-value">{{ healthStore.todayExerciseCount }}</div>
        <div class="stat-label">运动</div>
      </div>
      <div class="stat-card health-card">
        <div class="health-icon"><AppIcon name="eyeRest" :size="20" /></div>
        <div class="stat-value">{{ healthStore.todayEyeRestCount }}</div>
        <div class="stat-label">护眼</div>
      </div>
      <div class="stat-card health-card">
        <div class="stat-value">{{ healthStreak }}</div>
        <div class="stat-label">连续天数</div>
      </div>
    </div>

    <div class="weekly-section">
      <div class="section-title">健康趋势</div>
      <div class="chart-container">
        <div
          v-for="day in healthWeekDays" :key="day.label"
          class="chart-col"
          @mouseenter="showTooltip(day.tooltip, ($event.target as HTMLElement).closest('.chart-col')!)"
          @mouseleave="hideTooltip"
        >
          <div class="chart-bar-wrapper">
            <div
              class="chart-bar health-bar"
              :style="{ height: day.height + '%' }"
              :class="{ 'has-data': day.count > 0 }"
            ></div>
          </div>
          <div class="chart-count">{{ day.count }}</div>
          <div class="chart-label">{{ day.label }}</div>
        </div>
      </div>
    </div>

    <div class="achievements-section">
      <div class="section-title">健康成就</div>
      <div class="achievement-grid">
        <div
          v-for="ach in healthAchievements"
          :key="ach.id"
          class="achievement-badge"
          :class="{ unlocked: ach.unlocked }"
          :title="ach.desc"
        >
          <span class="ach-icon"><AppIcon :name="ach.icon" :size="18" /></span>
          <span class="ach-name">{{ ach.name }}</span>
        </div>
      </div>
    </div>

    <!-- 习惯统计 -->
    <div class="section-divider"></div>

    <div class="stats-header health-header">
      <span class="stats-title"><AppIcon name="habit" :size="18" /> 习惯</span>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ habitStore.completedToday }}/{{ habitStore.todayHabits.length }}</div>
        <div class="stat-label">今日完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-value"><AppIcon name="flame" :size="16" />{{ habitStore.longestStreak }}</div>
        <div class="stat-label">最长连击</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ habitStore.totalCheckins }}</div>
        <div class="stat-label">总打卡数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ habitStore.completionRate }}%</div>
        <div class="stat-label">月完成率</div>
      </div>
    </div>

    <div class="weekly-section">
      <div class="section-title">习惯趋势</div>
      <div class="chart-container">
        <div
          v-for="day in habitWeekDays" :key="day.label"
          class="chart-col"
          @mouseenter="showTooltip(day.tooltip, ($event.target as HTMLElement).closest('.chart-col')!)"
          @mouseleave="hideTooltip"
        >
          <div class="chart-bar-wrapper">
            <div
              class="chart-bar habit-bar"
              :style="{ height: day.height + '%' }"
              :class="{ 'has-data': day.count > 0 }"
            ></div>
          </div>
          <div class="chart-count">{{ day.count }}</div>
          <div class="chart-label">{{ day.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePomodoroStore } from '@/stores/pomodoro'
import { useHealthStore } from '@/stores/health'
import { useHabitStore } from '@/stores/habit'
import { toLocalDateStr } from '@/utils/date'
import AppIcon from '@/components/AppIcon.vue'

const pomStore = usePomodoroStore()
const healthStore = useHealthStore()
const habitStore = useHabitStore()

// --- Tooltip state ---
const tooltipVisible = ref(false)
const tooltipText = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)
let tooltipTimer: ReturnType<typeof setTimeout> | null = null

function showTooltip(text: string, el: HTMLElement) {
  if (tooltipTimer) clearTimeout(tooltipTimer)
  tooltipText.value = text
  const rect = el.getBoundingClientRect()
  tooltipX.value = rect.left + rect.width / 2
  tooltipY.value = rect.top - 12
  tooltipVisible.value = true
}

function hideTooltip() {
  tooltipTimer = setTimeout(() => { tooltipVisible.value = false }, 150)
}

const weekDays = computed(() => {
  const dayLabels = ['日', '一', '二', '三', '四', '五', '六']
  const weekly = pomStore.weeklyHistory
  const entries = Object.entries(weekly)

  const dayData = entries.map(([dateStr, records]) => {
    const parts = dateStr.split('-')
    const dayOfWeek = new Date(+parts[0], +parts[1] - 1, +parts[2]).getDay()
    const totalSeconds = records.reduce((sum, r) => sum + r.duration, 0)
    const minutes = Math.round(totalSeconds / 60)
    return {
      label: dayLabels[dayOfWeek],
      count: records.length,
      minutes,
      tooltip: `完成 ${records.length} 次\n专注 ${minutes} 分钟`,
    }
  })

  const maxMinutes = Math.max(1, ...dayData.map(d => d.minutes))
  return dayData.map(d => ({ ...d, height: Math.round((d.minutes / maxMinutes) * 100) }))
})

// --- Health stats ---
const healthWeekDays = computed(() => {
  const dayLabels = ['日', '一', '二', '三', '四', '五', '六']
  const result: { label: string; count: number; height: number; water: number; exercise: number; eyeRest: number; tooltip: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = toLocalDateStr(d)
    const rec = healthStore.records.find(r => r.date === dateStr)
    const water = rec?.waterCount ?? 0
    const exercise = rec?.exerciseCount ?? 0
    const eyeRest = rec?.eyeRestCount ?? 0
    const count = water + exercise + eyeRest
    result.push({
      label: dayLabels[d.getDay()],
      count, water, exercise, eyeRest,
      tooltip: `喝水${water}次 运动${exercise}次 护眼${eyeRest}次`,
      height: 0,
    })
  }
  const maxCount = Math.max(1, ...result.map(d => d.count))
  result.forEach(d => { d.height = Math.round((d.count / maxCount) * 100) })
  return result
})

const healthStreak = computed(() => {
  let streak = 0
  const todayDate = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(todayDate)
    d.setDate(d.getDate() - i)
    const dateStr = toLocalDateStr(d)
    const rec = healthStore.records.find(r => r.date === dateStr)
    if (rec && (rec.waterCount > 0 || rec.exerciseCount > 0 || rec.eyeRestCount > 0)) {
      streak++
    } else if (i === 0) {
      continue
    } else {
      break
    }
  }
  return streak
})

// --- 每周成就（周一重置）---
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0=周日, 1=周一...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const healthAchievements = computed(() => {
  const monday = getMonday(new Date())
  const weekDates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    weekDates.push(toLocalDateStr(d))
  }

  const weekRecords = weekDates.map(date =>
    healthStore.records.find(r => r.date === date)
  )

  // 水润达人：本周每天喝水≥3次（连续7天）
  const waterDays = weekRecords.filter(r => r && r.waterCount >= 3).length
  const waterMaster = waterDays >= 7

  // 运动达人：本周累计运动≥5次
  const totalExercise = weekRecords.reduce((s, r) => s + (r?.exerciseCount ?? 0), 0)
  const exerciseMaster = totalExercise >= 5

  // 护眼达人：本周累计护眼≥5次
  const totalEyeRest = weekRecords.reduce((s, r) => s + (r?.eyeRestCount ?? 0), 0)
  const eyeRestMaster = totalEyeRest >= 5

  // 早睡达人：本周早睡≥4次
  const totalSleep = weekRecords.filter(r => r?.sleepReminderResponded).length
  const sleepMaster = totalSleep >= 4

  // 健康坚持：同时达成任意3个成就
  const achievedCount = [waterMaster, exerciseMaster, eyeRestMaster, sleepMaster].filter(Boolean).length
  const healthChampion = achievedCount >= 3

  return [
    { id: 'water', icon: 'water', name: '水润达人', unlocked: waterMaster, desc: `本周 ${waterDays}/7 天喝水≥3次` },
    { id: 'exercise', icon: 'exercise', name: '运动达人', unlocked: exerciseMaster, desc: `本周运动 ${totalExercise}/5 次` },
    { id: 'eyerest', icon: 'eyeRest', name: '护眼达人', unlocked: eyeRestMaster, desc: `本周护眼 ${totalEyeRest}/5 次` },
    { id: 'sleep', icon: 'sleep', name: '早睡达人', unlocked: sleepMaster, desc: `本周早睡 ${totalSleep}/4 次` },
    { id: 'champion', icon: 'trophy', name: '健康坚持', unlocked: healthChampion, desc: `已达成 ${achievedCount}/4 项` },
  ]
})

// --- Habit stats ---
const habitWeekDays = computed(() => {
  const data = habitStore.weeklyData
  const maxCount = Math.max(1, ...data.map(d => d.count))
  return data.map(d => {
    const rate = d.total > 0 ? Math.round((d.count / d.total) * 100) : 0
    return {
      label: d.label,
      count: d.count,
      total: d.total,
      rate,
      tooltip: `已打卡 ${d.count}/${d.total}\n完成率 ${rate}%`,
      height: Math.round((d.count / maxCount) * 100),
    }
  })
})
</script>

<style scoped>
.stats-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  overflow-y: auto;
}

.stats-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(8px, 2vmin, 12px) clamp(8px, 2vmin, 12px);
  border-bottom: 1px solid var(--c-border);
}

.stats-title {
  font-weight: 700;
  font-size: clamp(14px, 2.5vmin, 18px);
  color: var(--c-text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(6px, 1.5vmin, 10px);
  padding: clamp(8px, 2vmin, 14px);
}

.stat-card {
  background: var(--c-bg-elevated);
  border: 1.5px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: clamp(10px, 2.5vmin, 16px) clamp(6px, 1.5vmin, 10px);
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}
.stat-card:hover {
  box-shadow: var(--shadow-md);
}

.stat-value {
  font-size: clamp(20px, 7vmin, 36px);
  font-weight: 800;
  color: var(--c-primary);
  line-height: 1.1;
}

.stat-label {
  font-size: clamp(10px, 1.8vmin, 14px);
  color: var(--c-text-muted);
  margin-top: clamp(2px, 0.5vmin, 4px);
  font-weight: 600;
}

.weekly-section {
  padding: clamp(4px, 1vmin, 8px) clamp(8px, 2vmin, 14px) clamp(8px, 2vmin, 14px);
}

.section-title {
  font-size: clamp(12px, 2vmin, 16px);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: clamp(4px, 1vmin, 8px);
  text-align: center;
}

.chart-container {
  display: flex;
  align-items: flex-end;
  gap: clamp(3px, 1vmin, 6px);
  background: var(--c-bg-elevated);
  border: 1.5px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: clamp(8px, 2vmin, 14px) clamp(4px, 1.5vmin, 8px) clamp(4px, 1vmin, 8px);
  height: clamp(90px, 24vmin, 150px);
  box-shadow: var(--shadow-sm);
}

.chart-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.chart-bar-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bar {
  width: 70%;
  min-height: 3px;
  background: var(--c-border);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.chart-bar.has-data {
  background: linear-gradient(to top, var(--c-primary), var(--c-primary-light));
}

.chart-count {
  font-size: clamp(9px, 1.5vmin, 12px);
  font-weight: 700;
  color: var(--c-text-secondary);
  margin-top: clamp(2px, 0.5vmin, 4px);
}

.chart-label {
  font-size: clamp(9px, 1.5vmin, 12px);
  color: var(--c-text-muted);
}

.total-section {
  flex-shrink: 0;
  display: flex;
  justify-content: space-around;
  padding: clamp(8px, 1.5vmin, 12px) clamp(8px, 2vmin, 14px);
  background: var(--c-bg-elevated);
  border-top: 1px solid var(--c-border);
  font-size: clamp(11px, 1.8vmin, 14px);
  color: var(--c-text-secondary);
  font-weight: 600;
}

/* --- Health section --- */
.section-divider {
  height: 1px;
  background: var(--c-border);
  margin: clamp(4px, 1vmin, 8px) clamp(8px, 2vmin, 14px);
}

.health-header {
  border-bottom: none;
  padding-bottom: 0;
}

.health-icon {
  font-size: clamp(14px, 3vmin, 20px);
  line-height: 1;
  margin-bottom: clamp(2px, 0.5vmin, 4px);
}

.health-card .stat-value {
  color: var(--c-secondary);
}

.chart-bar.health-bar.has-data {
  background: linear-gradient(to top, var(--c-secondary), var(--c-secondary-light));
}

.chart-bar.habit-bar.has-data {
  background: linear-gradient(to top, var(--c-primary), var(--c-primary-light));
}

.achievements-section {
  padding: clamp(4px, 1vmin, 8px) clamp(8px, 2vmin, 14px) clamp(8px, 2vmin, 14px);
}

.achievement-grid {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(4px, 1vmin, 6px);
  justify-content: center;
}

.achievement-badge {
  display: flex;
  align-items: center;
  gap: clamp(2px, 0.5vmin, 4px);
  padding: clamp(3px, 0.8vmin, 6px) clamp(6px, 1.5vmin, 10px);
  background: var(--c-border);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  opacity: 0.45;
  transition: all 0.3s ease;
}

.achievement-badge.unlocked {
  opacity: 1;
  background: var(--c-secondary-soft);
  border-color: var(--c-secondary-light);
}

.ach-icon {
  font-size: clamp(10px, 1.5vmin, 13px);
  line-height: 1;
}

.ach-name {
  font-size: clamp(10px, 1.5vmin, 13px);
  font-weight: 700;
  color: var(--c-text-primary);
  font-family: inherit;
  white-space: nowrap;
  line-height: 1.3;
}

/* ===== Chart Tooltip ===== */
.chart-tooltip {
  position: fixed;
  transform: translate(-50%, -100%);
  background: rgba(74, 69, 64, 0.92);
  color: var(--c-text-inverse);
  padding: clamp(6px, 1.2vmin, 8px) clamp(10px, 2vmin, 14px);
  border-radius: var(--radius-md);
  font-size: clamp(11px, 1.5vmin, 13px);
  font-weight: 600;
  white-space: pre-line;
  line-height: 1.5;
  text-align: center;
  pointer-events: none;
  z-index: 300;
  box-shadow: var(--shadow-lg);
  animation: tooltip-in 0.15s ease-out;
}

.chart-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(74, 69, 64, 0.92);
}

@keyframes tooltip-in {
  from { opacity: 0; transform: translate(-50%, calc(-100% + 4px)); }
  to { opacity: 1; transform: translate(-50%, -100%); }
}
</style>
