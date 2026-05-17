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
    <!-- 门把手 -->
    <circle cx="14" cy="22" r="0.8" fill="#5DAF60"/>

    <!-- 小狗头 -->
    <rect x="20" y="16" width="8" height="7" rx="1" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>
    <!-- 小狗耳朵 -->
    <rect x="20" y="14" width="3" height="3" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>

    <!-- 小狗眼睛 -->
    <circle cx="24" cy="19" r="0.8" fill="#5A5A5A"/>

    <!-- 小狗鼻子 -->
    <circle cx="27" cy="20" r="0.8" fill="#E88B5A"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
