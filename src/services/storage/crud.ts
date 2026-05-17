import { dbInstance } from './db.ts';
import type { StoreName } from './schema.ts';

export class CRUDService {
  async get(storeName: StoreName, id: string): Promise<any> {
    const db = await dbInstance.getConnection();
    return db.get(storeName, id);
  }

  async getAll(storeName: StoreName): Promise<any[]> {
    const db = await dbInstance.getConnection();
    return db.getAll(storeName);
  }

  async put(storeName: StoreName, data: any): Promise<void> {
    const db = await dbInstance.getConnection();
    // Deep-clone to strip Vue reactive proxies — ensures IndexedDB structured clone
    // receives plain objects, preventing silent serialization failures (especially WebView2)
    const raw = JSON.parse(JSON.stringify(data));
    await db.put(storeName, raw);
  }

  async delete(storeName: StoreName, id: string): Promise<void> {
    const db = await dbInstance.getConnection();
    await db.delete(storeName, id);
  }

  async clear(storeName: StoreName): Promise<void> {
    const db = await dbInstance.getConnection();
    await db.clear(storeName);
  }
}
