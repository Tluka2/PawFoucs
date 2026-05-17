<template>
  <div class="pet-select">
    <div class="select-title">选择你的萌宠伙伴</div>
    <div class="select-grid">
      <button
        v-for="opt in petOptions"
        :key="opt.type"
        class="select-card"
        @click="$emit('selected', opt.type)"
      >
        <PetSprite :pet-type="opt.type" size="sm" />
        <span class="select-label">{{ opt.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PetType } from '@/types/pet'
import PetSprite from './PetSprite.vue'

defineEmits<{
  selected: [type: PetType]
}>()

const petOptions: { type: PetType; label: string }[] = [
  { type: 'cat',     label: '小猫' },
  { type: 'dog',     label: '小狗' },
]
</script>

<style scoped>
.pet-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(6px, 1.5vmin, 12px);
  width: 100%;
}
.select-title {
  font-size: clamp(12px, 2vmin, 15px);
  font-weight: 700;
  color: var(--c-text-primary);
}
.select-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(4px, 1.2vmin, 8px);
  width: 100%;
  max-width: clamp(180px, 50vmin, 240px);
}
.select-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(2px, 0.5vmin, 4px);
  padding: clamp(6px, 1.5vmin, 10px) clamp(2px, 1vmin, 4px);
  background: var(--c-bg-elevated);
  border: 1.5px solid var(--c-border);
  border-radius: clamp(10px, 1.5vmin, 14px);
  cursor: pointer;
  transition: all 0.2s ease;
}
.select-card:hover {
  background: var(--c-bg-soft);
  border-color: var(--c-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 149, 106, 0.15);
}
.select-card:active { transform: scale(0.96); }
.select-card :deep(.pet-pixel-container) {
  width: clamp(36px, 10vmin, 48px) !important;
  height: clamp(36px, 10vmin, 48px) !important;
}
.select-card :deep(.pet-canvas) {
  width: 100% !important;
  height: 100% !important;
}
.select-label {
  font-size: clamp(9px, 1.3vmin, 11px);
  font-weight: 700;
  color: var(--c-text-secondary);
}
</style>
