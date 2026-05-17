<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 笔记本主体 -->
    <rect x="7" y="8" width="16" height="18" rx="1" fill="#7BC67E" stroke="#5DAF60" stroke-width="2"/>

    <!-- 螺旋装订 -->
    <rect x="5" y="10" width="3" height="2" fill="#C0B0A0"/>
    <rect x="5" y="14" width="3" height="2" fill="#C0B0A0"/>
    <rect x="5" y="18" width="3" height="2" fill="#C0B0A0"/>
    <rect x="5" y="22" width="3" height="2" fill="#C0B0A0"/>

    <!-- 页面勾选 -->
    <polyline points="12 16 15 19 20 13" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- 小猫趴在笔记本上方 -->
    <rect x="16" y="4" width="8" height="6" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1.5"/>

    <!-- 左耳 -->
    <path d="M16 4 L16 1 L19 4 Z" fill="#333333"/>
    <path d="M16.5 3.5 L17 2 L18 3.5 Z" fill="#E898A8"/>

    <!-- 右耳 -->
    <path d="M24 4 L24 1 L21 4 Z" fill="#333333"/>
    <path d="M23.5 3.5 L23 2 L22 3.5 Z" fill="#E898A8"/>

    <!-- 花纹 -->
    <rect x="17" y="4" width="2" height="2" fill="#333333"/>

    <!-- 眼睛 -->
    <circle cx="18" cy="7" r="0.7" fill="#333333"/>
    <circle cx="22" cy="7" r="0.7" fill="#333333"/>

    <!-- 鼻子 -->
    <circle cx="20" cy="8.5" r="0.5" fill="#E898A8"/>

    <!-- 爱心装饰 -->
    <path d="M23 22 C23 21 24 20 25 21 C26 20 27 21 27 22 C27 24 25 25 25 25 C25 25 23 24 23 22Z" fill="#E898A8" stroke="#D97A6A" stroke-width="1"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
