import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ModelStatus } from '../../lib/llm/types';
import { colors, fonts, spacing, radius } from '../../constants/theme';
import { formatBytes } from '../../lib/utils/format';

interface ModelStatusBarProps {
  status: ModelStatus;
  modelName: string;
  modelSize: number;
  downloadProgress: number;
  onDownload: () => void;
}

const STATUS_CONFIG: Record<ModelStatus, { dot: string; text: string }> = {
  not_downloaded: { dot: colors.ink40, text: 'Model not downloaded' },
  downloading: { dot: colors.warning, text: 'Downloading model...' },
  loading: { dot: colors.warning, text: 'Loading model...' },
  ready: { dot: colors.brand, text: 'Model ready' },
  error: { dot: colors.danger, text: 'Model error' },
};

export function ModelStatusBar({
  status,
  modelName,
  modelSize,
  downloadProgress,
  onDownload,
}: ModelStatusBarProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View style={[styles.dot, { backgroundColor: config.dot }]} />
        <Text style={styles.statusText}>{config.text}</Text>
        <Text style={styles.modelInfo}>
          {modelName} · {formatBytes(modelSize)}
        </Text>
      </View>

      {status === 'downloading' && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${downloadProgress}%` }]} />
        </View>
      )}

      {status === 'not_downloaded' && (
        <TouchableOpacity style={styles.downloadButton} onPress={onDownload} activeOpacity={0.7}>
          <Ionicons name="download-outline" size={14} color={colors.brand} />
          <Text style={styles.downloadText}>Download Model</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.ink60,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink20,
  },
  modelInfo: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink40,
    marginLeft: 'auto',
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.ink60,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.brand,
  },
  downloadText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.brand,
    marginLeft: spacing.xs,
  },
});
