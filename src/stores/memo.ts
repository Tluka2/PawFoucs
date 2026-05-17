import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StorageService } from '../services/storage/index.ts';
import type { Memo } from '../types/index.ts';
import { PRESET_CATEGORIES } from '../types/memo.ts';

function getTodayStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function deadlineStatus(memo: Memo): 'overdue' | 'urgent' | 'normal' | 'none' {
  if (!memo.deadline || memo.completed) return 'none'
  const today = getTodayStr()
  if (memo.deadline < today) return 'overdue'
  const daysLeft = Math.ceil((new Date(memo.deadline + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime()) / 86400000)
  if (daysLeft <= (memo.remindDays ?? 3)) return 'urgent'
  return 'normal'
}

const storage = new StorageService();
const CUSTOM_CATEGORIES_KEY = 'memo_custom_categories';
const HIDDEN_PRESETS_KEY = 'memo_hidden_preset_categories';

export const useMemoStore = defineStore('memo', () => {
  const memos = ref<Memo[]>([]);
  const isLoaded = ref(false);
  const currentFilter = ref('全部');
  const customCategories = ref<string[]>(loadCustomCategories());
  const hiddenPresetCategories = ref<string[]>(loadHiddenPresets());

  function loadCustomCategories(): string[] {
    try {
      const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function saveCustomCategories() {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories.value));
  }

  function loadHiddenPresets(): string[] {
    try {
      const raw = localStorage.getItem(HIDDEN_PRESETS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function saveHiddenPresets() {
    localStorage.setItem(HIDDEN_PRESETS_KEY, JSON.stringify(hiddenPresetCategories.value));
  }

  const categories = computed<string[]>(() =>
    [...PRESET_CATEGORIES.filter(c => !hiddenPresetCategories.value.includes(c)), ...customCategories.value]
  );

  const completedCount = computed(() => memos.value.filter(m => m.completed).length);

  const filteredMemos = computed<Memo[]>(() => {
    const list = currentFilter.value === '全部'
      ? memos.value
      : memos.value.filter(m => m.category === currentFilter.value);
    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const aUrgent = deadlineStatus(a) === 'overdue' ? 0 : (deadlineStatus(a) === 'urgent' ? 1 : 2);
      const bUrgent = deadlineStatus(b) === 'overdue' ? 0 : (deadlineStatus(b) === 'urgent' ? 1 : 2);
      if (aUrgent !== bUrgent) return aUrgent - bUrgent;
      if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
      return b.timestamp - a.timestamp;
    });
  });

  const urgentMemos = computed<Memo[]>(() =>
    memos.value.filter(m => !m.completed && m.deadline && deadlineStatus(m) !== 'none')
  );

  const todayReminders = computed<Memo[]>(() => {
    const today = getTodayStr()
    return memos.value.filter(m => {
      if (!m.deadline || m.completed) return false
      const daysLeft = Math.ceil((new Date(m.deadline + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime()) / 86400000)
      const remindBefore = m.remindDays ?? 3
      return daysLeft <= remindBefore
    })
  });

  const importantMemos = computed<Memo[]>(() =>
    memos.value.filter((m) => m.isImportant)
  );

  const recentMemos = computed<Memo[]>(() =>
    [...memos.value].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
  );

  async function load(): Promise<void> {
    const allMemos = await storage.getAll('memos');
    memos.value = (allMemos as Memo[]).map(m => ({
      ...m,
      completed: m.completed ?? false,
      category: m.category ?? '生活',
    })).sort((a, b) => b.timestamp - a.timestamp);
    isLoaded.value = true;
  }

  async function addMemo(
    content: string,
    isImportant: boolean = false,
    category: string = '生活',
    deadline?: string,
    remindDays?: number,
  ): Promise<Memo> {
    const memo: Memo = {
      id: `memo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      content,
      timestamp: Date.now(),
      isImportant,
      category,
      completed: false,
      deadline,
      remindDays,
    };
    await storage.save('memos', memo);
    memos.value.unshift(memo);
    return memo;
  }

  async function deleteMemo(id: string): Promise<void> {
    await storage.remove('memos', id);
    memos.value = memos.value.filter((m) => m.id !== id);
  }

  async function toggleImportant(id: string): Promise<void> {
    const memo = memos.value.find((m) => m.id === id);
    if (!memo) return;
    memo.isImportant = !memo.isImportant;
    await storage.save('memos', memo);
  }

  async function updateContent(id: string, content: string): Promise<void> {
    const memo = memos.value.find((m) => m.id === id);
    if (!memo) return;
    memo.content = content;
    await storage.save('memos', memo);
  }

  async function updateCategory(id: string, category: string): Promise<void> {
    const memo = memos.value.find((m) => m.id === id);
    if (!memo) return;
    memo.category = category;
    await storage.save('memos', memo);
  }

  async function toggleCompleted(id: string): Promise<void> {
    const memo = memos.value.find((m) => m.id === id);
    if (!memo) return;
    memo.completed = !memo.completed;
    await storage.save('memos', memo);
  }

  async function updateDeadline(id: string, deadline: string | undefined, remindDays?: number): Promise<void> {
    const memo = memos.value.find((m) => m.id === id);
    if (!memo) return;
    memo.deadline = deadline;
    memo.remindDays = remindDays;
    await storage.save('memos', memo);
  }

  async function updateMemo(id: string, data: { content?: string; category?: string; isImportant?: boolean; deadline?: string | undefined; remindDays?: number }): Promise<void> {
    const memo = memos.value.find((m) => m.id === id);
    if (!memo) return;
    if (data.content !== undefined) memo.content = data.content;
    if (data.category !== undefined) memo.category = data.category;
    if (data.isImportant !== undefined) memo.isImportant = data.isImportant;
    if (data.deadline !== undefined) memo.deadline = data.deadline;
    if (data.remindDays !== undefined) memo.remindDays = data.remindDays;
    await storage.save('memos', memo);
  }

  async function clearCompleted(): Promise<void> {
    const completed = memos.value.filter(m => m.completed);
    const completedIds = new Set(completed.map(m => m.id));
    const results = await Promise.allSettled(
      completed.map(m => storage.remove('memos', m.id))
    );
    const failedIds = new Set(
      completed.filter((_, i) => results[i].status === 'rejected').map(m => m.id)
    );
    memos.value = memos.value.filter(m => !completedIds.has(m.id) || failedIds.has(m.id));
  }

  function addCategory(name: string) {
    if (!name.trim() || categories.value.includes(name.trim())) return;
    customCategories.value.push(name.trim());
    saveCustomCategories();
  }

  function removeCategory(name: string) {
    if (PRESET_CATEGORIES.includes(name as any)) {
      if (!hiddenPresetCategories.value.includes(name)) {
        hiddenPresetCategories.value.push(name);
        saveHiddenPresets();
      }
    } else {
      customCategories.value = customCategories.value.filter(c => c !== name);
      saveCustomCategories();
    }
    for (const m of memos.value) {
      if (m.category === name) m.category = '生活';
    }
    if (currentFilter.value === name) currentFilter.value = '全部';
  }

  function renameCategory(oldName: string, newName: string) {
    const trimmed = newName.trim();
    if (!trimmed || categories.value.includes(trimmed)) return;
    const isPreset = PRESET_CATEGORIES.includes(oldName as any);
    if (isPreset) {
      if (!hiddenPresetCategories.value.includes(oldName)) {
        hiddenPresetCategories.value.push(oldName);
        saveHiddenPresets();
      }
      customCategories.value.push(trimmed);
      saveCustomCategories();
    } else {
      const idx = customCategories.value.indexOf(oldName);
      if (idx === -1) return;
      customCategories.value[idx] = trimmed;
      saveCustomCategories();
    }
    for (const m of memos.value) {
      if (m.category === oldName) {
        m.category = trimmed;
        storage.save('memos', m);
      }
    }
    if (currentFilter.value === oldName) currentFilter.value = trimmed;
  }

  function getDeadlineStatus(memo: Memo): 'overdue' | 'urgent' | 'normal' | 'none' {
    return deadlineStatus(memo)
  }

  function exportAsJSON(): string {
    return JSON.stringify(memos.value, null, 2);
  }

  function exportAsTXT(): string {
    return [...memos.value]
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(m => {
        const date = new Date(m.timestamp).toLocaleString('zh-CN');
        const star = m.isImportant ? '[重要] ' : '';
        return `[${date}] ${star}[${m.category}] ${m.content}`;
      })
      .join('\n');
  }

  return {
    memos, isLoaded, currentFilter, customCategories, categories,
    filteredMemos, importantMemos, recentMemos, completedCount,
    urgentMemos, todayReminders, getDeadlineStatus,
    load, addMemo, deleteMemo, toggleImportant, updateContent, updateCategory, updateDeadline,
    updateMemo, toggleCompleted, clearCompleted,
    addCategory, removeCategory, renameCategory, exportAsJSON, exportAsTXT,
  };
});
