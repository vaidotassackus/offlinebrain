import type { ModelConfig } from './types';

export const MODELS: ModelConfig[] = [
  {
    id: 'phi3-mini-q4km',
    name: 'Phi-3 Mini',
    fileName: 'phi-3-mini-4k-instruct-q4_k_m.gguf',
    sizeBytes: 2_500_000_000,
    quantization: 'Q4_K_M',
    downloadUrl: 'https://placeholder.example.com/phi-3-mini-q4_k_m.gguf',
    contextLength: 4096,
  },
];

export const DEFAULT_MODEL = MODELS[0];
