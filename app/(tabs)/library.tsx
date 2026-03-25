import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import { PackCard } from '../../components/PackCard';
import { StorageMeter } from '../../components/StorageMeter';
import { colors, fonts, spacing } from '../../constants/theme';
import { getAllPacks, installPack, deletePack, mockInstallPack, getInstalledSize } from '../../lib/db/packs';
import { usePackStore, type Pack } from '../../lib/store/usePackStore';
import { seedPackArticles } from '../../lib/seed';

export default function LibraryScreen() {
  const db = useSQLiteContext();
  const packs = usePackStore((s) => s.packs);
  const setPacks = usePackStore((s) => s.setPacks);
  const updatePack = usePackStore((s) => s.updatePack);
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [usedBytes, setUsedBytes] = useState(0);

  const loadPacks = useCallback(async () => {
    const allPacks = await getAllPacks(db);
    setPacks(allPacks);
    const size = await getInstalledSize(db);
    setUsedBytes(size);
  }, [db, setPacks]);

  useFocusEffect(
    useCallback(() => {
      loadPacks();
    }, [loadPacks])
  );

  const handleInstall = async (pack: Pack) => {
    setInstallingId(pack.id);
    setProgress(0);
    await mockInstallPack(pack.id, (p) => setProgress(p));
    await installPack(db, pack.id);
    await seedPackArticles(db, pack.id);
    updatePack(pack.id, { isInstalled: true, installedAt: Date.now() });
    setInstallingId(null);
    const size = await getInstalledSize(db);
    setUsedBytes(size);
  };

  const handleDelete = (pack: Pack) => {
    if (pack.isRequired) return;
    Alert.alert(
      'Delete Pack',
      `Are you sure you want to delete "${pack.name}"? This will remove all its articles.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePack(db, pack.id);
            updatePack(pack.id, { isInstalled: false, installedAt: null });
            const size = await getInstalledSize(db);
            setUsedBytes(size);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Library</Text>
        </View>

        <StorageMeter usedBytes={usedBytes} />

        <View style={styles.packList}>
          {packs.map((pack) => (
            <PackCard
              key={pack.id}
              name={pack.name}
              description={pack.description}
              sizeBytes={pack.sizeBytes}
              isInstalled={pack.isInstalled}
              isRequired={pack.isRequired}
              installing={installingId === pack.id}
              progress={installingId === pack.id ? progress : 0}
              onInstall={() => handleInstall(pack)}
              onDelete={() => handleDelete(pack)}
            />
          ))}
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.white,
  },
  packList: {
    paddingHorizontal: spacing.md,
  },
});
