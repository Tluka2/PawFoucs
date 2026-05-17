<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Water drop -->
    <path d="M16 4 Q26 14 26 20 A10 10 0 0 1 6 20 Q6 14 16 4Z" fill="#87CEEB" stroke="#6BB6D6" stroke-width="1.5"/>
    <!-- Highlight -->
    <ellipse cx="13" cy="16" rx="2" ry="3" fill="#FFFFFF" opacity="0.6"/>
    <!-- Small droplets -->
    <circle cx="8" cy="26" r="2" fill="#6BB6D6"/>
    <circle cx="24" cy="26" r="2" fill="#6BB6D6"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
