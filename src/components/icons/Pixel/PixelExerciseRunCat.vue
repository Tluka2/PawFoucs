<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 尾巴 -->
    <polyline points="8,14 6,12 5,9 7,7" fill="none" stroke="#333333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- 后腿 -->
    <rect x="8" y="17" width="3" height="4" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1.5"/>
    <rect x="12" y="18" width="3" height="3" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1.5"/>

    <!-- 身体 -->
    <rect x="10" y="11" width="14" height="7" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1.5"/>

    <!-- 头部 -->
    <rect x="21" y="8" width="10" height="9" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1.5"/>

    <!-- 左耳 -->
    <path d="M21 8 L21 4 L25 8 Z" fill="#333333"/>
    <path d="M21.5 7.5 L22 5.5 L24 7.5 Z" fill="#E898A8"/>
    <!-- 右耳 -->
    <path d="M31 8 L31 4 L27 8 Z" fill="#333333"/>
    <path d="M30.5 7.5 L30 5.5 L28 7.5 Z" fill="#E898A8"/>

    <!-- 花纹 -->
    <rect x="22" y="8" width="2" height="2" fill="#333333"/>

    <!-- 前腿 -->
    <rect x="19" y="17" width="3" height="4" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1.5"/>
    <rect x="23" y="18" width="3" height="3" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1.5"/>

    <!-- 眼睛 -->
    <circle cx="24" cy="11" r="0.8" fill="#333333"/>
    <circle cx="27" cy="11" r="0.8" fill="#333333"/>

    <!-- 鼻子 -->
    <circle cx="29" cy="13" r="0.5" fill="#E898A8"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
