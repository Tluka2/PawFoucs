<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Outer flame -->
    <path d="M16 4 Q26 12 26 20 A10 10 0 0 1 6 20 Q6 12 16 4Z" fill="#E8956A" stroke="#D67A4E" stroke-width="1.5"/>

    <!-- Middle flame -->
    <path d="M16 10 Q22 15 22 20 A6 6 0 0 1 10 20 Q10 15 16 10Z" fill="#FFD93D" stroke="#E8B84D" stroke-width="1"/>

    <!-- Inner flame -->
    <path d="M16 15 Q18 17 18 20 A3 3 0 0 1 14 20 Q14 17 16 15Z" fill="#FFFFFF" opacity="0.7"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
