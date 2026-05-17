<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Activity line graph -->
    <polyline points="4 20 8 20 12 12 16 24 20 8 24 16 28 16" fill="none" stroke="#E8956A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
