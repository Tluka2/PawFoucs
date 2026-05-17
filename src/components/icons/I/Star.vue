<template>
  <IconBase :size="size" :hoverScale="true">
    <template v-if="filled">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" :fill="color ?? 'var(--c-text-secondary)'"/>
    </template>
    <template v-else>
      <path d="M12 2.5l2.5 5.5 6 .8-4.3 4.3 1 6-5.2-2.8-5.2 2.8 1-6L3.5 8.8l6-.8z" fill="none" :stroke="color ?? 'var(--c-text-secondary)'" stroke-width="2" stroke-linejoin="round"/>
    </template>
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string; filled?: boolean }>()
</script>
