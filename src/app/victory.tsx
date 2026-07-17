import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormField } from '@/components/FormField';
import { ScenicScreen } from '@/components/ScenicScreen';
import { odysseyRepository } from '@/data/repositories/odysseyRepository';
import { colors, spacing } from '@/design/tokens';
import { useBoss, useProgress, useRefreshOdyssey } from '@/features/queries';

export default function VictoryScreen() {
  const router = useRouter();
  const boss = useBoss();
  const progress = useProgress();
  const refresh = useRefreshOdyssey();
  const [reflection, setReflection] = useState('');
  const [defeated, setDefeated] = useState(false);
  const [saving, setSaving] = useState(false);
  const metrics = progress.data;
  async function confirm() {
    const accepted = await new Promise<boolean>((resolve) =>
      Alert.alert(
        'Confirm the real outcome',
        'XP and app activity are not enough. Did you achieve this goal in the real world?',
        [
          { text: 'Not yet', onPress: () => resolve(false), style: 'cancel' },
          { text: 'Yes, it is complete', onPress: () => resolve(true) },
        ],
      ),
    );
    if (!accepted) return;
    setSaving(true);
    try {
      await odysseyRepository.defeatFinalBoss(reflection);
      await refresh();
      setDefeated(true);
    } catch (error) {
      Alert.alert(
        'The Voyage remains active',
        error instanceof Error
          ? error.message
          : 'Review the milestones and try again.',
      );
    } finally {
      setSaving(false);
    }
  }
  if (defeated)
    return (
      <ScenicScreen contentContainerStyle={styles.center}>
        <AppText variant="label">FINAL BOSS DEFEATED</AppText>
        <AppText variant="hero">You did the work.</AppText>
        <AppText variant="h2">The goal is complete.</AppText>
        <Card style={styles.victory}>
          <AppText>
            Your Voyage is now a read-only part of local history. The proof was
            the work—not the XP.
          </AppText>
        </Card>
        <Button
          label="Create the next Voyage"
          onPress={() => router.replace('/onboarding')}
        />
        <Button
          label="Return to history"
          variant="secondary"
          onPress={() => router.replace('/(tabs)/me')}
        />
      </ScenicScreen>
    );
  return (
    <ScenicScreen>
      <View style={styles.header}>
        <View>
          <AppText variant="label">REVIEW THE VOYAGE</AppText>
          <AppText variant="display">{boss.data?.name}</AppText>
        </View>
        <Button label="Close" variant="quiet" onPress={() => router.back()} />
      </View>
      <View style={styles.metrics}>
        <Card style={styles.metric}>
          <AppText variant="metric">
            {Math.round(metrics?.consistency ?? 0)}%
          </AppText>
          <AppText variant="small">Consistency</AppText>
        </Card>
        <Card style={styles.metric}>
          <AppText variant="metric">
            {metrics?.intensity == null
              ? '—'
              : `${Math.round(metrics.intensity)}%`}
          </AppText>
          <AppText variant="small">Intensity</AppText>
        </Card>
        <Card style={styles.metric}>
          <AppText variant="metric">{metrics?.xp ?? 0}</AppText>
          <AppText variant="small">XP earned</AppText>
        </Card>
      </View>
      <Card style={styles.form}>
        <AppText variant="h2">What changed because you completed this?</AppText>
        <FormField
          label="Final reflection (optional)"
          value={reflection}
          onChangeText={setReflection}
          multiline
          maxLength={1000}
        />
      </Card>
      <Button label="Confirm the outcome" loading={saving} onPress={confirm} />
      <AppText variant="small">
        Celebration never blocks the app. Reduced-motion users receive the same
        words and archived record without required animation.
      </AppText>
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: { justifyContent: 'center' },
  metrics: { flexDirection: 'row', gap: spacing.sm },
  metric: { flex: 1, paddingHorizontal: spacing.md },
  form: { gap: spacing.lg },
  victory: { backgroundColor: '#F4FFE8', borderColor: colors.lime },
});
