<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 完美对称的 3px 像素 X -->
    <path d="M8 8 L24 24 M24 8 L8 24" fill="none" stroke="#D97A6A" stroke-width="3" stroke-linecap="square"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
