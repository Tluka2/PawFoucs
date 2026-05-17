<template>
  <div class="pet-pixel-container" :class="[size, `anim-${animationState}`, { 'flip-h': petType === 'cat' }]">
    <canvas
      ref="canvasRef"
      :width="canvasSize"
      :height="canvasSize"
      class="pet-canvas"
    />
    <span v-if="animationState === 'sleep'" class="sleep-zzz">Z</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PetType } from '@/types/pet'
import type { AnimationName, SpriteSheetConfig, LegacyPetSpriteData, StripSpriteConfig } from '@/assets/pets/sprites/types'
import { getSpriteData } from '@/assets/pets/sprites'

const props = withDefaults(defineProps<{
  petType: PetType
  size?: 'sm' | 'md'
  animationState?: AnimationName
  frameIndex?: number
}>(), {
  size: 'md',
  animationState: 'idle',
  frameIndex: 0,
})

const SIZES = { sm: 96, md: 128 } as const

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasSize = computed(() => SIZES[props.size])
const spriteData = computed(() => getSpriteData(props.petType))
const loadedImage = ref<HTMLImageElement | null>(null)

// --- Strip sprite state (cat only) ---
const stripImages = ref<Map<string, HTMLImageElement>>(new Map())
interface StripFrameBounds { refW: number; refH: number; frames: { sx: number; sy: number; sw: number; sh: number }[] }
const stripBounds = ref<Map<string, StripFrameBounds>>(new Map())

// --- Sheet sprite state (dog) ---
const sheetBounds = ref<Map<string, StripFrameBounds>>(new Map())

// Map new animation names → old frame keys for legacy pixel art cat
const LEGACY_FRAME_MAP: Record<AnimationName, string> = {
  idle: 'idle',
  walk: 'idle',
  roll: 'special',
  beg: 'sad',
  sleep: 'sleep',
  shake: 'blink',
  drink: 'idle',
  bark: 'happy',
}

function loadImage(src: string) {
  const img = new Image()
  img.src = src
  img.onload = () => {
    loadedImage.value = img
    if (spriteData.value.type === 'sheet') {
      sheetBounds.value = computeSheetBounds(img, spriteData.value.config)
    }
  }
}

function computeFrameBounds(img: HTMLImageElement, frameCount: number): StripFrameBounds {
  const off = document.createElement('canvas')
  const w = img.naturalWidth
  const h = img.naturalHeight
  off.width = w
  off.height = h
  const c = off.getContext('2d')!
  c.drawImage(img, 0, 0)
  const d = c.getImageData(0, 0, w, h).data

  // Scan columns for content
  const colContent = new Uint8Array(w)
  let contentStart = -1, contentEnd = -1
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (d[(y * w + x) * 4 + 3] > 20) { colContent[x] = 1; break }
    }
    if (colContent[x]) {
      if (contentStart === -1) contentStart = x
      contentEnd = x
    }
  }

  // Detect content regions (merge gaps < 2px as intra-frame)
  const regions: { start: number; end: number }[] = []
  let regStart = -1, lastContent = -1
  for (let x = 0; x <= w; x++) {
    const hasContent = x < w && colContent[x]
    if (hasContent) {
      if (regStart === -1) regStart = x
      lastContent = x
    } else if (regStart !== -1 && x - lastContent >= 2) {
      regions.push({ start: regStart, end: lastContent })
      regStart = -1
    }
  }
  if (regStart !== -1) regions.push({ start: regStart, end: lastContent })

  // Build frame x-ranges: use detected regions if count matches, else even division of content span
  let ranges: { sx: number; ex: number }[]
  if (regions.length === frameCount) {
    ranges = regions.map(r => ({ sx: r.start, ex: r.end + 1 }))
  } else if (contentStart !== -1) {
    const span = contentEnd - contentStart + 1
    const cellW = span / frameCount
    ranges = []
    for (let f = 0; f < frameCount; f++) {
      ranges.push({
        sx: Math.round(contentStart + f * cellW),
        ex: Math.round(contentStart + (f + 1) * cellW),
      })
    }
  } else {
    const cellW = w / frameCount
    ranges = []
    for (let f = 0; f < frameCount; f++) {
      ranges.push({ sx: Math.round(f * cellW), ex: Math.round((f + 1) * cellW) })
    }
  }

  // Per-frame bounding box within each range
  const frames: { sx: number; sy: number; sw: number; sh: number }[] = []
  for (const range of ranges) {
    let minX = range.ex, minY = h, maxX = range.sx, maxY = 0
    for (let y = 0; y < h; y++) {
      for (let x = range.sx; x < range.ex; x++) {
        if (d[(y * w + x) * 4 + 3] > 20) {
          if (x < minX) minX = x; if (x > maxX) maxX = x
          if (y < minY) minY = y; if (y > maxY) maxY = y
        }
      }
    }
    if (maxX < minX || maxY < minY) frames.push({ sx: range.sx, sy: 0, sw: 1, sh: 1 })
    else frames.push({ sx: minX, sy: minY, sw: maxX - minX + 1, sh: maxY - minY + 1 })
  }

  const refW = Math.max(...frames.map(f => f.sw))
  const refH = Math.max(...frames.map(f => f.sh))

  return { refW, refH, frames }
}

