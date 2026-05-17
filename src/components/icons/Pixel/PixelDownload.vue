<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Tray -->
    <rect x="4" y="22" width="24" height="5" rx="1" fill="#E8956A" stroke="#D67A4E" stroke-width="1.5"/>
    <rect x="8" y="24" width="16" height="3" fill="#F0B08A"/>

    <!-- Down arrow -->
    <rect x="14" y="4" width="4" height="14" fill="#7CB89A" stroke="#5DAF60" stroke-width="1"/>
    <polygon points="10,16 16,24 22,16" fill="#7CB89A" stroke="#5DAF60" stroke-width="1.5" stroke-linejoin="miter"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
