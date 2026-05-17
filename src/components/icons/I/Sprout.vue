<template>
  <IconBase :size="size" :color="color">
    <path d="M7 20h10" />
    <path d="M10 20c0-4 2-8 6-10" />
    <path d="M14 20c0-4-2-8-6-10" />
    <path d="M12 20v-6" />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string }>()
</script>
