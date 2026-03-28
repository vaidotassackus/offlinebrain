import { Paths, File, Directory } from 'expo-file-system';
import { createDownloadResumable } from 'expo-file-system/legacy';
import { initLlama } from 'llama.rn';
import type { LlamaContext } from 'llama.rn';
import { DEFAULT_EMBEDDING_MODEL } from './models';
import type { EmbeddingModelStatus } from './types';

const MODELS_DIR_NAME = 'models';

let embeddingContext: LlamaContext | null = null;

function getModelFile(): File {
  return new File(Paths.document, MODELS_DIR_NAME, DEFAULT_EMBEDDING_MODEL.fileName);
}

function getModelsDir(): Directory {
  return new Directory(Paths.document, MODELS_DIR_NAME);
}

export function isEmbeddingModelDownloaded(): boolean {
  return getModelFile().exists;
}

export function isEmbeddingModelLoaded(): boolean {
  return embeddingContext !== null;
}

export async function getEmbeddingModelStatus(): Promise<EmbeddingModelStatus> {
  if (embeddingContext) return 'ready';
  if (isEmbeddingModelDownloaded()) return 'not_downloaded'; // downloaded but not loaded
  return 'not_downloaded';
}

export async function downloadEmbeddingModel(
  onProgress: (p: number) => void
): Promise<void> {
  const modelsDir = getModelsDir();
  if (!modelsDir.exists) {
    modelsDir.create({ intermediates: true });
  }

  const modelFile = getModelFile();
  const destPath = modelFile.uri;

  const downloadResumable = createDownloadResumable(
    DEFAULT_EMBEDDING_MODEL.downloadUrl,
    destPath,
    {},
    (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      onProgress(Math.round(progress * 100));
    }
  );

  const result = await downloadResumable.downloadAsync();
  if (!result) {
    throw new Error('Embedding model download failed');
  }
}

export async function loadEmbeddingModel(): Promise<void> {
  if (embeddingContext) return;

  const modelFile = getModelFile();
  if (!modelFile.exists) {
    throw new Error('Embedding model not found. Please download it first.');
  }

  embeddingContext = await initLlama({
    model: modelFile.uri,
    embedding: true,
    n_ctx: 512,
    n_gpu_layers: 99,
    use_mlock: true,
  });
}

export async function embedText(text: string): Promise<Float32Array> {
  if (!embeddingContext) {
    throw new Error('Embedding model not loaded.');
  }

  const result = await embeddingContext.embedding(text);

  // Convert to Float32Array and normalize
  const embedding = new Float32Array(result.embedding);
  let norm = 0;
  for (let i = 0; i < embedding.length; i++) {
    norm += embedding[i] * embedding[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= norm;
    }
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

export async function releaseEmbeddingModel(): Promise<void> {
  if (embeddingContext) {
    await embeddingContext.release();
    embeddingContext = null;
  }
}
