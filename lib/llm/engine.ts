import { Paths, File, Directory } from 'expo-file-system';
import { createDownloadResumable } from 'expo-file-system/legacy';
import { initLlama } from 'llama.rn';
import type { LlamaContext } from 'llama.rn';
import { DEFAULT_MODEL } from './models';
import type { ChatMessage, GenerateOptions, ModelStatus } from './types';

const MODELS_DIR_NAME = 'models';

let llamaContext: LlamaContext | null = null;

function getModelsDir(): Directory {
  return new Directory(Paths.document, MODELS_DIR_NAME);
}

function getModelFile(): File {
  return new File(Paths.document, MODELS_DIR_NAME, DEFAULT_MODEL.fileName);
}

export async function getModelStatus(): Promise<ModelStatus> {
  if (llamaContext) return 'ready';
  const modelFile = getModelFile();
  return modelFile.exists ? 'not_downloaded' : 'not_downloaded';
  // Note: if file exists but not loaded, we still need to load it
}

export function isModelDownloaded(): boolean {
  const modelFile = getModelFile();
  return modelFile.exists;
}

export async function downloadModel(
  _modelId: string,
  onProgress: (p: number) => void
): Promise<void> {
  // Ensure models directory exists
  const modelsDir = getModelsDir();
  if (!modelsDir.exists) {
    modelsDir.create({ intermediates: true });
  }

  const modelFile = getModelFile();
  const destPath = modelFile.uri;

  // Use legacy API for download with progress
  const downloadResumable = createDownloadResumable(
    DEFAULT_MODEL.downloadUrl,
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
    throw new Error('Download failed — no result returned');
  }
}

export async function loadModel(_modelId: string): Promise<void> {
  if (llamaContext) return; // already loaded

  const modelFile = getModelFile();
  if (!modelFile.exists) {
    throw new Error('Model file not found. Please download it first.');
  }

  llamaContext = await initLlama({
    model: modelFile.uri,
    n_ctx: DEFAULT_MODEL.contextLength,
    n_gpu_layers: 99,
    use_mlock: true,
  });
}

export async function generateResponse(
  messages: ChatMessage[],
  options?: GenerateOptions
): Promise<string> {
  if (!llamaContext) {
    throw new Error('Model not loaded. Please load the model first.');
  }

  // Build messages array for llama.rn
  const llmMessages: Array<{ role: string; content: string }> = [];

  // Add system message with RAG context if provided
  if (options?.ragContext) {
    llmMessages.push({ role: 'system', content: options.ragContext });
  }

  // Add conversation messages (skip system greeting, limit to last 3 exchanges)
  const conversationMsgs = messages.filter((m) => m.role !== 'system');
  const recentMsgs = conversationMsgs.slice(-6);
  for (const msg of recentMsgs) {
    llmMessages.push({ role: msg.role, content: msg.content });
  }

  const result = await llamaContext.completion(
    {
      messages: llmMessages,
      n_predict: options?.maxTokens ?? 512,
      temperature: options?.temperature ?? 0.7,
      stop: DEFAULT_MODEL.stopTokens,
    },
    // Partial completion callback for streaming
    options?.onToken
      ? (data: { token: string }) => {
          options.onToken!(data.token);
        }
      : undefined
  );

  return result.text.trim();
}

export async function releaseModel(): Promise<void> {
  if (llamaContext) {
    await llamaContext.release();
    llamaContext = null;
  }
}

export function isModelLoaded(): boolean {
  return llamaContext !== null;
}
