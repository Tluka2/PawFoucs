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

    <!-- 小猫站在粉色柱子上方 -->
    <rect x="12" y="6" width="8" height="7" rx="1" fill="#FFFFFF" stroke="#333333" stroke-width="1.5"/>

    <!-- 左耳 -->
    <path d="M12 6 L12 3 L15 6 Z" fill="#333333"/>
    <path d="M12.5 5.5 L13 4 L14 5.5 Z" fill="#E898A8"/>

    <!-- 右耳 -->
    <path d="M20 6 L20 3 L17 6 Z" fill="#333333"/>
    <path d="M19.5 5.5 L19 4 L18 5.5 Z" fill="#E898A8"/>

    <!-- 花纹 -->
    <rect x="13" y="6" width="2" height="2" fill="#333333"/>

    <!-- 眼睛 -->
    <circle cx="14" cy="10" r="0.7" fill="#333333"/>
    <circle cx="18" cy="10" r="0.7" fill="#333333"/>

    <!-- 鼻子 -->
    <circle cx="16" cy="11.5" r="0.5" fill="#E898A8"/>

    <!-- 旗帜 -->
    <line x1="24" y1="4" x2="24" y2="10" stroke="#C0B0A0" stroke-width="2"/>
    <rect x="24" y="4" width="5" height="4" fill="#E898A8" stroke="#D97A6A" stroke-width="1.5"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
