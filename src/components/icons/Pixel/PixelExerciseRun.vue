<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 尾巴 -->
    <polyline points="8,14 6,12 5,9 7,7" fill="none" stroke="#8B6914" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- 后腿 -->
    <rect x="8" y="17" width="3" height="4" rx="1" fill="#FFD93D" stroke="#8B6914" stroke-width="1.5"/>
    <rect x="12" y="18" width="3" height="3" rx="1" fill="#FFD93D" stroke="#8B6914" stroke-width="1.5"/>

    <!-- 身体 -->
    <rect x="10" y="11" width="14" height="7" rx="1" fill="#FFD93D" stroke="#8B6914" stroke-width="1.5"/>

    <!-- 头部 -->
    <rect x="21" y="7" width="10" height="9" rx="1" fill="#FFD93D" stroke="#8B6914" stroke-width="1.5"/>

    <!-- 耳朵（下垂） -->
    <rect x="21" y="4" width="3" height="4" rx="1" fill="#FFD93D" stroke="#8B6914" stroke-width="1.5"/>

    <!-- 前腿 -->
    <rect x="19" y="17" width="3" height="4" rx="1" fill="#FFD93D" stroke="#8B6914" stroke-width="1.5"/>
    <rect x="23" y="18" width="3" height="3" rx="1" fill="#FFD93D" stroke="#8B6914" stroke-width="1.5"/>

    <!-- 眼睛 -->
    <circle cx="24" cy="11" r="0.8" fill="#5A5A5A"/>

    <!-- 鼻子 -->
    <circle cx="29" cy="13" r="0.8" fill="#E88B5A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
