<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 番茄主体 -->
    <circle cx="16" cy="18" r="11" fill="#E8956A" stroke="#D67A4E" stroke-width="2"/>

    <!-- 顶部叶子 -->
    <path d="M10 10 L16 5 L22 10 L20 12 L16 8 L12 12 Z" fill="#7BC67E" stroke="#5DAF60" stroke-width="1" stroke-linejoin="miter"/>
    <rect x="15" y="7" width="2" height="3" fill="#7BC67E"/>

    <!-- 时钟刻度 -->
    <rect x="15" y="10" width="2" height="2" fill="#FFFFFF" opacity="0.7"/>
    <rect x="15" y="24" width="2" height="2" fill="#FFFFFF" opacity="0.7"/>
    <rect x="8" y="17" width="2" height="2" fill="#FFFFFF" opacity="0.7"/>
    <rect x="22" y="17" width="2" height="2" fill="#FFFFFF" opacity="0.7"/>

    <!-- 时钟指针 -->
    <rect x="15" y="13" width="2" height="5" fill="#FFFFFF" rx="0.5"/>
    <rect x="16" y="16" width="5" height="2" fill="#FFFFFF" rx="0.5"/>

    <!-- 中心点 -->
    <circle cx="16" cy="17" r="1.5" fill="#FFD93D"/>

    <!-- 小狗趴在番茄顶部 -->
    <rect x="13" y="4" width="6" height="5" rx="1" fill="#FFD93D" stroke="#E8B84D" stroke-width="1"/>
    <rect x="13" y="2" width="2" height="3" fill="#FFD93D" stroke="#E8B84D" stroke-width="1"/>
    <circle cx="16" cy="6" r="0.6" fill="#5A5A5A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