function computeSheetBounds(img: HTMLImageElement, config: SpriteSheetConfig): Map<string, StripFrameBounds> {
  const off = document.createElement('canvas')
  off.width = img.naturalWidth
  off.height = img.naturalHeight
  const c = off.getContext('2d')!
  c.drawImage(img, 0, 0)
  const d = c.getImageData(0, 0, off.width, off.height).data

  const result = new Map<string, StripFrameBounds>()

  for (let ai = 0; ai < config.animations.length; ai++) {
    const anim = config.animations[ai]
    const frames: { sx: number; sy: number; sw: number; sh: number }[] = []

    for (let f = 0; f < anim.frameCount; f++) {
      const cellX = f * config.cellWidth
      const cellY = ai * config.cellHeight
      let minX = cellX + config.cellWidth, minY = cellY + config.cellHeight
      let maxX = cellX, maxY = cellY

      for (let y = cellY; y < cellY + config.cellHeight && y < img.naturalHeight; y++) {
        for (let x = cellX; x < cellX + config.cellWidth; x++) {
          if (d[(y * img.naturalWidth + x) * 4 + 3] > 20) {
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
          }
        }
      }

      if (maxX < minX || maxY < minY) {
        frames.push({ sx: cellX, sy: cellY, sw: 1, sh: 1 })
      } else {
        frames.push({ sx: minX, sy: minY, sw: maxX - minX + 1, sh: maxY - minY + 1 })
      }
    }

    const refW = Math.max(...frames.map(fr => fr.sw))
    const refH = Math.max(...frames.map(fr => fr.sh))
    result.set(anim.name, { refW, refH, frames })
  }

  return result
}

watch(spriteData, (data) => {
  if (data.type === 'sheet') {
    loadImage(data.config.imagePath)
    stripImages.value.clear()
    stripBounds.value.clear()
  } else if (data.type === 'strip') {
    loadedImage.value = null
    sheetBounds.value.clear()
    const map = new Map<string, HTMLImageElement>()
    const boundsMap = new Map<string, StripFrameBounds>()
    for (const anim of data.config.animations) {
      const img = new Image()
      img.src = anim.imagePath
      img.onload = () => {
        map.set(anim.name, img)
        boundsMap.set(anim.name, computeFrameBounds(img, anim.frameCount))
        stripImages.value = new Map(map)
        stripBounds.value = new Map(boundsMap)
      }
      map.set(anim.name, img)
    }
    stripImages.value = map
    stripBounds.value = boundsMap
  } else {
    loadedImage.value = null
    stripImages.value.clear()
    stripBounds.value.clear()
    sheetBounds.value.clear()
  }
}, { immediate: true })

function drawFrame() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cw = canvas.width
  const ch = canvas.height

  const data = spriteData.value
  if (data.type === 'sheet') {
    drawSheetFrame(ctx, data.config, cw, ch)
  } else if (data.type === 'strip') {
    drawStripFrame(ctx, data.config, cw, ch)
  } else {
    drawLegacyFrame(ctx, data.data, cw, ch)
  }
}

function drawStripFrame(ctx: CanvasRenderingContext2D, config: StripSpriteConfig, cw: number, ch: number) {
  const anim = config.animations.find(a => a.name === props.animationState)
  if (!anim) return
  const img = stripImages.value.get(anim.name)
  if (!img || !img.naturalWidth) return
  const bd = stripBounds.value.get(anim.name)
  if (!bd) return
  const f = bd.frames[props.frameIndex]
  if (!f || f.sw <= 0 || f.sh <= 0) return

  const scale = Math.min(cw / bd.refW, ch / bd.refH)
  const dx = (cw - f.sw * scale) / 2
  const dy = (ch - f.sh * scale) / 2

  ctx.clearRect(0, 0, cw, ch)
  ctx.imageSmoothingEnabled = false

  // walk sprite faces opposite direction — double-flip to match others
  if (props.petType === 'cat' && anim.name === 'walk') {
    ctx.save()
    ctx.translate(cw, 0)
    ctx.scale(-1, 1)
  }

  ctx.drawImage(img,
    f.sx, f.sy, f.sw, f.sh,
    Math.round(dx), Math.round(dy), Math.round(f.sw * scale), Math.round(f.sh * scale))

  if (props.petType === 'cat' && anim.name === 'walk') {
    ctx.restore()
  }
}

