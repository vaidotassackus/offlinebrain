import type { SQLiteDatabase } from 'expo-sqlite';

export interface ArticleRow {
  id: string;
  pack_id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string | null;
  is_critical: number;
  read_time: number | null;
  created_at: number | null;
  updated_at: number | null;
}

export interface SearchResult {
  id: string;
  title: string;
  pack_id: string;
  pack_name: string;
  category: string | null;
  is_critical: number;
  read_time: number | null;
  snippet: string;
}

export async function searchArticles(
  db: SQLiteDatabase,
  query: string
): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  // Append * for prefix matching
  const ftsQuery = query.trim().split(/\s+/).map((w) => `${w}*`).join(' ');
  const results = await db.getAllAsync<SearchResult>(
    `SELECT a.id, a.title, a.pack_id, p.name as pack_name, a.category, a.is_critical, a.read_time,
            snippet(articles_fts, 1, '<b>', '</b>', '...', 32) as snippet
     FROM articles_fts
     JOIN articles a ON a.rowid = articles_fts.rowid
     JOIN packs p ON p.id = a.pack_id
     WHERE articles_fts MATCH ?
     ORDER BY rank
     LIMIT 50`,
    [ftsQuery]
  );
  return results;
}

export async function getArticleById(
  db: SQLiteDatabase,
  id: string
): Promise<(ArticleRow & { pack_name: string }) | null> {
  const result = await db.getFirstAsync<ArticleRow & { pack_name: string }>(
    `SELECT a.*, p.name as pack_name FROM articles a JOIN packs p ON p.id = a.pack_id WHERE a.id = ?`,
    [id]
  );
  return result ?? null;
}

export async function getArticlesByPack(
  db: SQLiteDatabase,
  packId: string
): Promise<ArticleRow[]> {
  return db.getAllAsync<ArticleRow>(
    `SELECT * FROM articles WHERE pack_id = ? ORDER BY title`,
    [packId]
  );
}

export async function getRecentArticles(
  db: SQLiteDatabase,
  limit = 10
): Promise<(ArticleRow & { pack_name: string; viewed_at: number })[]> {
  return db.getAllAsync<ArticleRow & { pack_name: string; viewed_at: number }>(
    `SELECT a.*, p.name as pack_name, h.viewed_at
     FROM history h
     JOIN articles a ON a.id = h.article_id
     JOIN packs p ON p.id = a.pack_id
     ORDER BY h.viewed_at DESC
     LIMIT ?`,
    [limit]
  );
}

export async function recordArticleView(
  db: SQLiteDatabase,
  articleId: string
): Promise<void> {
  await db.runAsync(
    `INSERT INTO history (article_id, viewed_at) VALUES (?, ?)`,
    [articleId, Date.now()]
  );
}

export async function clearHistory(db: SQLiteDatabase): Promise<void> {
  await db.runAsync(`DELETE FROM history`);
}

export async function clearBookmarks(db: SQLiteDatabase): Promise<void> {
  await db.runAsync(`DELETE FROM bookmarks`);
}
