<template>
  <IconBase :size="size" :color="color">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string }>()
</script>
