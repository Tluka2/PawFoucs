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
    <!-- bowl body -->
    <path d="M4 8c0 5 3.5 9 8 9s8-4 8-9H4z" />
    <!-- bowl rim -->
    <ellipse cx="12" cy="8" rx="8" ry="2" />
    <!-- bone decoration -->
    <path d="M9 11h6M8 10.5a1 1 0 1 0 0 1M16 10.5a1 1 0 1 1 0 1" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  size?: number
  color?: string
}>()
</script>
