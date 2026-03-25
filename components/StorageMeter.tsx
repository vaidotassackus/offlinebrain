import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { formatBytes } from '../lib/utils/format';

interface StorageMeterProps {
  usedBytes: number;
  totalBytes?: number;
}

export function StorageMeter({ usedBytes, totalBytes = 5_000_000_000 }: StorageMeterProps) {
  const fraction = Math.min(usedBytes / totalBytes, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Storage used</Text>
        <Text style={styles.value}>
          {formatBytes(usedBytes)} / {formatBytes(totalBytes)}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.ink20,
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink40,
  },
  track: {
    height: 6,
    backgroundColor: colors.ink60,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
  },
});
