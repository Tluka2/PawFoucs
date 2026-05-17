<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 盖子 -->
    <rect x="6" y="6" width="20" height="4" fill="#C0B0A0" stroke="#A09890" stroke-width="1.5"/>
    <!-- 把手 -->
    <rect x="13" y="3" width="6" height="4" fill="#C0B0A0" stroke="#A09890" stroke-width="1.5"/>

    <!-- 桶身 -->
    <rect x="7" y="10" width="18" height="19" rx="1" fill="#D0C8C0" stroke="#B0A8A0" stroke-width="1.5"/>

    <!-- 竖条纹（像金属垃圾桶） -->
    <line x1="11" y1="13" x2="11" y2="26" stroke="#B0A8A0" stroke-width="1.5"/>
    <line x1="16" y1="13" x2="16" y2="26" stroke="#B0A8A0" stroke-width="1.5"/>
    <line x1="21" y1="13" x2="21" y2="26" stroke="#B0A8A0" stroke-width="1.5"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
