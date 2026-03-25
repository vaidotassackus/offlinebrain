import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/ui/Input';
import { ArticleRow } from '../../components/ArticleRow';
import { searchArticles, type SearchResult } from '../../lib/db/articles';
import { colors, fonts, spacing } from '../../constants/theme';

export default function SearchScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    async (text: string) => {
      setQuery(text);
      if (text.trim().length === 0) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setHasSearched(true);
      const found = await searchArticles(db, text);
      setResults(found);
    },
    [db]
  );

  React.useEffect(() => {
    if (params.q) {
      handleSearch(params.q);
    }
  }, [params.q, handleSearch]);

  return (
    <SafeAreaView style={styles.safe}>
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
      </View>
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
});
