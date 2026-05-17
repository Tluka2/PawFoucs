# Pixel Icons Catalog (38 icons)

## Bottom Nav (5 icons)

### PixelHome.vue - 首页
```vue
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
```

### PixelHabit.vue - 习惯
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 笔记本主体 -->
    <rect x="7" y="8" width="16" height="18" rx="1" fill="#7BC67E" stroke="#5DAF60" stroke-width="2"/>

    <!-- 螺旋装订 -->
    <rect x="5" y="10" width="3" height="2" fill="#C0B0A0"/>
    <rect x="5" y="14" width="3" height="2" fill="#C0B0A0"/>
    <rect x="5" y="18" width="3" height="2" fill="#C0B0A0"/>
    <rect x="5" y="22" width="3" height="2" fill="#C0B0A0"/>

    <!-- 页面勾选 -->
    <polyline points="12 16 15 19 20 13" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- 小狗贴在笔记本上方 -->
    <rect x="16" y="4" width="8" height="6" rx="1" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>

    <!-- 小狗耳朵 -->
    <rect x="16" y="2" width="3" height="3" fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5"/>

    <!-- 小狗眼睛 -->
    <circle cx="20" cy="7" r="0.8" fill="#5A5A5A"/>

    <!-- 爱心装饰 -->
    <path d="M23 22 C23 21 24 20 25 21 C26 20 27 21 27 22 C27 24 25 25 25 25 C25 25 23 24 23 22Z" fill="#E898A8" stroke="#D97A6A" stroke-width="1"/>
  </svg>
</template>
```

### PixelMemo.vue - 备忘
```vue
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
```

### PixelStats.vue - 统计
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 柱状图座底 -->
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
```

### PixelSettings.vue - 设置
```vue
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
```

---

## Actions (7 icons)

### PixelClose.vue - 关闭 X
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- X shape with thick pixel strokes -->
    <path d="M8 8 L24 24 M24 8 L8 24" fill="none" stroke="#D97A6A" stroke-width="3" stroke-linecap="round"/>
    <!-- Highlight -->
    <path d="M9 9 L23 23 M23 9 L9 23" fill="none" stroke="#E89888" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</template>
```

### PixelCheck.vue - 勾选 √
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Check mark -->
    <polyline points="6 17 12 23 26 9" fill="none" stroke="#5DAF60" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Highlight line -->
    <polyline points="7 17 12 22 25 10" fill="none" stroke="#7BC67E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
```

### PixelPlus.vue - 加号 +
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Plus shape -->
    <rect x="14" y="6" width="4" height="20" rx="1" fill="#E8956A"/>
    <rect x="6" y="14" width="20" height="4" rx="1" fill="#E8956A"/>
    <!-- Highlight edges -->
    <rect x="14" y="6" width="4" height="2" fill="#F0B08A"/>
    <rect x="6" y="14" width="2" height="4" fill="#F0B08A"/>
  </svg>
</template>
```

### PixelDownload.vue - 下载
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Box outline -->
    <rect x="6" y="20" width="20" height="8" rx="1" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="2"/>
    <!-- Arrow down -->
    <line x1="16" y1="4" x2="16" y2="18" stroke="#E8956A" stroke-width="3" stroke-linecap="round"/>
    <polyline points="10 14 16 20 22 14" fill="none" stroke="#E8956A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Arrow highlight -->
    <line x1="15" y1="4" x2="15" y2="17" stroke="#F0B08A" stroke-width="1" stroke-linecap="round"/>
  </svg>
</template>
```

### PixelTrash.vue - 删除
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Lid -->
    <rect x="10" y="6" width="12" height="3" rx="1" fill="#E898A8" stroke="#D97A6A" stroke-width="1.5"/>
    <rect x="14" y="4" width="4" height="3" rx="1" fill="#E898A8" stroke="#D97A6A" stroke-width="1.5"/>

    <!-- Body -->
    <rect x="8" y="10" width="16" height="18" rx="1" fill="#F0E8F8" stroke="#D97A6A" stroke-width="2"/>

    <!-- Vertical stripes -->
    <line x1="13" y1="14" x2="13" y2="24" stroke="#D97A6A" stroke-width="1.5"/>
    <line x1="16" y1="14" x2="16" y2="24" stroke="#D97A6A" stroke-width="1.5"/>
    <line x1="19" y1="14" x2="19" y2="24" stroke="#D97A6A" stroke-width="1.5"/>
  </svg>
