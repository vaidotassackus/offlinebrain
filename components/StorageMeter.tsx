import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { formatBytes } from '../lib/utils/format';

interface StorageMeterProps {
  usedBytes: number;
  totalBytes?: number;
}

export function StorageMeter({ usedBytes, totalBytes = 5_000_000_000 }: StorageMeterProps) {
  const fraction = Math.min(usedBytes / totalBytes, 1);
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: fraction * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [fraction, animWidth]);

  const barColor = fraction > 0.9 ? colors.danger : fraction > 0.7 ? colors.warning : colors.brand;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Storage used</Text>
        <Text style={styles.value}>
          {formatBytes(usedBytes)} / {formatBytes(totalBytes)}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: barColor,
              width: animWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
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
    borderRadius: radius.pill,
  },
});
