import { useQuery } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScenicScreen } from '@/components/ScenicScreen';
import { odysseyRepository } from '@/data/repositories/odysseyRepository';
import { colors, spacing } from '@/design/tokens';
import { useBeginQuest, useRefreshOdyssey } from '@/features/queries';

export default function QuestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const refresh = useRefreshOdyssey();
  const quest = useQuery({
    queryKey: ['occurrence', id],
    queryFn: () => odysseyRepository.getOccurrence(id),
  });
  const begin = useBeginQuest();
  const item = quest.data;
  if (!item)
    return (
      <ScenicScreen>
        <AppText variant="h1">Quest not found</AppText>
        <Button label="Close" onPress={() => router.back()} />
      </ScenicScreen>
    );
  const occurrence = item;
  const terminal = ['complete', 'partial', 'skipped', 'missed'].includes(
    item.state,
  );
  async function moveTomorrow() {
    await odysseyRepository.rescheduleQuest(
      occurrence.id,
      format(
        addDays(new Date(`${occurrence.localDate}T12:00:00`), 1),
        'yyyy-MM-dd',
      ),
      occurrence.startTime ?? undefined,
    );
    await refresh();
    router.back();
  }
  return (
    <ScenicScreen>
      <View style={styles.header}>
        <AppText variant="label">
          {item.kind.toUpperCase()} · {item.priority.toUpperCase()}
        </AppText>
        <Button label="Close" variant="quiet" onPress={() => router.back()} />
      </View>
      <AppText variant="display">{item.title}</AppText>
      <Card style={styles.card}>
        <AppText variant="h3">The plan</AppText>
        <AppText>
          {item.localDate}
          {item.startTime ? ` · ${item.startTime}` : ''}
          {item.deadlineTime ? ` to ${item.deadlineTime}` : ''}
        </AppText>
        <AppText>
          {item.targetIntensity
            ? `${item.targetIntensity} ${item.unit}`
            : 'Unmeasured Quest'}
          {item.minimumWin ? ` · ${item.minimumWin} minimum win` : ''}
        </AppText>
        <AppText>Proof: {item.proofRule.replace('_', ' ')}</AppText>
        {item.notes && <AppText>{item.notes}</AppText>}
      </Card>
      {item.state === 'in_progress' && (
        <Card style={styles.active}>
          <AppText variant="h2">In progress</AppText>
          <AppText>
            Record the real effort when you finish. Leaving this screen will not
            lose the start time.
          </AppText>
        </Card>
      )}
      {!terminal && (
        <View style={styles.actions}>
          {item.state !== 'in_progress' && (
            <Button
              label="Begin Quest"
              loading={begin.isPending}
              onPress={async () => {
                await begin.mutateAsync(item.id);
                await quest.refetch();
              }}
            />
          )}
          <Button
            label="Log outcome"
            variant="secondary"
            onPress={() => router.push(`/quest/log/${item.id}`)}
          />
          <Button
            label="Move to tomorrow"
            variant="quiet"
            onPress={() =>
              Alert.alert(
                'Move this occurrence?',
                'Its history stays intact and no completion is created.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Move', onPress: moveTomorrow },
                ],
              )
            }
          />
        </View>
      )}
      {terminal && (
        <Card style={styles.active}>
          <AppText variant="h2">
            {item.state === 'complete'
              ? 'Complete'
              : item.state === 'partial'
                ? 'You showed up'
                : 'Resolved honestly'}
          </AppText>
          <AppText>
            This occurrence is recorded as {item.state}. History remains
            available in your Journal.
          </AppText>
        </Card>
      )}
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: { gap: spacing.sm },
  active: {
    gap: spacing.sm,
    backgroundColor: '#F4FFE8',
    borderColor: colors.lime,
  },
  actions: { gap: spacing.md },
});
