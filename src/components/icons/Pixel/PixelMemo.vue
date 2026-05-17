<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 便签纸主体 -->
    <rect x="8" y="4" width="14" height="18" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="2"/>

    <!-- 折角 -->
    <path d="M18 22 L22 22 L22 18 Z" fill="#E0D0F0" stroke="#C8B8E8" stroke-width="1"/>

    <!-- 横线 -->
    <line x1="11" y1="10" x2="19" y2="10" stroke="#C8B8E8" stroke-width="1.5"/>
    <line x1="11" y1="14" x2="19" y2="14" stroke="#C8B8E8" stroke-width="1.5"/>

    <!-- 小狗 -->
    <rect x="16" y="18" width="8" height="7" rx="1" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>

    <!-- 小狗耳朵 -->
    <rect x="16" y="16" width="3" height="3" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>

    <!-- 铅笔 -->
    <rect x="24" y="14" width="3" height="10" transform="rotate(30 25.5 19)" fill="#F29E6D" stroke="#E88B5A" stroke-width="1.5"/>

    <!-- 闪光 -->
    <path d="M6 8 L7 10 L9 10 L7.5 11.5 L8 13.5 L6 12.5 L4 13.5 L4.5 11.5 L3 10 L5 10 Z" fill="#E8B84D"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
