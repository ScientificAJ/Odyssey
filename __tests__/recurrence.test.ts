import { generateOccurrenceDates } from '@/domain/services/recurrence';

describe('recurrence', () => {
  it('generates an inclusive daily window', () => {
    expect(generateOccurrenceDates('2024-02-28', '2024-03-01')).toEqual([
      '2024-02-28',
      '2024-02-29',
      '2024-03-01',
    ]);
  });

  it('filters selected weekdays without duplicating dates', () => {
    const dates = generateOccurrenceDates(
      '2026-07-13',
      '2026-07-19',
      [1, 3, 5],
    );
    expect(dates).toEqual(['2026-07-13', '2026-07-15', '2026-07-17']);
    expect(new Set(dates).size).toBe(dates.length);
  });
});
