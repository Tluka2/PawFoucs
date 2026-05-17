<template>
  <IconBase :size="size" :hoverScale="true">
    <template v-if="filled">
      <path d="M12 4L4 10.5V20a2 2 0 0 0 2 2h5v-8h4v8h5a2 2 0 0 0 2-2v-9.5L12 4z" :fill="color ?? 'var(--c-text-secondary)'"/>
    </template>
    <template v-else>
      <path d="M4 10.5L12 4l8 6.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      <rect x="9.5" y="13" width="5" height="8" rx="1.5" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2"/>
    </template>
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string; filled?: boolean }>()
</script>