</template>
```

### PixelRotateCcw.vue - 重置
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Circular arrow body -->
    <path d="M16 28 A12 12 0 1 1 16 4" fill="none" stroke="#E8956A" stroke-width="3" stroke-linecap="round"/>

    <!-- Arrow head -->
    <polyline points="10 10 16 4 22 10" fill="none" stroke="#E8956A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
```

### PixelPencil.vue - 编辑
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Pencil body -->
    <rect x="12" y="4" width="8" height="20" transform="rotate(45 16 16)" fill="#F29E6D" stroke="#E88B5A" stroke-width="1.5"/>

    <!-- Pencil tip -->
    <polygon points="22,22 26,26 22,26" transform="rotate(45 16 16)" fill="#C0B0A0" stroke="#A09080" stroke-width="1"/>

    <!-- Eraser -->
    <rect x="11" y="2" width="10" height="4" transform="rotate(45 16 16)" fill="#E898A8" stroke="#D97A6A" stroke-width="1"/>
  </svg>
</template>
```

---

## Navigation (2 icons)

### PixelChevronLeft.vue - 左箭头
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Left chevron -->
    <polyline points="20 6 10 16 20 26" fill="none" stroke="#9A9088" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="19 7 11 16 19 25" fill="none" stroke="#B8A8D8" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
```

### PixelChevronRight.vue - 右箭头
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Right chevron -->
    <polyline points="12 6 22 16 12 26" fill="none" stroke="#9A9088" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="13 7 21 16 13 25" fill="none" stroke="#B8A8D8" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
```

---

## Status (2 icons)

### PixelStar.vue - 重点星星（实心）
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 五角星主体 -->
    <path d="M16 3 L19 11 L28 12 L21 17 L23 26 L16 21 L9 26 L11 17 L4 12 L13 11 Z"
          fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5" stroke-linejoin="round"/>

    <!-- 星星面部高光 -->
    <circle cx="16" cy="14" r="2" fill="#FFE066"/>

    <!-- 小狗贴在星星上方 -->
    <rect x="13" y="7" width="6" height="5" rx="1" fill="#FFD93D" stroke="#E8B84D" stroke-width="1"/>
    <!-- 小狗耳朵 -->
    <rect x="13" y="5" width="2" height="3" fill="#FFD93D" stroke="#E8B84D" stroke-width="1"/>
    <!-- 小狗眼睛 -->
    <circle cx="16" cy="9" r="0.6" fill="#5A5A5A"/>
    <!-- 小狗腮红 -->
    <circle cx="14" cy="10" r="0.5" fill="#E898A8" opacity="0.6"/>
  </svg>
</template>
```

### PixelStarOff.vue - 普通星星（空心）
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- 五角星轮廓 -->
    <path d="M16 3 L19 11 L28 12 L21 17 L23 26 L16 21 L9 26 L11 17 L4 12 L13 11 Z"
          fill="none" stroke="#C0B8B0" stroke-width="1.5" stroke-linejoin="round"/>

    <!-- 小狗贴在星星上方（灰色轮廓版） -->
    <rect x="13" y="7" width="6" height="5" rx="1" fill="none" stroke="#C0B8B0" stroke-width="1"/>
    <!-- 小狗耳朵 -->
    <rect x="13" y="5" width="2" height="3" fill="none" stroke="#C0B8B0" stroke-width="1"/>
    <!-- 小狗眼睛 -->
    <circle cx="16" cy="9" r="0.6" fill="#C0B8B0"/>
  </svg>
