<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Cup body -->
    <path d="M8 6 L8 16 Q8 22 16 22 Q24 22 24 16 L24 6Z" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>

    <!-- Handles -->
    <path d="M8 8 Q3 10 3 14 Q3 18 8 18" fill="none" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>
    <path d="M24 8 Q29 10 29 14 Q29 18 24 18" fill="none" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>

    <!-- Base -->
    <rect x="12" y="22" width="8" height="3" fill="#E8B84D"/>
    <rect x="10" y="25" width="12" height="3" rx="1" fill="#FFD93D" stroke="#E8B84D" stroke-width="1"/>

    <!-- Star on cup -->
    <rect x="14" y="11" width="4" height="4" fill="#E8956A"/>
    <rect x="13" y="12" width="1" height="2" fill="#E8956A"/>
    <rect x="18" y="12" width="1" height="2" fill="#E8956A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
