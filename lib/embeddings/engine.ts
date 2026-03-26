import type { EmbeddingModelStatus } from './types';

// TODO: Replace with real ONNX/transformer inference

export async function embedText(_text: string): Promise<Float32Array> {
  // TODO: Replace with real embedding model inference
  const dims = 384;
  const embedding = new Float32Array(dims);
  for (let i = 0; i < dims; i++) {
    embedding[i] = Math.random() * 2 - 1;
  }
  // Normalize
  let norm = 0;
  for (let i = 0; i < dims; i++) {
    norm += embedding[i] * embedding[i];
  }
  norm = Math.sqrt(norm);
  for (let i = 0; i < dims; i++) {
    embedding[i] /= norm;
  }
  return embedding;
}

export async function embedBatch(texts: string[]): Promise<Float32Array[]> {
  const results: Float32Array[] = [];
  for (const text of texts) {
    results.push(await embedText(text));
  }
  return results;
}

export async function getEmbeddingModelStatus(): Promise<EmbeddingModelStatus> {
  // TODO: Check if model file exists on disk
  return 'not_downloaded';
}

export async function downloadEmbeddingModel(
  onProgress: (p: number) => void
): Promise<void> {
  // TODO: Replace with real model download
  for (let i = 0; i <= 100; i += 10) {
    await new Promise((r) => setTimeout(r, 200));
    onProgress(i);
  }
}
