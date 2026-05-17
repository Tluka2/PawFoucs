/**
 * Pet Data Types
 * Pet interface and related types
 */

export type PetType = 'cat' | 'dog'
export type MoodState = 'happy' | 'normal' | 'sad'

export interface Pet {
  id: string
  name: string                 // 1-10 chars
  type: PetType
  level: number                // >= 1
  exp: number                 // >= 0
  mood: MoodState
  isUnlocked: boolean
  isSelected: boolean
  unlockDate: string          // ISO 8601
  lastInteractAt: string     // ISO 8601
}