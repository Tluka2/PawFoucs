<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Arrow curve -->
    <path d="M24 14 A10 10 0 1 0 24 22" fill="none" stroke="#E8956A" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Arrow head -->
    <polygon points="20,6 28,12 20,16" fill="#E8956A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
