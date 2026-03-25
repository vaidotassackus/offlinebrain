import type { SQLiteDatabase } from 'expo-sqlite';
import {
  CREATE_PACKS_TABLE,
  CREATE_ARTICLES_TABLE,
  CREATE_ARTICLES_FTS,
  CREATE_FTS_TRIGGER_INSERT,
  CREATE_FTS_TRIGGER_DELETE,
  CREATE_HISTORY_TABLE,
  CREATE_BOOKMARKS_TABLE,
} from './schema';

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`PRAGMA journal_mode = WAL;`);
  await db.execAsync(CREATE_PACKS_TABLE);
  await db.execAsync(CREATE_ARTICLES_TABLE);
  await db.execAsync(CREATE_ARTICLES_FTS);
  await db.execAsync(CREATE_FTS_TRIGGER_INSERT);
  await db.execAsync(CREATE_FTS_TRIGGER_DELETE);
  await db.execAsync(CREATE_HISTORY_TABLE);
  await db.execAsync(CREATE_BOOKMARKS_TABLE);
}
