import { addDays, format, parseISO } from 'date-fns';

export function generateOccurrenceDates(
  startDate: string,
  endDate: string,
  weekdays?: number[],
): string[] {
  const dates: string[] = [];
  let cursor = parseISO(startDate);
  const end = parseISO(endDate);
  while (cursor <= end) {
    if (!weekdays?.length || weekdays.includes(cursor.getDay()))
      dates.push(format(cursor, 'yyyy-MM-dd'));
    cursor = addDays(cursor, 1);
  }
  return dates;
}
