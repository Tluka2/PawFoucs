<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Note head -->
    <ellipse cx="10" cy="24" rx="5" ry="4" fill="#E8956A" stroke="#D67A4E" stroke-width="1.5"/>
    <!-- Note stem -->
    <rect x="14" y="6" width="2" height="18" fill="#E8956A"/>
    <!-- Note flag -->
    <path d="M16 6 Q24 10 24 16 Q20 14 16 14" fill="#E8956A" stroke="#D67A4E" stroke-width="1" stroke-linejoin="miter"/>
    <!-- Small note -->
    <ellipse cx="22" cy="20" rx="3" ry="2.5" fill="#7CB89A" stroke="#5DAF60" stroke-width="1"/>
    <rect x="24.5" y="10" width="1.5" height="10" fill="#7CB89A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
