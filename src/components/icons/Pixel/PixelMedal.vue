<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Ribbon top -->
    <polygon points="8,4 14,4 16,10 18,4 24,4 22,12 10,12" fill="#E8956A" stroke="#D67A4E" stroke-width="1" stroke-linejoin="miter"/>

    <!-- Medal circle -->
    <circle cx="16" cy="20" r="9" fill="#FFD93D" stroke="#E8B84D" stroke-width="2"/>

    <!-- Inner ring -->
    <circle cx="16" cy="20" r="6" fill="none" stroke="#E8B84D" stroke-width="1"/>

    <!-- Star in center -->
    <rect x="14" y="16" width="4" height="4" fill="#E8956A"/>
    <rect x="13" y="17" width="1" height="2" fill="#E8956A"/>
    <rect x="18" y="17" width="1" height="2" fill="#E8956A"/>
    <rect x="15" y="15" width="2" height="1" fill="#E8956A"/>
    <rect x="15" y="20" width="2" height="1" fill="#E8956A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
