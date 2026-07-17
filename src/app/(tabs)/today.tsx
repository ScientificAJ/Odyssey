import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { QuestCard } from '@/components/QuestCard';
import { ScenicScreen } from '@/components/ScenicScreen';
import { colors, spacing } from '@/design/tokens';
import { sortTodayQuests } from '@/domain/policies/quests';
import { useBoss, useOccurrences } from '@/features/queries';

export default function TodayScreen() {
  const router = useRouter();
  const date = format(new Date(), 'yyyy-MM-dd');
  const occurrences = useOccurrences(date);
  const boss = useBoss();
  if (occurrences.isLoading)
    return (
      <ScenicScreen scroll={false}>
        <ActivityIndicator size="large" color={colors.coral} />
      </ScenicScreen>
    );
  const sorted = sortTodayQuests(occurrences.data ?? []);
  const open = sorted.filter(
    (quest) =>
      !['complete', 'partial', 'skipped', 'missed', 'rescheduled'].includes(
        quest.state,
      ),
  );
  const done = sorted.filter((quest) =>
    ['complete', 'partial', 'skipped', 'missed'].includes(quest.state),
  );
  const planned = sorted.reduce(
    (sum, quest) =>
      sum + (quest.unit === 'minutes' ? (quest.targetIntensity ?? 0) : 0),
    0,
  );
  return (
    <ScenicScreen>
      <View style={styles.heading}>
        <View style={{ flex: 1 }}>
          <AppText variant="label">
            {format(new Date(), 'EEEE · MMMM d').toUpperCase()}
          </AppText>
          <AppText variant="h1">Your horizon is clear.</AppText>
        </View>
        <Button
          label="Create"
          variant="secondary"
          icon={<Plus size={18} color={colors.ink} />}
          onPress={() => router.push('/quest/create')}
        />
      </View>
      <Card style={styles.cue}>
        <View>
          <AppText variant="small">FINAL BOSS</AppText>
          <AppText variant="h3">{boss.data?.name ?? 'Your main goal'}</AppText>
        </View>
        <AppText variant="metric">
          {planned}
          <AppText variant="small"> min planned</AppText>
        </AppText>
      </Card>
      {open[0] ? (
        <>
          <AppText variant="h2">Next meaningful Quest</AppText>
          <QuestCard
            hero
            quest={open[0]}
            onPress={() => router.push(`/quest/${open[0].id}`)}
          />
        </>
      ) : (
        <Card style={styles.empty}>
          <AppText variant="h2">
            {done.length ? 'You did the work.' : 'Rest is on the route today.'}
          </AppText>
          <AppText>
            {done.length
              ? 'Every Quest has an honest outcome. Take a breath, then close the day.'
              : 'There is nothing scheduled. Rest, or chart the next step when you are ready.'}
          </AppText>
          <Button
            label="Create a Quest"
            variant="secondary"
            onPress={() => router.push('/quest/create')}
          />
        </Card>
      )}
      {open.length > 1 && (
        <View style={styles.section}>
          <AppText variant="h2">Later</AppText>
          {open.slice(1).map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onPress={() => router.push(`/quest/${quest.id}`)}
            />
          ))}
        </View>
      )}
      {!!done.length && (
        <View style={styles.section}>
          <AppText variant="h2">Done and resolved</AppText>
          {done.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onPress={() => router.push(`/quest/${quest.id}`)}
            />
          ))}
        </View>
      )}
      {planned > 180 && (
        <Card style={styles.warning}>
          <AppText variant="h3">A full tide today</AppText>
          <AppText>
            {planned} minutes are planned. Keep the goal, but adjust the route
            if the load is not realistic.
          </AppText>
        </Card>
      )}
      {(new Date().getHours() >= 18 || open.length === 0) && (
        <Button
          label="End Day"
          variant="secondary"
          onPress={() => router.push('/end-day')}
        />
      )}
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(234,251,255,0.95)',
  },
  section: { gap: spacing.md },
  empty: { gap: spacing.lg },
  warning: {
    gap: spacing.sm,
    borderColor: colors.warning,
    backgroundColor: '#FFF7E8',
  },
});
