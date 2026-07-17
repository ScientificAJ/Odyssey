import { Clock3, Flame, Repeat2, SquareCheckBig } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/design/tokens';
import { QuestOccurrence } from '@/domain/types';

import { AppText } from './AppText';
import { Card } from './Card';

export function QuestCard({
  quest,
  onPress,
  hero = false,
}: {
  quest: QuestOccurrence;
  onPress: () => void;
  hero?: boolean;
}) {
  const Icon = quest.kind === 'habit' ? Repeat2 : SquareCheckBig;
  const stateLabel = quest.state.replace('_', ' ');
  const a11y = `${quest.title}, ${quest.priority} priority, ${stateLabel}${quest.targetIntensity ? `, target ${quest.targetIntensity} ${quest.unit}` : ''}${quest.deadlineTime ? `, due ${quest.deadlineTime}` : ''}`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityHint="Opens quest details"
      onPress={onPress}
    >
      <Card style={[styles.card, hero && styles.hero]}>
        <View style={styles.top}>
          <View
            style={[
              styles.icon,
              { backgroundColor: priorityTint[quest.priority] },
            ]}
          >
            <Icon color={colors.ink} size={20} />
          </View>
          <View style={styles.title}>
            <AppText variant={hero ? 'h2' : 'h3'}>{quest.title}</AppText>
            <AppText variant="small" style={styles.meta}>
              {quest.priority.toUpperCase()} PRIORITY ·{' '}
              {stateLabel.toUpperCase()}
            </AppText>
          </View>
        </View>
        <View style={styles.details}>
          {quest.startTime && (
            <View style={styles.inline}>
              <Clock3 size={15} color={colors.muted} />
              <AppText variant="small">
                {quest.startTime}
                {quest.deadlineTime ? `–${quest.deadlineTime}` : ''}
              </AppText>
            </View>
          )}
          {quest.targetIntensity && (
            <View style={styles.inline}>
              <Flame size={15} color={colors.muted} />
              <AppText variant="small">
                {quest.targetIntensity} {quest.unit}
                {quest.minimumWin ? ` · ${quest.minimumWin} minimum win` : ''}
              </AppText>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const priorityTint = {
  low: colors.sky,
  medium: colors.sand,
  high: colors.sun,
  critical: colors.shell,
};
const styles = StyleSheet.create({
  card: { gap: spacing.md },
  hero: { borderColor: colors.coral, borderWidth: 2 },
  top: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, gap: 2 },
  meta: { color: colors.muted, fontFamily: 'Manrope_700Bold' },
  details: { gap: spacing.xs, paddingLeft: 54 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
