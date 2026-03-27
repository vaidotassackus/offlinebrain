import React, { useRef } from 'react';
import { Animated, Text, View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from './ui/Badge';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { formatReadTime } from '../lib/utils/format';

interface ArticleRowProps {
  title: string;
  packName: string;
  readTime: number | null;
  isCritical: boolean;
  onPress: () => void;
}

export function ArticleRow({
  title,
  packName,
  readTime,
  isCritical,
  onPress,
}: ArticleRowProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {isCritical && <Badge label="Critical" variant="critical" style={styles.badge} />}
          </View>
          <View style={styles.meta}>
            <Text style={styles.pack}>{packName}</Text>
            {readTime != null && (
              <>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.readTime}>{formatReadTime(readTime)}</Text>
              </>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.ink40} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.ink60,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.white,
    flexShrink: 1,
  },
  badge: {
    marginLeft: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pack: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink40,
  },
  dot: {
    color: colors.ink40,
    marginHorizontal: spacing.xs,
    fontSize: 12,
  },
  readTime: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink40,
  },
});
