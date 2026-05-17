<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 主硬币外圈 -->
    <circle cx="14" cy="15" r="10" fill="#D4A030"/>
    <!-- 主硬币主体 -->
    <circle cx="14" cy="15" r="8" fill="#FFD93D"/>
    <!-- 主硬币高光 -->
    <circle cx="11" cy="12" r="3" fill="#FFE066"/>
    <!-- 主硬币中心图案：星形 -->
    <rect x="13" y="11" width="2" height="2" fill="#D4A030"/>
    <rect x="11" y="13" width="2" height="2" fill="#D4A030"/>
    <rect x="15" y="13" width="2" height="2" fill="#D4A030"/>
    <rect x="13" y="15" width="2" height="2" fill="#D4A030"/>
    <rect x="11" y="15" width="2" height="2" fill="#D4A030"/>
    <rect x="15" y="15" width="2" height="2" fill="#D4A030"/>
    <rect x="13" y="17" width="2" height="2" fill="#D4A030"/>

    <!-- 小硬币（右下）外圈 -->
    <circle cx="24" cy="24" r="6" fill="#D4A030"/>
    <!-- 小硬币主体 -->
    <circle cx="24" cy="24" r="5" fill="#E8B85C"/>
    <!-- 小硬币高光 -->
    <circle cx="22" cy="22" r="2" fill="#FFE066"/>

    <!-- 闪光 -->
    <rect x="26" y="6" width="2" height="5" fill="#FFD93D"/>
    <rect x="24" y="8" width="6" height="2" fill="#FFD93D"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
