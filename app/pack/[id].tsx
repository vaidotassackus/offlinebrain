import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArticleRow } from '../../components/ArticleRow';
import { Badge } from '../../components/ui/Badge';
import { colors, fonts, spacing, radius } from '../../constants/theme';
import { getArticlesByPack, type ArticleRow as ArticleRowType } from '../../lib/db/articles';
import { formatBytes } from '../../lib/utils/format';
import { usePackStore } from '../../lib/store/usePackStore';

export default function PackDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const [articles, setArticles] = useState<ArticleRowType[]>([]);
  const pack = usePackStore((s) => s.packs.find((p) => p.id === id));

  useFocusEffect(
    useCallback(() => {
      if (id) {
        getArticlesByPack(db, id).then(setArticles);
      }
    }, [db, id])
  );

  if (!pack) {
    return (
      <View style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Pack not found</Text>
        </View>
      </View>
    );
  }

  const categoryColors: Record<string, string> = {
    medical: colors.danger,
    survival: colors.brand,
    maps: colors.warning,
    language: colors.purple,
    knowledge: colors.brandDark,
  };

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{pack.name}</Text>
      </View>

      {/* Pack metadata */}
      <View style={styles.metaCard}>
        <Text style={styles.description}>{pack.description}</Text>
        <View style={styles.metaRow}>
          <Badge
            label={pack.category}
            variant="default"
            style={{ backgroundColor: (categoryColors[pack.category] || colors.ink60) + '20' }}
          />
          <Text style={styles.metaText}>{formatBytes(pack.sizeBytes)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>v{pack.version}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{articles.length} articles</Text>
        </View>
        {pack.isRequired && (
          <View style={styles.requiredRow}>
            <Ionicons name="shield-checkmark" size={14} color={colors.brand} />
            <Text style={styles.requiredText}>Required pack — cannot be removed</Text>
          </View>
        )}
      </View>

      {/* Article list */}
      <Text style={styles.sectionTitle}>Articles</Text>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArticleRow
            title={item.title}
            packName={pack.name}
            readTime={item.read_time}
            isCritical={item.is_critical === 1}
            onPress={() => router.push(`/article/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={colors.ink60} />
            <Text style={styles.emptyText}>No articles in this pack</Text>
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
    flex: 1,
  },
  metaCard: {
    backgroundColor: colors.ink80,
    borderRadius: radius.card,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink10,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink40,
  },
  metaDot: {
    color: colors.ink40,
    fontSize: 12,
  },
  requiredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.ink60,
  },
  requiredText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink20,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink40,
  },
});
