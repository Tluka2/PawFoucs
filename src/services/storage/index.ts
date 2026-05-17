import { CRUDService } from './crud.ts';
import type { StoreName } from './schema.ts';
import type { UserData } from '../../types/index.ts';

export class StorageService {
  private crud = new CRUDService();

  // --- Generic methods (used by all Stores) ---

  async save(storeName: StoreName, data: any): Promise<void> {
    await this.crud.put(storeName, data);
  }

  async get(storeName: StoreName, key: string): Promise<any> {
    return this.crud.get(storeName, key);
  }

  async getAll(storeName: StoreName): Promise<any[]> {
    return this.crud.getAll(storeName);
  }

  async remove(storeName: StoreName, key: string): Promise<void> {
    await this.crud.delete(storeName, key);
  }

  async clearStore(storeName: StoreName): Promise<void> {
    await this.crud.clear(storeName);
  }

  // --- Typed convenience methods ---

  async saveUserData(data: UserData): Promise<void> {
    await this.save('users', data);
  }

  async getUserData(): Promise<UserData | null> {
    return this.get('users', 'current_user');
  }

  // --- Backup & Restore ---

  async getAllData(): Promise<Record<string, any[]>> {
    const stores: StoreName[] = [
      'users', 'pets', 'memos', 'habits',
      'pomodoro_history', 'pomodoro_state', 'outfits', 'health_records',
      'achievements', 'settings',
    ];
    const result: Record<string, any[]> = {};
    for (const s of stores) {
      result[s] = await this.getAll(s);
    }
    return result;
  }

  async restoreAllData(data: Record<string, any[]>): Promise<void> {
    for (const [store, items] of Object.entries(data)) {
      for (const item of items) {
        await this.save(store as StoreName, item);
      }
    }
  }
}
