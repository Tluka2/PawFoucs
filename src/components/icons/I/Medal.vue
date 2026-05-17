<template>
  <IconBase :size="size" :color="color" :strokeWidth="1.5" hoverScale>
    <circle v-if="filled" cx="12" cy="9" r="5" fill="currentColor" fill-opacity="0.12" stroke="none" />
    <circle cx="12" cy="9" r="5" />
    <path d="M8.5 13.5L6 22l6-2 6 2-2.5-8.5" />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string; filled?: boolean }>()
</script>
