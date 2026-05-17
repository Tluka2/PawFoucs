<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 外圈大红盘 -->
    <circle cx="16" cy="16" r="13" fill="#E8956A" stroke="#D67A4E" stroke-width="2"/>
    <!-- 白色环 -->
    <circle cx="16" cy="16" r="9" fill="#FFFFFF" stroke="#C0B8B0" stroke-width="1.5"/>
    <!-- 红色内环 -->
    <circle cx="16" cy="16" r="5" fill="#E8956A" stroke="#D67A4E" stroke-width="1.5"/>
    <!-- 黄色靶心 -->
    <circle cx="16" cy="16" r="2" fill="#FFD93D"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
