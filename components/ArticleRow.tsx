import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
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
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
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
    </TouchableOpacity>
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
    marginBottom: 4,
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
