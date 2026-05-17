<template>
  <div class="reminder-overlay" @click.self="$emit('dismiss')">
    <div class="reminder-card">
      <div class="reminder-icon"><AppIcon :name="reminder.icon" :size="32" /></div>
      <div class="reminder-title">{{ reminder.title }}</div>
      <div class="reminder-msg">{{ reminder.message }}</div>
      <div class="reminder-actions">
        <button class="btn-done" @click="$emit('respond', 'done')">完成</button>
        <button class="btn-later" @click="$emit('respond', 'later')">稍后</button>
        <button class="btn-dismiss" @click="$emit('dismiss')">忽略</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HealthReminder } from '@/composables/useHealthReminder'
import type { UserResponse } from '@/types/health'
import AppIcon from '@/components/AppIcon.vue'

defineProps<{
  reminder: HealthReminder
}>()

defineEmits<{
  respond: [response: UserResponse]
  dismiss: []
}>()
</script>

<style scoped>
.reminder-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  border-radius: 16px;
  animation: overlay-in 0.2s ease-out;
}
@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.reminder-card {
  background: var(--c-bg-elevated);
  border-radius: clamp(12px, 2.5vmin, 18px);
  padding: clamp(12px, 3vmin, 20px) clamp(14px, 4vmin, 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(4px, 1vmin, 8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: card-pop 0.3s ease-out;
  max-width: clamp(160px, 45vmin, 220px);
}
@keyframes card-pop {
  0% { opacity: 0; transform: scale(0.9) translateY(8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.reminder-icon {
  font-size: clamp(22px, 5vmin, 32px);
  line-height: 1;
}
.reminder-title {
  font-size: clamp(12px, 2vmin, 15px);
  font-weight: 800;
  color: var(--c-text-primary);
}
.reminder-msg {
  font-size: clamp(10px, 1.5vmin, 12px);
  color: var(--c-text-secondary);
  text-align: center;
  line-height: 1.4;
}

.reminder-actions {
  display: flex;
  gap: clamp(4px, 1.5vmin, 8px);
  margin-top: clamp(2px, 0.8vmin, 4px);
}

.btn-done {
  background: linear-gradient(145deg, var(--c-primary), var(--c-primary-dark));
  color: var(--c-text-inverse);
  border: none;
  border-radius: clamp(8px, 1.5vmin, 14px);
  padding: clamp(4px, 0.8vmin, 6px) clamp(10px, 2.5vmin, 16px);
  font-size: clamp(10px, 1.5vmin, 12px);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-done:hover { transform: translateY(-1px); }

.btn-later {
  background: var(--c-bg);
  color: var(--c-primary);
  border: 1.5px solid var(--c-border);
  border-radius: clamp(8px, 1.5vmin, 14px);
  padding: clamp(4px, 0.8vmin, 6px) clamp(8px, 2vmin, 14px);
  font-size: clamp(9px, 1.5vmin, 12px);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-later:hover { background: var(--c-bg-soft); }

.btn-dismiss {
  background: none;
  color: var(--c-text-muted);
  border: none;
  padding: clamp(4px, 0.8vmin, 6px) clamp(5px, 1.5vmin, 10px);
  font-size: clamp(8px, 1.3vmin, 11px);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}
.btn-dismiss:hover { color: var(--c-text-secondary); }
</style>
