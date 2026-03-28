import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { ChatMessage } from '../../lib/llm/types';
import { colors, fonts, spacing, radius } from '../../constants/theme';

interface ChatBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function ChatBubble({ message, isStreaming }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isStreaming) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [isStreaming, cursorOpacity]);

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.text, isUser && styles.textUser]}>
          {message.content}
          {isStreaming && (
            <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
              ▎
            </Animated.Text>
          )}
        </Text>
      </View>
    </View>
  );
}

export function ThinkingBubble() {
  const dotOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [dotOpacity]);

  return (
    <View style={styles.row}>
      <View style={[styles.bubble, styles.bubbleAssistant]}>
        <Animated.Text style={[styles.text, { opacity: dotOpacity }]}>
          Thinking…
        </Animated.Text>
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
  cursor: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.brand,
  },
});
