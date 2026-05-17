<template>
  <IconBase :size="size" :color="color">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string }>()
</script>