function drawSheetFrame(ctx: CanvasRenderingContext2D, _config: SpriteSheetConfig, cw: number, ch: number) {
  if (!loadedImage.value) return

  const bd = sheetBounds.value.get(props.animationState)
  if (!bd) return

  const f = bd.frames[props.frameIndex]
  if (!f || f.sw <= 0 || f.sh <= 0) return

  const scale = Math.min(cw / bd.refW, ch / bd.refH)
  const dx = (cw - f.sw * scale) / 2
  const dy = (ch - f.sh * scale) / 2

  ctx.clearRect(0, 0, cw, ch)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(loadedImage.value,
    f.sx, f.sy, f.sw, f.sh,
    Math.round(dx), Math.round(dy), Math.round(f.sw * scale), Math.round(f.sh * scale))
}

function drawLegacyFrame(ctx: CanvasRenderingContext2D, data: LegacyPetSpriteData, cw: number, ch: number) {
  const frameKey = LEGACY_FRAME_MAP[props.animationState] || 'idle'
  const frame = data.frames[frameKey] || data.frames.idle
  if (!frame) return

  ctx.clearRect(0, 0, cw, ch)

  const palette = data.palette
  const scale = Math.min(
    Math.floor(cw / frame.width),
    Math.floor(ch / frame.height)
  )
  const offsetX = Math.floor((cw - frame.width * scale) / 2)
  const offsetY = Math.floor((ch - frame.height * scale) / 2)

  ctx.imageSmoothingEnabled = false

  for (let y = 0; y < frame.height; y++) {
    for (let x = 0; x < frame.width; x++) {
      const ci = frame.grid[y][x]
      if (ci === 0) continue
      ctx.fillStyle = palette[ci]
      ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale)
    }
  }
}

watch(
  [() => props.animationState, () => props.frameIndex, () => props.petType, () => props.size, canvasRef, loadedImage, stripImages, stripBounds, sheetBounds],
  () => drawFrame(),
  { immediate: true }
)
</script>

<style scoped>
.pet-pixel-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: transparent;
}
.md { width: clamp(80px, 20vmin, 128px); height: clamp(80px, 20vmin, 128px); }
.sm { width: clamp(60px, 14vmin, 96px); height: clamp(60px, 14vmin, 96px); }

.pet-canvas {
  background: transparent;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
.flip-h { transform: scaleX(-1); }

.anim-idle .pet-canvas { animation: pet-pixel-breathe 2s steps(1, end) infinite; }
.anim-walk .pet-canvas { animation: pet-pixel-breathe 1.5s steps(1, end) infinite; }
.anim-roll .pet-canvas { animation: pet-pixel-special 0.2s steps(1, end) 4; }
.anim-beg .pet-canvas { animation: pet-pixel-sad 3s steps(1, end) infinite; }
.anim-sleep .pet-canvas { animation: pet-pixel-breathe 3s steps(1, end) infinite; filter: brightness(0.8); }
.anim-shake .pet-canvas { animation: pet-pixel-special 0.15s steps(1, end) 5; }
.anim-drink .pet-canvas { animation: pet-pixel-breathe 2.5s steps(1, end) infinite; }
.anim-bark .pet-canvas { animation: pet-pixel-happy 0.4s steps(1, end) 2; }

@keyframes pet-pixel-breathe {
  0%, 49% { transform: translateY(0); }
  50%, 100% { transform: translateY(-4px); }
}
@keyframes pet-pixel-happy {
  0%, 29% { transform: translateY(0) scale(1); }
  30%, 59% { transform: translateY(-10px) scale(1.06); }
  60%, 100% { transform: translateY(-4px) scale(1); }
}
@keyframes pet-pixel-sad {
  0%, 49% { transform: translateY(0) rotate(0deg); }
  50%, 100% { transform: translateY(4px) rotate(-4deg); }
}
@keyframes pet-pixel-special {
  0%, 24% { transform: rotate(0deg); }
  25%, 74% { transform: rotate(-5deg); }
  75%, 100% { transform: rotate(5deg); }
}

.sleep-zzz {
  position: absolute;
  top: clamp(-2px, -0.8vmin, -4px);
  right: clamp(-4px, -1.5vmin, -8px);
  font-family: 'Nunito', sans-serif;
  font-size: clamp(11px, 2.5vmin, 16px);
  font-weight: 800;
  color: var(--c-primary);
  animation: zzz-float 2s ease-in-out infinite;
  pointer-events: none;
}
@keyframes zzz-float {
  0% { opacity: 0; transform: translateY(0) translateX(0); }
  50% { opacity: 1; transform: translateY(-8px) translateX(4px); }
  100% { opacity: 0; transform: translateY(-16px) translateX(8px); }
}
</style>
