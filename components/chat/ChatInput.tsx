import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../constants/theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  isGenerating: boolean;
}

export function ChatInput({ onSend, disabled, isGenerating }: ChatInputProps) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0 && !disabled && !isGenerating;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={isGenerating ? 'Generating...' : 'Ask anything...'}
          placeholderTextColor={colors.ink40}
          style={styles.input}
          editable={!disabled && !isGenerating}
          selectionColor={colors.brand}
          multiline
          maxLength={2000}
          onSubmitEditing={handleSend}
          blurOnSubmit
        />
      </View>
      <TouchableOpacity
        style={[styles.sendButton, canSend && styles.sendButtonActive]}
        onPress={handleSend}
        disabled={!canSend}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-up" size={20} color={canSend ? colors.white : colors.ink40} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.ink60,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.ink80,
    borderRadius: radius.element,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.white,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ink60,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonActive: {
    backgroundColor: colors.brand,
  },
});
