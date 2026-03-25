import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { colors, spacing, radius } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.ink80,
    borderRadius: radius.card,
    padding: spacing.md,
  },
});
