/**
 * User Data Types
 * Core user and settings interfaces
 */

import type { Pet } from './pet'
import type { PomodoroData, TimerMode } from './pomodoro'
import type { Habit } from './habit'
import type { Memo } from './memo'
import type { Outfit } from './outfit'
import type { HealthStats } from './health'
import type { Achievement } from './achievement'
import type { WindowSettings } from './window'

export interface UserData {
  userId: string
  username: string
  createdAt: string
  lastActiveAt: string

  // Pet system
  pets: Pet[]
  currentPetId: string

  // Economy
  coins: number
  totalEarned: number

  // Pomodoro data
  pomodoro: PomodoroData

  // Habits
  habits: Habit[]

  // Memos
  memos: Memo[]

  // Outfits
  outfits: Outfit[]

  // Health stats
  healthStats: HealthStats

  // Achievements
  achievements: Achievement[]

  // Window settings
  windowSettings: WindowSettings
}

export interface UserSettings {
  // Pomodoro settings
  workDuration: number        // minutes, default 25
  breakDuration: number     // minutes, default 5
  longBreakDuration: number  // minutes, default 15
  defaultMode: TimerMode    // 'countdown' | 'countup'
  autoStartBreak: boolean
  autoStartWork: boolean
  sessionsUntilLongBreak: number

  // Sound settings
  soundEnabled: boolean
  soundVolume: number

  // Window settings
  defaultOpacity: number
  defaultAlwaysOnTop: boolean
  closeAction?: 'trayWithTimer' | 'trayOnly' | 'exit' // deprecated
  autoStart: boolean

  // Health settings
  waterEnabled: boolean
  waterInterval: number
  exerciseEnabled: boolean
  exerciseInterval: number
  eyeRestEnabled: boolean
  eyeRestMinutes: number
  sleepEnabled: boolean
  sleepAfterHour: number
  reminderStyle: 'dialogue' | 'toast' | 'silent'

  // Time period boundaries for ambient background (hour values 0-23)
  morningEnd: number       // default 11 — morning ends, afternoon starts
  afternoonEnd: number     // default 17 — afternoon ends, evening starts
  eveningEnd: number       // default 21 — evening ends, night starts
}