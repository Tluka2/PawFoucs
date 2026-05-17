<template>
  <IconBase :size="size" :color="color">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m13 14 1-1 1 1" />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string }>()
</script>
