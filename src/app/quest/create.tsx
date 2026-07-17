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
import { scheduleQuestReminder } from '@/data/notifications/scheduler';
import { odysseyRepository } from '@/data/repositories/odysseyRepository';
import { spacing } from '@/design/tokens';
import { Priority, ProofRule, QuestKind } from '@/domain/types';
import { useBoss, useRefreshOdyssey } from '@/features/queries';

export default function CreateQuestScreen() {
  const router = useRouter();
  const refresh = useRefreshOdyssey();
  const boss = useBoss();
  const [kind, setKind] = useState<QuestKind>('task');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('18:30');
  const [deadlineTime, setDeadlineTime] = useState('20:00');
  const [priority, setPriority] = useState<Priority>('medium');
  const [target, setTarget] = useState('30');
  const [minimum, setMinimum] = useState('10');
  const [proofRule, setProofRule] = useState<ProofRule>('optional');
  const [weekdays, setWeekdays] = useState([1, 2, 3, 4, 5]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim())
      return Alert.alert('Name the Quest', 'Add a short, concrete title.');
    if (startTime && deadlineTime && deadlineTime < startTime)
      return Alert.alert(
        'Check the time',
        'The deadline cannot be earlier than the start.',
      );
    const targetValue = target ? Number(target) : undefined;
    const minimumValue = minimum ? Number(minimum) : undefined;
    if (minimumValue && targetValue && minimumValue > targetValue)
      return Alert.alert(
        'Check the minimum win',
        'It must be no higher than the target.',
      );
    if (priority === 'critical') {
      const critical = await new Promise<boolean>((resolve) =>
        Alert.alert(
          'Keep Critical rare',
          'Critical means time-sensitive and materially consequential today. Save it as Critical?',
          [
            {
              text: 'Choose another',
              onPress: () => resolve(false),
              style: 'cancel',
            },
            { text: 'Save Critical', onPress: () => resolve(true) },
          ],
        ),
      );
      if (!critical) return;
    }
    setSaving(true);
    try {
      const occurrenceId = await odysseyRepository.createQuest({
        bossId: boss.data?.id,
        kind,
        title,
        localDate: date,
        startTime: startTime || undefined,
        deadlineTime: deadlineTime || undefined,
        priority,
        targetIntensity: targetValue,
        minimumWin: minimumValue,
        unit: targetValue ? 'minutes' : undefined,
        proofRule,
        notes,
        recurrence:
          kind === 'habit' ? `weekdays:${weekdays.join(',')}` : undefined,
      });
      const preferences = await odysseyRepository.getSettings();
      const occurrence = await odysseyRepository.getOccurrence(occurrenceId);
      if (occurrence && preferences?.notifications_enabled)
        await scheduleQuestReminder(
          occurrence,
          Boolean(preferences.privacy_shield),
        );
      await refresh();
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScenicScreen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="label">CHART THE ROUTE</AppText>
          <AppText variant="h1">Create a Quest</AppText>
        </View>
        <Button label="Close" variant="quiet" onPress={() => router.back()} />
      </View>
      <Card style={styles.form}>
        <View style={styles.row}>
          <Chip
            label="Habit"
            selected={kind === 'habit'}
            onPress={() => setKind('habit')}
          />
          <Chip
            label="Task"
            selected={kind === 'task'}
            onPress={() => setKind('task')}
          />
        </View>
        {kind === 'habit' && (
          <>
            <AppText variant="label">REPEAT ON</AppText>
            <View style={styles.row}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => (
                <Chip
                  key={`${label}-${index}`}
                  label={label}
                  selected={weekdays.includes(index)}
                  onPress={() =>
                    setWeekdays((current) =>
                      current.includes(index)
                        ? current.filter((day) => day !== index)
                        : [...current, index].sort(),
                    )
                  }
                />
              ))}
            </View>
          </>
        )}
        <FormField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Study mathematics"
        />
        <FormField
          label="Date · YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          autoCapitalize="none"
        />
        <View style={styles.two}>
          <View style={styles.flex}>
            <FormField
              label="Start · HH:MM"
              value={startTime}
              onChangeText={setStartTime}
            />
          </View>
          <View style={styles.flex}>
            <FormField
              label="Deadline · HH:MM"
              value={deadlineTime}
              onChangeText={setDeadlineTime}
            />
          </View>
        </View>
        <AppText variant="label">PRIORITY</AppText>
        <View style={styles.row}>
          {(['low', 'medium', 'high', 'critical'] as Priority[]).map((item) => (
            <Chip
              key={item}
              label={item}
              selected={priority === item}
              onPress={() => setPriority(item)}
            />
          ))}
        </View>
        <View style={styles.two}>
          <View style={styles.flex}>
            <FormField
              label="Target minutes"
              keyboardType="decimal-pad"
              value={target}
              onChangeText={setTarget}
            />
          </View>
          <View style={styles.flex}>
            <FormField
              label="Minimum win"
              keyboardType="decimal-pad"
              value={minimum}
              onChangeText={setMinimum}
            />
          </View>
        </View>
        <AppText variant="label">PHOTO PROOF</AppText>
        <View style={styles.row}>
          {(['not_needed', 'optional', 'required'] as ProofRule[]).map(
            (item) => (
              <Chip
                key={item}
                label={item.replace('_', ' ')}
                selected={proofRule === item}
                onPress={() => setProofRule(item)}
              />
            ),
          )}
        </View>
        <FormField
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          maxLength={1000}
        />
      </Card>
      <Button label="Save Quest" loading={saving} onPress={save} />
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  form: { gap: spacing.lg },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  two: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
});
