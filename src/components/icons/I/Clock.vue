<template>
  <IconBase :size="size" :hoverScale="true">
    <template v-if="filled">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 10.5V7h-2v6.5l4.5 2.7.9-1.5-3.9-2.2z" :fill="color ?? 'var(--c-text-secondary)'"/>
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="10" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2"/>
      <polyline points="12 6 12 12 16 14" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string; filled?: boolean }>()
</script>
