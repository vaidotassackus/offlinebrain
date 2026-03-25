import type { SQLiteDatabase } from 'expo-sqlite';
import type { Pack } from '../store/usePackStore';

interface PackRow {
  id: string;
  name: string;
  description: string;
  category: string;
  size_bytes: number;
  version: string;
  is_required: number;
  is_installed: number;
  installed_at: number | null;
  updated_at: number | null;
}

function rowToPack(row: PackRow): Pack {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    sizeBytes: row.size_bytes,
    version: row.version,
    isRequired: row.is_required === 1,
    isInstalled: row.is_installed === 1,
    installedAt: row.installed_at,
  };
}

export async function getAllPacks(db: SQLiteDatabase): Promise<Pack[]> {
  const rows = await db.getAllAsync<PackRow>(`SELECT * FROM packs ORDER BY name`);
  return rows.map(rowToPack);
}

export async function installPack(
  db: SQLiteDatabase,
  packId: string
): Promise<void> {
  await db.runAsync(
    `UPDATE packs SET is_installed = 1, installed_at = ? WHERE id = ?`,
    [Date.now(), packId]
  );
}

export async function deletePack(
  db: SQLiteDatabase,
  packId: string
): Promise<void> {
  // Check if pack is required
  const pack = await db.getFirstAsync<PackRow>(
    `SELECT * FROM packs WHERE id = ?`,
    [packId]
  );
  if (pack?.is_required === 1) {
    throw new Error('Cannot delete a required pack');
  }
  // Delete articles for this pack
  await db.runAsync(`DELETE FROM articles WHERE pack_id = ?`, [packId]);
  // Mark as uninstalled
  await db.runAsync(
    `UPDATE packs SET is_installed = 0, installed_at = NULL WHERE id = ?`,
    [packId]
  );
}

export async function mockInstallPack(
  packId: string,
  onProgress: (p: number) => void
): Promise<void> {
  for (let i = 0; i <= 100; i += 10) {
    await new Promise((r) => setTimeout(r, 300));
    onProgress(i);
  }
}

export async function getInstalledSize(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(size_bytes), 0) as total FROM packs WHERE is_installed = 1`
  );
  return result?.total ?? 0;
}
