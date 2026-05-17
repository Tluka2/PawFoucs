<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 左眼白 -->
    <ellipse cx="10" cy="14" rx="6" ry="7" fill="#F0F8F0" stroke="#9DD4B8" stroke-width="2"/>
    <!-- 左眼虹膜 -->
    <circle cx="10" cy="14" r="3.5" fill="#B8E8C8"/>
    <!-- 左眼瞳孔 -->
    <circle cx="10" cy="14" r="2" fill="#5A8A6A"/>
    <!-- 左眼高光 -->
    <circle cx="9" cy="12" r="1.2" fill="#FFFFFF"/>
    <circle cx="11" cy="15" r="0.6" fill="#FFFFFF" opacity="0.5"/>

    <!-- 右眼白 -->
    <ellipse cx="22" cy="14" rx="6" ry="7" fill="#F0F8F0" stroke="#9DD4B8" stroke-width="2"/>
    <!-- 右眼虹膜 -->
    <circle cx="22" cy="14" r="3.5" fill="#B8E8C8"/>
    <!-- 右眼瞳孔 -->
    <circle cx="22" cy="14" r="2" fill="#5A8A6A"/>
    <!-- 右眼高光 -->
    <circle cx="21" cy="12" r="1.2" fill="#FFFFFF"/>
    <circle cx="23" cy="15" r="0.6" fill="#FFFFFF" opacity="0.5"/>

    <!-- 可爱眉毛 -->
    <path d="M6 5 Q10 3 14 5" fill="none" stroke="#9DD4B8" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M18 5 Q22 3 26 5" fill="none" stroke="#9DD4B8" stroke-width="1.5" stroke-linecap="round"/>

    <!-- 腮红 -->
    <circle cx="7" cy="20" r="1.5" fill="#E898A8" opacity="0.4"/>
    <circle cx="25" cy="20" r="1.5" fill="#E898A8" opacity="0.4"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
