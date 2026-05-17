/**
 * Habit Tracking Types
 * Habit and check-in interfaces
 */

export type Frequency = 'daily' | 'weekdays' | 'every_n_days' | 'custom_days'

export type CheckInStatus = 'done' | 'partial'

export interface FrequencyConfig {
  nDays?: number
  customDays?: number[]
}

export interface Habit {
  id: string
  userId: string
  name: string              // 1-30 chars
  note: string             // <= 200 chars
  frequency: Frequency
  frequencyConfig?: FrequencyConfig
  reminderTime?: string    // HH:mm
  checkins: CheckIn[]
  streak: number
  bestStreak: number        // 历史最高连续天数
  createdAt: string        // ISO 8601
}

export interface CheckIn {
  date: string              // YYYY-MM-DD
  content: string
  timestamp: number
  status: CheckInStatus
}

export interface DayStatus {
  date: string
  status: 'checked' | 'missed' | 'future'
}