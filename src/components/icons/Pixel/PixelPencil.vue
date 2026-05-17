<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Pencil body (rotated) -->
    <g transform="rotate(-45 16 16)">
      <!-- Eraser -->
      <rect x="13" y="3" width="6" height="5" rx="1" fill="#E898A8" stroke="#D97A6A" stroke-width="1"/>
      <rect x="13" y="8" width="6" height="2" fill="#C0B0A0"/>

      <!-- Wood body -->
      <rect x="13" y="10" width="6" height="14" fill="#F29E6D" stroke="#E88B5A" stroke-width="1"/>

      <!-- Tip -->
      <polygon points="13,24 19,24 16,29" fill="#FFD93D" stroke="#E8B84D" stroke-width="1" stroke-linejoin="miter"/>
      <polygon points="15,26 17,26 16,28" fill="#5A5A5A"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
