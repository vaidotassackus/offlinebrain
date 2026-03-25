import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../constants/theme';

export default function AskScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ask AI</Text>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name="sparkles" size={24} color={colors.purple} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>AI coming in the next update</Text>
            <Text style={styles.bannerText}>
              For now, use Search to find answers in your downloaded packs.
            </Text>
          </View>
        </View>

        {/* Mock chat UI */}
        <View style={styles.chatArea}>
          <View style={styles.botBubble}>
            <Text style={styles.botText}>
              Hi! I&apos;m your offline AI assistant. Soon I&apos;ll be able to answer questions
              from all your downloaded knowledge packs — even without internet.
            </Text>
          </View>

          <View style={styles.botBubble}>
            <Text style={styles.botText}>
              In the meantime, try the Search tab to find articles across your packs.
            </Text>
          </View>
        </View>

        {/* Disabled input bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputField}>
            <Text style={styles.inputPlaceholder}>Ask anything...</Text>
          </View>
          <View style={styles.sendButton}>
            <Ionicons name="arrow-up" size={20} color={colors.ink40} />
          </View>
        </View>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.purple + '15',
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
  chatArea: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  botBubble: {
    backgroundColor: colors.ink80,
    borderRadius: radius.card,
    borderTopLeftRadius: 4,
    padding: spacing.md,
    marginBottom: spacing.sm,
    maxWidth: '85%',
  },
  botText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink10,
    lineHeight: 22,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.ink60,
  },
  inputField: {
    flex: 1,
    backgroundColor: colors.ink80,
    borderRadius: radius.element,
    paddingHorizontal: spacing.md,
    height: 44,
    justifyContent: 'center',
  },
  inputPlaceholder: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ink60,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
