import { useRouter } from 'expo-router';
import { ArrowDown, ArrowUp, Check, Circle } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormField } from '@/components/FormField';
import { ScenicScreen } from '@/components/ScenicScreen';
import { odysseyRepository } from '@/data/repositories/odysseyRepository';
import { colors, radii, spacing } from '@/design/tokens';
import { momentumLabel } from '@/domain/policies/progress';
import {
  useBoss,
  useMilestones,
  useProgress,
  useRefreshOdyssey,
  useToggleMilestone,
} from '@/features/queries';

export default function OdysseyScreen() {
  const router = useRouter();
  const boss = useBoss();
  const milestones = useMilestones();
  const progress = useProgress();
  const toggle = useToggleMilestone();
  const refresh = useRefreshOdyssey();
  const [newMilestone, setNewMilestone] = useState('');
  const metrics = progress.data ?? {
    consistency: 0,
    intensity: null,
    momentum: 0,
    xp: 0,
    showedUp: 0,
    due: 0,
  };
  const completed =
    milestones.data?.filter((item) => item.status === 'complete').length ?? 0;
  const total = milestones.data?.length ?? 0;
  async function move(id: string, direction: -1 | 1) {
    await odysseyRepository.moveMilestone(id, direction);
    await refresh();
  }
  async function addMilestone() {
    if (newMilestone.trim().length < 3)
      return Alert.alert('Name the milestone', 'Use at least 3 characters.');
    await odysseyRepository.addMilestone(newMilestone);
    setNewMilestone('');
    await refresh();
  }
  return (
    <ScenicScreen>
      <AppText variant="label">YOUR VOYAGE</AppText>
      <AppText variant="display">
        {boss.data?.name ?? 'Chart your goal'}
      </AppText>
      {boss.data?.motivation && <AppText>{boss.data.motivation}</AppText>}
      <Card style={styles.hero}>
        <View>
          <AppText variant="small">WEEKLY MOMENTUM</AppText>
          <AppText variant="metric">{Math.round(metrics.momentum)}%</AppText>
          <AppText>{momentumLabel(metrics.momentum)}</AppText>
        </View>
        <View style={styles.tide}>
          <View
            style={[
              styles.tideFill,
              { width: `${Math.min(metrics.momentum, 100)}%` },
            ]}
          />
        </View>
      </Card>
      <View style={styles.metrics}>
        <Card style={styles.metric}>
          <AppText variant="metric">{Math.round(metrics.consistency)}%</AppText>
          <AppText variant="small">Consistency</AppText>
          <AppText variant="small">
            {metrics.showedUp} of {metrics.due} due
          </AppText>
        </Card>
        <Card style={styles.metric}>
          <AppText variant="metric">
            {metrics.intensity == null
              ? '—'
              : `${Math.round(metrics.intensity)}%`}
          </AppText>
          <AppText variant="small">Intensity</AppText>
          <AppText variant="small">Actual vs target</AppText>
        </Card>
        <Card style={styles.metric}>
          <AppText variant="metric">{metrics.xp}</AppText>
          <AppText variant="small">XP</AppText>
          <AppText variant="small">Recognition only</AppText>
        </Card>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <AppText variant="h2">Milestones</AppText>
          <AppText variant="small">
            {completed} of {total}
          </AppText>
        </View>
        {(milestones.data ?? []).map((milestone) => (
          <Card key={milestone.id} style={styles.milestone}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: milestone.status === 'complete' }}
              accessibilityLabel={`${milestone.name}, ${milestone.status.replace('_', ' ')}`}
              onPress={() =>
                Alert.alert(
                  milestone.status === 'complete'
                    ? 'Reopen milestone?'
                    : 'Complete this outcome?',
                  'Milestones represent real outcomes and are always confirmed manually.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Confirm',
                      onPress: () => toggle.mutate(milestone.id),
                    },
                  ],
                )
              }
              style={styles.milestoneMain}
            >
              {milestone.status === 'complete' ? (
                <Check color={colors.ink} />
              ) : (
                <Circle color={colors.muted} />
              )}
              <View style={{ flex: 1 }}>
                <AppText variant="h3">{milestone.name}</AppText>
                <AppText variant="small">
                  {milestone.status.replace('_', ' ')}
                </AppText>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Move ${milestone.name} up`}
              onPress={() => move(milestone.id, -1)}
              style={styles.moveButton}
            >
              <ArrowUp color={colors.muted} size={18} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Move ${milestone.name} down`}
              onPress={() => move(milestone.id, 1)}
              style={styles.moveButton}
            >
              <ArrowDown color={colors.muted} size={18} />
            </Pressable>
          </Card>
        ))}
        {!total && (
          <Card>
            <AppText variant="h3">No milestones yet</AppText>
            <AppText>
              You can still confirm the real-world outcome directly.
            </AppText>
          </Card>
        )}
        <Card style={styles.addMilestone}>
          <FormField
            label="Add milestone"
            placeholder="A concrete outcome"
            value={newMilestone}
            onChangeText={setNewMilestone}
            maxLength={80}
          />
          <Button
            label="Add milestone"
            variant="secondary"
            onPress={addMilestone}
          />
        </Card>
      </View>
      {completed === total && (
        <Card style={styles.victory}>
          <AppText variant="h2">The horizon is within reach.</AppText>
          <AppText>
            {total
              ? 'Every milestone is complete.'
              : 'No milestones were required.'}{' '}
            Review the real outcome before defeating the Final Boss.
          </AppText>
          <Button
            label="Review Voyage"
            onPress={() => router.push('/victory')}
          />
        </Card>
      )}
      <Button
        label="How progress works"
        variant="secondary"
        onPress={() =>
          Alert.alert(
            'Transparent progress',
            'Consistency = showed up ÷ due. Intensity = average capped actual ÷ target. Momentum = 60% consistency + 40% intensity. XP is cosmetic and never completes your goal.',
          )
        }
      />
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.lg },
  tide: {
    height: 12,
    backgroundColor: colors.line,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  tideFill: {
    height: '100%',
    backgroundColor: colors.aqua,
    borderRadius: radii.pill,
  },
  metrics: { flexDirection: 'row', gap: spacing.sm },
  metric: { flex: 1, paddingHorizontal: spacing.md },
  section: { gap: spacing.md },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestone: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center' },
  milestoneMain: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    minHeight: 44,
  },
  moveButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMilestone: { gap: spacing.md },
  victory: {
    gap: spacing.lg,
    backgroundColor: '#F4FFE8',
    borderColor: colors.lime,
  },
});
