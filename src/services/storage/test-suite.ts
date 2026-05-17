/**
 * Storage System Test Suite
 * For verifying Slice 0.2: Storage System
 *
 * NOTE: Run as standalone test, NOT in production code.
 * Requires fake-indexeddb in non-browser environments.
 */
import { StorageService } from './index.ts';
import { backupData } from './backup.ts';
import type { UserData, Pet, Memo } from '../../types/index.ts';

export async function runStorageTests() {
  console.log('Starting Storage System Validation Tests...');
  const results: { test: string; status: 'PASS' | 'FAIL'; error?: any }[] = [];

  const storage = new StorageService();

  // --- Shared test data ---
  const mockUser: UserData = {
    userId: 'current_user',
    username: 'Test User',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    pets: [],
    currentPetId: '',
    coins: 100,
    totalEarned: 100,
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
      lockPosition: false, autoStart: true, closeAction: 'trayWithTimer' as const,
    },
  };

  try {
    // Test 1: Save and Get User
    try {
      await storage.saveUserData(mockUser);
      const retrieved = await storage.getUserData();
      if (retrieved?.username === 'Test User') {
        results.push({ test: 'Save & Get User', status: 'PASS' });
      } else {
        throw new Error('Retrieved user data mismatch');
      }
    } catch (e) {
      results.push({ test: 'Save & Get User', status: 'FAIL', error: e });
    }

    // Test 2: Save and Get Pet (generic methods)
    try {
      const pet: Pet = {
        id: 'pet-001', name: 'Mimi', type: 'cat', level: 1, exp: 0,
        mood: 'happy', isUnlocked: true, isSelected: true,
        unlockDate: new Date().toISOString(), lastInteractAt: new Date().toISOString(),
      };
      await storage.save('pets', pet);
      const pets = await storage.getAll('pets') as Pet[];
      if (pets.length > 0 && pets[0].name === 'Mimi') {
        results.push({ test: 'Save & Get Pet', status: 'PASS' });
      } else {
        throw new Error('Pet data mismatch');
      }
    } catch (e) {
      results.push({ test: 'Save & Get Pet', status: 'FAIL', error: e });
    }

    // Test 3: Save and Get Memos (generic methods)
    try {
      const memo: Memo = { id: 'memo-1', content: 'Hello World', timestamp: Date.now(), isImportant: true, category: '生活', completed: false };
      await storage.save('memos', memo);
      const memos = await storage.getAll('memos') as Memo[];
      if (memos.length > 0 && memos[0].id === 'memo-1') {
        results.push({ test: 'Save & Get Memos', status: 'PASS' });
      } else {
        throw new Error('Memo retrieval failed');
      }
    } catch (e) {
      results.push({ test: 'Save & Get Memos', status: 'FAIL', error: e });
    }

    // Test 4: Delete (generic method)
    try {
      await storage.remove('memos', 'memo-1');
      const memos = await storage.getAll('memos') as Memo[];
      if (memos.length === 0) {
        results.push({ test: 'Delete Record', status: 'PASS' });
      } else {
        throw new Error('Record was not deleted');
      }
    } catch (e) {
      results.push({ test: 'Delete Record', status: 'FAIL', error: e });
    }

    // Test 5: Save and Get Habits (generic methods)
    try {
      await storage.save('habits', { id: 'habit-1', userId: 'current_user', name: 'Read', note: '', frequency: 'daily', frequencyConfig: undefined, checkins: [], streak: 0, bestStreak: 0, createdAt: new Date().toISOString() });
      const habits = await storage.getAll('habits');
      if (habits.length > 0 && habits[0].name === 'Read') {
        results.push({ test: 'Save & Get Habits', status: 'PASS' });
      } else {
        throw new Error('Habit retrieval failed');
      }
    } catch (e) {
      results.push({ test: 'Save & Get Habits', status: 'FAIL', error: e });
    }

    // Test 6: Settings (generic methods)
    try {
      await storage.save('settings', { key: 'window', opacity: 50, alwaysOnTop: false });
      const settings = await storage.get('settings', 'window');
      if (settings && settings.opacity === 50) {
        results.push({ test: 'Save & Get Settings', status: 'PASS' });
      } else {
        throw new Error('Settings retrieval failed');
      }
    } catch (e) {
      results.push({ test: 'Save & Get Settings', status: 'FAIL', error: e });
    }

    // Test 7: Backup Export
    try {
      const blob = await backupData();
      const text = await blob.text();
      const parsed = JSON.parse(text);
      if (parsed.users && parsed.pets) {
        results.push({ test: 'Backup Export', status: 'PASS' });
      } else {
        throw new Error('Backup data incomplete');
      }
    } catch (e) {
      results.push({ test: 'Backup Export', status: 'FAIL', error: e });
    }

  } catch (globalError) {
    console.error('Critical failure in test suite:', globalError);
  }

  console.table(results);

  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;
  console.log(`\nResults: ${passCount} passed, ${failCount} failed out of ${results.length} tests.`);

  return results;
}
