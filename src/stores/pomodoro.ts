import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StorageService } from '../services/storage/index.ts';
import { toLocalDateStr } from '../utils/date.ts';
import type { PomodoroData, PomodoroRecord, TimerMode } from '../types/index.ts';
import { useUserStore } from './user.ts';
import { usePetStore } from './pet.ts';
import { useSound } from '../composables/useSound.ts';

const storage = new StorageService();

function defaultPomodoroData(): PomodoroData {
  return {
    totalCompleted: 0,
    totalMinutes: 0,
    todayCompleted: 0,
    streak: 0,
    lastCompletedDate: null,
    mode: 'countdown',
    duration: 1500,
    breakDuration: 300,
    breakType: 'short',
    loopTarget: 0,
    loopCompleted: 0,
    history: [],
  };
}

export const usePomodoroStore = defineStore('pomodoro', () => {
  const data = ref<PomodoroData>(defaultPomodoroData());
  const timerState = ref<'idle' | 'running' | 'paused' | 'break' | 'completed'>('idle');
  const elapsed = ref(0);
  const remaining = ref(0);
  const isLoaded = ref(false);

  const todayCompleted = computed(() => data.value.todayCompleted);
  const totalMinutes = computed(() => data.value.totalMinutes);
  const streak = computed(() => data.value.streak);
  const shouldAutoContinue = computed(() =>
    data.value.loopTarget > 0 && data.value.loopCompleted < data.value.loopTarget
  );
  const averageSessionDuration = computed(() =>
    data.value.totalCompleted > 0 ? Math.round(data.value.totalMinutes / data.value.totalCompleted) : 0
  );
  const weeklyHistory = computed(() => {
    const result: Record<string, PomodoroRecord[]> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000);
      const key = toLocalDateStr(d);
      result[key] = data.value.history.filter((r) => r.date === key);
    }
    return result;
  });
  const todayMinutes = computed(() => {
    const today = toLocalDateStr(new Date());
    const todayRecords = data.value.history.filter((r) => r.date === today);
    return Math.round(todayRecords.reduce((sum, r) => sum + r.duration, 0) / 60);
  });

  async function load(): Promise<void> {
    const records = await storage.getAll('pomodoro_history');
    data.value.history = records as PomodoroRecord[];
    if (!data.value.breakType) data.value.breakType = 'short';
    if (data.value.history.length > 0) {
      data.value.totalCompleted = data.value.history.length;
      data.value.totalMinutes = Math.round(data.value.history.reduce((sum, r) => sum + r.duration, 0) / 60);
      const today = toLocalDateStr(new Date());
      data.value.todayCompleted = data.value.history.filter((r) => r.date === today).length;

      // Reconstruct streak and lastCompletedDate from history
      const sortedDates = [...new Set(data.value.history.map((r) => r.date))].sort().reverse();
      if (sortedDates.length > 0) {
        data.value.lastCompletedDate = sortedDates[0];
        let streak = 0;
        let d = new Date();
        d.setHours(0, 0, 0, 0);
        // Check today first, then go backwards
        const todayKey = toLocalDateStr(d);
        if (sortedDates[0] === todayKey) {
          d = new Date(d.getTime());
        } else {
          d = new Date(d.getTime() - 86400000);
        }
        while (true) {
          const dateKey = toLocalDateStr(d);
          if (sortedDates.includes(dateKey)) {
            streak++;
            d = new Date(d.getTime() - 86400000);
          } else {
            break;
          }
        }
        data.value.streak = streak;
      }
    }
    isLoaded.value = true;
  }

  async function completePomodoro(duration: number, mode: TimerMode, coins: number = 50): Promise<PomodoroRecord> {
    const now = new Date();
    data.value.loopCompleted += 1;
    const record: PomodoroRecord = {
      id: `pom-${Date.now()}`,
      userId: 'current_user',
      duration,
      completedAt: now.toISOString(),
      date: toLocalDateStr(now),
      mode,
      round: data.value.loopCompleted,
    };

    await storage.save('pomodoro_history', record);
    data.value.history.push(record);
    data.value.totalCompleted = data.value.history.length;
    data.value.totalMinutes = Math.round(data.value.history.reduce((sum, r) => sum + r.duration, 0) / 60);
    const today = toLocalDateStr(now);
    data.value.todayCompleted = data.value.history.filter(r => r.date === today).length;

    if (data.value.lastCompletedDate !== today) {
      const yesterday = toLocalDateStr(new Date(now.getTime() - 86400000));
      if (data.value.lastCompletedDate === yesterday) {
        data.value.streak += 1;
      } else {
        data.value.streak = 1;
      }
      data.value.lastCompletedDate = today;
    }

    timerState.value = 'completed';

    const userStore = useUserStore();
    const petStore = usePetStore();
    const sound = useSound();
    userStore.addCoins(coins);
    sound.playCoinSound();
    await userStore.save();
    await petStore.addExp(20);
    await save();

    return record;
  }

  function resetLoopCompleted(): void {
    data.value.loopCompleted = 0;
  }

  async function save(): Promise<void> {
    await storage.save('pomodoro_state', {
      key: 'pomodoro_state',
      streak: data.value.streak,
      lastCompletedDate: data.value.lastCompletedDate,
      loopCompleted: data.value.loopCompleted,
      loopTarget: data.value.loopTarget,
      mode: data.value.mode,
    });
  }

  async function loadState(): Promise<void> {
    const state = await storage.get('pomodoro_state', 'pomodoro_state');
    if (state) {
      data.value.streak = state.streak ?? 0;
      data.value.lastCompletedDate = state.lastCompletedDate ?? null;
      data.value.loopCompleted = state.loopCompleted ?? 0;
      data.value.loopTarget = state.loopTarget ?? 0;
      data.value.mode = state.mode ?? 'countdown';
    }
  }

  function startTimer(): void {
    timerState.value = 'running';
    if (data.value.mode === 'countdown') {
      remaining.value = data.value.duration;
      elapsed.value = 0;
    } else {
      elapsed.value = 0;
      remaining.value = 0;
    }
  }

  function pauseTimer(): void {
    if (timerState.value === 'running') timerState.value = 'paused';
  }

  function resumeTimer(): void {
    if (timerState.value === 'paused') timerState.value = 'running';
  }

  function resetTimer(): void {
    timerState.value = 'idle';
    elapsed.value = 0;
    remaining.value = 0;
  }

  function setMode(mode: TimerMode): void {
    data.value.mode = mode;
  }

  function setDuration(seconds: number): void {
    data.value.duration = seconds;
  }

  function setLoopTarget(target: number): void {
    data.value.loopTarget = target;
  }

  return {
    data, timerState, elapsed, remaining, isLoaded,
    todayCompleted, totalMinutes, streak,
    shouldAutoContinue, averageSessionDuration, weeklyHistory, todayMinutes,
    load, loadState, save, completePomodoro, startTimer, pauseTimer, resumeTimer, resetTimer,
    setMode, setDuration, setLoopTarget,
    resetLoopCompleted,
  };
});
