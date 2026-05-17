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
    <path d="M8 15c0 3 1.5 5 4 5s4-2 4-5c0-2.5-1.5-4-4-4S8 12.5 8 15z" />
    <!-- toe 1 -->
    <circle cx="6" cy="9" r="2.5" />
    <!-- toe 2 -->
    <circle cx="10" cy="7" r="2.5" />
    <!-- toe 3 -->
    <circle cx="14" cy="7" r="2.5" />
    <!-- toe 4 -->
    <circle cx="18" cy="9" r="2.5" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  size?: number
  color?: string
}>()
</script>