</template>
```

---

## App Sections (8 icons)

### PixelCalendar.vue - 日历
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Calendar body -->
    <rect x="5" y="8" width="22" height="20" rx="2" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="2"/>

    <!-- Header bar -->
    <rect x="5" y="8" width="22" height="6" rx="2" fill="#C8B8E8"/>

    <!-- Hanging rings -->
    <rect x="9" y="4" width="2" height="6" fill="#B8A8D8"/>
    <rect x="21" y="4" width="2" height="6" fill="#B8A8D8"/>

    <!-- Date dots -->
    <rect x="10" y="18" width="3" height="3" fill="#E8956A"/>
    <rect x="15" y="18" width="3" height="3" fill="#E8956A"/>
    <rect x="20" y="18" width="3" height="3" fill="#E8956A"/>

    <rect x="10" y="23" width="3" height="3" fill="#7BC67E"/>
    <rect x="15" y="23" width="3" height="3" fill="#7BC67E"/>
  </svg>
</template>
```

### PixelClock.vue - 时钟
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Clock outer circle -->
    <circle cx="16" cy="16" r="11" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="2"/>

    <!-- Clock inner circle -->
    <circle cx="16" cy="16" r="9" fill="none" stroke="#E0D0F0" stroke-width="1"/>

    <!-- Hour markers -->
    <rect x="15" y="7" width="2" height="2" fill="#C8B8E8"/>
    <rect x="15" y="23" width="2" height="2" fill="#C8B8E8"/>
    <rect x="7" y="15" width="2" height="2" fill="#C8B8E8"/>
    <rect x="23" y="15" width="2" height="2" fill="#C8B8E8"/>

    <!-- Hour hand -->
    <line x1="16" y1="16" x2="16" y2="11" stroke="#5A5A5A" stroke-width="2" stroke-linecap="round"/>

    <!-- Minute hand -->
    <line x1="16" y1="16" x2="21" y2="16" stroke="#5A5A5A" stroke-width="2" stroke-linecap="round"/>

    <!-- Center dot -->
    <circle cx="16" cy="16" r="1.5" fill="#E8956A"/>
  </svg>
</template>
```

### PixelBookOpen.vue - 书本
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Left page -->
    <rect x="4" y="6" width="12" height="20" rx="1" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="1.5"/>

    <!-- Right page -->
    <rect x="16" y="6" width="12" height="20" rx="1" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="1.5"/>

    <!-- Center spine -->
    <rect x="15" y="6" width="2" height="20" fill="#C8B8E8"/>

    <!-- Text lines left -->
    <line x1="7" y1="11" x2="13" y2="11" stroke="#C8B8E8" stroke-width="1"/>
    <line x1="7" y1="15" x2="13" y2="15" stroke="#C8B8E8" stroke-width="1"/>
    <line x1="7" y1="19" x2="11" y2="19" stroke="#C8B8E8" stroke-width="1"/>

    <!-- Text lines right -->
    <line x1="19" y1="11" x2="25" y2="11" stroke="#C8B8E8" stroke-width="1"/>
    <line x1="19" y1="15" x2="25" y2="15" stroke="#C8B8E8" stroke-width="1"/>
    <line x1="19" y1="19" x2="23" y2="19" stroke="#C8B8E8" stroke-width="1"/>

    <!-- Bookmark -->
    <rect x="22" y="4" width="3" height="7" fill="#E8956A"/>
    <polygon points="22,11 23.5,13 25,11" fill="#E8956A"/>
  </svg>
</template>
```

### PixelSprout.vue - 萌芽/成长
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Soil -->
    <rect x="6" y="22" width="20" height="6" rx="1" fill="#C0B0A0"/>

    <!-- Stem -->
    <rect x="15" y="14" width="2" height="10" fill="#7BC67E"/>

    <!-- Left leaf -->
    <ellipse cx="11" cy="12" rx="5" ry="3" fill="#7BC67E" stroke="#5DAF60" stroke-width="1" transform="rotate(-20 11 12)"/>

    <!-- Right leaf -->
    <ellipse cx="21" cy="12" rx="5" ry="3" fill="#7BC67E" stroke="#5DAF60" stroke-width="1" transform="rotate(20 21 12)"/>

    <!-- Top sprout -->
    <ellipse cx="16" cy="8" rx="3" ry="5" fill="#9DD4B8" stroke="#5DAF60" stroke-width="1"/>

    <!-- Small sparkles -->
    <rect x="6" y="6" width="1" height="3" fill="#E8B84D"/>
    <rect x="5" y="7" width="3" height="1" fill="#E8B84D"/>
  </svg>
