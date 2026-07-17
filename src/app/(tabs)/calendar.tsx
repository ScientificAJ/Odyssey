import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { QuestCard } from '@/components/QuestCard';
import { ScenicScreen } from '@/components/ScenicScreen';
import { colors, radii, spacing } from '@/design/tokens';
import { useOccurrences } from '@/features/queries';

type ViewMode = 'day' | 'week' | 'month';

export default function CalendarScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<ViewMode>('month');
  const [selected, setSelected] = useState(new Date());
  const interval = useMemo(
    () =>
      mode === 'day'
        ? { start: selected, end: selected }
        : mode === 'week'
          ? { start: startOfWeek(selected), end: endOfWeek(selected) }
          : {
              start: startOfWeek(startOfMonth(selected)),
              end: endOfWeek(endOfMonth(selected)),
            },
    [mode, selected],
  );
  const occurrences = useOccurrences(
    format(interval.start, 'yyyy-MM-dd'),
    format(interval.end, 'yyyy-MM-dd'),
  );
  const selectedDate = format(selected, 'yyyy-MM-dd');
  const agenda = (occurrences.data ?? []).filter(
    (item) => item.localDate === selectedDate,
  );
  const days = eachDayOfInterval(interval);
  const move = (direction: number) =>
    setSelected((date) =>
      mode === 'month'
        ? addMonths(date, direction)
        : addDays(date, direction * (mode === 'week' ? 7 : 1)),
    );
  return (
    <ScenicScreen>
      <View style={styles.header}>
        <View>
          <AppText variant="label">FIRST-PARTY CALENDAR</AppText>
          <AppText variant="h1">{format(selected, 'MMMM yyyy')}</AppText>
        </View>
        <Button
          label="Create"
          variant="secondary"
          onPress={() => router.push('/quest/create')}
        />
      </View>
      <View style={styles.row}>
        {(['day', 'week', 'month'] as ViewMode[]).map((item) => (
          <Chip
            key={item}
            label={item[0].toUpperCase() + item.slice(1)}
            selected={mode === item}
            onPress={() => setMode(item)}
          />
        ))}
      </View>
      <Card style={styles.calendar}>
        <View style={styles.navigator}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous period"
            onPress={() => move(-1)}
            style={styles.icon}
          >
            <ChevronLeft color={colors.ink} />
          </Pressable>
          <AppText variant="h3">
            {mode === 'day'
              ? format(selected, 'EEEE, MMMM d')
              : mode === 'week'
                ? `Week of ${format(interval.start, 'MMM d')}`
                : format(selected, 'MMMM yyyy')}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next period"
            onPress={() => move(1)}
            style={styles.icon}
          >
            <ChevronRight color={colors.ink} />
          </Pressable>
        </View>
        {mode !== 'day' && (
          <View style={styles.weekLabels}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => (
              <AppText
                key={`${label}-${index}`}
                variant="label"
                style={styles.weekLabel}
              >
                {label}
              </AppText>
            ))}
          </View>
        )}
        <View style={mode === 'day' ? undefined : styles.grid}>
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const items = (occurrences.data ?? []).filter(
              (item) => item.localDate === key,
            );
            const active = key === selectedDate;
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={`${format(day, 'EEEE, MMMM d')}, ${items.length} Quests`}
                accessibilityState={{ selected: active }}
                onPress={() => setSelected(day)}
                style={[
                  styles.day,
                  active && styles.dayActive,
                  mode === 'day' && styles.dayWide,
                ]}
              >
                <AppText variant="small" style={active && styles.dayText}>
                  {format(day, mode === 'day' ? 'EEEE, MMMM d' : 'd')}
                </AppText>
                <View style={styles.dots}>
                  {items.slice(0, 3).map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.dot,
                        stateDot[item.state] ?? styles.dotScheduled,
                      ]}
                    />
                  ))}
                </View>
                {mode === 'day' && (
                  <AppText variant="small">{items.length} scheduled</AppText>
                )}
              </Pressable>
            );
          })}
        </View>
      </Card>
      <View style={styles.section}>
        <AppText variant="h2">{format(selected, 'EEEE, MMMM d')}</AppText>
        {agenda.length ? (
          agenda.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onPress={() => router.push(`/quest/${quest.id}`)}
            />
          ))
        ) : (
          <Card>
            <AppText variant="h3">Open water</AppText>
            <AppText>
              No Quests are scheduled. Rest is part of the route.
            </AppText>
          </Card>
        )}
      </View>
      <AppText variant="small">
        Move a Quest from its detail screen. This visible action is the
        accessible alternative to drag scheduling.
      </AppText>
    </ScenicScreen>
  );
}

const stateDot: Record<string, object> = {
  complete: { backgroundColor: colors.lime },
  partial: { backgroundColor: colors.mango },
  missed: { backgroundColor: colors.danger },
  in_progress: { backgroundColor: colors.coral },
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  calendar: { gap: spacing.md },
  navigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekLabels: { flexDirection: 'row' },
  weekLabel: { width: '14.285%', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  day: {
    width: '14.285%',
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    gap: 3,
  },
  dayWide: { width: '100%', minHeight: 80 },
  dayActive: { backgroundColor: colors.coral },
  dayText: { fontFamily: 'Manrope_700Bold' },
  dots: { flexDirection: 'row', gap: 2 },
  dot: { width: 5, height: 5, borderRadius: radii.pill },
  dotScheduled: { backgroundColor: colors.blue },
  section: { gap: spacing.md },
});
