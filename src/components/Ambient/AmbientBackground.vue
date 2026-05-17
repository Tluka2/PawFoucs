<template>
  <div class="ambient-layer" :class="period" :style="{ background: config.bgGradient }">
    <!-- Date & time panel -->
    <div class="greeting-panel">
      <span>{{ dateDisplay }}</span>
      <span class="time-line">{{ timeDisplay }}</span>
    </div>

    <!-- Sun -->
    <div v-if="config.showSun" class="celestial celestial-sun" :class="{ 'sun-pulse': config.sunGlow, 'sun-dim': period === 'evening' }"></div>

    <!-- Moon -->
    <div v-if="config.showMoon" class="celestial celestial-moon"></div>

    <!-- Clouds -->
    <template v-if="config.showClouds">
      <div v-for="n in config.cloudCount" :key="n" class="cloud" :class="'cloud-' + n" :style="{ opacity: config.cloudOpacity }"></div>
    </template>

    <!-- Stars -->
    <template v-if="config.showStars">
      <div v-for="s in stars" :key="s.id" class="star" :style="s.style"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { TimePeriod } from '@/composables/useTimeOfDay'
import type { CSSProperties } from 'vue'

defineProps<{ period: TimePeriod; config: (typeof import('@/composables/useTimeOfDay').PERIOD_CONFIG)[TimePeriod] }>()

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const stars = computed(() =>
  Array.from({ length: 50 }, (_, i) => ({
    id: i,
    style: {
      left: `${seededRandom(i) * 94 + 3}%`,
      top: `${seededRandom(i + 100) * 60 + 3}%`,
      width: `${1 + seededRandom(i + 200) * 2}px`,
      height: `${1 + seededRandom(i + 200) * 2}px`,
      animationDelay: `${seededRandom(i + 300) * 3}s`,
      animationDuration: `${1.5 + seededRandom(i + 400) * 2}s`,
    } as CSSProperties,
  })),
)

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const now = ref(new Date())
let clockTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => { clockTimer = setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => { if (clockTimer) clearInterval(clockTimer) })
const dateDisplay = computed(() => {
  const d = now.value
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const w = WEEKDAYS[d.getDay()]
  return `${m}月${day}日 周${w}`
})

const timeDisplay = computed(() => {
  const d = now.value
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
})
</script>

<style scoped>
.ambient-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background-size: cover;
  transition: background 2s ease;
  overflow: hidden;
}

/* ===== Date panel ===== */
.greeting-panel {
  position: absolute;
  top: clamp(6px, 2vmin, 12px);
  left: clamp(6px, 2vmin, 12px);
  padding: clamp(4px, 1vmin, 7px) clamp(8px, 2vmin, 14px);
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: clamp(8px, 1.5vmin, 14px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: clamp(10px, 1.6vmin, 13px);
  font-weight: 700;
  color: rgba(74, 69, 64, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 2s ease, border-color 2s ease, color 2s ease;
}

.time-line {
  font-size: clamp(10px, 1.6vmin, 13px);
  font-weight: 700;
  line-height: 1.3;
}

.night .greeting-panel {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
}

/* ===== Celestial bodies ===== */
.celestial {
  position: absolute;
  top: clamp(12px, 3vmin, 24px);
  right: clamp(12px, 3vmin, 24px);
  transition: top 0.3s ease, right 0.3s ease, background 2s ease, box-shadow 2s ease;
}

/* Sun */
.celestial-sun {
  width: clamp(24px, 5vmin, 36px);
  height: clamp(24px, 5vmin, 36px);
  background: #FFD93D;
  border-radius: 50%;
  box-shadow: 0 0 12px 3px rgba(255, 217, 61, 0.3);
  transition: top 0.3s ease, right 0.3s ease, background 2s ease, box-shadow 2s ease;
}

.celestial-sun.sun-dim {
  background: #FF9A6C;
  box-shadow: 0 0 16px 4px rgba(255, 154, 108, 0.3);
}

.celestial-sun.sun-pulse {
  animation: sun-pulse 3s ease-in-out infinite;
}

.celestial-sun.sun-dim.sun-pulse {
  animation: sun-pulse-dim 3s ease-in-out infinite;
}

@keyframes sun-pulse {
  0%, 100% { box-shadow: 0 0 12px 3px rgba(255, 217, 61, 0.3); transform: scale(1); }
  50% { box-shadow: 0 0 24px 8px rgba(255, 217, 61, 0.5); transform: scale(1.06); }
}

@keyframes sun-pulse-dim {
  0%, 100% { box-shadow: 0 0 12px 3px rgba(255, 154, 108, 0.3); transform: scale(1); }
  50% { box-shadow: 0 0 24px 8px rgba(255, 154, 108, 0.5); transform: scale(1.06); }
}

/* Moon */
.celestial-moon {
  width: clamp(22px, 4.5vmin, 32px);
  height: clamp(22px, 4.5vmin, 32px);
  border-radius: 50%;
  background: #F5F0C1;
  box-shadow: 0 0 14px 3px rgba(245, 240, 193, 0.25);
  animation: moon-float 6s ease-in-out infinite;
  overflow: hidden;
  transition: top 0.3s ease, right 0.3s ease;
}

.celestial-moon::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 7px;
  width: clamp(14px, 3vmin, 20px);
  height: clamp(16px, 3.5vmin, 24px);
  border-radius: 50%;
  background: #1a1a2e;
}

@keyframes moon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-clamp(3px, 0.8vmin, 6px)); }
}

/* ===== Clouds ===== */
.cloud {
  position: absolute;
  background: white;
  border-radius: 50px;
  width: clamp(40px, 10vmin, 65px);
  height: clamp(14px, 3vmin, 20px);
  transition: opacity 2s ease, top 0.3s ease;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
  transition: width 0.3s ease, height 0.3s ease;
}

.cloud::before {
  width: 55%;
  height: 160%;
  top: -70%;
  left: 18%;
}

.cloud::after {
  width: 40%;
  height: 130%;
  top: -50%;
  right: 15%;
}

.cloud-1 {
  top: 18%;
  left: -15%;
  animation: cloud-drift 25s linear infinite;
}

.cloud-2 {
  top: 30%;
  left: -20%;
  animation: cloud-drift 35s linear infinite;
  animation-delay: -12s;
}

.cloud-3 {
  top: 12%;
  left: -10%;
  width: clamp(30px, 8vmin, 50px);
  height: clamp(10px, 2vmin, 16px);
  animation: cloud-drift 30s linear infinite;
  animation-delay: -6s;
}

@keyframes cloud-drift {
  from { transform: translateX(0); }
  to { transform: translateX(calc(100vw + 100px)); }
}

/* ===== Stars ===== */
.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
</style>
