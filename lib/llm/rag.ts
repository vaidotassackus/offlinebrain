import type { SQLiteDatabase } from 'expo-sqlite';
import { getArticleById, searchArticlesForRAG } from '../db/articles';
import { searchByVector, hasEmbeddings } from '../db/vectors';
import { embedText, isEmbeddingModelLoaded } from '../embeddings/engine';

export interface RAGResult {
  articleId: string;
  title: string;
  packName: string;
  contentExcerpt: string;
}

/**
 * Search articles for RAG context.
 * Prefers vector search when embeddings are available, falls back to FTS5.
 */
export async function searchRAGContext(
  db: SQLiteDatabase,
  query: string,
  limit = 3
): Promise<RAGResult[]> {
  // Try vector search first
  if (isEmbeddingModelLoaded() && (await hasEmbeddings(db))) {
    try {
      const queryEmbedding = await embedText(query);
      const vectorResults = await searchByVector(db, queryEmbedding, limit);

      if (vectorResults.length > 0) {
        // Fetch full content for each result
        const results: RAGResult[] = [];
        for (const vr of vectorResults) {
          const article = await getArticleById(db, vr.articleId);
          if (article) {
            results.push({
              articleId: vr.articleId,
              title: vr.title,
              packName: vr.packName,
              contentExcerpt: article.content.slice(0, 1500),
            });
          }
        }
        return results;
      }
    } catch (error) {
      console.warn('Vector search failed, falling back to FTS5:', error);
    }
  }

  // Fallback to FTS5 keyword search
  const results = await searchArticlesForRAG(db, query, limit);
  return results.map((r) => ({
    articleId: r.id,
    title: r.title,
    packName: r.pack_name,
    contentExcerpt: r.content.slice(0, 1500),
  }));
}

/**
 * Get a specific article's content for article-focused chat.
 */
export async function getArticleContext(
  db: SQLiteDatabase,
  articleId: string
): Promise<RAGResult | null> {
  const article = await getArticleById(db, articleId);
  if (!article) return null;
  return {
    articleId: article.id,
    title: article.title,
    packName: article.pack_name,
    contentExcerpt: article.content.slice(0, 2000),
  };
}

/**
 * Format RAG results into a structured context block for the system prompt.
 */
export function buildRAGPrompt(results: RAGResult[]): string {
  if (results.length === 0) return '';

  const sections = results
    .map(
      (r) =>
        `--- Source: ${r.title} (${r.packName}) ---\n${r.contentExcerpt}\n---`
    )
    .join('\n\n');

  return `Use the following reference material to answer the user's question. If the answer is not in the material, say so.\n\n${sections}`;
}
