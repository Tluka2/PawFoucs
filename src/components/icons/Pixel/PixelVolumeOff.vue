<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Speaker body -->
    <rect x="6" y="10" width="6" height="12" fill="#C0B8B0" stroke="#9A9088" stroke-width="1.5"/>
    <polygon points="12,10 22,4 22,28 12,22" fill="#D0C8C0" stroke="#C0B8B0" stroke-width="1.5"/>
    <!-- Mute X -->
    <line x1="24" y1="10" x2="30" y2="22" stroke="#D97A6A" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="30" y1="10" x2="24" y2="22" stroke="#D97A6A" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
