import { StorageService } from './index.ts';

export async function backupData(): Promise<Blob> {
  const storage = new StorageService();
  const data = await storage.getAllData();
  return new Blob([JSON.stringify(data)], { type: 'application/json' });
}

export async function restoreData(blob: Blob): Promise<void> {
  const storage = new StorageService();
  const text = await blob.text();
  const data = JSON.parse(text);
  await storage.restoreAllData(data);
}
