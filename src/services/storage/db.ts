import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import { DATABASE_SCHEMA } from './schema.ts';

type MigrationFn = (db: IDBPDatabase) => Promise<void>;

const migrations: Record<number, MigrationFn> = {
  1: async (db) => {
    // Initial schema creation
    for (const [storeName, config] of Object.entries(DATABASE_SCHEMA.stores)) {
      const store = db.createObjectStore(storeName, { keyPath: config.keyPath });
      const indexes = (config as { keyPath: string; indexes?: string[] }).indexes;
      if (indexes) {
        for (const indexName of indexes) {
          store.createIndex(indexName, indexName);
        }
      }
    }
  },
  // Add future migrations here:
  // 2: async (db) => { ... },
};

class Database {
  private static instance: Database;
  private db: IDBPDatabase | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }

  async getConnection(): Promise<IDBPDatabase> {
    if (this.db) return this.db;

    this.db = await openDB(DATABASE_SCHEMA.name, DATABASE_SCHEMA.version, {
      upgrade(db, oldVersion, newVersion) {
        const target = newVersion ?? DATABASE_SCHEMA.version;
        console.log(`Upgrading DB from ${oldVersion} to ${target}`);
        for (let v = oldVersion + 1; v <= target; v++) {
          if (migrations[v]) {
            migrations[v](db).then(() => {
              console.log(`Migration ${v} applied`);
            });
          }
        }
      },
      blocked() {
        console.warn('Database upgrade blocked. Please close other tabs of the app.');
      },
      terminated() {
        console.log('Database connection terminated.');
      },
    });

    return this.db;
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const dbInstance = Database.getInstance();
