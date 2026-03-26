export type ModelStatus = 'not_downloaded' | 'downloading' | 'loading' | 'ready' | 'error';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  fileName: string;
  sizeBytes: number;
  quantization: string;
  downloadUrl: string;
  contextLength: number;
}

export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
}
