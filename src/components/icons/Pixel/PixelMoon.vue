<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 弯月：参考 emoji 🌙 比例，左凸右凹的圆润月牙 -->
    <path d="M20 2 C10 2 3 9 3 16 C3 23 10 30 20 30 C14 26 10 21 10 16 C10 11 14 6 20 2 Z"
          fill="#C8B8E8" stroke="#A090C0" stroke-width="1.5" stroke-linejoin="round"/>

    <!-- 陨石坑 -->
    <circle cx="9" cy="12" r="1" fill="#B0A0D0" opacity="0.5"/>
    <circle cx="7" cy="17" r="1.2" fill="#B0A0D0" opacity="0.5"/>
    <circle cx="11" cy="22" r="0.8" fill="#B0A0D0" opacity="0.5"/>

    <!-- 小星星 -->
    <rect x="26" y="6" width="2" height="2" fill="#E8B84D"/>
    <rect x="28" y="20" width="1" height="1" fill="#E8B84D"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
