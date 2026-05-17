/**
 * Achievement Types
 * Achievement and reward interfaces
 */

export interface Achievement {
  id: string                // predefined ID
  userId: string
  unlockedAt: string | null  // ISO 8601, null if not unlocked
  isUnlocked: boolean
}

export type AchievementId =
  | 'first_pomodoro'
  | 'week_streak'
  | 'focus_master'
  | 'hundred_pomodoro'
  | 'marathon'
  | 'diamond_will'
  | 'habit_formation'
  | 'habit_master'
  | 'perfect_attendance'
  | 'water_master'
  | 'exercise_master'
  | 'early_bird'
  | 'first_meeting'
  | 'new_friend'
  | 'legendary_partner'
  | 'fashionista'