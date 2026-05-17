<template>
  <IconBase :size="size" :hoverScale="true">
    <template v-if="filled">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" :fill="color ?? 'var(--c-text-secondary)'"/>
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="9" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2"/>
      <polyline points="8 12 11 15 16 9" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string; filled?: boolean }>()
</script>
