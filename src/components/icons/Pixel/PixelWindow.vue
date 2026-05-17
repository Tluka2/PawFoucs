<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 窗口主体 -->
    <rect x="4" y="6" width="24" height="20" rx="1" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="2"/>
    <!-- 标题栏 -->
    <rect x="4" y="6" width="24" height="5" rx="1" fill="#C8B8E8" stroke="#C8B8E8" stroke-width="1"/>
    <!-- 窗口按钮（红黄绿） -->
    <circle cx="7.5" cy="8.5" r="1" fill="#E898A8"/>
    <circle cx="11" cy="8.5" r="1" fill="#FFD93D"/>
    <circle cx="14.5" cy="8.5" r="1" fill="#7BC67E"/>
    <!-- 内容区域线条 -->
    <rect x="7" y="14" width="18" height="2" fill="#E0D0F0"/>
    <rect x="7" y="18" width="14" height="2" fill="#E0D0F0"/>
    <rect x="7" y="22" width="10" height="2" fill="#E0D0F0"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
