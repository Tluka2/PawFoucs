# Cat Sprite Strip & Dog Sprite Sheet Fix 集成测试报告

**日期**: 2026-05-08
**范围**: 猫精灵图 strip 类型渲染、动画帧数、狗动画隔离、狗精灵图帧错位修复
**分析轮数**: 6 轮

---

## 1. 测试范围

| 文件 | 角色 | 变更类型 |
|------|------|---------|
| `src/assets/pets/sprites/types.ts` | 类型定义 | 新增 StripAnimationEntry、StripSpriteConfig |
| `src/assets/pets/sprites/index.ts` | 精灵注册 | 猫从 legacy → strip，注册 8 动画 |
| `src/components/Pet/PetSprite.vue` | 渲染器 | 新增 drawStripFrame + computeFrameBounds + computeSheetBounds |
| `src/composables/usePetAnimation.ts` | 动画控制 | 新增 CAT_ANIM，petType 参数选择 |
| `src/App.vue` | 调用方 | 传入 petType.value |
| `src/components/HabitPanel.vue` | 调用方 | 传入 petType.value |

---

## 2. Round 1 — Strip 渲染数据流

### 数据流路径

```
index.ts getSpriteData('cat')  →  CAT_SPRITE { type: 'strip' }
       ↓
PetSprite.vue spriteData watch  →  strip 分支，为每个动画创建 Image + onload
       ↓
onload 触发  →  computeFrameBounds(img, frameCount) → stripBounds Map
       ↓
drawFrame() watch  →  drawStripFrame(ctx, config, cw, ch)
       ↓
drawStripFrame  →  查找 anim、img、bounds → drawImage 居中绘制
```

### 验证结果

| 检查项 | 结果 |
|--------|------|
| 8 个动画名全部注册 | **通过** — idle/walk/roll/beg/sleep/shake/drink/bark |
| imagePath 使用 `new URL(..., import.meta.url).href` | **通过** — Vite 正确解析资源路径 |
| 构建产物包含 8 张猫图片 | **通过** — 见 Vite 输出 |
| 图片加载前不崩溃 | **通过** — `img.naturalWidth` 为 0 时 return |
| 共享 Map 累积正确（无竞态） | **通过** — JS 单线程保证顺序 |

---

## 3. Round 2 — 猫动画状态切换

### 猫动画映射

| 系统动画名 | 猫精灵图 | 帧数 (CAT_ANIM) | 图片帧数 | 匹配 |
|-----------|---------|----------------|---------|------|
| idle | idle.png | 4 | 4 | **通过** |
| walk | walk.png | 4 | 4 | **通过** |
| roll | roll.png | 4 | 4 | **通过** |
| beg | Stretch.png | 2 | 2 | **通过** |
| sleep | sleep.png | 2 | 2 | **通过** |
| shake | lick.png | 2 | 2 | **通过** |
| drink | drink.png | 2 | 2 | **通过** |
| bark | memo.png | 2 | 2 | **通过** |

### 状态转换路径

| 触发方式 | 切换到 | 猫表现 | 结果 |
|---------|--------|--------|------|
| 随机动作 (20-50s) | shake(舔毛) 或 roll(打滚) | lick/roll 动画 | **通过** |
| 点击宠物 | beg(伸懒腰) 或 bark(喵叫) | Stretch/memo 动画 | **通过** |
| 22:00-06:00 | sleep | sleep 动画 + Zzz 标记 | **通过** |
| 退出 sleep | idle | idle 动画 | **通过** |
| 动画完成 | 回到 idle | 恢复待机 | **通过** |

---

## 4. Round 3 — 帧居中与 bounding box

### computeFrameBounds 逻辑

1. 图片宽度 / frameCount = 等分宽度
2. 每个等分区域内扫描非透明像素，找 tight bounding box
3. refW/refH 取所有帧的最大宽高（统一缩放基准）
4. drawStripFrame 使用 refW/refH 计算 scale，dx/dy 偏移居中

### 验证结果

| 检查项 | 结果 |
|--------|------|
| 每帧独立检测 bounding box | **通过** |
| refW/refH 取最大值保证统一缩放 | **通过** |
| dx/dy 偏移保证帧间不左右漂移 | **通过** |
| Math.round 防止亚像素模糊 | **通过** |
| 空帧保护 (sw<=0 return) | **通过** |
| imageSmoothingEnabled = false | **通过** — 保持像素锐利 |

---

## 5. Round 4 — 狗动画隔离验证

### 代码路径隔离检查

| 文件 | 狗路径 | 是否被修改 |
|------|--------|-----------|
| `index.ts` DOG_SPRITE | type: 'sheet', cellWidth:72, cellHeight:72, 6 列, 8 动画 | **未修改** |
| `PetSprite.vue` drawSheetFrame | 现使用 computeSheetBounds 精确裁剪 | **已优化** |
| `PetSprite.vue` loadImage | 单图加载函数 | **已优化** — 加载后计算 bounds |
| `PetSprite.vue` drawLegacyFrame | 像素画渲染 | **未修改** |
| `usePetAnimation.ts` DOG_ANIM | frameCount/fps/duration 数值 | **未修改** — 与原始 ANIM_CONFIG 完全一致 |

### 运行时隔离

