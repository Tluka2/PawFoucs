<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 屋顶 -->
    <path d="M4 14 L13 5 L22 14 Z" fill="#F29E6D" stroke="#E88B5A" stroke-width="2" stroke-linejoin="miter"/>
    <!-- 烟囱 -->
    <rect x="17" y="7" width="3" height="5" fill="#E88B5A"/>

    <!-- 房子主体 -->
    <rect x="6" y="14" width="14" height="12" fill="#FFF5E6" stroke="#E88B5A" stroke-width="2"/>
    <!-- 门 -->
    <rect x="11" y="18" width="4" height="8" fill="#7BC67E" stroke="#5DAF60" stroke-width="1.5"/>
    <circle cx="14" cy="22" r="0.8" fill="#5DAF60"/>

    <!-- 小猫 -->
    <rect x="20" y="16" width="8" height="7" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1.5"/>
    <!-- 左耳 -->
    <path d="M20 16 L20 13 L23 16 Z" fill="#333333"/>
    <path d="M20.5 15.5 L21 14 L22 15.5 Z" fill="#E898A8"/>
    <!-- 右耳 -->
    <path d="M28 16 L28 13 L25 16 Z" fill="#333333"/>
    <path d="M27.5 15.5 L27 14 L26 15.5 Z" fill="#E898A8"/>
    <!-- 花纹 -->
    <rect x="21" y="16" width="2" height="2" fill="#333333"/>
    <!-- 眼睛 -->
    <circle cx="22" cy="20" r="0.7" fill="#333333"/>
    <circle cx="26" cy="20" r="0.7" fill="#333333"/>
    <!-- 鼻子 -->
    <circle cx="24" cy="21.5" r="0.5" fill="#E898A8"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
