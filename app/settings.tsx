import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../constants/theme';
import { useSettingsStore } from '../lib/store/useSettingsStore';

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

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'This will remove all your reading history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await db.runAsync('DELETE FROM history');
          Alert.alert('Done', 'Reading history cleared.');
        },
      },
    ]);
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
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* General */}
        <Text style={styles.sectionLabel}>General</Text>
        <View style={styles.section}>
          <SettingsRow icon="library-outline" label="Manage Packs" onPress={() => router.push('/(tabs)/library')} />
          <SettingsRow icon="time-outline" label="Clear Reading History" onPress={handleClearHistory} />
        </View>

        {/* Data */}
        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.section}>
          <SettingsRow icon="trash-outline" label="Reset All Data" onPress={handleResetData} danger />
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.section}>
          <SettingsRow icon="information-circle-outline" label="Version" value="1.0.0" />
          <SettingsRow icon="shield-checkmark-outline" label="Privacy" value="100% offline" />
        </View>
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
});
