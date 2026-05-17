<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :size="size"
    :color="color"
    :filled="filled"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePet } from '@/composables/usePet'

// Icons kept without pixel replacement
import ISparkles from './icons/I/Sparkles.vue'
import PixelHeart from './icons/Pixel/PixelHeart.vue'

// Pixel art icons (bottom nav)
import PixelHome from './icons/Pixel/PixelHome.vue'
import PixelHabit from './icons/Pixel/PixelHabit.vue'
import PixelMemo from './icons/Pixel/PixelMemo.vue'
import PixelStats from './icons/Pixel/PixelStats.vue'
import PixelSettings from './icons/Pixel/PixelSettings.vue'

// Cat-themed variants (switch based on pet type)
import PixelHomeCat from './icons/Pixel/PixelHomeCat.vue'
import PixelHabitCat from './icons/Pixel/PixelHabitCat.vue'
import PixelMemoCat from './icons/Pixel/PixelMemoCat.vue'
import PixelStatsCat from './icons/Pixel/PixelStatsCat.vue'
import PixelSettingsCat from './icons/Pixel/PixelSettingsCat.vue'

// Pixel art icons (actions & misc)
import PixelClose from './icons/Pixel/PixelClose.vue'
import PixelCheck from './icons/Pixel/PixelCheck.vue'
import PixelPlus from './icons/Pixel/PixelPlus.vue'
import PixelTarget from './icons/Pixel/PixelTarget.vue'
import PixelCoins from './icons/Pixel/PixelCoins.vue'
import PixelClock from './icons/Pixel/PixelClock.vue'
import PixelClockCat from './icons/Pixel/PixelClockCat.vue'
import PixelStar from './icons/Pixel/PixelStar.vue'
import PixelStarOff from './icons/Pixel/PixelStarOff.vue'
import PixelSun from './icons/Pixel/PixelSun.vue'
import PixelMoon from './icons/Pixel/PixelMoon.vue'
import PixelBell from './icons/Pixel/PixelBell.vue'
import PixelBellOff from './icons/Pixel/PixelBellOff.vue'
import PixelVolumeOn from './icons/Pixel/PixelVolumeOn.vue'
import PixelVolumeOff from './icons/Pixel/PixelVolumeOff.vue'
import PixelEye from './icons/Pixel/PixelEye.vue'
import PixelWater from './icons/Pixel/PixelWater.vue'
import PixelExerciseRun from './icons/Pixel/PixelExerciseRun.vue'
import PixelExerciseRunCat from './icons/Pixel/PixelExerciseRunCat.vue'
import PixelTrash from './icons/Pixel/PixelTrash.vue'
import PixelDownload from './icons/Pixel/PixelDownload.vue'
import PixelCalendar from './icons/Pixel/PixelCalendar.vue'
import PixelPencil from './icons/Pixel/PixelPencil.vue'
import PixelFlame from './icons/Pixel/PixelFlame.vue'
import PixelTrophy from './icons/Pixel/PixelTrophy.vue'
import PixelMedal from './icons/Pixel/PixelMedal.vue'
import PixelChevronLeft from './icons/Pixel/PixelChevronLeft.vue'
import PixelChevronRight from './icons/Pixel/PixelChevronRight.vue'
import PixelBookOpen from './icons/Pixel/PixelBookOpen.vue'
import PixelCoffee from './icons/Pixel/PixelCoffee.vue'
import PixelMusic from './icons/Pixel/PixelMusic.vue'
import PixelZzz from './icons/Pixel/PixelZzz.vue'
import PixelSprout from './icons/Pixel/PixelSprout.vue'
import PixelSquare from './icons/Pixel/PixelSquare.vue'
import PixelRotateCcw from './icons/Pixel/PixelRotateCcw.vue'
import PixelWindow from './icons/Pixel/PixelWindow.vue'

// Custom pet icons
import IconCatPaw from './icons/IconCatPaw.vue'
import IconDogPaw from './icons/IconDogPaw.vue'
import IconPetBowl from './icons/IconPetBowl.vue'
import IconHeartTail from './icons/IconHeartTail.vue'

const props = defineProps<{
  name: string
  size?: number
  color?: string
  filled?: boolean
}>()

const { petType } = usePet()

const size = computed(() => props.size ?? 18)
const color = computed(() => props.color)
const filled = computed(() => props.filled ?? false)

// Pet-themed icons that switch between dog/cat variants
function petIcon(dog: any, cat: any) {
  return { dog, cat, __pet: true }
}

const ICON_MAP: Record<string, any> = {
  // Actions
  check: PixelCheck,
  square: PixelSquare,
  close: PixelClose,
  plus: PixelPlus,
  download: PixelDownload,
  trash: PixelTrash,
  rotateCcw: PixelRotateCcw,
  pencil: PixelPencil,

  // Navigation
  chevronLeft: PixelChevronLeft,
  chevronRight: PixelChevronRight,

  // Status
  star: PixelStar,
  starOff: PixelStarOff,
  heart: PixelHeart,

  // App sections — pet-themed (auto-switch by pet type)
  home: petIcon(PixelHome, PixelHomeCat),
  sprout: PixelSprout,
  memo: petIcon(PixelMemo, PixelMemoCat),
  habit: petIcon(PixelHabit, PixelHabitCat),
  stats: petIcon(PixelStats, PixelStatsCat),
  settings: petIcon(PixelSettings, PixelSettingsCat),
  calendar: PixelCalendar,
  clock: petIcon(PixelClock, PixelClockCat),
  bookOpen: PixelBookOpen,

  // Pixel art icons (bottom nav) — pet-themed
  pixelHome: petIcon(PixelHome, PixelHomeCat),
  pixelHabit: petIcon(PixelHabit, PixelHabitCat),
  pixelMemo: petIcon(PixelMemo, PixelMemoCat),
  pixelStats: petIcon(PixelStats, PixelStatsCat),
  pixelSettings: petIcon(PixelSettings, PixelSettingsCat),

  // Health
  water: PixelWater,
  exercise: petIcon(PixelExerciseRun, PixelExerciseRunCat),
  eyeRest: PixelEye,
  sleep: PixelMoon,
  zzz: PixelZzz,
  flame: PixelFlame,
  trophy: PixelTrophy,
  medal: PixelMedal,

  // Pet
  coins: PixelCoins,
  target: PixelTarget,
  sparkles: ISparkles,
  catPaw: IconCatPaw,
  dogPaw: IconDogPaw,
  petBowl: IconPetBowl,
  heartTail: IconHeartTail,

  // Misc
  volumeOn: PixelVolumeOn,
  volumeOff: PixelVolumeOff,
  bell: PixelBell,
  bellOff: PixelBellOff,
  sun: PixelSun,
  cloudMoon: PixelMoon,
  coffee: PixelCoffee,
  music: PixelMusic,
  window: PixelWindow,
}

const iconComponent = computed(() => {
  const entry = ICON_MAP[props.name]
  if (!entry) return null
  if (entry.__pet) {
    return petType.value === 'cat' ? entry.cat : entry.dog
  }
  return entry
})
</script>
