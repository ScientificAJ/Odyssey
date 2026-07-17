import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { FormField } from '@/components/FormField';
import { ScenicScreen } from '@/components/ScenicScreen';
import { proofStore } from '@/data/media/proofStore';
import { odysseyRepository } from '@/data/repositories/odysseyRepository';
import { colors, radii, spacing } from '@/design/tokens';
import { resolveOutcome } from '@/domain/policies/quests';
import { useRefreshOdyssey } from '@/features/queries';

export default function LogQuestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const refresh = useRefreshOdyssey();
  const quest = useQuery({
    queryKey: ['occurrence', id],
    queryFn: () => odysseyRepository.getOccurrence(id),
  });
  const [actual, setActual] = useState('');
  const [note, setNote] = useState('');
  const [choice, setChoice] = useState<'effort' | 'skipped'>('effort');
  const [proof, setProof] = useState<{
    id: string;
    thumbnailUri: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const item = quest.data;
  if (!item)
    return (
      <ScenicScreen>
        <AppText>Loading Quest…</AppText>
      </ScenicScreen>
    );
  const occurrence = item;
  const actualValue = actual ? Number(actual) : null;
  const outcome =
    choice === 'skipped'
      ? 'skipped'
      : resolveOutcome(
          item.targetIntensity,
          actualValue,
          item.targetIntensity == null,
        );

  async function addProof(source: 'camera' | 'library') {
    try {
      const uri = await proofStore.pick(source);
      if (uri)
        setProof(
          await proofStore.save(uri, `Private proof for ${occurrence.title}`),
        );
    } catch (error) {
      Alert.alert(
        'Proof was not saved',
        error instanceof Error ? error.message : 'Try again.',
      );
    }
  }
  async function save() {
    if (
      occurrence.targetIntensity &&
      choice === 'effort' &&
      (!actualValue || actualValue < 0)
    )
      return Alert.alert(
        'Record the effort',
        'Enter an amount above zero, or choose Skip.',
      );
    if (occurrence.proofRule === 'required' && choice === 'effort' && !proof)
      return Alert.alert(
        'Proof is required',
        'Add a private photo, or choose Skip.',
      );
    setSaving(true);
    try {
      await odysseyRepository.completeQuest(occurrence.id, {
        actualIntensity: actualValue,
        outcome,
        note,
        proofId: proof?.id,
      });
      await refresh();
      router.dismissAll();
    } catch (error) {
      Alert.alert(
        'Could not save yet',
        error instanceof Error
          ? error.message
          : 'Your entries remain here. Try again.',
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <ScenicScreen>
      <View style={styles.header}>
        <View>
          <AppText variant="label">RECORD REALITY</AppText>
          <AppText variant="h1">Log outcome</AppText>
        </View>
        <Button label="Close" variant="quiet" onPress={() => router.back()} />
      </View>
      <Card style={styles.form}>
        <AppText variant="h2">{item.title}</AppText>
        <View style={styles.row}>
          <Chip
            label="Record effort"
            selected={choice === 'effort'}
            onPress={() => setChoice('effort')}
          />
          <Chip
            label="Skip honestly"
            selected={choice === 'skipped'}
            onPress={() => setChoice('skipped')}
          />
        </View>
        {choice === 'effort' && item.targetIntensity && (
          <FormField
            label={`Actual ${item.unit} · target ${item.targetIntensity}`}
            value={actual}
            onChangeText={setActual}
            keyboardType="decimal-pad"
          />
        )}
        <Card
          style={[
            styles.outcome,
            outcome === 'complete' ? styles.complete : styles.partial,
          ]}
        >
          <AppText variant="h3">
            {outcome === 'complete'
              ? 'Complete'
              : outcome === 'partial'
                ? `Partial · ${actualValue ?? 0} of ${item.targetIntensity}`
                : 'Skipped'}
          </AppText>
          <AppText>
            {outcome === 'partial'
              ? 'Showing up counts for consistency. XP and intensity reflect the actual effort.'
              : outcome === 'skipped'
                ? 'No guilt. This records the day honestly.'
                : 'The planned target was met.'}
          </AppText>
        </Card>
        {item.proofRule !== 'not_needed' && (
          <>
            <AppText variant="label">
              PRIVATE PHOTO · {item.proofRule.toUpperCase()}
            </AppText>
            <View style={styles.row}>
              <Button
                label="Camera"
                variant="secondary"
                icon={<Camera size={18} color={colors.ink} />}
                onPress={() => addProof('camera')}
              />
              <Button
                label="Photo library"
                variant="secondary"
                icon={<ImageIcon size={18} color={colors.ink} />}
                onPress={() => addProof('library')}
              />
            </View>
            {proof && (
              <Image
                source={{ uri: proof.thumbnailUri }}
                style={styles.preview}
                accessibilityLabel={`Private proof preview for ${item.title}`}
              />
            )}
          </>
        )}
        <FormField
          label="Reflection note (optional)"
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={500}
        />
      </Card>
      <Button label="Save durable outcome" loading={saving} onPress={save} />
      <AppText variant="small">
        Success appears only after the local file and database write finish.
      </AppText>
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  form: { gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  outcome: { gap: spacing.xs },
  complete: { backgroundColor: '#F4FFE8', borderColor: colors.lime },
  partial: { backgroundColor: '#FFF7E8', borderColor: colors.mango },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radii.compact,
    backgroundColor: colors.sand,
  },
});
