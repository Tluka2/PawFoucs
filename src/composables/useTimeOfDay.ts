import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night'

// Dev override: set to a TimePeriod string to force that period, null = auto
export const devPeriodOverride = ref<TimePeriod | null>(null)

export const PERIOD_CONFIG: Record<TimePeriod, {
  bgGradient: string
  greeting: string
  showSun: boolean
  showMoon: boolean
  showClouds: boolean
  cloudCount: number
  cloudOpacity: number
  showStars: boolean
  sunGlow: boolean
  isNight: boolean
}> = {
  morning: {
    bgGradient: 'linear-gradient(170deg, #D4EAFC 0%, #FBF3E8 40%, #FDF6ED 100%)',
    greeting: '早安',
    showSun: true,
    showMoon: false,
    showClouds: true,
    cloudCount: 3,
    cloudOpacity: 0.5,
    showStars: false,
    sunGlow: false,
    isNight: false,
  },
  afternoon: {
    bgGradient: 'linear-gradient(170deg, #87CEEB 0%, #B8E0F7 40%, #E8F4FD 100%)',
    greeting: '午安',
    showSun: true,
    showMoon: false,
    showClouds: false,
    cloudCount: 0,
    cloudOpacity: 0,
    showStars: false,
    sunGlow: true,
    isNight: false,
  },
  evening: {
    bgGradient: 'linear-gradient(170deg, #FF9A6C 0%, #FFB88C 30%, #E8C8F0 70%, #C9A0DC 100%)',
    greeting: '傍晚好',
    showSun: true,
    showMoon: false,
    showClouds: true,
    cloudCount: 2,
    cloudOpacity: 0.35,
    showStars: false,
    sunGlow: true,
    isNight: false,
  },
  night: {
    bgGradient: 'linear-gradient(170deg, #0f3460 0%, #1a1a2e 60%, #16213e 100%)',
    greeting: '晚安',
    showSun: false,
    showMoon: true,
    showClouds: false,
    cloudCount: 0,
    cloudOpacity: 0,
    showStars: true,
    sunGlow: false,
    isNight: true,
  },
}

function getPeriod(hour: number, morningEnd = 11, afternoonEnd = 17, eveningEnd = 21): TimePeriod {
  if (hour >= 6 && hour < morningEnd) return 'morning'
  if (hour >= morningEnd && hour < afternoonEnd) return 'afternoon'
  if (hour >= afternoonEnd && hour < eveningEnd) return 'evening'
  return 'night'
}

export function useTimeOfDay() {
  const settings = useSettingsStore()
  const hour = ref(new Date().getHours())

  let timer: ReturnType<typeof setInterval> | null = null
  onMounted(() => {
    timer = setInterval(() => {
      hour.value = new Date().getHours()
    }, 60000)
  })
  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  const period = computed(() =>
    devPeriodOverride.value ?? getPeriod(
      hour.value,
      settings.settings.morningEnd,
      settings.settings.afternoonEnd,
      settings.settings.eveningEnd,
    )
  )
  const config = computed(() => PERIOD_CONFIG[period.value])
  const isNight = computed(() => config.value.isNight)

  return { period, config, isNight }
}
