import {
  canTransition,
  resolveOutcome,
  sortTodayQuests,
} from '@/domain/policies/quests';
import { QuestOccurrence } from '@/domain/types';

const quest = (
  id: string,
  overrides: Partial<QuestOccurrence>,
): QuestOccurrence => ({
  id,
  templateId: `${id}-template`,
  kind: 'task',
  title: id,
  localDate: '2026-07-17',
  startTime: null,
  deadlineTime: null,
  priority: 'medium',
  state: 'scheduled',
  targetIntensity: null,
  minimumWin: null,
  unit: null,
  proofRule: 'not_needed',
  notes: null,
  milestoneId: null,
  userOrder: 0,
  startedAt: null,
  ...overrides,
});

describe('Quest policies', () => {
  it('orders in-progress first, then priority, deadline, start, and manual order', () => {
    const sorted = sortTodayQuests([
      quest('low', { priority: 'low', deadlineTime: '08:00' }),
      quest('high-late', { priority: 'high', deadlineTime: '20:00' }),
      quest('high-early', { priority: 'high', deadlineTime: '12:00' }),
      quest('active', { priority: 'medium', state: 'in_progress' }),
    ]);
    expect(sorted.map((item) => item.id)).toEqual([
      'active',
      'high-early',
      'high-late',
      'low',
    ]);
  });

  it('keeps only documented state transitions', () => {
    expect(canTransition('scheduled', 'in_progress')).toBe(true);
    expect(canTransition('overdue', 'rescheduled')).toBe(true);
    expect(canTransition('skipped', 'complete')).toBe(false);
  });

  it('derives partial versus complete from actual effort', () => {
    expect(resolveOutcome(60, 25)).toBe('partial');
    expect(resolveOutcome(60, 60)).toBe('complete');
    expect(resolveOutcome(null, null, true)).toBe('complete');
  });
});
