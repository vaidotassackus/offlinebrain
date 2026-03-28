import type { SQLiteDatabase } from 'expo-sqlite';
import { getArticleById, searchArticlesForRAG } from '../db/articles';

export interface RAGResult {
  articleId: string;
  title: string;
  packName: string;
  contentExcerpt: string;
}

/**
 * Search articles for RAG context using FTS5.
 * Returns the top 3 most relevant articles with content excerpts.
 */
export async function searchRAGContext(
  db: SQLiteDatabase,
  query: string,
  limit = 3
): Promise<RAGResult[]> {
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
