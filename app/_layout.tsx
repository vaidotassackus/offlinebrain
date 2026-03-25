import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Syne_700Bold, Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { DMSans_300Light, DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBanner } from '../components/ui/StatusBanner';
import { runMigrations } from '../lib/db/migrations';
import { subscribeToNetworkChanges } from '../lib/utils/network';
import { colors } from '../constants/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Syne_700Bold,
    Syne_800ExtraBold,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  useEffect(() => {
    const unsubscribe = subscribeToNetworkChanges();
    return unsubscribe;
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <SQLiteProvider databaseName="offlinebrain.db" onInit={runMigrations}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <StatusBanner />
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.ink },
              animation: 'slide_from_right',
            }}
          />
        </View>
      </View>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ink,
  },
  container: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  content: {
    flex: 1,
  },
});
