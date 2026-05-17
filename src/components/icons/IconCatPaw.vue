<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- main pad -->
    <ellipse cx="12" cy="15.5" rx="5" ry="4" />
    <!-- toe 1 -->
    <ellipse cx="6.5" cy="8" rx="2.2" ry="2.8" />
    <!-- toe 2 -->
    <ellipse cx="10.5" cy="6" rx="2.2" ry="2.8" />
    <!-- toe 3 -->
    <ellipse cx="13.5" cy="6" rx="2.2" ry="2.8" />
    <!-- toe 4 -->
    <ellipse cx="17.5" cy="8" rx="2.2" ry="2.8" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  size?: number
  color?: string
}>()
</script>
