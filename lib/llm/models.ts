import type { ModelConfig } from './types';

export const MODELS: ModelConfig[] = [
  {
    id: 'smollm2-1.7b-q4km',
    name: 'SmolLM2 1.7B',
    fileName: 'smollm2-1.7b-instruct-q4_k_m.gguf',
    sizeBytes: 1_060_000_000,
    quantization: 'Q4_K_M',
    downloadUrl:
      'https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct-GGUF/resolve/main/smollm2-1.7b-instruct-q4_k_m.gguf',
    contextLength: 2048,
    stopTokens: ['<|im_end|>', '</s>', '<|endoftext|>'],
  },
];

export const DEFAULT_MODEL = MODELS[0];
