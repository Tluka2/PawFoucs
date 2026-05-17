import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useHealthStore } from '@/stores/health'
import { useSettingsStore } from '@/stores/settings'
import { usePomodoroStore } from '@/stores/pomodoro'
import { useUserStore } from '@/stores/user'
import { usePetStore } from '@/stores/pet'
import { useSound } from '@/composables/useSound'
import { toLocalDateStr } from '@/utils/date'
import type { ReminderType, UserResponse } from '@/types/health'

export interface HealthReminder {
  type: ReminderType
  title: string
  message: string
  icon: string
}

const REMINDER_META: Record<ReminderType, { title: string; icon: string; messages: string[] }> = {
  water: {
    title: '该喝水啦',
    icon: 'water',
    messages: ['记得喝一杯水哦~', '补充水分，保持状态!', '喝水时间到!'],
  },
  exercise: {
    title: '活动一下',
    icon: 'exercise',
    messages: ['站起来动一动吧!', '做几个拉伸放松一下~', '该活动活动身体了!'],
  },
  eyeRest: {
    title: '让眼睛休息',
    icon: 'eyeRest',
    messages: ['看看远处放松眼睛~', '闭眼休息几秒吧!', '注意用眼健康哦~'],
  },
  sleep: {
    title: '该休息了',
    icon: 'sleep',
    messages: ['已经很晚了，早点休息吧~', '熬夜不好哦，明天继续!', '该睡觉啦~'],
  },
}

export function useHealthReminder() {
  const healthStore = useHealthStore()
  const settingsStore = useSettingsStore()
  const pomStore = usePomodoroStore()
  const userStore = useUserStore()
  const petStore = usePetStore()
  const { playReminderSound, playCoinSound } = useSound()

  const activeReminder = ref<HealthReminder | null>(null)
  let pendingReminder: HealthReminder | null = null
  let laterRescheduleTimer: ReturnType<typeof setTimeout> | null = null
  let lastSleepTriggerDate: string | null = null
  let lastWaterPomCount = 0
  let lastExercisePomCount = 0
  let sessionStart: number | null = null
  let eyeRestTimer: ReturnType<typeof setInterval> | null = null
  let sleepCheckTimer: ReturnType<typeof setInterval> | null = null

  function pickMessage(type: ReminderType): string {
    const msgs = REMINDER_META[type].messages
    return msgs[Math.floor(Math.random() * msgs.length)]
  }

  function showReminder(reminder: HealthReminder) {
    activeReminder.value = reminder
    playReminderSound()
  }

  function trigger(type: ReminderType) {
    const s = settingsStore.settings
    if (type === 'water' && !s.waterEnabled) return
    if (type === 'exercise' && !s.exerciseEnabled) return
    if (type === 'eyeRest' && !s.eyeRestEnabled) return
    if (type === 'sleep' && !s.sleepEnabled) return

    const reminder: HealthReminder = {
      type,
      title: REMINDER_META[type].title,
      icon: REMINDER_META[type].icon,
      message: pickMessage(type),
    }
    if (activeReminder.value) {
      pendingReminder = reminder
    } else {
      showReminder(reminder)
    }
  }

  function checkPomodoroReminders() {
    const todayCompleted = pomStore.data.todayCompleted
    const s = settingsStore.settings

    // Water: every N pomodoros
    if (s.waterEnabled && todayCompleted > 0 && todayCompleted % s.waterInterval === 0 && todayCompleted !== lastWaterPomCount) {
      lastWaterPomCount = todayCompleted
      trigger('water')
    }

    // Exercise: every N pomodoros
    if (s.exerciseEnabled && todayCompleted > 0 && todayCompleted % s.exerciseInterval === 0 && todayCompleted !== lastExercisePomCount) {
      lastExercisePomCount = todayCompleted
      trigger('exercise')
    }
  }

  function checkEyeRest() {
    if (!settingsStore.settings.eyeRestEnabled) return
    if (!sessionStart) return
    if (activeReminder.value) return
    const elapsed = (Date.now() - sessionStart) / 60000
    if (elapsed >= settingsStore.settings.eyeRestMinutes) {
      sessionStart = Date.now()
      trigger('eyeRest')
    }
  }

  function checkSleep() {
    if (!settingsStore.settings.sleepEnabled) return
    if (activeReminder.value) return
    const today = toLocalDateStr(new Date())
    if (lastSleepTriggerDate === today) return
    const hour = new Date().getHours()
    if (hour >= settingsStore.settings.sleepAfterHour) {
      lastSleepTriggerDate = today
      trigger('sleep')
    }
  }

  async function respond(response: UserResponse) {
    const current = activeReminder.value
    if (!current) return

    // Close dialog immediately to prevent double-clicks
    activeReminder.value = null

    if (response === 'later') {
      // Reschedule: re-show after 15 minutes
      const reminderForLater = { ...current }
      if (laterRescheduleTimer) clearTimeout(laterRescheduleTimer)
      laterRescheduleTimer = setTimeout(() => {
        laterRescheduleTimer = null
        if (!activeReminder.value) {
          showReminder(reminderForLater)
        } else {
          pendingReminder = reminderForLater
        }
      }, 15 * 60 * 1000)
      // Show next pending reminder if any
      if (pendingReminder) {
        const next = pendingReminder
        pendingReminder = null
        showReminder(next)
      }
      return
    }

    // Show next pending reminder if any
    if (pendingReminder) {
      const next = pendingReminder
      pendingReminder = null
      showReminder(next)
    }

    const type = current.type

    if (response === 'done') {
      userStore.addCoins(5)
      petStore.addExp(5)
      playCoinSound()

      switch (type) {
        case 'water':
          await healthStore.recordWater()
          break
        case 'exercise':
          await healthStore.recordExercise()
          break
        case 'eyeRest':
          await healthStore.recordEyeRest()
          break
        case 'sleep':
          await healthStore.recordSleepReminder('done')
          break
      }

      await userStore.save()
    }
  }

  function dismiss() {
    activeReminder.value = null
    if (pendingReminder) {
      const next = pendingReminder
      pendingReminder = null
      showReminder(next)
    }
  }

  // Watch pomodoro completions
  watch(() => pomStore.data.todayCompleted, () => {
    checkPomodoroReminders()
  })

  // Watch timer running state for eye rest tracking
  watch(() => pomStore.timerState, (state) => {
    if (state === 'running' && !sessionStart) {
      sessionStart = Date.now()
    } else if (state === 'idle' || state === 'completed' || state === 'break') {
      sessionStart = null
    }
  })

  onMounted(() => {
    lastWaterPomCount = pomStore.data.todayCompleted
    lastExercisePomCount = pomStore.data.todayCompleted
    checkPomodoroReminders()

    eyeRestTimer = setInterval(checkEyeRest, 60000)
    sleepCheckTimer = setInterval(checkSleep, 60000)
    checkSleep()
  })

  onUnmounted(() => {
    if (eyeRestTimer) clearInterval(eyeRestTimer)
    if (sleepCheckTimer) clearInterval(sleepCheckTimer)
    if (laterRescheduleTimer) clearTimeout(laterRescheduleTimer)
  })

  return {
    activeReminder,
    respond,
    dismiss,
  }
}