| 检查项 | 结果 |
|--------|------|
| 狗走 sheet 分支，不进入 strip | **通过** — `spriteData.type === 'sheet'` |
| stripImages/stripBounds 对狗无影响 | **通过** — sheet 分支 clear 后不再变化 |
| DOG_ANIM 帧数与原版一致 | **通过** — 逐字段对比确认 |

---

## 6. Round 5 — 狗精灵图帧错位诊断

### 问题根源

狗精灵图 `dog-removebg-preview.png` 为 432×578px，配置为 72×72 网格。

**旧切片公式**（已废弃）:
```
sx = frameIndex * 72 + 1  // 假设每帧左侧有 1px 间距
sy = animIndex * 72 + 1   // 假设每行顶部有 1px 间距
sw = 70                    // 减去左右间距各 1px
sh = 70                    // 减去上下间距各 1px
```

**诊断发现**:
- 图片高度 578px ≠ 预期 576px (8行 × 72)，多出 2px
- Row 4 (sleep): 内容 y=0-71，**无间距**，+1 偏移裁掉了第一行像素
- Row 6 (drink): 内容 y=0-71，**无间距**，同上
- Row 7 (bark): 内容 y=0-71，**无间距**，同上
- Row 1 walk 第72列有 1px 内容泄漏到下一帧区域
- +1/-2 公式对无间距行造成内容裁切 → 身体拼接重叠、画面崩坏

### 验证结果

| 检查项 | 结果 |
|--------|------|
| 旧公式裁切 sleep/drink/bark 行顶部像素 | **确认** — 这些行内容从 y=0 开始 |
| 旧公式跨帧内容泄漏 (walk→下一帧) | **确认** — col 72 边界有内容 |
| 图片高度不匹配 (578 vs 576) | **确认** — Row 7 扫描范围正确（504-575），多余 2px 被忽略 |

---

## 7. Round 6 — computeSheetBounds 修复

### 修复方案

对狗精灵图应用与猫相同的 **bounding box 精确裁剪** 方案：

1. 图片加载后，对每个 cell (动画行 × 帧列) 扫描非透明像素
2. 找到每帧的 tight bounding box (精确内容边界)
3. 每行动画取最大 refW/refH 作为统一缩放基准
4. 绘制时使用 bounds 坐标 + 居中偏移，确保帧间不漂移

### 新数据流

```
loadImage() onload
  → computeSheetBounds(img, config)
  → 遍历 8 动画 × N 帧
  → 每帧扫描 cell 区域非透明像素
  → 生成 Map<animName, StripFrameBounds>
  → 存入 sheetBounds ref
       ↓
drawSheetFrame(ctx, config, cw, ch)
  → sheetBounds.get(animationState)
  → 取 frames[frameIndex] 的精确 sx/sy/sw/sh
  → 计算统一 scale + 居中 dx/dy
  → drawImage 精确裁剪绘制
```

### 修复对比

| 方面 | 旧方案 (固定偏移) | 新方案 (bounding box) |
|------|-----------------|---------------------|
| 裁剪方式 | `cellX+1, cellY+1, 70, 70` | 扫描实际内容边界 |
| 对无间距行 | 裁掉顶部/左侧内容 | 正确保留全部内容 |
| 对有间距行 | 粗略跳过 1px | 精确跳过透明边距 |
| 帧间泄漏 | walk col 72 泄漏 | 只绘制 bounding box 内内容 |
| 帧居中 | 无 (从 0,0 绘制) | 统一 refW/refH + dx/dy 居中 |
| 亚像素 | 无处理 | Math.round 防止模糊 |

### 验证结果

| 检查项 | 结果 |
|--------|------|
| computeSheetBounds 正确扫描所有 cell | **通过** — 遍历 animations × frameCount |
| y 越界保护 (578px 高度) | **通过** — `y < img.naturalHeight` 限制 |
| 空帧保护 | **通过** — sw<=0 return |
| drawSheetFrame 使用 bounds 坐标 | **通过** — 不再使用固定 +1/-2 公式 |
| 居中绘制防止帧间漂移 | **通过** — 与 drawStripFrame 逻辑一致 |
| sheetBounds 加入 watch 依赖 | **通过** — bounds 更新触发重绘 |
| sheetBounds 在切换宠物类型时清理 | **通过** — strip/else 分支均 clear |
| TypeScript 编译通过 | **通过** — vue-tsc --noEmit 无错误 |
| 狗动画配置 (DOG_ANIM) 未修改 | **通过** — 帧数/FPS/duration 与原版一致 |
| 猫动画不受影响 | **通过** — drawStripFrame 代码未改动 |

---

## 8. 结论

| 级别 | 数量 |
|------|------|
| P0 (Critical) | 0 |
| P1 (Medium) | 0 |
| P2 (Minor) | 0 |
| P3 (Info) | 1 — legacy 相关死代码残留 (LEGACY_FRAME_MAP) |

**核心修复**: 狗精灵图帧错位问题通过 `computeSheetBounds` bounding box 精确裁剪方案修复，替代了原来的固定 +1/-2 偏移公式。猫和狗现在都使用相同的 bounding box + 居中渲染技术，但各自走独立的代码分支（sheet vs strip），互不影响。
