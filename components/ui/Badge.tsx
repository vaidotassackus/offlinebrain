import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors, fonts, spacing, radius } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'critical' | 'required' | 'purple';
  style?: ViewStyle;
}

const badgeColors = {
  default: { bg: colors.ink60, text: colors.ink10 },
  critical: { bg: colors.dangerLight, text: colors.danger },
  required: { bg: colors.brandLight, text: colors.brandDark },
  purple: { bg: colors.purpleLight, text: colors.purple },
};

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const palette = badgeColors[variant];

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
