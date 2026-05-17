<template>
  <IconBase :size="size" :hoverScale="true">
    <template v-if="filled">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10z" :fill="color ?? 'var(--c-text-secondary)'"/>
    </template>
    <template v-else>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2"/>
      <line x1="16" y1="2" x2="16" y2="6" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="2" x2="8" y2="6" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2" stroke-linecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2" stroke-linecap="round"/>
    </template>
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string; filled?: boolean }>()
</script>
