import { Priority, ProgressMetrics, ProgressOccurrence } from '@/domain/types';

export const priorityXP: Record<Priority, number> = {
  low: 10,
  medium: 15,
  high: 25,
  critical: 40,
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

export function calculateProgress(
  items: ProgressOccurrence[],
): ProgressMetrics {
  const dueItems = items.filter(
    (item) => !['scheduled', 'in_progress', 'rescheduled'].includes(item.state),
  );
  const showedUp = dueItems.filter(
    (item) => item.state === 'complete' || item.state === 'partial',
  ).length;
  const consistency = dueItems.length ? (showedUp / dueItems.length) * 100 : 0;
  const measured = dueItems.filter(
    (item) => item.targetIntensity != null && item.targetIntensity > 0,
  );
  const intensity = measured.length
    ? (measured.reduce(
        (sum, item) =>
          sum +
          clamp((item.actualIntensity ?? 0) / (item.targetIntensity ?? 1)),
        0,
      ) /
        measured.length) *
      100
    : null;
  const momentum =
    intensity == null ? consistency : consistency * 0.6 + intensity * 0.4;
  const xp = items.reduce((sum, item) => {
    if (item.state !== 'complete' && item.state !== 'partial') return sum;
    const factor = item.targetIntensity
      ? clamp((item.actualIntensity ?? 0) / item.targetIntensity)
      : item.state === 'complete'
        ? 1
        : 0;
    return sum + priorityXP[item.priority] * factor;
  }, 0);
  return {
    consistency,
    intensity,
    momentum,
    xp: Math.round(xp),
    showedUp,
    due: dueItems.length,
  };
}

export function momentumLabel(
  momentum: number,
): 'Building' | 'Steady' | 'Strong' {
  if (momentum >= 75) return 'Strong';
  if (momentum >= 40) return 'Steady';
  return 'Building';
}
