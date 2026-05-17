<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 柱状图底座 -->
    <line x1="5" y1="26" x2="27" y2="26" stroke="#C0B0A0" stroke-width="2" stroke-linecap="round"/>

    <!-- 绿色柱子 -->
    <rect x="7" y="18" width="5" height="8" fill="#7BC67E" stroke="#5DAF60" stroke-width="1.5"/>

    <!-- 粉色柱子 -->
    <rect x="14" y="12" width="5" height="14" fill="#E898A8" stroke="#D97A6A" stroke-width="1.5"/>

    <!-- 蓝色柱子 -->
    <rect x="21" y="8" width="5" height="18" fill="#87CEEB" stroke="#6BB6D6" stroke-width="1.5"/>

    <!-- 小狗 -->
    <rect x="4" y="10" width="8" height="7" rx="1" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>

    <!-- 小狗耳朵 -->
    <rect x="4" y="8" width="3" height="3" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>

    <!-- 小狗眼睛 -->
    <circle cx="8" cy="13" r="0.8" fill="#5A5A5A"/>

    <!-- 旗帜 -->
    <line x1="24" y1="4" x2="24" y2="10" stroke="#C0B0A0" stroke-width="2"/>
    <rect x="24" y="4" width="5" height="4" fill="#E898A8" stroke="#D97A6A" stroke-width="1.5"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
