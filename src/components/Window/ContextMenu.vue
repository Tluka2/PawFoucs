<template>
  <div v-if="visible" class="context-menu" :style="{ left: x + 'px', top: y + 'px' }" @click.stop>
    <div class="menu-section">
      <div class="menu-label">透明度</div>
      <button
        v-for="opt in opacityOptions"
        :key="opt.value"
        class="menu-item"
        :class="{ active: currentOpacity === opt.value }"
        @click="handleOpacity(opt.value)"
      >{{ opt.label }}</button>
    </div>
    <div class="menu-divider"></div>
    <button class="menu-item" @click="handleToggleOnTop">
      <span class="check-space"><AppIcon v-if="isOnTop" name="check" :size="12" /></span>窗口置顶
    </button>
    <button class="menu-item" @click="handleToggleLock">
      <span class="check-space"><AppIcon v-if="isLocked" name="check" :size="12" /></span>锁定位置
    </button>
    <div class="menu-divider"></div>
    <button class="menu-item danger" @click="handleExit">最小化到托盘</button>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'

defineProps<{
  visible: boolean
  x: number
  y: number
  currentOpacity: number
  isOnTop: boolean
  isLocked: boolean
}>()

const emit = defineEmits<{
  close: []
  setOpacity: [value: number]
  toggleOnTop: []
  toggleLock: []
  exit: []
}>()

const opacityOptions = [
  { label: '100%', value: 100 },
  { label: '75%', value: 75 },
  { label: '50%', value: 50 },
  { label: '25%', value: 25 },
  { label: '10%', value: 10 },
]

const handleOpacity = (value: number) => {
  emit('setOpacity', value)
  emit('close')
}
const handleToggleOnTop = () => {
  emit('toggleOnTop')
  emit('close')
}
const handleToggleLock = () => {
  emit('toggleLock')
  emit('close')
}
const handleExit = () => {
  emit('exit')
  emit('close')
}
</script>

<style scoped>
.context-menu {
  position: absolute;
  z-index: 100;
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  border-radius: clamp(10px, 1.5vmin, 14px);
  padding: clamp(3px, 0.8vmin, 6px) 0;
  min-width: clamp(100px, 22vmin, 130px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-size: clamp(10px, 1.5vmin, 13px);
}
.menu-section {
  padding: 1px 0;
}
.menu-label {
  padding: 1px clamp(8px, 2vmin, 14px);
  font-size: clamp(8px, 1.2vmin, 10px);
  color: var(--c-text-muted);
  font-weight: 700;
}
.menu-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: clamp(4px, 0.8vmin, 6px) clamp(8px, 2vmin, 14px);
  border: none;
  background: none;
  cursor: pointer;
  font-size: clamp(10px, 1.5vmin, 13px);
  font-weight: 600;
  font-family: inherit;
  color: var(--c-text-primary);
  transition: background 0.15s;
}
.menu-item:hover { background: var(--c-bg); }
.menu-item.active { color: var(--c-primary); }
.menu-item.danger { color: var(--c-danger); }
.menu-item.danger:hover { background: var(--c-danger-soft); }
.check-space {
  display: inline-block;
  width: 16px;
  text-align: center;
  margin-right: 2px;
}
.menu-divider {
  height: 1px;
  background: var(--c-border);
  margin: 4px 10px;
}
</style>
