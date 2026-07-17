import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { FormField } from '@/components/FormField';
import { ScenicScreen } from '@/components/ScenicScreen';
import { odysseyRepository } from '@/data/repositories/odysseyRepository';
import { spacing } from '@/design/tokens';
import { useOccurrences, useRefreshOdyssey } from '@/features/queries';

export default function EndDayScreen() {
  const router = useRouter();
  const date = format(new Date(), 'yyyy-MM-dd');
  const occurrences = useOccurrences(date);
  const refresh = useRefreshOdyssey();
  const [reflection, setReflection] = useState('');
  const [realistic, setRealistic] = useState(true);
  const [saving, setSaving] = useState(false);
  const counts = (occurrences.data ?? []).reduce<Record<string, number>>(
    (result, item) => ({
      ...result,
      [item.state]: (result[item.state] ?? 0) + 1,
    }),
    {},
  );
  const unresolved =
    (counts.scheduled ?? 0) + (counts.in_progress ?? 0) + (counts.overdue ?? 0);
  async function save() {
    if (unresolved) {
      const confirmed = await new Promise<boolean>((resolve) =>
        Alert.alert(
          'Leave unresolved Quests as missed?',
          `${unresolved} unresolved ${unresolved === 1 ? 'Quest' : 'Quests'} will be recorded as missed—not completed.`,
          [
            { text: 'Go back', onPress: () => resolve(false), style: 'cancel' },
            { text: 'Record honestly', onPress: () => resolve(true) },
          ],
        ),
      );
      if (!confirmed) return;
    }
    setSaving(true);
    try {
      await odysseyRepository.endDay(date, reflection, realistic);
      await refresh();
      router.back();
    } finally {
      setSaving(false);
    }
  }
  return (
    <ScenicScreen>
      <View style={styles.header}>
        <View>
          <AppText variant="label">SUNSET CLOSE</AppText>
          <AppText variant="h1">End the day honestly</AppText>
        </View>
        <Button label="Close" variant="quiet" onPress={() => router.back()} />
      </View>
      <View style={styles.summary}>
        {['complete', 'partial', 'rescheduled', 'skipped', 'missed'].map(
          (state) => (
            <Card key={state} style={styles.count}>
              <AppText variant="metric">{counts[state] ?? 0}</AppText>
              <AppText variant="small">{state}</AppText>
            </Card>
          ),
        )}
      </View>
      {!!unresolved && (
        <Card style={styles.unresolved}>
          <AppText variant="h3">{unresolved} unresolved</AppText>
          <AppText>
            They can be rescheduled or skipped from their Quest screen. If you
            close now, they become Missed without shame or fake progress.
          </AppText>
        </Card>
      )}
      <Card style={styles.form}>
        <FormField
          label="What made today easier or harder? (optional)"
          value={reflection}
          onChangeText={setReflection}
          multiline
          maxLength={500}
        />
        <AppText variant="label">
          DOES {"TOMORROW'S"} LOAD LOOK REALISTIC?
        </AppText>
        <View style={styles.row}>
          <Chip
            label="Yes"
            selected={realistic}
            onPress={() => setRealistic(true)}
          />
          <Chip
            label="Needs adjustment"
            selected={!realistic}
            onPress={() => setRealistic(false)}
          />
        </View>
      </Card>
      <Button label="Save and close the day" loading={saving} onPress={save} />
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  count: { minWidth: 92, flex: 1, paddingHorizontal: spacing.md },
  unresolved: { gap: spacing.sm, backgroundColor: '#FFF7E8' },
  form: { gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.sm },
});
