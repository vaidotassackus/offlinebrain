import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { ChatBubble, ThinkingBubble } from '../../components/chat/ChatBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { ModelStatusBar } from '../../components/chat/ModelStatusBar';
import { useChatStore } from '../../lib/store/useChatStore';
import { getChatMessages, insertChatMessage } from '../../lib/db/chat';
import {
  downloadModel,
  loadModel,
  generateResponse,
  isModelDownloaded,
} from '../../lib/llm/engine';
import {
  isEmbeddingModelDownloaded,
  downloadEmbeddingModel,
  loadEmbeddingModel,
  isEmbeddingModelLoaded,
} from '../../lib/embeddings/engine';
import { indexUnindexedArticles } from '../../lib/embeddings/indexer';
import { DEFAULT_MODEL } from '../../lib/llm/models';
import { buildSystemMessage } from '../../lib/llm/prompts';
import {
  searchRAGContext,
  getArticleContext,
  buildRAGPrompt,
} from '../../lib/llm/rag';
import type { ChatMessage } from '../../lib/llm/types';
import { colors, fonts, spacing, radius } from '../../constants/theme';

const SYSTEM_GREETING: Omit<ChatMessage, 'id'> = {
  role: 'assistant',
  content:
    "I'm your offline AI assistant. I can answer questions from your downloaded knowledge packs — even without internet. Download the AI model to get started, or try asking a question now.",
  createdAt: 0,
};

