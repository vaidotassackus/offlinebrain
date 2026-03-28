import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { StorageMeter } from '../components/StorageMeter';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { useSettingsStore } from '../lib/store/useSettingsStore';
import { clearHistory, clearBookmarks } from '../lib/db/articles';
import { getInstalledSize } from '../lib/db/packs';
import { isEmbeddingModelDownloaded, isEmbeddingModelLoaded } from '../lib/embeddings/engine';
import { reindexAllArticles } from '../lib/embeddings/indexer';
import { getEmbeddingCount, getTotalArticleCount } from '../lib/db/vectors';
import { formatBytes } from '../lib/utils/format';
import { DEFAULT_EMBEDDING_MODEL } from '../lib/embeddings/models';

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={20}
        color={danger ? colors.danger : colors.ink20}
        style={styles.rowIcon}
      />
      <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {onPress && (
        <Ionicons name="chevron-forward" size={16} color={colors.ink40} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const setHasSeeded = useSettingsStore((s) => s.setHasSeeded);
  const [usedBytes, setUsedBytes] = useState(0);
  const [embeddingCount, setEmbeddingCount] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isReindexing, setIsReindexing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getInstalledSize(db).then(setUsedBytes);
      getEmbeddingCount(db).then(setEmbeddingCount);
      getTotalArticleCount(db).then(setTotalArticles);
    }, [db])
  );

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const sdkVersion = Constants.expoConfig?.sdkVersion ?? 'Unknown';

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'This will remove all your reading history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearHistory(db);
          Alert.alert('Done', 'Reading history cleared.');
        },
      },
    ]);
  };

  const handleClearBookmarks = () => {
    Alert.alert('Clear Bookmarks', 'This will remove all your saved articles.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearBookmarks(db);
          Alert.alert('Done', 'All bookmarks cleared.');
        },
      },
    ]);
  };

  const handleReindex = async () => {
    if (!isEmbeddingModelLoaded()) {
      Alert.alert('Model Not Loaded', 'The embedding model needs to be loaded first. Open the Ask AI tab to auto-download it.');
      return;
    }
    setIsReindexing(true);
    try {
      const count = await reindexAllArticles(db, (current, total) => {
        setEmbeddingCount(current);
        setTotalArticles(total);
      });
      Alert.alert('Done', `Re-indexed ${count} articles.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to re-index articles.');
      console.error('Reindex error:', error);
    } finally {
      setIsReindexing(false);
      getEmbeddingCount(db).then(setEmbeddingCount);
      getTotalArticleCount(db).then(setTotalArticles);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all packs, articles, and history. The app will re-seed on next launch.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await db.runAsync('DELETE FROM history');
            await db.runAsync('DELETE FROM bookmarks');
            await db.runAsync('DELETE FROM articles');
            await db.runAsync('DELETE FROM packs');
            setHasSeeded(false);
            Alert.alert('Done', 'All data has been reset. Restart the app to re-seed.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Storage */}
        <Text style={styles.sectionLabel}>Storage</Text>
        <View style={styles.section}>
          <StorageMeter usedBytes={usedBytes} />
        </View>

        {/* AI Search */}
        <Text style={styles.sectionLabel}>AI Search</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="hardware-chip-outline"
            label="Embedding Model"
            value={isEmbeddingModelDownloaded() ? `Downloaded (${formatBytes(DEFAULT_EMBEDDING_MODEL.sizeBytes)})` : 'Not Downloaded'}
          />
          <SettingsRow
            icon="analytics-outline"
            label="Indexed Articles"
            value={`${embeddingCount} / ${totalArticles}`}
          />
          <SettingsRow
            icon="refresh-outline"
            label={isReindexing ? 'Re-indexing...' : 'Re-index Articles'}
            onPress={isReindexing ? undefined : handleReindex}
          />
        </View>

        {/* General */}
        <Text style={styles.sectionLabel}>General</Text>
        <View style={styles.section}>
          <SettingsRow icon="library-outline" label="Manage Packs" onPress={() => router.push('/(tabs)/library')} />
          <SettingsRow icon="time-outline" label="Reading History" onPress={() => router.push('/history')} />
          <SettingsRow icon="bookmark-outline" label="Saved Articles" onPress={() => router.push('/(tabs)/search')} />
        </View>

        {/* Data */}
        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.section}>
          <SettingsRow icon="time-outline" label="Clear Reading History" onPress={handleClearHistory} />
          <SettingsRow icon="bookmark-outline" label="Clear Bookmarks" onPress={handleClearBookmarks} />
          <SettingsRow icon="trash-outline" label="Reset All Data" onPress={handleResetData} danger />
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.section}>
          <SettingsRow icon="information-circle-outline" label="Version" value={appVersion} />
          <SettingsRow icon="code-slash-outline" label="Expo SDK" value={sdkVersion} />
          <SettingsRow icon="shield-checkmark-outline" label="Privacy" value="100% offline" />
        </View>

        <Text style={styles.footer}>OfflineBrain · Everything you need to know,{'\n'}even when the world goes dark.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.white,
  },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink40,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  section: {
    backgroundColor: colors.ink80,
    borderRadius: radius.card,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.ink60,
  },
  rowIcon: {
    marginRight: spacing.md,
  },
  rowLabel: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.white,
    flex: 1,
  },
  rowValue: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.ink40,
    marginRight: spacing.sm,
  },
  footer: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink40,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing['2xl'],
    lineHeight: 20,
  },
});
