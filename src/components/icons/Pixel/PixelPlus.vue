<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Plus sign -->
    <rect x="13" y="6" width="6" height="6" fill="#E8956A"/>
    <rect x="6" y="13" width="6" height="6" fill="#E8956A"/>
    <rect x="13" y="13" width="6" height="6" fill="#E8956A"/>
    <rect x="20" y="13" width="6" height="6" fill="#E8956A"/>
    <rect x="13" y="20" width="6" height="6" fill="#E8956A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
