import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { formatBytes } from '../lib/utils/format';

interface PackCardProps {
  id: string;
  name: string;
  description: string;
  sizeBytes: number;
  isInstalled: boolean;
  isRequired: boolean;
  installing: boolean;
  progress: number;
  onInstall: () => void;
  onDelete: () => void;
  onPress: () => void;
}

export function PackCard({
  id,
  name,
  description,
  sizeBytes,
  isInstalled,
  isRequired,
  installing,
  progress,
  onInstall,
  onDelete,
  onPress,
}: PackCardProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{name}</Text>
          {isRequired && <Badge label="Required" variant="required" style={styles.badge} />}
          {isInstalled && !isRequired && (
            <Ionicons name="checkmark-circle" size={16} color={colors.brand} style={styles.installedIcon} />
          )}
        </View>
        <Text style={styles.size}>{formatBytes(sizeBytes)}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>{description}</Text>

      {installing && (
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <Ionicons name="document-text-outline" size={14} color={colors.ink40} />
          <Text style={styles.metaText}>
            {isInstalled ? 'Installed' : 'Not installed'}
          </Text>
        </View>
        <View style={styles.actions}>
          {isInstalled ? (
            <Button
              title="Delete"
              variant="ghost"
              onPress={(e) => { e?.stopPropagation?.(); onDelete(); }}
              disabled={isRequired}
            />
          ) : (
            <Button
              title={installing ? 'Installing...' : 'Install'}
              variant="primary"
              onPress={(e) => { e?.stopPropagation?.(); onInstall(); }}
              disabled={installing}
              loading={installing}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ink80,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    color: colors.white,
  },
  badge: {
    marginLeft: spacing.sm,
  },
  size: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink40,
    marginLeft: spacing.sm,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink20,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.ink60,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink40,
  },
  installedIcon: {
    marginLeft: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
