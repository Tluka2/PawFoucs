<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Big Z -->
    <polyline points="6,8 18,8 6,20 18,20" fill="none" stroke="#C8B8E8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Medium Z -->
    <polyline points="16,4 24,4 16,14 24,14" fill="none" stroke="#D0C0E8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Small Z -->
    <polyline points="22,16 28,16 22,22 28,22" fill="none" stroke="#E0D0F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