export default function AskScreen() {
  const db = useSQLiteContext();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const { articleId, articleTitle } = useLocalSearchParams<{
    articleId?: string;
    articleTitle?: string;
  }>();

  const messages = useChatStore((s) => s.messages);
  const modelStatus = useChatStore((s) => s.modelStatus);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const downloadProgress = useChatStore((s) => s.downloadProgress);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const contextArticleId = useChatStore((s) => s.contextArticleId);
  const contextArticleTitle = useChatStore((s) => s.contextArticleTitle);
  const setMessages = useChatStore((s) => s.setMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const setModelStatus = useChatStore((s) => s.setModelStatus);
  const setIsGenerating = useChatStore((s) => s.setIsGenerating);
  const setDownloadProgress = useChatStore((s) => s.setDownloadProgress);
  const appendStreamToken = useChatStore((s) => s.appendStreamToken);
  const clearStreamingContent = useChatStore((s) => s.clearStreamingContent);
  const setContextArticle = useChatStore((s) => s.setContextArticle);

  // Handle article context from route params
  useEffect(() => {
    if (articleId && articleTitle) {
      setContextArticle(articleId, articleTitle);
    }
  }, [articleId, articleTitle, setContextArticle]);

  // Check model status on mount
  useEffect(() => {
    if (isModelDownloaded() && modelStatus === 'not_downloaded') {
      setModelStatus('loading');
      loadModel(DEFAULT_MODEL.id)
        .then(() => setModelStatus('ready'))
        .catch(() => setModelStatus('error'));
    }
  }, []);

  // Auto-download embedding model and index articles after LLM is ready
  useEffect(() => {
    if (modelStatus !== 'ready') return;

    const setupEmbeddings = async () => {
      try {
        // Download embedding model if needed (25MB — quick)
        if (!isEmbeddingModelDownloaded()) {
          await downloadEmbeddingModel(() => {});
        }
        // Load embedding model if not already loaded
        if (!isEmbeddingModelLoaded()) {
          await loadEmbeddingModel();
        }
        // Index any unindexed articles in background
        await indexUnindexedArticles(db);
      } catch (error) {
        console.warn('Embedding setup failed (non-critical):', error);
      }
    };

    setupEmbeddings();
  }, [modelStatus, db]);

  // Load chat messages on mount
  useEffect(() => {
    getChatMessages(db).then((msgs) => {
      if (msgs.length === 0) {
        const greeting = { ...SYSTEM_GREETING, createdAt: Date.now() };
        insertChatMessage(db, greeting).then((id) => {
          setMessages([{ ...greeting, id }]);
        });
      } else {
        setMessages(msgs);
      }
    });
  }, [db, setMessages]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      // 1. Insert user message
      const userMsg: Omit<ChatMessage, 'id'> = {
        role: 'user',
        content: text,
        createdAt: Date.now(),
      };
      const userId = await insertChatMessage(db, userMsg);
      addMessage({ ...userMsg, id: userId });
      scrollToEnd();

      setIsGenerating(true);
      clearStreamingContent();

      try {
        // 2. Build RAG context
        let ragPrompt = '';
        let articleTitleForPrompt: string | undefined;

        if (contextArticleId) {
          // Article-specific chat
          const articleCtx = await getArticleContext(db, contextArticleId);
          if (articleCtx) {
            ragPrompt = buildRAGPrompt([articleCtx]);
            articleTitleForPrompt = articleCtx.title;
          }
        } else {
          // General RAG search
          const ragResults = await searchRAGContext(db, text);
          if (ragResults.length > 0) {
            ragPrompt = buildRAGPrompt(ragResults);
          }
        }

        // 3. Build system message
        const systemMessage = buildSystemMessage(ragPrompt, articleTitleForPrompt);

        // 4. Generate response with streaming
        const responseText = await generateResponse(
          [...messages, { ...userMsg, id: userId }],
          {
            ragContext: systemMessage,
            onToken: (token: string) => {
              appendStreamToken(token);
            },
          }
        );

        // 5. Persist assistant message
        const assistantMsg: Omit<ChatMessage, 'id'> = {
          role: 'assistant',
          content: responseText,
          createdAt: Date.now(),
        };
        const assistantId = await insertChatMessage(db, assistantMsg);
        addMessage({ ...assistantMsg, id: assistantId });
      } catch (error) {
        // Show error as assistant message
        const errorMsg: Omit<ChatMessage, 'id'> = {
          role: 'assistant',
          content:
            'Sorry, I encountered an error generating a response. Please try again.',
          createdAt: Date.now(),
        };
        const errorId = await insertChatMessage(db, errorMsg);
        addMessage({ ...errorMsg, id: errorId });
        console.error('Generation error:', error);
      } finally {
        setIsGenerating(false);
        clearStreamingContent();
        scrollToEnd();
      }
    },
    [
      db,
      messages,
      addMessage,
      setIsGenerating,
      scrollToEnd,
      contextArticleId,
      appendStreamToken,
      clearStreamingContent,
    ]
  );

  const handleDownloadModel = useCallback(async () => {
    try {
      setModelStatus('downloading');
      setDownloadProgress(0);
      await downloadModel(DEFAULT_MODEL.id, (p) => setDownloadProgress(p));
      setModelStatus('loading');
      await loadModel(DEFAULT_MODEL.id);
      setModelStatus('ready');
    } catch (error) {
      setModelStatus('error');
      console.error('Model download/load error:', error);
    }
  }, [setModelStatus, setDownloadProgress]);

  const handleClearContext = useCallback(() => {
    setContextArticle(null, null);
  }, [setContextArticle]);

  const renderFooter = useCallback(() => {
    if (!isGenerating) return null;
    if (streamingContent.length > 0) {
      return (
        <ChatBubble
          message={{
            id: 'streaming',
            role: 'assistant',
            content: streamingContent,
            createdAt: Date.now(),
          }}
          isStreaming
        />
      );
    }
    return <ThinkingBubble />;
  }, [isGenerating, streamingContent]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ask AI</Text>
      </View>

      <ModelStatusBar
        status={modelStatus}
        modelName={DEFAULT_MODEL.name}
        modelSize={DEFAULT_MODEL.sizeBytes}
        downloadProgress={downloadProgress}
        onDownload={handleDownloadModel}
      />

      {/* Article context banner */}
      {contextArticleTitle && (
        <View style={styles.contextBanner}>
          <Ionicons
            name="document-text-outline"
            size={16}
            color={colors.brand}
          />
          <Text style={styles.contextText} numberOfLines={1}>
            Chatting about: {contextArticleTitle}
          </Text>
          <TouchableOpacity
            onPress={handleClearContext}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={colors.ink40} />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.chatContent}
        style={styles.chatList}
        onContentSizeChange={scrollToEnd}
        ListFooterComponent={renderFooter}
      />

      <ChatInput
        onSend={handleSend}
        disabled={false}
        isGenerating={isGenerating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.white,
  },
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink80,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    gap: spacing.sm,
  },
  contextText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.ink10,
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: spacing.md,
  },
});
