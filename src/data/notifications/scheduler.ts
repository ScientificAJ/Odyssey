import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';

import { getDatabase } from '@/data/db/client';
import { QuestOccurrence } from '@/domain/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestReminderPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  return (await Notifications.requestPermissionsAsync()).granted;
}

export async function scheduleQuestReminder(
  quest: QuestOccurrence,
  privacyPreview: boolean,
): Promise<string | null> {
  if (!quest.startTime) return null;
  const trigger = new Date(`${quest.localDate}T${quest.startTime}:00`);
  trigger.setMinutes(trigger.getMinutes() - 15);
  if (trigger <= new Date()) return null;
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'A scheduled quest begins soon',
      body: privacyPreview
        ? 'Open Odyssey to view the details.'
        : `${quest.title} begins in 15 minutes.`,
      data: { url: `/quest/${quest.id}` },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
  });
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO reminders (id, occurrence_id, notification_id, stage, trigger_at, state, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    Crypto.randomUUID(),
    quest.id,
    notificationId,
    'prepare',
    trigger.toISOString(),
    'scheduled',
    new Date().toISOString(),
  );
  return notificationId;
}

export async function cancelQuestReminders(
  occurrenceId: string,
  reason: string,
): Promise<void> {
  const db = await getDatabase();
  const reminders = await db.getAllAsync<{ notificationId: string | null }>(
    "SELECT notification_id AS notificationId FROM reminders WHERE occurrence_id=? AND state='scheduled'",
    occurrenceId,
  );
  for (const reminder of reminders)
    if (reminder.notificationId)
      await Notifications.cancelScheduledNotificationAsync(
        reminder.notificationId,
      );
  await db.runAsync(
    "UPDATE reminders SET state='cancelled', cancellation_reason=? WHERE occurrence_id=? AND state='scheduled'",
    reason,
    occurrenceId,
  );
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE reminders SET state='cancelled', cancellation_reason='master_switch_off' WHERE state='scheduled'",
  );
}
