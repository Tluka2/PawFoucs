<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Calendar body -->
    <rect x="5" y="8" width="22" height="20" rx="2" fill="#FFFFFF" stroke="#E8956A" stroke-width="2"/>

    <!-- Top bar -->
    <rect x="5" y="8" width="22" height="7" rx="2" fill="#E8956A"/>
    <rect x="5" y="13" width="22" height="2" fill="#D67A4E"/>

    <!-- Rings -->
    <rect x="9" y="4" width="3" height="6" rx="1" fill="#C0B0A0" stroke="#9A9088" stroke-width="1"/>
    <rect x="20" y="4" width="3" height="6" rx="1" fill="#C0B0A0" stroke="#9A9088" stroke-width="1"/>

    <!-- Date grid dots -->
    <rect x="9" y="20" width="3" height="3" fill="#E8956A" opacity="0.6"/>
    <rect x="15" y="20" width="3" height="3" fill="#E8956A" opacity="0.6"/>
    <rect x="21" y="20" width="3" height="3" fill="#FFD93D"/>
    <rect x="9" y="26" width="3" height="3" fill="#E8956A" opacity="0.3"/>
    <rect x="15" y="26" width="3" height="3" fill="#E8956A" opacity="0.3"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
