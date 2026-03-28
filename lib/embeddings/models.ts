import type { EmbeddingModelConfig } from './types';

export const EMBEDDING_MODELS: EmbeddingModelConfig[] = [
  {
    id: 'minilm-l6-v2-q8',
    name: 'all-MiniLM-L6-v2',
    fileName: 'all-MiniLM-L6-v2-Q8_0.gguf',
    sizeBytes: 25_000_000,
    dimensions: 384,
    downloadUrl:
      'https://huggingface.co/second-state/All-MiniLM-L6-v2-Embedding-GGUF/resolve/main/all-MiniLM-L6-v2-Q8_0.gguf',
  },
];

export const DEFAULT_EMBEDDING_MODEL = EMBEDDING_MODELS[0];