</template>
```

### PixelSquare.vue - 空方框
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Empty square checkbox -->
    <rect x="6" y="6" width="20" height="20" rx="2" fill="none" stroke="#C0B8B0" stroke-width="2.5"/>

    <!-- Inner light border -->
    <rect x="8" y="8" width="16" height="16" rx="1" fill="none" stroke="#E0D8D0" stroke-width="1"/>
  </svg>
</template>
```

### PixelStickyNote.vue - 便签
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Note body -->
    <rect x="7" y="5" width="18" height="22" rx="1" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="2"/>
    <!-- Folded corner -->
    <path d="M21 5 L25 5 L25 9 Z" fill="#E0D0F0" stroke="#C8B8E8" stroke-width="1"/>
    <!-- Lines -->
    <line x1="10" y1="11" x2="22" y2="11" stroke="#C8B8E8" stroke-width="1.5"/>
    <line x1="10" y1="16" x2="22" y2="16" stroke="#C8B8E8" stroke-width="1.5"/>
    <line x1="10" y1="21" x2="18" y2="21" stroke="#C8B8E8" stroke-width="1.5"/>
    <!-- Pin -->
    <circle cx="16" cy="8" r="2" fill="#E8956A"/>
  </svg>
</template>
```

### PixelBarChart.vue - 柱状图
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Base line -->
    <line x1="4" y1="26" x2="28" y2="26" stroke="#C0B0A0" stroke-width="2" stroke-linecap="round"/>

    <!-- Bar 1 -->
    <rect x="6" y="16" width="5" height="10" fill="#7BC67E" stroke="#5DAF60" stroke-width="1.5"/>

    <!-- Bar 2 -->
    <rect x="13" y="10" width="5" height="16" fill="#E898A8" stroke="#D97A6A" stroke-width="1.5"/>

    <!-- Bar 3 -->
    <rect x="20" y="6" width="5" height="20" fill="#87CEEB" stroke="#6BB6D6" stroke-width="1.5"/>

    <!-- Star topper on tallest bar -->
    <rect x="22" y="2" width="2" height="2" fill="#E8B84D"/>
    <rect x="21" y="3" width="4" height="1" fill="#E8B84D"/>
  </svg>
</template>
```

---

## Health (7 icons)

### PixelSun.vue - 太阳/日间
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Sun body -->
    <circle cx="16" cy="16" r="7" fill="#FFD93D" stroke="#E8B84D" stroke-width="2"/>

    <!-- Rays -->
    <line x1="16" y1="3" x2="16" y2="6" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>
    <line x1="16" y1="26" x2="16" y2="29" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>
    <line x1="3" y1="16" x2="6" y2="16" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>
    <line x1="26" y1="16" x2="29" y2="16" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>

    <line x1="7" y1="7" x2="9" y2="9" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>
    <line x1="23" y1="23" x2="25" y2="25" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>
    <line x1="25" y1="7" x2="23" y2="9" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>
    <line x1="9" y1="23" x2="7" y2="25" stroke="#E8B84D" stroke-width="2" stroke-linecap="round"/>

    <!-- Face -->
    <circle cx="13" cy="15" r="1" fill="#5A5A5A"/>
    <circle cx="19" cy="15" r="1" fill="#5A5A5A"/>
    <rect x="14" y="18" width="4" height="1" fill="#E88B5A"/>
  </svg>
</template>
```

### PixelMoon.vue - 月亮/夜间
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Crescent moon body -->
    <path d="M16 4 A12 12 0 1 0 16 28 A10 10 0 1 1 16 4 Z"
          fill="#C8B8E8" stroke="#A090C0" stroke-width="1.5"/>

    <!-- Craters -->
    <circle cx="12" cy="14" r="1.5" fill="#B0A0D0"/>
    <circle cx="18" cy="20" r="2" fill="#B0A0D0"/>
    <circle cx="14" cy="22" r="1" fill="#B0A0D0"/>

    <!-- Sleeping face -->
    <rect x="10" y="14" width="3" height="1" fill="#5A5A5A"/>
    <rect x="17" y="14" width="3" height="1" fill="#5A5A5A"/>
    <rect x="13" y="17" width="4" height="1" fill="#E88B5A"/>
  </svg>
</template>
```

