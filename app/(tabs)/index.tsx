import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { ArticleRow } from '../../components/ArticleRow';
import { colors, fonts, spacing, radius } from '../../constants/theme';
import { getRecentArticles, type ArticleRow as ArticleRowType } from '../../lib/db/articles';
import { seedDatabase } from '../../lib/seed';
import { useSettingsStore } from '../../lib/store/useSettingsStore';

const QUICK_ACCESS = [
  { id: 'first-aid', label: 'First Aid', icon: 'medkit' as const, color: colors.danger },
  { id: 'maps', label: 'Maps', icon: 'map' as const, color: colors.brand },
  { id: 'phrases', label: 'Phrases', icon: 'chatbubbles' as const, color: colors.warning },
  { id: 'wikipedia', label: 'Wikipedia', icon: 'globe' as const, color: colors.purple },
  { id: 'library', label: 'Library', icon: 'library' as const, color: colors.brandDark },
  { id: 'shelter', label: 'Shelter', icon: 'home' as const, color: '#7B8794' },
];

export default function HomeScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [recentArticles, setRecentArticles] = useState<
    (ArticleRowType & { pack_name: string; viewed_at: number })[]
  >([]);
  const hasSeeded = useSettingsStore((s) => s.hasSeeded);
  const setHasSeeded = useSettingsStore((s) => s.setHasSeeded);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!hasSeeded && !seeding) {
      setSeeding(true);
      seedDatabase(db).then(() => {
        setHasSeeded(true);
        setSeeding(false);
      });
    }
  }, [hasSeeded, db, seeding, setHasSeeded]);

  useFocusEffect(
    useCallback(() => {
      getRecentArticles(db).then(setRecentArticles);
    }, [db])
  );

  const handleQuickAccess = (id: string) => {
    if (id === 'library') {
      router.push('/(tabs)/library');
    } else if (id === 'first-aid') {
      router.push({ pathname: '/(tabs)/search', params: { q: 'first aid' } });
    } else {
      router.push('/(tabs)/search');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/search')}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={18} color={colors.ink40} />
          <Text style={styles.searchPlaceholder}>Search downloaded packs...</Text>
        </TouchableOpacity>

        {/* Ask AI row */}
        <TouchableOpacity
          style={styles.askRow}
          onPress={() => router.push('/(tabs)/ask')}
          activeOpacity={0.7}
        >
          <View style={styles.askIcon}>
            <Ionicons name="sparkles" size={20} color={colors.purple} />
          </View>
          <View style={styles.askContent}>
            <Text style={styles.askTitle}>Ask AI a question</Text>
            <Text style={styles.askSubtitle}>Get answers from your downloaded packs</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.purple} />
        </TouchableOpacity>

        {/* Quick access grid */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.grid}>
          {QUICK_ACCESS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.tile}
              onPress={() => handleQuickAccess(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.tileIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.tileLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recently viewed */}
        {recentArticles.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            {recentArticles.map((article) => (
              <ArticleRow
                key={article.id}
                title={article.title}
                packName={article.pack_name}
                readTime={article.read_time}
                isCritical={article.is_critical === 1}
                onPress={() => router.push(`/article/${article.id}`)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink80,
    borderRadius: radius.element,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchPlaceholder: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink40,
    marginLeft: spacing.sm,
  },
  askRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.purple + '15',
    borderRadius: radius.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  askIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.icon,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  askContent: {
    flex: 1,
  },
  askTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.white,
  },
  askSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink20,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tile: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.ink80,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  tileIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tileLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.ink10,
    textAlign: 'center',
  },
});
