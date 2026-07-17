import { Priority, QuestOccurrence, QuestState } from '@/domain/types';

const priorityRank: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function sortTodayQuests(items: QuestOccurrence[]): QuestOccurrence[] {
  return [...items].sort((a, b) => {
    if (a.state === 'in_progress' && b.state !== 'in_progress') return -1;
    if (b.state === 'in_progress' && a.state !== 'in_progress') return 1;
    const rank = priorityRank[a.priority] - priorityRank[b.priority];
    if (rank) return rank;
    const deadline = (a.deadlineTime ?? '99:99').localeCompare(
      b.deadlineTime ?? '99:99',
    );
    if (deadline) return deadline;
    const start = (a.startTime ?? '99:99').localeCompare(
      b.startTime ?? '99:99',
    );
    return start || a.userOrder - b.userOrder;
  });
}

const transitions: Record<QuestState, QuestState[]> = {
  scheduled: ['in_progress', 'rescheduled', 'skipped', 'overdue'],
  in_progress: ['complete', 'partial', 'rescheduled', 'skipped'],
  overdue: ['complete', 'partial', 'rescheduled', 'missed', 'skipped'],
  complete: ['scheduled', 'partial'],
  partial: ['scheduled', 'complete'],
  rescheduled: [],
  skipped: [],
  missed: ['complete', 'partial', 'rescheduled'],
};

export function canTransition(from: QuestState, to: QuestState): boolean {
  return transitions[from].includes(to);
}

export function resolveOutcome(
  target: number | null,
  actual: number | null,
  unmeasuredComplete = false,
): 'complete' | 'partial' {
  if (target == null) return unmeasuredComplete ? 'complete' : 'partial';
  return (actual ?? 0) >= target ? 'complete' : 'partial';
}
