<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 五角星主体 -->
    <path d="M16 3 L19 11 L28 12 L21 17 L23 26 L16 21 L9 26 L11 17 L4 12 L13 11 Z"
          fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5" stroke-linejoin="round"/>

    <!-- 星星面部高光 -->
    <circle cx="16" cy="14" r="2" fill="#FFE066"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
