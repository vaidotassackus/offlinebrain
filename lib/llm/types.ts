export type ModelStatus = 'not_downloaded' | 'downloading' | 'loading' | 'ready' | 'error';

export type StreamCallback = (token: string) => void;

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
  stopTokens: string[];
}

export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
  onToken?: StreamCallback;
  ragContext?: string;
}
