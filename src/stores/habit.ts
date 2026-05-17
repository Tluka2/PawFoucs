import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StorageService } from '../services/storage/index.ts';
import { toLocalDateStr } from '../utils/date.ts';
import type { Habit, Frequency, FrequencyConfig, CheckInStatus } from '../types/index.ts';

const storage = new StorageService();

export const useHabitStore = defineStore('habit', () => {
  // --- State ---
  const habits = ref<Habit[]>([]);
  const isLoaded = ref(false);

  // --- Getters ---
  function getToday(): string {
    return toLocalDateStr(new Date());
  }

  function isTodayActive(h: Habit): boolean {
    const now = new Date()
    const today = now.getDay()
    switch (h.frequency) {
      case 'daily': return true
      case 'weekdays': return today >= 1 && today <= 5
      case 'every_n_days': {
        const n = h.frequencyConfig?.nDays ?? 2
        const created = new Date(h.createdAt)
        const diffDays = Math.floor((now.getTime() - created.getTime()) / 86400000)
        return diffDays % n === 0
      }
      case 'custom_days': {
        const days = h.frequencyConfig?.customDays ?? []
        return days.includes(today)
      }
      default: return true
    }
  }

  function isDayActive(h: Habit, d: Date): boolean {
    const dayOfWeek = d.getDay()
    switch (h.frequency) {
      case 'daily': return true
      case 'weekdays': return dayOfWeek >= 1 && dayOfWeek <= 5
      case 'every_n_days': {
        const n = h.frequencyConfig?.nDays ?? 2
        const created = new Date(h.createdAt)
        const diffDays = Math.floor((d.getTime() - created.getTime()) / 86400000)
        return diffDays >= 0 && diffDays % n === 0
      }
      case 'custom_days': {
        const days = h.frequencyConfig?.customDays ?? []
        return days.includes(dayOfWeek)
      }
      default: return true
    }
  }

  const todayHabits = computed<Habit[]>(() =>
    habits.value.filter(h => isTodayActive(h))
  );

  const completedToday = computed<number>(() => {
    const today = getToday()
    return todayHabits.value.filter((h) => h.checkins.some((c) => c.date === today)).length
  });

  const uncheckedToday = computed<number>(() =>
    todayHabits.value.length - completedToday.value
  );

  const longestStreak = computed<number>(() =>
    habits.value.reduce((max, h) => Math.max(max, h.bestStreak), 0)
  );

  const totalCheckins = computed<number>(() =>
    habits.value.reduce((sum, h) => sum + h.checkins.length, 0)
  );

  const weeklyData = computed<{ label: string; date: string; count: number; total: number }[]>(() => {
    const dayLabels = ['日', '一', '二', '三', '四', '五', '六']
    const result: { label: string; date: string; count: number; total: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = toLocalDateStr(d)
      let count = 0
      let total = 0
      for (const h of habits.value) {
        const active = isDayActive(h, d)
        if (active) total++
        if (h.checkins.some(c => c.date === dateStr)) count++
      }
      result.push({ label: dayLabels[d.getDay()], date: dateStr, count, total })
    }
    return result
  });

  const completionRate = computed<number>(() => {
    if (habits.value.length === 0) return 0
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const today = now.getDate()
    if (today === 0) return 0
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`
    let totalPossible = 0
    let totalDone = 0
    for (const h of habits.value) {
      for (let d = 1; d <= today; d++) {
        const dateStr = `${monthPrefix}${String(d).padStart(2, '0')}`
        const dayDate = new Date(year, month, d)
        const dayOfWeek = dayDate.getDay()
        let active = false
        switch (h.frequency) {
          case 'daily': active = true; break
          case 'weekdays': active = dayOfWeek >= 1 && dayOfWeek <= 5; break
          case 'every_n_days': {
            const n = h.frequencyConfig?.nDays ?? 2
            const created = new Date(h.createdAt)
            const diff = Math.floor((dayDate.getTime() - created.getTime()) / 86400000)
            active = diff >= 0 && diff % n === 0
            break
          }
          case 'custom_days': {
            active = (h.frequencyConfig?.customDays ?? []).includes(dayOfWeek)
            break
          }
        }
        if (active) {
          totalPossible++
          if (h.checkins.some(c => c.date === dateStr && c.status === 'done')) totalDone++
        }
      }
    }
    return totalPossible === 0 ? 0 : Math.round((totalDone / totalPossible) * 100)
  });

  // --- Actions ---
  async function load(): Promise<void> {
    const allHabits = await storage.getAll('habits');
    habits.value = (allHabits as Habit[]).map(h => ({
      ...h,
      bestStreak: h.bestStreak ?? 0,
      checkins: (h.checkins ?? []).map((c: any) => ({
        ...c,
        status: c.status ?? 'done',
      })),
    }));
    isLoaded.value = true;
  }

  async function addHabit(
    name: string,
    frequency: Frequency = 'daily',
    note: string = '',
    frequencyConfig?: FrequencyConfig,
    reminderTime?: string
  ): Promise<Habit> {
    const habit: Habit = {
      id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: 'current_user',
      name,
      note,
      frequency,
      frequencyConfig,
      reminderTime,
      checkins: [],
      streak: 0,
      bestStreak: 0,
      createdAt: new Date().toISOString(),
    };
    await storage.save('habits', habit);
    habits.value.push(habit);
    return habit;
  }

  async function checkIn(habitId: string, status: CheckInStatus = 'done', content: string = ''): Promise<void> {
    const habit = habits.value.find((h) => h.id === habitId);
    if (!habit) return;

    const todayStr = getToday();
    const existing = habit.checkins.find((c) => c.date === todayStr);

    if (existing) {
      existing.status = status;
      existing.timestamp = Date.now();
    } else {
      habit.checkins.push({ date: todayStr, content, timestamp: Date.now(), status });

      // Update streak only for new check-ins
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = toLocalDateStr(yesterdayDate);
      const hasYesterday = habit.checkins.some((c) => c.date === yesterday);
      habit.streak = hasYesterday ? habit.streak + 1 : 1;
      if (habit.streak > habit.bestStreak) habit.bestStreak = habit.streak;
    }

    await storage.save('habits', habit);
  }

  async function toggleDayCheckIn(habitId: string, date: string, status: CheckInStatus): Promise<void> {
    const habit = habits.value.find((h) => h.id === habitId);
    if (!habit) return;

    const existing = habit.checkins.find((c) => c.date === date);
    if (existing) {
      existing.status = status;
      existing.timestamp = Date.now();
    } else {
      habit.checkins.push({ date, content: '', timestamp: Date.now(), status });
    }

    recalcStreak(habit);
    await storage.save('habits', habit);
  }

  async function removeDayCheckIn(habitId: string, date: string): Promise<void> {
    const habit = habits.value.find((h) => h.id === habitId);
    if (!habit) return;

    habit.checkins = habit.checkins.filter(c => c.date !== date);
    recalcStreak(habit);
    await storage.save('habits', habit);
  }

  function recalcStreak(habit: Habit) {
    const sorted = [...habit.checkins]
      .filter(c => c.status === 'done')
      .map(c => c.date)
      .sort()
      .reverse();

    if (sorted.length === 0) { habit.streak = 0; return; }

    let streak = 1;
    let current = new Date(sorted[0] + 'T00:00:00');
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(current);
      prev.setDate(prev.getDate() - 1);
      if (sorted[i] === toLocalDateStr(prev)) {
        streak++;
        current = prev;
      } else {
        break;
      }
    }
    habit.streak = streak;
    if (streak > habit.bestStreak) habit.bestStreak = streak;
  }

  async function deleteHabit(habitId: string): Promise<void> {
    await storage.remove('habits', habitId);
    habits.value = habits.value.filter((h) => h.id !== habitId);
  }

  async function updateHabit(habitId: string, updates: Partial<Pick<Habit, 'name' | 'note' | 'frequency' | 'frequencyConfig' | 'reminderTime'>>): Promise<void> {
    const habit = habits.value.find((h) => h.id === habitId);
    if (!habit) return;
    Object.assign(habit, updates);
    await storage.save('habits', habit);
  }

  function getCheckInStatus(habitId: string, date: string): CheckInStatus | null {
    const habit = habits.value.find((h) => h.id === habitId);
    if (!habit) return null;
    const ci = habit.checkins.find((c) => c.date === date);
    return ci ? ci.status : null;
  }

  return {
    habits, isLoaded,
    todayHabits, completedToday, uncheckedToday, longestStreak,
    totalCheckins, weeklyData, completionRate, isTodayActive,
    load, addHabit, checkIn, deleteHabit, updateHabit,
    toggleDayCheckIn, removeDayCheckIn, getCheckInStatus,
  };
});
