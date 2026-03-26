import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/ui/Input';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { ArticleRow } from '../../components/ArticleRow';
import { searchArticles, type SearchResult } from '../../lib/db/articles';
import { colors, fonts, spacing } from '../../constants/theme';

const SEARCH_MODES = [
  { label: 'Keyword', value: 'keyword' },
  { label: 'Semantic', value: 'semantic' },
];

export default function SearchScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMode, setSearchMode] = useState<'keyword' | 'semantic'>('keyword');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (text: string) => {
      setQuery(text);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (text.trim().length === 0) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        setHasSearched(true);
        const found = await searchArticles(db, text);
        setResults(found);
      }, 300);
    },
    [db]
  );

  React.useEffect(() => {
    if (params.q) {
      handleSearch(params.q);
    }
  }, [params.q, handleSearch]);

  const isSemantic = searchMode === 'semantic';

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Input
            value={query}
            onChangeText={handleSearch}
            placeholder="Search your downloaded packs..."
            icon="search"
            autoFocus
          />
        </View>

        <View style={styles.segmentWrapper}>
          <SegmentedControl
            options={SEARCH_MODES}
            selected={searchMode}
            onChange={(v) => setSearchMode(v as 'keyword' | 'semantic')}
          />
        </View>

        {isSemantic ? (
          <View style={styles.emptyState}>
            <Ionicons name="sparkles-outline" size={48} color={colors.purple} />
            <Text style={styles.semanticTitle}>Semantic Search</Text>
            <Text style={styles.semanticText}>
              Find related content by meaning, not just keywords.{'\n'}Coming in a future update.
            </Text>
          </View>
        ) : (
          <>
            {!hasSearched && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={colors.ink40} />
                <Text style={styles.emptyText}>Search your downloaded packs</Text>
              </View>
            )}

            {hasSearched && results.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="alert-circle-outline" size={48} color={colors.ink40} />
                <Text style={styles.emptyText}>Nothing found. Try different words.</Text>
              </View>
            )}

            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ArticleRow
                  title={item.title}
                  packName={item.pack_name}
                  readTime={item.read_time}
                  isCritical={item.is_critical === 1}
                  onPress={() => router.push(`/article/${item.id}`)}
                />
              )}
            />
          </>
        )}
      </View>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.white,
  },
  inputWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  segmentWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.section,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink40,
    marginTop: spacing.md,
  },
  semanticTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    color: colors.white,
    marginTop: spacing.md,
  },
  semanticText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink40,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.xl,
  },
});
