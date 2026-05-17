<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Checkmark -->
    <rect x="6" y="16" width="4" height="4" fill="#7CB89A"/>
    <rect x="10" y="20" width="4" height="4" fill="#7CB89A"/>
    <rect x="14" y="16" width="4" height="4" fill="#7CB89A"/>
    <rect x="18" y="12" width="4" height="4" fill="#7CB89A"/>
    <rect x="22" y="8" width="4" height="4" fill="#7CB89A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
