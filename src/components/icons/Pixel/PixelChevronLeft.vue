<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <polygon points="20,6 10,16 20,26" fill="none" stroke="#9A9088" stroke-width="3" stroke-linejoin="miter"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
