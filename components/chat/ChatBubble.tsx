import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ChatMessage } from '../../lib/llm/types';
import { colors, fonts, spacing, radius } from '../../constants/theme';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.text, isUser && styles.textUser]}>{message.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: radius.card,
    padding: spacing.md,
    maxWidth: '85%',
  },
  bubbleUser: {
    backgroundColor: colors.brand,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: colors.ink80,
    borderTopLeftRadius: 4,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink10,
    lineHeight: 22,
  },
  textUser: {
    color: colors.white,
  },
});
