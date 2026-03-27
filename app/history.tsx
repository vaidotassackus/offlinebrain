import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArticleRow } from '../components/ArticleRow';
import { colors, fonts, spacing } from '../constants/theme';
import { getRecentArticles, type ArticleRow as ArticleRowType } from '../lib/db/articles';

export default function HistoryScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [articles, setArticles] = useState<
    (ArticleRowType & { pack_name: string; viewed_at: number })[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      getRecentArticles(db, 50).then(setArticles);
    }, [db])
  );

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Reading History</Text>
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <ArticleRow
            title={item.title}
            packName={item.pack_name}
            readTime={item.read_time}
            isCritical={item.is_critical === 1}
            onPress={() => router.push(`/article/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color={colors.ink60} />
            <Text style={styles.emptyTitle}>No articles viewed yet</Text>
            <Text style={styles.emptySubtitle}>Articles you read will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
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
    fontSize: 24,
    color: colors.white,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    gap: spacing.sm,
  },
  emptyTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    color: colors.white,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink40,
  },
});
