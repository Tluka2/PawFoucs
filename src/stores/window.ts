import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StorageService } from '../services/storage/index.ts';
import type { WindowSettings } from '../types/index.ts';
import { applyOpacity, applyAlwaysOnTop, setWindowPosition } from '../composables/useWindow.ts';

const storage = new StorageService();

function defaultWindowSettings(): WindowSettings {
  return {
    width: 320,
    height: 480,
    minWidth: 320,
    minHeight: 480,
    opacity: 100,
    alwaysOnTop: false,
    showDecorations: false,
    lockPosition: false,
    autoStart: false,
    closeAction: 'trayWithTimer' as const,
  };
}

const SETTINGS_KEY = 'window';

export const useWindowStore = defineStore('window', () => {
  const settings = ref<WindowSettings>(defaultWindowSettings());
  const isLoaded = ref(false);

  const isOnTop = computed(() => settings.value.alwaysOnTop);
  const currentOpacity = computed(() => settings.value.opacity);
  const isLocked = computed(() => settings.value.lockPosition);
  const windowSize = computed(() => ({ width: settings.value.width, height: settings.value.height }));

  async function load(): Promise<void> {
    const data = await storage.get('settings', SETTINGS_KEY);
    if (data) {
      settings.value = { ...defaultWindowSettings(), ...data };
    }
    isLoaded.value = true;
  }

  async function save(): Promise<void> {
    await storage.save('settings', { key: SETTINGS_KEY, ...settings.value });
  }

  async function initWindow(): Promise<void> {
    await applyOpacity(settings.value.opacity);
    await applyAlwaysOnTop(settings.value.alwaysOnTop);
    if (settings.value.position) {
      await setWindowPosition(settings.value.position.x, settings.value.position.y);
    }
  }

  async function setOpacity(value: number): Promise<void> {
    settings.value.opacity = Math.max(10, Math.min(100, value));
    await applyOpacity(settings.value.opacity);
    await save();
  }

  async function toggleOnTop(): Promise<void> {
    settings.value.alwaysOnTop = !settings.value.alwaysOnTop;
    await applyAlwaysOnTop(settings.value.alwaysOnTop);
    await save();
  }

  async function toggleLock(): Promise<void> {
    settings.value.lockPosition = !settings.value.lockPosition;
    await save();
  }

  async function setPosition(x: number, y: number): Promise<void> {
    settings.value.position = { x, y };
    await save();
  }

  async function updateSettings(updates: Partial<WindowSettings>): Promise<void> {
    Object.assign(settings.value, updates);
    await save();
  }

  return {
    settings, isLoaded,
    isOnTop, currentOpacity, isLocked, windowSize,
    load, save, initWindow, setOpacity, toggleOnTop, toggleLock, setPosition, updateSettings,
  };
});
