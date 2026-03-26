import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RegionCard } from '../components/maps/RegionCard';
import { useMapStore } from '../lib/store/useMapStore';
import { colors, fonts, spacing, radius } from '../constants/theme';

export default function MapsScreen() {
  const router = useRouter();
  const regions = useMapStore((s) => s.regions);
  const updateRegion = useMapStore((s) => s.updateRegion);

  const handleDownload = (regionId: string) => {
    updateRegion(regionId, { downloadStatus: 'downloading' });
    // Mock download completes after 3s
    setTimeout(() => {
      updateRegion(regionId, {
        downloadStatus: 'downloaded',
        downloadedAt: Date.now(),
      });
    }, 3300);
  };

  return (
    <View style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Offline Maps</Text>
        </View>

        {/* Coming soon banner */}
        <View style={styles.banner}>
          <Ionicons name="map-outline" size={24} color={colors.brand} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Offline maps coming soon</Text>
            <Text style={styles.bannerText}>
              Download map regions for offline navigation with MapLibre and MBTiles. Full map
              rendering will be available in a future update.
            </Text>
          </View>
        </View>

        {/* Region list */}
        <Text style={styles.sectionTitle}>Available Regions</Text>
        <View style={styles.regionList}>
          {regions.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              onDownload={() => handleDownload(region.id)}
            />
          ))}
        </View>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.brand + '15',
    borderRadius: radius.card,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  bannerTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.white,
    marginBottom: 4,
  },
  bannerText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink20,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  regionList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
});
