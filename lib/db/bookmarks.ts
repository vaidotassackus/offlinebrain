import type { SQLiteDatabase } from 'expo-sqlite';
import type { ArticleRow } from './articles';

export type BookmarkRow = ArticleRow & { pack_name: string; saved_at: number };

export async function getBookmarks(
  db: SQLiteDatabase,
  limit = 50
): Promise<BookmarkRow[]> {
  return db.getAllAsync<BookmarkRow>(
    `SELECT a.*, p.name as pack_name, b.saved_at
     FROM bookmarks b
     JOIN articles a ON a.id = b.article_id
     JOIN packs p ON p.id = a.pack_id
     ORDER BY b.saved_at DESC
     LIMIT ?`,
    [limit]
  );
}

export async function isBookmarked(
  db: SQLiteDatabase,
  articleId: string
): Promise<boolean> {
  const row = await db.getFirstAsync<{ article_id: string }>(
    `SELECT article_id FROM bookmarks WHERE article_id = ?`,
    [articleId]
  );
  return row != null;
}

export async function toggleBookmark(
  db: SQLiteDatabase,
  articleId: string
): Promise<boolean> {
  const exists = await isBookmarked(db, articleId);
  if (exists) {
    await db.runAsync(`DELETE FROM bookmarks WHERE article_id = ?`, [articleId]);
    return false;
  }
  await db.runAsync(
    `INSERT INTO bookmarks (article_id, saved_at) VALUES (?, ?)`,
    [articleId, Date.now()]
  );
  return true;
}

export async function removeBookmark(
  db: SQLiteDatabase,
  articleId: string
): Promise<void> {
  await db.runAsync(`DELETE FROM bookmarks WHERE article_id = ?`, [articleId]);
}
