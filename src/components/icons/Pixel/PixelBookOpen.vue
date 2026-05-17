<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Left page -->
    <path d="M4 8 Q12 4 16 8 L16 26 Q12 22 4 26Z" fill="#F0B08A" stroke="#E8956A" stroke-width="1.5"/>
    <!-- Right page -->
    <path d="M28 8 Q20 4 16 8 L16 26 Q20 22 28 26Z" fill="#F0B08A" stroke="#E8956A" stroke-width="1.5"/>
    <!-- Spine -->
    <rect x="15" y="7" width="2" height="20" fill="#D67A4E"/>
    <!-- Text lines left -->
    <rect x="7" y="12" width="6" height="2" fill="#E8956A" opacity="0.5"/>
    <rect x="7" y="17" width="5" height="2" fill="#E8956A" opacity="0.5"/>
    <!-- Text lines right -->
    <rect x="19" y="12" width="6" height="2" fill="#E8956A" opacity="0.5"/>
    <rect x="19" y="17" width="5" height="2" fill="#E8956A" opacity="0.5"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
