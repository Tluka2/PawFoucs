import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StorageService } from '../services/storage/index.ts';
import type { UserSettings } from '../types/index.ts';

const storage = new StorageService();

function defaultSettings(): UserSettings {
  return {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    defaultMode: 'countdown',
    autoStartBreak: false,
    autoStartWork: false,
    sessionsUntilLongBreak: 4,
    soundEnabled: true,
    soundVolume: 50,
    defaultOpacity: 100,
    defaultAlwaysOnTop: false,
    closeAction: 'trayWithTimer' as const,
    autoStart: false,
    waterEnabled: true,
    waterInterval: 2,
    exerciseEnabled: true,
    exerciseInterval: 4,
    eyeRestEnabled: true,
    eyeRestMinutes: 60,
    sleepEnabled: true,
    sleepAfterHour: 22,
    reminderStyle: 'dialogue',
    morningEnd: 11,
    afternoonEnd: 17,
    eveningEnd: 21,
  };
}

const SETTINGS_KEY = 'user_settings';

export const useSettingsStore = defineStore('settings', () => {
  // --- State ---
  const settings = ref<UserSettings>(defaultSettings());
  const isLoaded = ref(false);

  // --- Getters ---
  const workDurationSeconds = computed(() => settings.value.workDuration * 60);
  const breakDurationSeconds = computed(() => settings.value.breakDuration * 60);
  const longBreakDurationSeconds = computed(() => settings.value.longBreakDuration * 60);

  // --- Actions ---
  async function load(): Promise<void> {
    const data = await storage.get('settings', SETTINGS_KEY);
    if (data) {
      Object.assign(settings.value, data);
    }
    isLoaded.value = true;
  }

  async function save(): Promise<void> {
    await storage.save('settings', { key: SETTINGS_KEY, ...settings.value });
  }

  async function updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): Promise<void> {
    settings.value[key] = value;
    await save();
  }

  async function updateMany(updates: Partial<UserSettings>): Promise<void> {
    Object.assign(settings.value, updates);
    await save();
  }

  async function resetToDefaults(): Promise<void> {
    settings.value = defaultSettings();
    await save();
  }

  return {
    settings, isLoaded,
    workDurationSeconds, breakDurationSeconds, longBreakDurationSeconds,
    load, save, updateSetting, updateMany, resetToDefaults,
  };
});