### PixelBell.vue - 铃铛
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Bell body -->
    <path d="M8 22 L10 10 C10 6 13 3 16 3 C19 3 22 6 22 10 L24 22 Z"
          fill="#FFD93D" stroke="#E8B84D" stroke-width="1.5" stroke-linejoin="round"/>

    <!-- Bell rim -->
    <rect x="7" y="21" width="18" height="3" rx="1" fill="#E8B84D"/>

    <!-- Bell clapper -->
    <circle cx="16" cy="26" r="2.5" fill="#E8956A"/>

    <!-- Shine highlight -->
    <rect x="12" y="7" width="2" height="6" rx="1" fill="#FFE066"/>
  </svg>
</template>
```

### PixelBellOff.vue - 铃铛关闭
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Bell body -->
    <path d="M8 22 L10 10 C10 6 13 3 16 3 C19 3 22 6 22 10 L24 22 Z"
          fill="#E0D8D0" stroke="#C0B8B0" stroke-width="1.5" stroke-linejoin="round"/>

    <!-- Bell rim -->
    <rect x="7" y="21" width="18" height="3" rx="1" fill="#C0B8B0"/>

    <!-- Bell clapper -->
    <circle cx="16" cy="26" r="2.5" fill="#C0B8B0"/>

    <!-- Off slash -->
    <line x1="5" y1="26" x2="27" y2="6" stroke="#D97A6A" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
</template>
```

### PixelVolumeOn.vue - 音量开
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Speaker body -->
    <polygon points="8,10 14,10 20,5 20,27 14,22 8,22" fill="#E8956A" stroke="#D67A4E" stroke-width="1.5" stroke-linejoin="round"/>

    <!-- Sound waves -->
    <path d="M23 10 C26 12 26 20 23 22" fill="none" stroke="#E8956A" stroke-width="2" stroke-linecap="round"/>
    <path d="M26 7 C31 11 31 21 26 25" fill="none" stroke="#E8956A" stroke-width="2" stroke-linecap="round"/>
  </svg>
</template>
```

### PixelVolumeOff.vue - 音量关
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Speaker body -->
    <polygon points="8,10 14,10 20,5 20,27 14,22 8,22" fill="#C0B8B0" stroke="#A09890" stroke-width="1.5" stroke-linejoin="round"/>

    <!-- Off slash -->
    <line x1="23" y1="9" x2="29" y2="23" stroke="#D97A6A" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
</template>
```

### PixelEye.vue - 护眼/眼睛
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Eye outline -->
    <path d="M4 16 C4 16 10 6 16 6 C22 6 28 16 28 16 C28 16 22 26 16 26 C10 26 4 16 4 16 Z"
          fill="#F0E8F8" stroke="#C8B8E8" stroke-width="2"/>

    <!-- Iris -->
    <circle cx="16" cy="16" r="5" fill="#87CEEB" stroke="#6BB6D6" stroke-width="1"/>

    <!-- Pupil -->
    <circle cx="16" cy="16" r="2.5" fill="#5A5A5A"/>

    <!-- Highlight -->
    <circle cx="14" cy="14" r="1.5" fill="#FFFFFF"/>
  </svg>
</template>
```

### PixelWater.vue - 喝水/水滴
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Water cup body -->
    <rect x="10" y="10" width="12" height="16" rx="1" fill="#E0F0F8" stroke="#87CEEB" stroke-width="2"/>

    <!-- Water level -->
    <rect x="10" y="18" width="12" height="8" rx="1" fill="#87CEEB"/>

    <!-- Cup rim -->
    <rect x="8" y="8" width="16" height="3" rx="1" fill="#C0D8E8" stroke="#87CEEB" stroke-width="1"/>

    <!-- Straw -->
    <line x1="18" y1="4" x2="16" y2="14" stroke="#E8956A" stroke-width="2" stroke-linecap="round"/>

    <!-- Bubbles -->
    <circle cx="14" cy="22" r="1" fill="#FFFFFF" opacity="0.6"/>
    <circle cx="18" cy="24" r="1.2" fill="#FFFFFF" opacity="0.6"/>
  </svg>
</template>
```

