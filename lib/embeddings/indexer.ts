import type { SQLiteDatabase } from 'expo-sqlite';
import { embedText, isEmbeddingModelLoaded } from './engine';
import { DEFAULT_EMBEDDING_MODEL } from './models';
import { insertEmbedding, deleteEmbeddingsByPack } from '../db/vectors';
import { getArticlesByPack } from '../db/articles';

/**
 * Embed all articles in a pack and store in article_embeddings.
 * Skips articles that already have embeddings for the current model version.
 */
export async function indexPackArticles(
  db: SQLiteDatabase,
  packId: string,
  onProgress?: (current: number, total: number) => void
): Promise<number> {
  if (!isEmbeddingModelLoaded()) {
    throw new Error('Embedding model not loaded');
  }

  const articles = await getArticlesByPack(db, packId);

  // Get existing embeddings to skip already-indexed articles
  const existing = await db.getAllAsync<{ article_id: string }>(
    `SELECT article_id FROM article_embeddings
     WHERE article_id IN (SELECT id FROM articles WHERE pack_id = ?)
     AND model_version = ?`,
    [packId, DEFAULT_EMBEDDING_MODEL.id]
  );
  const existingIds = new Set(existing.map((r) => r.article_id));

  const toIndex = articles.filter((a) => !existingIds.has(a.id));
  let indexed = 0;

  for (const article of toIndex) {
    // Embed title + first 500 chars of content for a balanced representation
    const textToEmbed = `${article.title}\n${article.content.slice(0, 500)}`;
    const embedding = await embedText(textToEmbed);
    await insertEmbedding(db, article.id, embedding, DEFAULT_EMBEDDING_MODEL.id);
    indexed++;
    onProgress?.(indexed, toIndex.length);
  }

  return indexed;
}

/**
 * Check if a pack's articles have been indexed with the current model.
 */
export async function isPackIndexed(
  db: SQLiteDatabase,
  packId: string
): Promise<boolean> {
  const result = await db.getFirstAsync<{ total: number; indexed: number }>(
    `SELECT
       (SELECT COUNT(*) FROM articles WHERE pack_id = ?) as total,
       (SELECT COUNT(*) FROM article_embeddings ae
        JOIN articles a ON a.id = ae.article_id
        WHERE a.pack_id = ? AND ae.model_version = ?) as indexed`,
    [packId, packId, DEFAULT_EMBEDDING_MODEL.id]
  );
  if (!result || result.total === 0) return false;
  return result.indexed >= result.total;
}

/**
 * Delete all embeddings for articles in a pack.
 */
export async function deletePackEmbeddings(
  db: SQLiteDatabase,
  packId: string
): Promise<void> {
  await deleteEmbeddingsByPack(db, packId);
}

/**
 * Re-index all articles across all installed packs.
 */
export async function reindexAllArticles(
  db: SQLiteDatabase,
  onProgress?: (current: number, total: number) => void
): Promise<number> {
  if (!isEmbeddingModelLoaded()) {
    throw new Error('Embedding model not loaded');
  }

  // Clear all existing embeddings
  await db.runAsync(`DELETE FROM article_embeddings`);

  // Get all articles
  const articles = await db.getAllAsync<{ id: string; title: string; content: string }>(
    `SELECT id, title, content FROM articles`
  );

  let indexed = 0;
  for (const article of articles) {
    const textToEmbed = `${article.title}\n${article.content.slice(0, 500)}`;
    const embedding = await embedText(textToEmbed);
    await insertEmbedding(db, article.id, embedding, DEFAULT_EMBEDDING_MODEL.id);
    indexed++;
    onProgress?.(indexed, articles.length);
  }

  return indexed;
}

/**
 * Index any articles that don't yet have embeddings.
 */
export async function indexUnindexedArticles(
  db: SQLiteDatabase,
  onProgress?: (current: number, total: number) => void
): Promise<number> {
  if (!isEmbeddingModelLoaded()) {
    throw new Error('Embedding model not loaded');
  }

  const articles = await db.getAllAsync<{ id: string; title: string; content: string }>(
    `SELECT a.id, a.title, a.content FROM articles a
     LEFT JOIN article_embeddings ae ON ae.article_id = a.id AND ae.model_version = ?
     WHERE ae.article_id IS NULL`,
    [DEFAULT_EMBEDDING_MODEL.id]
  );

  let indexed = 0;
  for (const article of articles) {
    const textToEmbed = `${article.title}\n${article.content.slice(0, 500)}`;
    const embedding = await embedText(textToEmbed);
    await insertEmbedding(db, article.id, embedding, DEFAULT_EMBEDDING_MODEL.id);
    indexed++;
    onProgress?.(indexed, articles.length);
  }

  return indexed;
}
