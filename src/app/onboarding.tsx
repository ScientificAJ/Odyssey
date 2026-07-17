import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import { z } from 'zod';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { FormField } from '@/components/FormField';
import { ScenicScreen } from '@/components/ScenicScreen';
import {
  requestReminderPermission,
  scheduleQuestReminder,
} from '@/data/notifications/scheduler';
import { odysseyRepository } from '@/data/repositories/odysseyRepository';
import { spacing } from '@/design/tokens';
import { Priority, ProofRule, QuestKind } from '@/domain/types';

const schema = z.object({
  bossName: z.string().trim().min(3, 'Use at least 3 characters.').max(80),
  motivation: z.string().max(280).optional(),
  milestone: z.string().max(80).optional(),
  questTitle: z.string().trim().min(1, 'Name your first quest.').max(100),
  target: z.string().regex(/^$|^\d+(\.\d+)?$/, 'Enter a positive number.'),
  minimumWin: z.string().regex(/^$|^\d+(\.\d+)?$/, 'Enter a positive number.'),
});
type Form = z.infer<typeof schema>;

export default function Onboarding() {
  const router = useRouter();
  const client = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      bossName: '',
      motivation: '',
      milestone: '',
      questTitle: '',
      target: '30',
      minimumWin: '10',
    },
  });
  const [kind, setKind] = useState<QuestKind>('habit');
  const [priority, setPriority] = useState<Priority>('high');
  const [proofRule, setProofRule] = useState<ProofRule>('optional');

  const submit = handleSubmit(async (values) => {
    const target = values.target === '' ? undefined : Number(values.target);
    const minimumWin =
      values.minimumWin === '' ? undefined : Number(values.minimumWin);
    if (target && minimumWin && minimumWin > target) {
      Alert.alert(
        'Check the minimum win',
        'It must be no higher than the target.',
      );
      return;
    }
    await odysseyRepository.setupVoyage({
      bossName: values.bossName,
      motivation: values.motivation,
      milestoneNames: values.milestone ? [values.milestone] : [],
      quest: {
        kind,
        title: values.questTitle,
        localDate: format(new Date(), 'yyyy-MM-dd'),
        startTime: '18:30',
        deadlineTime: '20:00',
        priority,
        targetIntensity: target,
        minimumWin,
        unit: target ? 'minutes' : undefined,
        proofRule,
        recurrence: kind === 'habit' ? 'daily' : undefined,
      },
    });
    await client.invalidateQueries();
    Alert.alert(
      'Your route is ready',
      'Odyssey can remind you before scheduled work. You can change this anytime.',
      [
        { text: 'Not now', onPress: () => router.replace('/(tabs)/today') },
        {
          text: 'Allow reminders',
          onPress: async () => {
            const granted = await requestReminderPermission();
            if (granted) {
              await odysseyRepository.updateSetting(
                'notifications_enabled',
                true,
              );
              const currentDate = format(new Date(), 'yyyy-MM-dd');
              const first = (
                await odysseyRepository.getOccurrences(currentDate, currentDate)
              )[0];
              if (first) await scheduleQuestReminder(first, true);
            }
            router.replace('/(tabs)/today');
          },
        },
      ],
    );
  });

  return (
    <ScenicScreen>
      <View style={styles.hero}>
        <AppText variant="label">WELCOME TO ODYSSEY</AppText>
        <AppText variant="display">One goal. A route you can trust.</AppText>
        <AppText>
          Plan the work, record what really happened, and keep proof private on
          this device.
        </AppText>
      </View>
      <Card style={styles.form}>
        <AppText variant="h2">Choose your Final Boss</AppText>
        <Controller
          control={control}
          name="bossName"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Main goal"
              placeholder="Pass the mathematics examination"
              value={value}
              onChangeText={onChange}
              error={errors.bossName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="motivation"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Why it matters (optional)"
              multiline
              maxLength={280}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="milestone"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="First milestone (optional)"
              placeholder="Finish the algebra syllabus"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </Card>
      <Card style={styles.form}>
        <AppText variant="h2">Schedule your first Quest</AppText>
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
        <Controller
          control={control}
          name="questTitle"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Quest title"
              placeholder="Study mathematics"
              value={value}
              onChangeText={onChange}
              error={errors.questTitle?.message}
            />
          )}
        />
        <View style={styles.row}>
          {(['medium', 'high', 'critical'] as Priority[]).map((item) => (
            <Chip
              key={item}
              label={item[0].toUpperCase() + item.slice(1)}
              selected={priority === item}
              onPress={() => setPriority(item)}
            />
          ))}
        </View>
        <Controller
          control={control}
          name="target"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Target minutes (optional)"
              keyboardType="decimal-pad"
              value={String(value ?? '')}
              onChangeText={onChange}
              error={errors.target?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="minimumWin"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Minimum win minutes (optional)"
              keyboardType="decimal-pad"
              value={String(value ?? '')}
              onChangeText={onChange}
              error={errors.minimumWin?.message}
            />
          )}
        />
        <AppText variant="label">PRIVATE PHOTO PROOF</AppText>
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
      </Card>
      <Button
        label="Start the voyage"
        loading={isSubmitting}
        onPress={submit}
      />
      <AppText variant="small">
        No account. No cloud. Your schedule and proof stay on this device.
      </AppText>
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.sm, paddingVertical: spacing.xxl },
  form: { gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
});
