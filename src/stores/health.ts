import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StorageService } from '../services/storage/index.ts';
import { toLocalDateStr } from '../utils/date.ts';
import type { HealthStats, HealthRecord, UserResponse } from '../types/index.ts';

const storage = new StorageService();

function defaultHealthStats(): HealthStats {
  return { waterCount: 0, exerciseCount: 0, eyeRestCount: 0, sleepReminderCount: 0 };
}

export const useHealthStore = defineStore('health', () => {
  // --- State ---
  const stats = ref<HealthStats>(defaultHealthStats());
  const records = ref<HealthRecord[]>([]);
  const isLoaded = ref(false);

  // --- Getters ---
  const today = ref(toLocalDateStr(new Date()))
  const todayRecord = computed<HealthRecord | undefined>(() =>
    records.value.find((r) => r.date === today.value)
  )

  let dayCheckTimer: ReturnType<typeof setInterval> | null = null

  const todayWaterCount = computed(() => todayRecord.value?.waterCount ?? 0);
  const todayExerciseCount = computed(() => todayRecord.value?.exerciseCount ?? 0);
  const todayEyeRestCount = computed(() => todayRecord.value?.eyeRestCount ?? 0);

  // --- Actions ---
  async function load(): Promise<void> {
    const allRecords = await storage.getAll('health_records');
    records.value = allRecords as HealthRecord[];
    // Load today's stats
    const rec = todayRecord.value;
    if (rec) {
      stats.value.waterCount = rec.waterCount;
      stats.value.exerciseCount = rec.exerciseCount;
      stats.value.eyeRestCount = rec.eyeRestCount;
    }
    isLoaded.value = true;
    dayCheckTimer = setInterval(() => {
      const newDay = toLocalDateStr(new Date());
      if (newDay !== today.value) {
        today.value = newDay;
      }
    }, 60000);
  }

  async function destroy(): Promise<void> {
    if (dayCheckTimer) {
      clearInterval(dayCheckTimer);
      dayCheckTimer = null;
    }
  }

  async function getOrCreateTodayRecord(): Promise<HealthRecord> {
    let rec = todayRecord.value;
    if (!rec) {
      rec = {
        id: `health-${today.value}`,
        userId: 'current_user',
        date: today.value,
        waterCount: 0,
        exerciseCount: 0,
        eyeRestCount: 0,
        sleepReminderResponded: false,
      };
      await storage.save('health_records', rec);
      records.value.push(rec);
    }
    return rec;
  }

  async function recordWater(): Promise<void> {
    const rec = await getOrCreateTodayRecord();
    rec.waterCount += 1;
    stats.value.waterCount = rec.waterCount;
    await storage.save('health_records', rec);
  }

  async function recordExercise(): Promise<void> {
    const rec = await getOrCreateTodayRecord();
    rec.exerciseCount += 1;
    stats.value.exerciseCount = rec.exerciseCount;
    await storage.save('health_records', rec);
  }

  async function recordEyeRest(): Promise<void> {
    const rec = await getOrCreateTodayRecord();
    rec.eyeRestCount += 1;
    stats.value.eyeRestCount = rec.eyeRestCount;
    await storage.save('health_records', rec);
  }

  async function recordSleepReminder(response: UserResponse): Promise<void> {
    const rec = await getOrCreateTodayRecord();
    rec.sleepReminderResponded = response === 'done';
    stats.value.sleepReminderCount += 1;
    await storage.save('health_records', rec);
  }

  return {
    stats, records, isLoaded,
    todayRecord, todayWaterCount, todayExerciseCount, todayEyeRestCount,
    load, recordWater, recordExercise, recordEyeRest, recordSleepReminder, destroy,
  };
});
