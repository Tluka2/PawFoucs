<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Speaker body -->
    <rect x="6" y="10" width="6" height="12" fill="#E8956A" stroke="#D67A4E" stroke-width="1.5"/>
    <polygon points="12,10 22,4 22,28 12,22" fill="#F0B08A" stroke="#E8956A" stroke-width="1.5"/>
    <!-- Sound waves -->
    <path d="M24 10 Q28 16 24 22" fill="none" stroke="#7CB89A" stroke-width="2" stroke-linecap="round"/>
    <path d="M27 7 Q33 16 27 25" fill="none" stroke="#7CB89A" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
