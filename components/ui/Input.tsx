import React from 'react';
import { TextInput, StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../constants/theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  autoFocus?: boolean;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  icon,
  style,
  autoFocus,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <Ionicons name={icon} size={18} color={colors.ink40} style={styles.icon} />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.ink40}
        style={styles.input}
        autoFocus={autoFocus}
        selectionColor={colors.brand}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink80,
    borderRadius: radius.element,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.white,
  },
});