### PixelActivity.vue - 运动/活动
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Activity line graph -->
    <polyline points="4 20 8 20 12 12 16 24 20 8 24 16 28 16" fill="none" stroke="#E8956A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Heart at the end -->
    <rect x="25" y="12" width="2" height="2" fill="#E898A8"/>
    <rect x="27" y="12" width="2" height="2" fill="#E898A8"/>
    <rect x="25" y="14" width="4" height="2" fill="#E898A8"/>
    <rect x="26" y="16" width="2" height="2" fill="#E898A8"/>
  </svg>
</template>
```

---

## Stats/Habits (3 icons)

### PixelFlame.vue - 火焰/连续打卡
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Outer flame -->
    <path d="M16 4 C10 10 6 18 8 24 C10 28 22 28 24 24 C26 18 22 10 16 4 Z"
          fill="#F29E6D" stroke="#E88B5A" stroke-width="1.5"/>

    <!-- Inner flame -->
    <path d="M16 10 C12 14 10 20 12 24 C14 26 18 26 20 24 C22 20 20 14 16 10 Z"
          fill="#FFD93D" stroke="#E8B84D" stroke-width="1"/>

    <!-- Core flame -->
    <path d="M16 16 C14 18 13 21 14 23 C15 24 17 24 18 23 C19 21 18 18 16 16 Z"
          fill="#FFFFFF" opacity="0.6"/>
  </svg>
</template>
```

### PixelTrophy.vue - 奖杯
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Trophy cup body -->
    <path d="M8 6 L8 14 C8 20 12 24 16 24 C20 24 24 20 24 14 L24 6 Z"
          fill="#FFD93D" stroke="#E8B84D" stroke-width="2"/>

    <!-- Left handle -->
    <path d="M8 9 L4 9 L4 14 C4 17 6 19 8 19" fill="none" stroke="#E8B84D" stroke-width="2"/>

    <!-- Right handle -->
    <path d="M24 9 L28 9 L28 14 C28 17 26 19 24 19" fill="none" stroke="#E8B84D" stroke-width="2"/>

    <!-- Stem -->
    <rect x="14" y="24" width="4" height="4" fill="#E8B84D"/>

    <!-- Base -->
    <rect x="10" y="28" width="12" height="3" rx="1" fill="#E8B84D"/>

    <!-- Star on cup -->
    <rect x="14" y="12" width="4" height="3" fill="#E8956A"/>
    <rect x="15" y="11" width="2" height="1" fill="#E8956A"/>
    <rect x="15" y="15" width="2" height="1" fill="#E8956A"/>
  </svg>
</template>
```

### PixelMedal.vue - 勋章
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Ribbon top -->
    <polygon points="8,4 14,4 16,10 18,4 24,4 22,12 10,12" fill="#E8956A" stroke="#D67A4E" stroke-width="1" stroke-linejoin="miter"/>

    <!-- Medal circle -->
    <circle cx="16" cy="20" r="9" fill="#FFD93D" stroke="#E8B84D" stroke-width="2"/>

    <!-- Inner ring -->
    <circle cx="16" cy="20" r="6" fill="none" stroke="#E8B84D" stroke-width="1"/>

    <!-- Star in center -->
    <rect x="14" y="16" width="4" height="4" fill="#E8956A"/>
    <rect x="13" y="17" width="1" height="2" fill="#E8956A"/>
    <rect x="18" y="17" width="1" height="2" fill="#E8956A"/>
    <rect x="15" y="15" width="2" height="1" fill="#E8956A"/>
    <rect x="15" y="20" width="2" height="1" fill="#E8956A"/>
  </svg>
</template>
```

---

## Misc (4 icons)

