<template>
  <IconBase :size="size" :color="color">
    <polyline points="9 18 15 12 9 6" />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string }>()
</script>
