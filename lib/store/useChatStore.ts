import { create } from 'zustand';
import type { ChatMessage, ModelStatus } from '../llm/types';
import { DEFAULT_MODEL } from '../llm/models';

interface ChatState {
  messages: ChatMessage[];
  modelStatus: ModelStatus;
  currentModelId: string;
  isGenerating: boolean;
  downloadProgress: number;
  streamingContent: string;
  contextArticleId: string | null;
  contextArticleTitle: string | null;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setModelStatus: (status: ModelStatus) => void;
  setIsGenerating: (v: boolean) => void;
  setDownloadProgress: (p: number) => void;
  clearMessages: () => void;
  appendStreamToken: (token: string) => void;
  clearStreamingContent: () => void;
  setContextArticle: (id: string | null, title: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  modelStatus: 'not_downloaded',
  currentModelId: DEFAULT_MODEL.id,
  isGenerating: false,
  downloadProgress: 0,
  streamingContent: '',
  contextArticleId: null,
  contextArticleTitle: null,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setModelStatus: (modelStatus) => set({ modelStatus }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
  clearMessages: () => set({ messages: [] }),
  appendStreamToken: (token) =>
    set((state) => ({ streamingContent: state.streamingContent + token })),
  clearStreamingContent: () => set({ streamingContent: '' }),
  setContextArticle: (id, title) =>
    set({ contextArticleId: id, contextArticleTitle: title }),
}));
