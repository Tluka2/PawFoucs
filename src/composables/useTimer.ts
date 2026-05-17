import { ref, computed, onUnmounted } from 'vue'
import { usePomodoroStore } from '@/stores/pomodoro'
import { useSettingsStore } from '@/stores/settings'
import { useSound } from '@/composables/useSound'
import { useNotification } from '@/composables/useNotification'

const TICK_MS = 200

export function useTimer() {
  const pomStore = usePomodoroStore()
  const settingsStore = useSettingsStore()
  const { playCompletionSound, playStartSound, playBreakSound, playCoinSound } = useSound()
  const { sendNotification } = useNotification()

  const startedAt = ref(0)
  const initialRemainingMs = ref(0)
  const snapshotElapsed = ref(0)
  const snapshotRemainingMs = ref(0)
  const hasPaused = ref(false)
  let tickInterval: ReturnType<typeof setInterval> | null = null

  const timerState = computed(() => pomStore.timerState)
  const isRunning = computed(() => timerState.value === 'running')
  const isPaused = computed(() => timerState.value === 'paused')
  const isCompleted = computed(() => timerState.value === 'completed')
  const isBreak = computed(() => timerState.value === 'break')
  let wasBreakBeforePause = false
  const mode = computed(() => pomStore.data.mode)

  const formattedTime = computed(() => {
    const secs = mode.value === 'countdown' ? pomStore.remaining : pomStore.elapsed
    const totalSec = Math.max(0, Math.floor(secs))
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  })

  const loopDisplay = computed(() => {
    const target = pomStore.data.loopTarget
    const completed = pomStore.data.loopCompleted
    if (target <= 0 || completed === 0) return ''
    return `${completed}/${target}`
  })

  const breakTypeLabel = computed(() => {
    if (!isBreak.value) return ''
    return pomStore.data.breakType === 'long' ? '长休息' : '短休息'
  })

  const timerLabel = computed(() => {
    if (isCompleted.value) return '完成!'
    if (isBreak.value) return breakTypeLabel.value
    if (isPaused.value) return '已暂停'
    return pomStore.data.mode === 'countdown' ? '专注中...' : '记录中...'
  })

  function tick() {
    if (isBreak.value) {
      // Break countdown
      const elapsedMs = Date.now() - startedAt.value
      const remainMs = Math.max(0, initialRemainingMs.value - elapsedMs)
      pomStore.remaining = Math.ceil(remainMs / 1000)
      pomStore.elapsed = Math.floor(elapsedMs / 1000)
      if (remainMs <= 0) {
        stopTick()
        onBreakEnd()
      }
    } else if (mode.value === 'countdown') {
      const elapsedMs = Date.now() - startedAt.value
      const remainMs = Math.max(0, initialRemainingMs.value - elapsedMs)
      pomStore.remaining = Math.ceil(remainMs / 1000)
      pomStore.elapsed = Math.floor(elapsedMs / 1000)
      if (remainMs <= 0) {
        stopTick()
        autoComplete()
      }
    } else {
      const elapsedMs = snapshotElapsed.value * 1000 + (Date.now() - startedAt.value)
      pomStore.elapsed = Math.floor(elapsedMs / 1000)
      pomStore.remaining = 0
    }
  }

  function startTick() {
    stopTick()
    tickInterval = setInterval(tick, TICK_MS)
  }

  function stopTick() {
    if (tickInterval !== null) {
      clearInterval(tickInterval)
      tickInterval = null
    }
  }

  function startTimer() {
    playStartSound()
    const durationSec = settingsStore.settings.workDuration * 60
    pomStore.data.duration = durationSec
    hasPaused.value = false
    wasBreakBeforePause = false

    if (mode.value === 'countdown') {
      initialRemainingMs.value = durationSec * 1000
      snapshotRemainingMs.value = durationSec * 1000
      pomStore.remaining = durationSec
      pomStore.elapsed = 0
    } else {
      snapshotElapsed.value = 0
      pomStore.elapsed = 0
      pomStore.remaining = 0
    }

    startedAt.value = Date.now()
    pomStore.timerState = 'running'
    startTick()
  }

  function pauseTimer() {
    if (pomStore.timerState !== 'running' && pomStore.timerState !== 'break') return
    stopTick()
    wasBreakBeforePause = pomStore.timerState === 'break'
    if (!wasBreakBeforePause) hasPaused.value = true

    if (wasBreakBeforePause || mode.value === 'countdown') {
      snapshotRemainingMs.value = Math.max(0, initialRemainingMs.value - (Date.now() - startedAt.value))
    } else {
      snapshotElapsed.value = snapshotElapsed.value * 1000 + (Date.now() - startedAt.value)
      snapshotElapsed.value = snapshotElapsed.value / 1000
    }

    pomStore.timerState = 'paused'
  }

  function resumeTimer() {
    if (pomStore.timerState !== 'paused') return

    if (wasBreakBeforePause || mode.value === 'countdown') {
      initialRemainingMs.value = snapshotRemainingMs.value
    }

    startedAt.value = Date.now()
    pomStore.timerState = wasBreakBeforePause ? 'break' : 'running'
    startTick()
  }

  function resetTimer() {
    stopTick()
    pomStore.timerState = 'idle'
    pomStore.elapsed = 0
    pomStore.remaining = 0
    hasPaused.value = false
  }

  async function autoComplete() {
    stopTick()
    const actualDuration = pomStore.elapsed
    const isPerfect = !hasPaused.value && (
      (mode.value === 'countdown') ||
      (mode.value === 'countup' && actualDuration >= 20 * 60)
    )
    const baseCoins = 50
    const perfectBonus = isPerfect ? 10 : 0
    const streakBonus = (pomStore.data.todayCompleted > 0 && (pomStore.data.todayCompleted + 1) % 3 === 0) ? 20 : 0
    const totalCoins = baseCoins + perfectBonus + streakBonus

    await pomStore.completePomodoro(actualDuration, mode.value, totalCoins)
    pomStore.timerState = 'completed'

    playCompletionSound()
    if (totalCoins > 0) playCoinSound()
    sendNotification('PawFocus', `专注完成! ${Math.round(actualDuration / 60)} 分钟`)
  }

  async function manualComplete() {
    stopTick()
    if (mode.value === 'countdown') {
      const elapsedMs = Date.now() - startedAt.value
      pomStore.elapsed = Math.floor(elapsedMs / 1000)
    }
    await autoComplete()
  }

  function startBreak() {
    playBreakSound()
    const loopCompleted = pomStore.data.loopCompleted
    const sessionsForLong = settingsStore.settings.sessionsUntilLongBreak
    const isLong = loopCompleted > 0 && loopCompleted % sessionsForLong === 0
    const breakSeconds = isLong
      ? settingsStore.settings.longBreakDuration * 60
      : settingsStore.settings.breakDuration * 60

    pomStore.data.breakType = isLong ? 'long' : 'short'
    initialRemainingMs.value = breakSeconds * 1000
    snapshotRemainingMs.value = breakSeconds * 1000
    pomStore.remaining = breakSeconds
    pomStore.elapsed = 0
    startedAt.value = Date.now()
    pomStore.timerState = 'break'
    startTick()
  }

  function onBreakEnd() {
    stopTick()
    if (settingsStore.settings.autoStartWork) {
      startTimer()
    } else {
      pomStore.timerState = 'idle'
      pomStore.elapsed = 0
      pomStore.remaining = 0
    }
  }

  function skipBreak() {
    stopTick()
    startTimer()
  }

  function claimReward() {
    if (pomStore.shouldAutoContinue) {
      startBreak()
    } else {
      pomStore.resetLoopCompleted()
      pomStore.timerState = 'idle'
      pomStore.elapsed = 0
      pomStore.remaining = 0
      hasPaused.value = false
    }
  }

  function giveUp() {
    stopTick()
    pomStore.resetLoopCompleted()
    pomStore.timerState = 'idle'
    pomStore.elapsed = 0
    pomStore.remaining = 0
    hasPaused.value = false
  }

  onUnmounted(() => {
    stopTick()
  })

  return {
    formattedTime,
    timerState,
    isRunning,
    isPaused,
    isCompleted,
    isBreak,
    mode,
    hasPaused,
    loopDisplay,
    breakTypeLabel,
    timerLabel,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    manualComplete,
    claimReward,
    giveUp,
    skipBreak,
  }
}
