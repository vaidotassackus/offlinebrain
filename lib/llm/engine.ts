import type { ChatMessage, GenerateOptions, ModelStatus } from './types';

// TODO: Replace with llama.rn integration

const MOCK_RESPONSES = [
  'Based on your downloaded knowledge packs, here is what I found. In a real scenario, the Phi-3 Mini model would generate a contextual answer using retrieval-augmented generation from your offline content.',
  'That is a great question. The on-device LLM will search through your medical and survival packs to provide accurate, sourced answers — even without internet.',
  'I can help with that. Once the full AI engine is integrated, I will be able to reference specific articles and provide step-by-step guidance from your downloaded packs.',
];

let responseIndex = 0;

export async function getModelStatus(): Promise<ModelStatus> {
  // TODO: Check if model file exists on disk via expo-file-system
  return 'not_downloaded';
}

export async function downloadModel(
  _modelId: string,
  onProgress: (p: number) => void
): Promise<void> {
  // TODO: Replace with real model download from CDN
  for (let i = 0; i <= 100; i += 5) {
    await new Promise((r) => setTimeout(r, 150));
    onProgress(i);
  }
}

export async function loadModel(_modelId: string): Promise<void> {
  // TODO: Replace with llama.rn context initialization
  await new Promise((r) => setTimeout(r, 1000));
}

export async function generateResponse(
  _messages: ChatMessage[],
  _options?: GenerateOptions
): Promise<string> {
  // TODO: Replace with llama.rn inference
  await new Promise((r) => setTimeout(r, 1500));
  const response = MOCK_RESPONSES[responseIndex % MOCK_RESPONSES.length];
  responseIndex++;
  return response;
}
