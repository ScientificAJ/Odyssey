import { calculateProgress, momentumLabel } from '@/domain/policies/progress';

describe('transparent progress', () => {
  it('calculates consistency, capped intensity, momentum, and proportional XP', () => {
    const result = calculateProgress([
      {
        state: 'complete',
        targetIntensity: 60,
        actualIntensity: 80,
        priority: 'high',
      },
      {
        state: 'partial',
        targetIntensity: 60,
        actualIntensity: 30,
        priority: 'medium',
      },
      {
        state: 'missed',
        targetIntensity: 30,
        actualIntensity: null,
        priority: 'low',
      },
      {
        state: 'scheduled',
        targetIntensity: 30,
        actualIntensity: null,
        priority: 'critical',
      },
    ]);
    expect(result.consistency).toBeCloseTo(66.666, 2);
    expect(result.intensity).toBe(50);
    expect(result.momentum).toBeCloseTo(60, 2);
    expect(result.xp).toBe(33);
    expect(result.due).toBe(3);
  });

  it('uses consistency for momentum when every quest is unmeasured', () => {
    const result = calculateProgress([
      {
        state: 'complete',
        targetIntensity: null,
        actualIntensity: null,
        priority: 'medium',
      },
      {
        state: 'skipped',
        targetIntensity: null,
        actualIntensity: null,
        priority: 'medium',
      },
    ]);
    expect(result.intensity).toBeNull();
    expect(result.momentum).toBe(50);
    expect(result.xp).toBe(15);
  });

  it('labels momentum without moral grades', () => {
    expect(momentumLabel(20)).toBe('Building');
    expect(momentumLabel(60)).toBe('Steady');
    expect(momentumLabel(90)).toBe('Strong');
  });
});
