<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 齿轮外圈 -->
    <circle cx="16" cy="16" r="10" fill="#D0C0E8" stroke="#B8A8D8" stroke-width="2"/>

    <!-- 齿轮齿 -->
    <rect x="14" y="4" width="4" height="4" fill="#B8A8D8"/>
    <rect x="14" y="24" width="4" height="4" fill="#B8A8D8"/>
    <rect x="4" y="14" width="4" height="4" fill="#B8A8D8"/>
    <rect x="24" y="14" width="4" height="4" fill="#B8A8D8"/>

    <!-- 中心圆 -->
    <circle cx="16" cy="16" r="5" fill="#E8E0F4" stroke="#B8A8D8" stroke-width="1.5"/>

    <!-- 小猫趴在齿轮中心 -->
    <rect x="13" y="13" width="6" height="5" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1"/>

    <!-- 左耳 -->
    <path d="M13 13 L13 10 L16 13 Z" fill="#333333"/>
    <path d="M13.5 12.5 L14 11 L15 12.5 Z" fill="#E898A8"/>

    <!-- 右耳 -->
    <path d="M19 13 L19 10 L16 13 Z" fill="#333333"/>
    <path d="M18.5 12.5 L18 11 L17 12.5 Z" fill="#E898A8"/>

    <!-- 花纹 -->
    <rect x="14" y="13" width="1.5" height="1.5" fill="#333333"/>

    <!-- 眼睛 -->
    <circle cx="14.5" cy="15.5" r="0.5" fill="#333333"/>
    <circle cx="17.5" cy="15.5" r="0.5" fill="#333333"/>

    <!-- 鼻子 -->
    <circle cx="16" cy="16.5" r="0.4" fill="#E898A8"/>

    <!-- 叶子装饰 -->
    <ellipse cx="26" cy="24" rx="3" ry="2" fill="#7BC67E" stroke="#5DAF60" stroke-width="1" transform="rotate(-30 26 24)"/>
    <line x1="26" y1="24" x2="28" y2="28" stroke="#5DAF60" stroke-width="1.5"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
