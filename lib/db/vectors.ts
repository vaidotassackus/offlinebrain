import type { SQLiteDatabase } from 'expo-sqlite';
import type { VectorSearchResult } from '../embeddings/types';

export async function insertEmbedding(
  db: SQLiteDatabase,
  articleId: string,
  embedding: Float32Array,
  modelVersion: string
): Promise<void> {
  const buffer = new Uint8Array(embedding.buffer);
  await db.runAsync(
    `INSERT OR REPLACE INTO article_embeddings (article_id, embedding, model_version) VALUES (?, ?, ?)`,
    [articleId, buffer as unknown as string, modelVersion]
  );
}

export async function deleteEmbeddingsByPack(
  db: SQLiteDatabase,
  packId: string
): Promise<void> {
  await db.runAsync(
    `DELETE FROM article_embeddings WHERE article_id IN (SELECT id FROM articles WHERE pack_id = ?)`,
    [packId]
  );
}

interface EmbeddingRow {
  article_id: string;
  embedding: ArrayBuffer;
  title: string;
  pack_name: string;
  content: string;
}

export async function searchByVector(
  db: SQLiteDatabase,
  queryEmbedding: Float32Array,
  limit = 3
): Promise<VectorSearchResult[]> {
  // Load all embeddings with article metadata
  const rows = await db.getAllAsync<EmbeddingRow>(
    `SELECT ae.article_id, ae.embedding, a.title, p.name as pack_name, a.content
     FROM article_embeddings ae
     JOIN articles a ON a.id = ae.article_id
     JOIN packs p ON p.id = a.pack_id`
  );

  if (rows.length === 0) return [];

  // Compute cosine similarity for each article
  const scored = rows
    .map((row) => {
      const storedEmbedding = new Float32Array(row.embedding);
      const similarity = cosineSimilarity(queryEmbedding, storedEmbedding);
      return {
        articleId: row.article_id,
        title: row.title,
        packName: row.pack_name,
        similarity,
        snippet: row.content.slice(0, 200),
      };
    })
    .filter((r) => r.similarity > 0.3) // minimum relevance threshold
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return scored;
}

export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) throw new Error('Vectors must have same dimensions');
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export async function hasEmbeddings(db: SQLiteDatabase): Promise<boolean> {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM article_embeddings`
  );
  return (result?.count ?? 0) > 0;
}

export async function getEmbeddingCount(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM article_embeddings`
  );
  return result?.count ?? 0;
}

export async function getTotalArticleCount(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM articles`
  );
  return result?.count ?? 0;
}
