<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Bell body -->
    <rect x="10" y="8" width="12" height="4" rx="2" fill="#E8956A" stroke="#D67A4E" stroke-width="1.5"/>
    <rect x="8" y="12" width="16" height="10" fill="#F0B08A" stroke="#E8956A" stroke-width="1.5"/>
    <!-- Bell bottom -->
    <rect x="10" y="22" width="12" height="3" fill="#E8956A"/>
    <!-- Clapper -->
    <circle cx="16" cy="26" r="2" fill="#D67A4E"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
