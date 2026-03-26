export type EmbeddingModelStatus = 'not_downloaded' | 'downloading' | 'ready' | 'error';

export interface EmbeddingModelConfig {
  id: string;
  name: string;
  fileName: string;
  sizeBytes: number;
  dimensions: number;
  downloadUrl: string;
}

export interface VectorSearchResult {
  articleId: string;
  title: string;
  packName: string;
  similarity: number;
  snippet: string;
}
