<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Pot -->
    <path d="M8 20 L10 28 L22 28 L24 20Z" fill="#C0B0A0" stroke="#9A9088" stroke-width="1.5" stroke-linejoin="miter"/>
    <!-- Soil -->
    <ellipse cx="16" cy="20" rx="8" ry="3" fill="#8B6914" stroke="#6B4F10" stroke-width="1"/>
    <!-- Stem -->
    <rect x="15" y="10" width="2" height="12" fill="#7CB89A"/>
    <!-- Left leaf -->
    <ellipse cx="10" cy="12" rx="5" ry="4" fill="#7CB89A" stroke="#5DAF60" stroke-width="1.5"/>
    <!-- Right leaf -->
    <ellipse cx="22" cy="10" rx="5" ry="4" fill="#9DD4B8" stroke="#7CB89A" stroke-width="1.5"/>
    <!-- Center bud -->
    <ellipse cx="16" cy="7" rx="3" ry="4" fill="#9DD4B8" stroke="#7CB89A" stroke-width="1"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
