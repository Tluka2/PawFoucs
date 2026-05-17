import type { PetType } from '@/types/pet'
import type { PetSpriteData } from './types'

const DOG_SPRITE: PetSpriteData = {
  type: 'strip',
  config: {
    animations: [
      { name: 'idle',  imagePath: new URL('./dog/idle.png', import.meta.url).href,  frameCount: 2, fps: 1.25 },
      { name: 'walk',  imagePath: new URL('./dog/walk.png', import.meta.url).href,  frameCount: 4, fps: 1.5 },
      { name: 'roll',  imagePath: new URL('./dog/roll.png', import.meta.url).href,  frameCount: 6, fps: 2 },
      { name: 'beg',   imagePath: new URL('./dog/beg.png', import.meta.url).href,   frameCount: 2, fps: 1 },
      { name: 'sleep', imagePath: new URL('./dog/sleep.png', import.meta.url).href, frameCount: 2, fps: 0.4 },
      { name: 'shake', imagePath: new URL('./dog/shake.png', import.meta.url).href, frameCount: 3, fps: 2 },
      { name: 'drink', imagePath: new URL('./dog/drink.png', import.meta.url).href, frameCount: 2, fps: 1 },
      { name: 'bark',  imagePath: new URL('./dog/bark.png', import.meta.url).href,  frameCount: 2, fps: 1.5 },
    ],
  },
}

const CAT_SPRITE: PetSpriteData = {
  type: 'strip',
  config: {
    animations: [
      { name: 'idle',   imagePath: new URL('./catnew/idle2.png', import.meta.url).href,   frameCount: 2, fps: 1.25 },
      { name: 'walk',   imagePath: new URL('./catnew/walking2.png', import.meta.url).href, frameCount: 4, fps: 1.5 },
      { name: 'roll',   imagePath: new URL('./catnew/roll.png', import.meta.url).href,    frameCount: 4, fps: 2 },
      { name: 'beg',    imagePath: new URL('./catnew/Stretch.png', import.meta.url).href, frameCount: 2, fps: 1 },
      { name: 'sleep',  imagePath: new URL('./catnew/sleep.png', import.meta.url).href,   frameCount: 2, fps: 0.4 },
      { name: 'shake',  imagePath: new URL('./catnew/lick3.png', import.meta.url).href,   frameCount: 2, fps: 2 },
      { name: 'drink',  imagePath: new URL('./catnew/drink3.png', import.meta.url).href,   frameCount: 2, fps: 1 },
      { name: 'bark',   imagePath: new URL('./catnew/memo.png', import.meta.url).href,    frameCount: 2, fps: 1.5 },
    ],
  },
}

const spriteMap: Record<PetType, PetSpriteData> = {
  cat: CAT_SPRITE,
  dog: DOG_SPRITE,
}

export function getSpriteData(petType: PetType): PetSpriteData {
  return spriteMap[petType]
}
