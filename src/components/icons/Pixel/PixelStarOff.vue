<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 五角星轮廓 -->
    <path d="M16 3 L19 11 L28 12 L21 17 L23 26 L16 21 L9 26 L11 17 L4 12 L13 11 Z"
          fill="none" stroke="#C0B8B0" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
