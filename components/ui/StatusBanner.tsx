import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStore } from '../../lib/store/useNetworkStore';
import { colors, fonts, spacing } from '../../constants/theme';

const bannerConfig = {
  offline: {
    bg: 'rgba(192, 57, 43, 0.15)',
    dot: colors.danger,
    text: 'No internet · offline mode',
  },
  syncing: {
    bg: 'rgba(214, 137, 16, 0.15)',
    dot: colors.warning,
    text: 'Connected · syncing packs',
  },
  online: {
    bg: 'rgba(29, 158, 117, 0.15)',
    dot: colors.brand,
    text: 'Connected · all packs current',
  },
} as const;

export function StatusBanner() {
  const bannerState = useNetworkStore((s) => s.bannerState);
  const config = bannerConfig[bannerState];

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={styles.text}>{config.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink20,
  },
});
