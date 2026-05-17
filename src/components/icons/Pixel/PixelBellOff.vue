<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Bell body (muted) -->
    <rect x="10" y="8" width="12" height="4" rx="2" fill="#C0B0A0" stroke="#9A9088" stroke-width="1.5"/>
    <rect x="8" y="12" width="16" height="10" fill="#D0C8C0" stroke="#C0B0A0" stroke-width="1.5"/>
    <rect x="10" y="22" width="12" height="3" fill="#C0B0A0"/>
    <circle cx="16" cy="26" r="2" fill="#9A9088"/>
    <!-- Mute line -->
    <line x1="6" y1="6" x2="26" y2="26" stroke="#D97A6A" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
