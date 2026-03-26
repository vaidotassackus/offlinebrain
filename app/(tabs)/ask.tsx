import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { ModelStatusBar } from '../../components/chat/ModelStatusBar';
import { useChatStore } from '../../lib/store/useChatStore';
import { getChatMessages, insertChatMessage } from '../../lib/db/chat';
import { downloadModel, loadModel, generateResponse } from '../../lib/llm/engine';
import { DEFAULT_MODEL } from '../../lib/llm/models';
import type { ChatMessage } from '../../lib/llm/types';
import { colors, fonts, spacing } from '../../constants/theme';

const SYSTEM_GREETING: Omit<ChatMessage, 'id'> = {
  role: 'assistant',
  content:
    "I'm your offline AI assistant. I can answer questions from your downloaded knowledge packs — even without internet. Download the AI model to get started, or try asking a question now.",
  createdAt: 0,
};

export default function AskScreen() {
  const db = useSQLiteContext();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const messages = useChatStore((s) => s.messages);
  const modelStatus = useChatStore((s) => s.modelStatus);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const downloadProgress = useChatStore((s) => s.downloadProgress);
  const setMessages = useChatStore((s) => s.setMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const setModelStatus = useChatStore((s) => s.setModelStatus);
  const setIsGenerating = useChatStore((s) => s.setIsGenerating);
  const setDownloadProgress = useChatStore((s) => s.setDownloadProgress);

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
      const userMsg: Omit<ChatMessage, 'id'> = {
        role: 'user',
        content: text,
        createdAt: Date.now(),
      };
      const userId = await insertChatMessage(db, userMsg);
      addMessage({ ...userMsg, id: userId });
      scrollToEnd();

      setIsGenerating(true);
      const responseText = await generateResponse(messages);
      const assistantMsg: Omit<ChatMessage, 'id'> = {
        role: 'assistant',
        content: responseText,
        createdAt: Date.now(),
      };
      const assistantId = await insertChatMessage(db, assistantMsg);
      addMessage({ ...assistantMsg, id: assistantId });
      setIsGenerating(false);
      scrollToEnd();
    },
    [db, messages, addMessage, setIsGenerating, scrollToEnd]
  );

  const handleDownloadModel = useCallback(async () => {
    setModelStatus('downloading');
    setDownloadProgress(0);
    await downloadModel(DEFAULT_MODEL.id, (p) => setDownloadProgress(p));
    setModelStatus('loading');
    await loadModel(DEFAULT_MODEL.id);
    setModelStatus('ready');
  }, [setModelStatus, setDownloadProgress]);

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

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.chatContent}
        style={styles.chatList}
        onContentSizeChange={scrollToEnd}
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
  chatList: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: spacing.md,
  },
});
