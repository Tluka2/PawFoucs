<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Sun center -->
    <circle cx="16" cy="16" r="6" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>
    <!-- Rays -->
    <rect x="14" y="4" width="4" height="4" fill="#FFD93D"/>
    <rect x="14" y="24" width="4" height="4" fill="#FFD93D"/>
    <rect x="4" y="14" width="4" height="4" fill="#FFD93D"/>
    <rect x="24" y="14" width="4" height="4" fill="#FFD93D"/>
    <!-- Diagonal rays -->
    <rect x="7" y="7" width="3" height="3" fill="#FFD93D"/>
    <rect x="22" y="7" width="3" height="3" fill="#FFD93D"/>
    <rect x="7" y="22" width="3" height="3" fill="#FFD93D"/>
    <rect x="22" y="22" width="3" height="3" fill="#FFD93D"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
