<template>
  <div class="pet-welcome">
    <div class="welcome-icon"><AppIcon name="sprout" :size="36" color="var(--c-secondary)" /></div>
    <p class="welcome-title">欢迎来到学习小助手</p>
    <p class="welcome-desc">选一只伙伴陪你专注学习</p>
    <button class="btn-warm btn-next" @click="$emit('next')">
      开始
    </button>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'

defineEmits<{
  next: []
}>()
</script>

<style scoped>
.pet-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.welcome-icon {
  font-size: clamp(28px, 6vmin, 40px);
  margin-bottom: clamp(2px, 0.5vmin, 4px);
  animation: welcome-float 2s ease-in-out infinite;
}
@keyframes welcome-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.welcome-title {
  font-size: clamp(14px, 2.5vmin, 16px);
  font-weight: 800;
  color: var(--c-text-primary);
  margin: 0;
}
.welcome-desc {
  font-size: clamp(10px, 1.5vmin, 12px);
  color: var(--c-text-secondary);
  margin: 0;
}
.btn-next {
  margin-top: clamp(6px, 1.5vmin, 8px);
  padding: clamp(6px, 1vmin, 8px) clamp(28px, 6vmin, 48px);
  background: linear-gradient(145deg, var(--c-primary), var(--c-primary-dark));
  color: var(--c-text-inverse);
  border: none;
  border-radius: clamp(14px, 2.5vmin, 20px);
  font-size: clamp(11px, 1.8vmin, 14px);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(232, 149, 106, 0.3);
  transition: all 0.2s ease;
}
.btn-next:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(232, 149, 106, 0.4);
}
.btn-next:active {
  transform: translateY(1px);
}
</style>
