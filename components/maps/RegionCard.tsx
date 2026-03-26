import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import type { MapRegion } from '../../lib/maps/types';
import { colors, fonts, spacing, radius } from '../../constants/theme';
import { formatBytes } from '../../lib/utils/format';

interface RegionCardProps {
  region: MapRegion;
  onDownload: () => void;
}

export function RegionCard({ region, onDownload }: RegionCardProps) {
  const [progress, setProgress] = useState(0);
  const isDownloading = region.downloadStatus === 'downloading';
  const isDownloaded = region.downloadStatus === 'downloaded';

  const handleDownload = async () => {
    onDownload();
    // Mock progress animation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 300));
      setProgress(i);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="map-outline" size={18} color={colors.brand} style={styles.icon} />
          <Text style={styles.name}>{region.name}</Text>
        </View>
        <Text style={styles.size}>{formatBytes(region.sizeBytes)}</Text>
      </View>
      <Text style={styles.description}>{region.description}</Text>

      {isDownloading && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      )}

      <View style={styles.actions}>
        {isDownloaded ? (
          <View style={styles.downloadedRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.brand} />
            <Text style={styles.downloadedText}>Downloaded</Text>
          </View>
        ) : (
          <Button
            title={isDownloading ? 'Downloading...' : 'Download'}
            variant={isDownloading ? 'secondary' : 'primary'}
            onPress={handleDownload}
            disabled={isDownloading}
            loading={isDownloading}
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
  icon: {
    marginRight: spacing.sm,
  },
  name: {
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    color: colors.white,
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
  downloadedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadedText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.brand,
    marginLeft: spacing.xs,
  },
});
