export type AnimationName = 'idle' | 'walk' | 'roll' | 'beg' | 'sleep' | 'shake' | 'drink' | 'bark'

export interface AnimationConfig {
  name: AnimationName
  frameCount: number
  fps: number
}

export interface SpriteSheetConfig {
  imagePath: string
  cellWidth: number
  cellHeight: number
  columns: number
  animations: AnimationConfig[]
}

// Legacy pixel art types (cat until cat.png is ready)
export type PixelGrid = number[][]

export interface SpriteFrame {
  grid: PixelGrid
  width: number
  height: number
}

export interface LegacyPetSpriteData {
  petType: string
  palette: string[]
  frames: Record<string, SpriteFrame>
}

export type PetSpriteData =
  | { type: 'sheet'; config: SpriteSheetConfig }
  | { type: 'legacy'; data: LegacyPetSpriteData }
  | { type: 'strip'; config: StripSpriteConfig }

// Per-animation image strip (one image per animation, frames laid out horizontally)
export interface StripAnimationEntry {
  name: AnimationName
  imagePath: string
  frameCount: number
  fps: number
}

export interface StripSpriteConfig {
  animations: StripAnimationEntry[]
}
