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

    <!-- 小狗头在中心 -->
    <rect x="13" y="13" width="6" height="5" rx="1" fill="#FFD93D" stroke="#E8B84D" stroke-width="1"/>

    <!-- 小狗耳朵 -->
    <rect x="13" y="11" width="2" height="3" fill="#FFD93D" stroke="#E8B84D" stroke-width="1"/>

    <!-- 小狗眼睛 -->
    <circle cx="16" cy="15" r="0.6" fill="#5A5A5A"/>

    <!-- 叶子装饰 -->
    <ellipse cx="26" cy="24" rx="3" ry="2" fill="#7BC67E" stroke="#5DAF60" stroke-width="1" transform="rotate(-30 26 24)"/>

    <line x1="26" y1="24" x2="28" y2="28" stroke="#5DAF60" stroke-width="1.5"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