### PixelCoffee.vue - 咖啡/休息
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Saucer -->
    <rect x="6" y="24" width="16" height="3" rx="1" fill="#C0B0A0"/>

    <!-- Cup body -->
    <rect x="7" y="12" width="14" height="12" rx="2" fill="#F0E8F8" stroke="#C8B8E8" stroke-width="2"/>

    <!-- Coffee inside -->
    <rect x="9" y="14" width="10" height="3" fill="#8B6914"/>

    <!-- Cup handle -->
    <path d="M21 14 L24 14 C26 14 26 18 26 20 C26 22 24 22 21 22" fill="none" stroke="#C8B8E8" stroke-width="2" stroke-linecap="round"/>

    <!-- Steam -->
    <path d="M11 6 C11 4 13 4 13 2" fill="none" stroke="#C0B8B0" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M16 7 C16 5 18 5 18 3" fill="none" stroke="#C0B8B0" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</template>
```

### PixelMusic.vue - 音乐
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Music note body -->
    <path d="M22 6 L22 20 C22 20 20 22 18 22 C16 22 14 20 14 18 C14 16 16 14 18 14 C20 14 20 14 20 14 L20 10 L12 12 L12 24 C12 24 10 26 8 26 C6 26 4 24 4 22 C4 20 6 18 8 18 C10 18 10 18 10 18 L10 8 Z"
          fill="#E8956A" stroke="#D67A4E" stroke-width="1.5" stroke-linejoin="round"/>

    <!-- Note head accents -->
    <circle cx="8" cy="23" r="1" fill="#F0B08A"/>
    <circle cx="18" cy="19" r="1" fill="#F0B08A"/>
  </svg>
</template>
```

### PixelZzz.vue - 睡眠
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Z letters -->
    <polyline points="6 10 14 10 6 18 14 18" fill="none" stroke="#C8B8E8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

    <polyline points="14 6 20 6 14 12 20 12" fill="none" stroke="#B8A8D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

    <polyline points="20 3 24 3 20 7 24 7" fill="none" stroke="#A090C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Small moon -->
    <path d="M26 20 A5 5 0 1 0 26 30 A4 4 0 1 1 26 20 Z" fill="#C8B8E8" stroke="#A090C0" stroke-width="1"/>
  </svg>
</template>
```

### PixelTarget.vue - 目标/靶心
```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <!-- Outer ring -->
    <circle cx="16" cy="16" r="11" fill="none" stroke="#E8956A" stroke-width="2"/>

    <!-- Middle ring -->
    <circle cx="16" cy="16" r="7" fill="none" stroke="#E8956A" stroke-width="2"/>

    <!-- Inner circle -->
    <circle cx="16" cy="16" r="3" fill="#E8956A"/>

    <!-- Crosshair lines -->
    <line x1="16" y1="2" x2="16" y2="7" stroke="#E8956A" stroke-width="2" stroke-linecap="round"/>
    <line x1="16" y1="25" x2="16" y2="30" stroke="#E8956A" stroke-width="2" stroke-linecap="round"/>
    <line x1="2" y1="16" x2="7" y2="16" stroke="#E8956A" stroke-width="2" stroke-linecap="round"/>
    <line x1="25" y1="16" x2="30" y2="16" stroke="#E8956A" stroke-width="2" stroke-linecap="round"/>

    <!-- Center dot -->
    <circle cx="16" cy="16" r="1" fill="#FFFFFF"/>
  </svg>
</template>
```

---

## Summary

Total: **38 pixel icons**

| Category | Count | Icons |
|----------|-------|-------|
| Bottom Nav | 5 | Home, Habit, Memo, Stats, Settings |
| Actions | 7 | Close, Check, Plus, Download, Trash, RotateCcw, Pencil |
| Navigation | 2 | ChevronLeft, ChevronRight |
| Status | 2 | Star, StarOff |
| App Sections | 8 | Calendar, Clock, BookOpen, Sprout, Square, StickyNote, BarChart, (Habit→Check) |
| Health | 7 | Sun, Moon, Bell, BellOff, VolumeOn, VolumeOff, Eye, Water, Activity |
| Stats/Habits | 3 | Flame, Trophy, Medal |
| Misc | 4 | Coffee, Music, Zzz, Target |

All icons: 32×32 viewBox, `shape-rendering="crispEdges"`, consistent 4-color palette (warm yellow #FFD93D, peach #E8956A, sage green #7BC67E, lavender #C8B8E8).
