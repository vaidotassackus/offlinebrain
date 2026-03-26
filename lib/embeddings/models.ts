import type { EmbeddingModelConfig } from './types';

export const EMBEDDING_MODELS: EmbeddingModelConfig[] = [
  {
    id: 'minilm-l6-v2',
    name: 'all-MiniLM-L6-v2',
    fileName: 'all-MiniLM-L6-v2.onnx',
    sizeBytes: 22_000_000,
    dimensions: 384,
    downloadUrl: 'https://placeholder.example.com/all-MiniLM-L6-v2.onnx',
  },
];

export const DEFAULT_EMBEDDING_MODEL = EMBEDDING_MODELS[0];
