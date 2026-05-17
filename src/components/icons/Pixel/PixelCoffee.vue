<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Saucer -->
    <rect x="5" y="24" width="18" height="3" rx="1" fill="#C0B0A0"/>
    <!-- Cup body -->
    <path d="M6 10 L6 22 Q6 26 14 26 Q22 26 22 22 L22 10Z" fill="#FFFFFF" stroke="#E8956A" stroke-width="1.5"/>
    <!-- Coffee liquid -->
    <ellipse cx="14" cy="12" rx="6" ry="3" fill="#6B4226"/>
    <!-- Handle -->
    <path d="M22 12 Q27 12 27 17 Q27 22 22 22" fill="none" stroke="#E8956A" stroke-width="2" stroke-linecap="round"/>
    <!-- Steam -->
    <path d="M10 6 Q11 3 10 1" fill="none" stroke="#C0B0A0" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M14 5 Q15 2 14 0" fill="none" stroke="#C0B0A0" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M18 6 Q19 3 18 1" fill="none" stroke="#C0B0A0" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
