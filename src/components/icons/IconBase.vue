<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    class="icon-base"
    :class="{ 'icon-hover': hoverScale }"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  hoverScale?: boolean
}>(), {
  size: 24,
  hoverScale: false,
})
</script>

<style scoped>
.icon-base {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}
.icon-hover:hover {
  transform: scale(1.12);
}
</style>
