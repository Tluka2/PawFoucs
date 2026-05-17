<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Note body -->
    <rect x="7" y="5" width="18" height="22" rx="1" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="2"/>
    <!-- Folded corner -->
    <path d="M21 5 L25 5 L25 9 Z" fill="#E0D0F0" stroke="#C8B8E8" stroke-width="1"/>
    <!-- Lines -->
    <line x1="10" y1="11" x2="22" y2="11" stroke="#C8B8E8" stroke-width="1.5"/>
    <line x1="10" y1="16" x2="22" y2="16" stroke="#C8B8E8" stroke-width="1.5"/>
    <line x1="10" y1="21" x2="18" y2="21" stroke="#C8B8E8" stroke-width="1.5"/>
    <!-- Pin -->
    <circle cx="16" cy="8" r="2" fill="#E8956A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
