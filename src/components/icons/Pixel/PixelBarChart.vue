<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Base line -->
    <line x1="4" y1="26" x2="28" y2="26" stroke="#C0B0A0" stroke-width="2" stroke-linecap="round"/>
    <!-- Bar 1 (green) -->
    <rect x="6" y="16" width="6" height="10" fill="#7BC67E" stroke="#5DAF60" stroke-width="1.5"/>
    <!-- Bar 2 (pink) -->
    <rect x="13" y="10" width="6" height="16" fill="#E898A8" stroke="#D97A6A" stroke-width="1.5"/>
    <!-- Bar 3 (blue) -->
    <rect x="20" y="6" width="6" height="20" fill="#87CEEB" stroke="#6BB6D6" stroke-width="1.5"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
