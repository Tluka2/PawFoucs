<template>
  <IconBase :size="size" :color="color">
    <polyline points="15 18 9 12 15 6" />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string }>()
</script>
