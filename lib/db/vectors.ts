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

export async function searchByVector(
  _db: SQLiteDatabase,
  _queryEmbedding: Float32Array,
  _limit = 10
): Promise<VectorSearchResult[]> {
  // TODO: Replace with sqlite-vec HNSW search
  // In the real implementation, this will use:
  // SELECT ... FROM article_embeddings
  // WHERE embedding MATCH vec_query(?)
  // ORDER BY distance LIMIT ?
  return [
    {
      articleId: 'med-cpr',
      title: 'CPR — Adult and Child',
      packName: 'Emergency Medical',
      similarity: 0.92,
      snippet: 'Recognizing cardiac arrest and performing chest compressions...',
    },
    {
      articleId: 'med-tourniquet',
      title: 'Tourniquet Application for Severe Bleeding',
      packName: 'Emergency Medical',
      similarity: 0.87,
      snippet: 'A tourniquet is indicated for life-threatening bleeding...',
    },
    {
      articleId: 'surv-water',
      title: 'Water Purification Methods',
      packName: 'Wilderness Survival',
      similarity: 0.73,
      snippet: 'Boiling is the most reliable field method for killing all pathogens...',
    },
  ];
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
