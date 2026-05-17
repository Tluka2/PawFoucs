/**
 * Health Reminder Types
 * Health tracking and reminder interfaces
 */

export type ReminderType = 'water' | 'exercise' | 'eyeRest' | 'sleep'
export type UserResponse = 'done' | 'later' | 'dismiss'

export interface HealthStats {
  waterCount: number
  exerciseCount: number
  eyeRestCount: number
  sleepReminderCount: number
}

export interface HealthRecord {
  id: string
  userId: string
  date: string               // YYYY-MM-DD
  waterCount: number
  exerciseCount: number
  eyeRestCount: number
  sleepReminderResponded: boolean
}

