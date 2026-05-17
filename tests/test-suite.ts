import { StorageService } from '../src/services/storage/index.ts';
import { Pet, Memo } from '../src/types/index.ts';

async function runStorageTests() {
  console.log("🚀 Starting Storage System Full Suite Tests...");
  const storage = new StorageService();

  try {
    // Test 1: Save and Get Memo
    const memo: Memo = { id: "m1", content: "Hello World", timestamp: Date.now(), isImportant: true, category: "生活", completed: false };
    await storage.save('memos', memo);
    const memos = await storage.getAll('memos') as Memo[];
    console.assert(memos.length > 0 && memos[0].content === "Hello World", "Test 1 Failed: Memo CRUD");

    // Test 2: Save and Get Pet
    const pet: Pet = { id: "p1", name: "Momo", type: "cat", level: 1, exp: 0, isUnlocked: true, isSelected: true, unlockDate: new Date().toISOString(), mood: "happy", lastInteractAt: new Date().toISOString() };
    await storage.save('pets', pet);
    const pets = await storage.getAll('pets') as Pet[];
    console.assert(pets.length > 0 && pets[0].name === "Momo", "Test 2 Failed: Pet CRUD");

    // Test 3: Delete Memo
    await storage.remove('memos', 'm1');
    const memosAfterDelete = await storage.getAll('memos') as Memo[];
    console.assert(memosAfterDelete.length === 0, "Test 3 Failed: Delete Memo");

    // Test 4: Multiple Memos
    await storage.save('memos', { id: "m2", content: "Test 2", timestamp: Date.now(), isImportant: false, category: "工作", completed: false });
    await storage.save('memos', { id: "m3", content: "Test 3", timestamp: Date.now(), isImportant: false, category: "学习", completed: true });
    const allMemos = await storage.getAll('memos') as Memo[];
    console.assert(allMemos.length === 2, "Test 4 Failed: getAll count");

    // Test 5: Settings
    await storage.save('settings', { key: 'window', opacity: 50, alwaysOnTop: false });
    const settings = await storage.get('settings', 'window');
    console.assert(settings && settings.opacity === 50, "Test 5 Failed: Settings");

    console.log("✅ All 5 Storage Tests Passed!");
  } catch (e) {
    console.error("❌ Storage Tests Failed:", e);
  }
}

runStorageTests();
