<template>
  <IconBase :size="size" :color="color"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string }>()
</script>
