export type TimerMode = 'countdown' | 'countup';
export type TimerState = 'idle' | 'running' | 'paused' | 'break' | 'completed';
export type BreakType = 'short' | 'long';

export interface PomodoroData {
  totalCompleted: number;
  totalMinutes: number;
  todayCompleted: number;
  streak: number;
  lastCompletedDate: string | null;
  mode: TimerMode;
  duration: number;            // seconds
  breakDuration: number;       // seconds
  breakType: BreakType;        // current break type
  loopTarget: number;          // 0 = unlimited
  loopCompleted: number;
  history: PomodoroRecord[];
}

export interface PomodoroRecord {
  id: string;
  userId: string;
  duration: number;
  completedAt: string;
  date: string;                // YYYY-MM-DD for indexing
  mode: TimerMode;
  round?: number;              // which loop round
}

export interface SavedTimerState {
  mode: TimerMode;
  state: TimerState;
  startedAt: number;           // timestamp
  elapsed: number;             // seconds
  remaining: number;           // seconds
  duration: number;
  hasPaused: boolean;
  loopCompleted: number;
  loopTarget: number;
  currentRound: number;
  savedAt: number;             // timestamp
}
