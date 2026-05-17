<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 爱心主体 -->
    <path d="M16 28 L6 18 C2 14 2 8 6 6 C10 2 14 6 16 10 C18 6 22 2 26 6 C30 8 30 14 26 18 L16 28 Z"
          fill="#E898A8" stroke="#D97A6A" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- 高光 -->
    <ellipse cx="10" cy="10" rx="2" ry="3" fill="#F0B0B8" opacity="0.5" transform="rotate(-30 10 10)"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
