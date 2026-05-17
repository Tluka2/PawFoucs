<template>
  <IconBase :size="size" :color="color" :strokeWidth="1.5" hoverScale>
    <path v-if="filled" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="currentColor" fill-opacity="0.12" stroke="none" />
    <path v-if="filled" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="currentColor" fill-opacity="0.12" stroke="none" />
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue'
defineProps<{ size?: number; color?: string; filled?: boolean }>()
</script>
