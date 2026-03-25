import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { formatBytes } from '../lib/utils/format';

interface PackCardProps {
  name: string;
  description: string;
  sizeBytes: number;
  isInstalled: boolean;
  isRequired: boolean;
  installing: boolean;
  progress: number;
  onInstall: () => void;
  onDelete: () => void;
}

export function PackCard({
  name,
  description,
  sizeBytes,
  isInstalled,
  isRequired,
  installing,
  progress,
  onInstall,
  onDelete,
}: PackCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{name}</Text>
          {isRequired && <Badge label="Required" variant="required" style={styles.badge} />}
        </View>
        <Text style={styles.size}>{formatBytes(sizeBytes)}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>

      {installing && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      )}

      <View style={styles.actions}>
        {isInstalled ? (
          <Button
            title="Delete"
            variant="ghost"
            onPress={onDelete}
            disabled={isRequired}
          />
        ) : (
          <Button
            title={installing ? 'Installing...' : 'Install'}
            variant="primary"
            onPress={onInstall}
            disabled={installing}
            loading={installing}
          />
        )}
      </View>
    </View>
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
