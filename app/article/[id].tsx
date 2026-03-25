import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { colors, fonts, spacing, radius } from '../../constants/theme';
import {
  getArticleById,
  recordArticleView,
  type ArticleRow,
} from '../../lib/db/articles';

interface Section {
  title: string;
  content: string;
}

function parseArticleSections(content: string): Section[] {
  const parts = content.split(/^## /m);
  const sections: Section[] = [];
  for (const part of parts) {
    if (!part.trim()) continue;
    const newlineIndex = part.indexOf('\n');
    if (newlineIndex === -1) {
      sections.push({ title: '', content: part.trim() });
    } else {
      const title = part.substring(0, newlineIndex).trim();
      const body = part.substring(newlineIndex + 1).trim();
      sections.push({ title, content: body });
    }
  }
  return sections;
}

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const [article, setArticle] = useState<(ArticleRow & { pack_name: string }) | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (!id) return;
    getArticleById(db, id).then((a) => {
      if (a) {
        setArticle(a);
        setSections(parseArticleSections(a.content));
        recordArticleView(db, id);
      }
    });
  }, [id, db]);

  if (!article) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const tags: string[] = article.tags ? JSON.parse(article.tags) : [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Back button + breadcrumb */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.breadcrumb}>{article.pack_name}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{article.title}</Text>

        {/* Badges */}
        <View style={styles.badges}>
          {article.is_critical === 1 && (
            <Badge label="Life-Critical" variant="critical" style={styles.badge} />
          )}
          {article.read_time != null && (
            <Badge label={`${article.read_time} min`} variant="default" style={styles.badge} />
          )}
        </View>

        {/* Table of contents */}
        {sections.filter((s) => s.title).length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toc}>
            {sections
              .filter((s) => s.title)
              .map((s, i) => (
                <View key={i} style={styles.tocItem}>
                  <Text style={styles.tocText}>{s.title}</Text>
                </View>
              ))}
          </ScrollView>
        )}

        {/* Content */}
        {sections.map((section, i) => (
          <View key={i} style={styles.section}>
            {section.title ? (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            ) : null}
            <Text style={styles.body}>{section.content}</Text>
          </View>
        ))}

        {/* Tags */}
        {tags.length > 0 && (
          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <Badge key={tag} label={tag} variant="default" style={styles.tag} />
            ))}
          </View>
        )}

        {/* Ask AI button */}
        <Button
          title="Ask AI about this"
          variant="ghost"
          disabled
          onPress={() =>
            Alert.alert('Coming Soon', 'AI features will be available in the next update.')
          }
          style={styles.askButton}
        />
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
    paddingBottom: spacing['2xl'],
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink40,
  },
  nav: {
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
  breadcrumb: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink40,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.white,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  badge: {
    marginRight: spacing.sm,
  },
  toc: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  tocItem: {
    backgroundColor: colors.ink80,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  tocText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.ink10,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 19,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink10,
    lineHeight: 27,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  tag: {
    marginBottom: 0,
  },
  askButton: {
    marginHorizontal: spacing.md,
  },
});
