import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StorageService } from '../services/storage/index.ts';
import type { UserData } from '../types/index.ts';

const storage = new StorageService();

export const useUserStore = defineStore('user', () => {
  const userId = ref('');
  const username = ref('');
  const createdAt = ref('');
  const lastActiveAt = ref('');
  const coins = ref(0);
  const totalEarned = ref(0);
  const currentPetId = ref('');
  const isLoaded = ref(false);
  
  let saveQueue = Promise.resolve();

  const isLoggedIn = computed(() => !!userId.value);
  const formattedCoins = computed(() => coins.value.toLocaleString());

  async function load(): Promise<void> {
    const data = await storage.getUserData();
    if (data) {
      userId.value = data.userId;
      username.value = data.username;
      createdAt.value = data.createdAt;
      lastActiveAt.value = data.lastActiveAt;
      coins.value = data.coins;
      totalEarned.value = data.totalEarned;
      currentPetId.value = data.currentPetId;
    }
    isLoaded.value = true;
  }

  async function save(): Promise<void> {
    saveQueue = saveQueue.then(async () => {
      const currentData = await storage.getUserData();
      const baseData = currentData || {
        userId: userId.value || 'current_user',
        username: username.value,
        createdAt: createdAt.value,
        lastActiveAt: new Date().toISOString(),
        coins: coins.value,
        totalEarned: totalEarned.value,
        currentPetId: currentPetId.value,
        pets: [],
        pomodoro: {
          totalCompleted: 0, totalMinutes: 0, todayCompleted: 0,
          streak: 0, lastCompletedDate: null, mode: 'countdown',
          duration: 1500, breakDuration: 300, breakType: 'short',
          loopTarget: 0, loopCompleted: 0, history: [],
        },
        habits: [],
        memos: [],
        outfits: [],
        healthStats: { waterCount: 0, exerciseCount: 0, eyeRestCount: 0, sleepReminderCount: 0 },
        achievements: [],
        windowSettings: {
          width: 320, height: 480, minWidth: 320, minHeight: 480,
          opacity: 100, alwaysOnTop: true, showDecorations: true,
          lockPosition: false, autoStart: false, closeAction: 'exit' as const,
        },
      };

      const updatedData: UserData = {
        ...baseData,
        userId: userId.value || baseData.userId,
        username: username.value,
        createdAt: createdAt.value || baseData.createdAt,
        lastActiveAt: new Date().toISOString(),
        coins: coins.value,
        totalEarned: totalEarned.value,
        currentPetId: currentPetId.value,
      };

      await storage.saveUserData(updatedData);
    });
    return saveQueue;
  }

  function addCoins(amount: number): void {
    coins.value += amount;
    totalEarned.value += amount;
  }

  function spendCoins(amount: number): boolean {
    if (coins.value >= amount) {
      coins.value -= amount;
      return true;
    }
    return false;
  }

  async function initNewUser(name: string): Promise<void> {
    userId.value = 'current_user';
    username.value = name;
    createdAt.value = new Date().toISOString();
    lastActiveAt.value = new Date().toISOString();
    coins.value = 0;
    totalEarned.value = 0;
    currentPetId.value = '';
    await save();
  }

  return {
    userId, username, createdAt, lastActiveAt,
    coins, totalEarned, currentPetId, isLoaded,
    isLoggedIn, formattedCoins,
    load, save, addCoins, spendCoins, initNewUser,
  };
});
