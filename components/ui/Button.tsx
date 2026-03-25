import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const buttonStyle = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[styles.base, buttonStyle.container, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={buttonStyle.text.color as string} />
      ) : (
        <Text style={[styles.text, buttonStyle.text]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },
});

const variantStyles = {
  primary: {
    container: { backgroundColor: colors.brand } as ViewStyle,
    text: { color: colors.white } as TextStyle,
  },
  secondary: {
    container: { backgroundColor: colors.ink60 } as ViewStyle,
    text: { color: colors.white } as TextStyle,
  },
  danger: {
    container: { backgroundColor: colors.danger } as ViewStyle,
    text: { color: colors.white } as TextStyle,
  },
  ghost: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.ink60 } as ViewStyle,
    text: { color: colors.ink20 } as TextStyle,
  },
};
