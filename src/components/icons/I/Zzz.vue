<template>
  <IconBase :size="size" :color="color" :strokeWidth="1.5" hoverScale>
    <path d="M12 4h8v4h-6v4h6v4h-8" />
    <path d="M4 14h6v2H6v2h4" />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string; filled?: boolean }>()
</script>
