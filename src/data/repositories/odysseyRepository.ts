import { addDays, format, parseISO } from 'date-fns';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';

import { calculateProgress, priorityXP } from '@/domain/policies/progress';
import { generateOccurrenceDates } from '@/domain/services/recurrence';
import {
  CompletionInput,
  Priority,
  QuestKind,
  QuestOccurrence,
} from '@/domain/types';

import { eraseDatabaseKey, getDatabase } from '../db/client';
import {
  cancelQuestReminders,
  scheduleQuestReminder,
} from '../notifications/scheduler';

const id = () => Crypto.randomUUID();
const now = () => new Date().toISOString();
const today = () => new Date().toLocaleDateString('en-CA');
const zone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export interface VoyageSetupInput {
  bossName: string;
  motivation?: string;
  milestoneNames: string[];
  quest: CreateQuestInput;
}

export interface CreateQuestInput {
  bossId?: string;
  milestoneId?: string;
  kind: QuestKind;
  title: string;
  localDate: string;
  startTime?: string;
  deadlineTime?: string;
  priority: Priority;
  targetIntensity?: number;
  minimumWin?: number;
  unit?: string;
  proofRule: 'not_needed' | 'optional' | 'required';
  notes?: string;
  recurrence?: string;
}

export interface BossSummary {
  id: string;
  name: string;
  motivation: string | null;
  targetDate: string | null;
  milestoneCount: number;
  completedMilestones: number;
}

export interface HistoryEntry {
  id: string;
  occurrenceId: string;
  title: string;
  localDate: string;
  outcome: string;
  actualIntensity: number | null;
  targetIntensity: number | null;
  unit: string | null;
  note: string | null;
  thumbnailPath: string | null;
}

async function ensureProfile(): Promise<string> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM local_profiles LIMIT 1',
  );
  if (existing) return existing.id;
  const profileId = id();
  const created = now();
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'INSERT INTO local_profiles (id, locale, time_zone, day_boundary, created_at) VALUES (?, ?, ?, ?, ?)',
      profileId,
      Intl.DateTimeFormat().resolvedOptions().locale,
      zone(),
      '04:00',
      created,
    );
    await db.runAsync(
      'INSERT INTO settings (profile_id, updated_at) VALUES (?, ?)',
      profileId,
      created,
    );
  });
  return profileId;
}

export const odysseyRepository = {
  ensureProfile,

  async hasActiveBoss(): Promise<boolean> {
    await ensureProfile();
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) AS count FROM final_bosses WHERE status='active'",
    );
    return (result?.count ?? 0) > 0;
  },

  async setupVoyage(input: VoyageSetupInput): Promise<void> {
    const profileId = await ensureProfile();
    const db = await getDatabase();
    const bossId = id();
    const timestamp = now();
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'INSERT INTO final_bosses (id, profile_id, name, motivation, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        bossId,
        profileId,
        input.bossName.trim(),
        input.motivation?.trim() || null,
        'active',
        timestamp,
        timestamp,
      );
      for (const [order, name] of input.milestoneNames
        .filter(Boolean)
        .entries()) {
        await db.runAsync(
          'INSERT INTO milestones (id, boss_id, name, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          id(),
          bossId,
          name.trim(),
          order,
          'not_started',
          timestamp,
          timestamp,
        );
      }
    });
    await this.createQuest({ ...input.quest, bossId });
  },

  async createQuest(input: CreateQuestInput): Promise<string> {
    const db = await getDatabase();
    const templateId = id();
    const occurrenceId = id();
    const timestamp = now();
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'INSERT INTO quest_templates (id, boss_id, milestone_id, kind, title, priority, target_intensity, minimum_win, unit, proof_rule, notes, recurrence, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        templateId,
        input.bossId ?? null,
        input.milestoneId ?? null,
        input.kind,
        input.title.trim(),
        input.priority,
        input.targetIntensity ?? null,
        input.minimumWin ?? null,
        input.unit ?? null,
        input.proofRule,
        input.notes?.trim() || null,
        input.recurrence ?? null,
        timestamp,
        timestamp,
      );
      const dates =
        input.kind === 'habit'
          ? generateOccurrenceDates(
              input.localDate,
              format(addDays(parseISO(input.localDate), 60), 'yyyy-MM-dd'),
              input.recurrence?.startsWith('weekdays:')
                ? input.recurrence.slice(9).split(',').map(Number)
                : undefined,
            )
          : [input.localDate];
      for (const [index, localDate] of dates.entries()) {
        await db.runAsync(
          'INSERT INTO occurrences (id, template_id, local_date, start_time, deadline_time, time_zone, state, title_snapshot, priority_snapshot, target_snapshot, minimum_win_snapshot, unit_snapshot, proof_rule_snapshot, milestone_snapshot, user_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          index === 0 ? occurrenceId : id(),
          templateId,
          localDate,
          input.startTime ?? null,
          input.deadlineTime ?? null,
          zone(),
          'scheduled',
          input.title.trim(),
          input.priority,
          input.targetIntensity ?? null,
          input.minimumWin ?? null,
          input.unit ?? null,
          input.proofRule,
          input.milestoneId ?? null,
          0,
          timestamp,
          timestamp,
        );
      }
    });
    return occurrenceId;
  },

  async getOccurrences(
    startDate = today(),
    endDate = startDate,
  ): Promise<QuestOccurrence[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT o.id, o.template_id, q.kind, o.title_snapshot, o.local_date, o.start_time, o.deadline_time,
       o.priority_snapshot, o.state, o.target_snapshot, o.minimum_win_snapshot, o.unit_snapshot,
       o.proof_rule_snapshot, q.notes, o.milestone_snapshot, o.user_order, o.started_at
       FROM occurrences o JOIN quest_templates q ON q.id=o.template_id
       WHERE o.local_date BETWEEN ? AND ? ORDER BY o.local_date, o.user_order`,
      startDate,
      endDate,
    );
    return rows.map((row) => ({
      id: String(row.id),
      templateId: String(row.template_id),
      kind: row.kind as QuestOccurrence['kind'],
      title: String(row.title_snapshot),
      localDate: String(row.local_date),
      startTime: (row.start_time as string | null) ?? null,
      deadlineTime: (row.deadline_time as string | null) ?? null,
      priority: row.priority_snapshot as Priority,
      state: row.state as QuestOccurrence['state'],
      targetIntensity: (row.target_snapshot as number | null) ?? null,
      minimumWin: (row.minimum_win_snapshot as number | null) ?? null,
      unit: row.unit_snapshot as QuestOccurrence['unit'],
      proofRule: row.proof_rule_snapshot as QuestOccurrence['proofRule'],
      notes: (row.notes as string | null) ?? null,
      milestoneId: (row.milestone_snapshot as string | null) ?? null,
      userOrder: Number(row.user_order),
      startedAt: (row.started_at as string | null) ?? null,
    }));
  },

  async getOccurrence(occurrenceId: string): Promise<QuestOccurrence | null> {
    const all = await this.getOccurrences('0000-01-01', '9999-12-31');
    return all.find((item) => item.id === occurrenceId) ?? null;
  },

  async beginQuest(occurrenceId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "UPDATE occurrences SET state='in_progress', started_at=?, updated_at=? WHERE id=? AND state IN ('scheduled','overdue')",
      now(),
      now(),
      occurrenceId,
    );
  },

  async completeQuest(
    occurrenceId: string,
    input: CompletionInput,
  ): Promise<void> {
    const db = await getDatabase();
    const occurrence = await this.getOccurrence(occurrenceId);
    if (!occurrence) throw new Error('Quest not found.');
    if (
      occurrence.proofRule === 'required' &&
      !input.proofId &&
      input.outcome !== 'skipped'
    )
      throw new Error('Add the required private proof before saving.');
    const existing = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM completions WHERE occurrence_id=?',
      occurrenceId,
    );
    const completionId = existing?.id ?? id();
    const base = priorityXP[occurrence.priority];
    const factor =
      input.outcome === 'skipped'
        ? 0
        : occurrence.targetIntensity
          ? Math.min(
              (input.actualIntensity ?? 0) / occurrence.targetIntensity,
              1,
            )
          : input.outcome === 'complete'
            ? 1
            : 0;
    const timestamp = now();
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'DELETE FROM xp_ledger WHERE completion_id=?',
        completionId,
      );
      await db.runAsync(
        `INSERT INTO completions (id, occurrence_id, outcome, actual_intensity, note, calculation_version, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(occurrence_id) DO UPDATE SET outcome=excluded.outcome, actual_intensity=excluded.actual_intensity, note=excluded.note, calculation_version=excluded.calculation_version, updated_at=excluded.updated_at`,
        completionId,
        occurrenceId,
        input.outcome,
        input.actualIntensity ?? null,
        input.note?.trim() || null,
        1,
        timestamp,
        timestamp,
      );
      await db.runAsync(
        'UPDATE occurrences SET state=?, updated_at=? WHERE id=?',
        input.outcome,
        timestamp,
        occurrenceId,
      );
      await db.runAsync(
        'INSERT INTO xp_ledger (id, completion_id, base, factor, delta, calculation_version, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        id(),
        completionId,
        base,
        factor,
        Math.round(base * factor),
        1,
        timestamp,
      );
      if (input.proofId)
        await db.runAsync(
          'UPDATE proof_assets SET completion_id=?, save_state=? WHERE id=?',
          completionId,
          'durable',
          input.proofId,
        );
    });
    await cancelQuestReminders(occurrenceId, `quest_${input.outcome}`);
  },

  async rescheduleQuest(
    occurrenceId: string,
    localDate: string,
    startTime?: string,
  ): Promise<void> {
    const db = await getDatabase();
    await cancelQuestReminders(occurrenceId, 'quest_rescheduled');
    await db.runAsync(
      "UPDATE occurrences SET local_date=?, start_time=?, state='scheduled', rescheduled_from=COALESCE(rescheduled_from, local_date), updated_at=? WHERE id=?",
      localDate,
      startTime ?? null,
      now(),
      occurrenceId,
    );
    const quest = await this.getOccurrence(occurrenceId);
    const preferences = await this.getSettings();
    if (quest && preferences?.notifications_enabled)
      await scheduleQuestReminder(quest, Boolean(preferences.privacy_shield));
  },

  async getBossSummary(): Promise<BossSummary | null> {
    const db = await getDatabase();
    return db.getFirstAsync<BossSummary>(`SELECT b.id, b.name, b.motivation, b.target_date AS targetDate,
      COUNT(m.id) AS milestoneCount, SUM(CASE WHEN m.status='complete' THEN 1 ELSE 0 END) AS completedMilestones
      FROM final_bosses b LEFT JOIN milestones m ON m.boss_id=b.id WHERE b.status='active' GROUP BY b.id LIMIT 1`);
  },

  async getMilestones(): Promise<
    { id: string; name: string; status: string }[]
  > {
    const db = await getDatabase();
    return db.getAllAsync(
      "SELECT m.id, m.name, m.status FROM milestones m JOIN final_bosses b ON b.id=m.boss_id WHERE b.status='active' ORDER BY m.sort_order",
    );
  },

  async toggleMilestone(milestoneId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "UPDATE milestones SET status=CASE WHEN status='complete' THEN 'in_progress' ELSE 'complete' END, completed_at=CASE WHEN status='complete' THEN NULL ELSE ? END, updated_at=? WHERE id=?",
      now(),
      now(),
      milestoneId,
    );
  },

  async addMilestone(name: string): Promise<void> {
    const db = await getDatabase();
    const boss = await db.getFirstAsync<{ id: string }>(
      "SELECT id FROM final_bosses WHERE status='active' LIMIT 1",
    );
    if (!boss) throw new Error('Create an active Final Boss first.');
    const count = await db.getFirstAsync<{ value: number }>(
      'SELECT COUNT(*) AS value FROM milestones WHERE boss_id=?',
      boss.id,
    );
    if ((count?.value ?? 0) >= 12)
      throw new Error('V1 supports up to 12 milestones.');
    const order = await db.getFirstAsync<{ value: number }>(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS value FROM milestones WHERE boss_id=?',
      boss.id,
    );
    const timestamp = now();
    await db.runAsync(
      'INSERT INTO milestones (id, boss_id, name, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      id(),
      boss.id,
      name.trim(),
      order?.value ?? 0,
      'not_started',
      timestamp,
      timestamp,
    );
  },

  async moveMilestone(milestoneId: string, direction: -1 | 1): Promise<void> {
    const db = await getDatabase();
    const current = await db.getFirstAsync<{
      bossId: string;
      sortOrder: number;
    }>(
      'SELECT boss_id AS bossId, sort_order AS sortOrder FROM milestones WHERE id=?',
      milestoneId,
    );
    if (!current) return;
    const adjacent = await db.getFirstAsync<{ id: string; sortOrder: number }>(
      direction < 0
        ? 'SELECT id, sort_order AS sortOrder FROM milestones WHERE boss_id=? AND sort_order<? ORDER BY sort_order DESC LIMIT 1'
        : 'SELECT id, sort_order AS sortOrder FROM milestones WHERE boss_id=? AND sort_order>? ORDER BY sort_order ASC LIMIT 1',
      current.bossId,
      current.sortOrder,
    );
    if (!adjacent) return;
    const timestamp = now();
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'UPDATE milestones SET sort_order=?, updated_at=? WHERE id=?',
        adjacent.sortOrder,
        timestamp,
        milestoneId,
      );
      await db.runAsync(
        'UPDATE milestones SET sort_order=?, updated_at=? WHERE id=?',
        current.sortOrder,
        timestamp,
        adjacent.id,
      );
    });
  },

  async getProgress() {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      state: QuestOccurrence['state'];
      targetIntensity: number | null;
      actualIntensity: number | null;
      priority: Priority;
    }>(
      `SELECT o.state, o.target_snapshot AS targetIntensity, c.actual_intensity AS actualIntensity, o.priority_snapshot AS priority FROM occurrences o LEFT JOIN completions c ON c.occurrence_id=o.id`,
    );
    return calculateProgress(rows);
  },

  async getHistory(): Promise<HistoryEntry[]> {
    const db = await getDatabase();
    return db.getAllAsync(`SELECT c.id, c.occurrence_id AS occurrenceId, o.title_snapshot AS title, o.local_date AS localDate, c.outcome,
      c.actual_intensity AS actualIntensity, o.target_snapshot AS targetIntensity, o.unit_snapshot AS unit,
      c.note, p.thumbnail_path AS thumbnailPath FROM completions c JOIN occurrences o ON o.id=c.occurrence_id
      LEFT JOIN proof_assets p ON p.completion_id=c.id ORDER BY c.created_at DESC`);
  },

  async endDay(
    localDate: string,
    reflection?: string,
    loadRealistic?: boolean,
  ): Promise<void> {
    const profileId = await ensureProfile();
    const db = await getDatabase();
    const timestamp = now();
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        "UPDATE occurrences SET state='missed', updated_at=? WHERE local_date=? AND state IN ('scheduled','in_progress','overdue')",
        timestamp,
        localDate,
      );
      await db.runAsync(
        `INSERT INTO daily_reflections (id, profile_id, local_date, text, load_realistic, created_at) VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(profile_id, local_date) DO UPDATE SET text=excluded.text, load_realistic=excluded.load_realistic`,
        id(),
        profileId,
        localDate,
        reflection?.trim() || null,
        loadRealistic == null ? null : Number(loadRealistic),
        timestamp,
      );
    });
  },

  async defeatFinalBoss(reflection?: string): Promise<void> {
    const db = await getDatabase();
    const boss = await db.getFirstAsync<{
      id: string;
      name: string;
      motivation: string | null;
      createdAt: string;
    }>(
      "SELECT id, name, motivation, created_at AS createdAt FROM final_bosses WHERE status='active' LIMIT 1",
    );
    if (!boss) throw new Error('There is no active Final Boss.');
    const incomplete = await db.getFirstAsync<{ value: number }>(
      "SELECT COUNT(*) AS value FROM milestones WHERE boss_id=? AND status!='complete'",
      boss.id,
    );
    if ((incomplete?.value ?? 0) > 0)
      throw new Error(
        'Complete every milestone before defeating the Final Boss.',
      );
    const metrics = await this.getProgress();
    const totals = await db.getFirstAsync<{
      completions: number;
      effort: number;
    }>(
      'SELECT COUNT(*) AS completions, COALESCE(SUM(c.actual_intensity), 0) AS effort FROM completions c JOIN occurrences o ON o.id=c.occurrence_id JOIN quest_templates q ON q.id=o.template_id WHERE q.boss_id=?',
      boss.id,
    );
    const timestamp = now();
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'INSERT INTO voyages (id, boss_id, boss_name_snapshot, motivation_snapshot, summary_json, reflection, final_state, started_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id(),
        boss.id,
        boss.name,
        boss.motivation,
        JSON.stringify({
          ...metrics,
          completions: totals?.completions ?? 0,
          totalEffort: totals?.effort ?? 0,
        }),
        reflection?.trim() || null,
        'defeated',
        boss.createdAt,
        timestamp,
      );
      await db.runAsync(
        "UPDATE final_bosses SET status='defeated', updated_at=? WHERE id=?",
        timestamp,
        boss.id,
      );
    });
  },

  async getSettings() {
    const profileId = await ensureProfile();
    const db = await getDatabase();
    return db.getFirstAsync<Record<string, number | string>>(
      'SELECT * FROM settings WHERE profile_id=?',
      profileId,
    );
  },

  async updateSetting(
    key: string,
    value: boolean | number | string,
  ): Promise<void> {
    const allowed = new Set([
      'plain_language',
      'reduced_motion',
      'sound_enabled',
      'haptics_enabled',
      'privacy_shield',
      'notifications_enabled',
      'quiet_start',
      'quiet_end',
      'daily_capacity_minutes',
    ]);
    if (!allowed.has(key)) throw new Error('Unsupported setting.');
    const profileId = await ensureProfile();
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE settings SET ${key}=?, updated_at=? WHERE profile_id=?`,
      typeof value === 'boolean' ? Number(value) : value,
      now(),
      profileId,
    );
  },

  async exportData(): Promise<string> {
    const db = await getDatabase();
    const payload: Record<string, unknown> = {
      exportedAt: now(),
      formatVersion: 1,
    };
    for (const table of [
      'final_bosses',
      'milestones',
      'quest_templates',
      'occurrences',
      'completions',
      'proof_assets',
      'xp_ledger',
      'daily_reflections',
      'voyages',
    ])
      payload[table] = await db.getAllAsync(`SELECT * FROM ${table}`);
    const exportDirectory = `${FileSystem.documentDirectory}odyssey/exports/`;
    await FileSystem.makeDirectoryAsync(exportDirectory, {
      intermediates: true,
    });
    const uri = `${exportDirectory}odyssey-export-${today()}.json`;
    await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2));
    return uri;
  },

  async eraseAllData(): Promise<void> {
    const db = await getDatabase();
    await db.closeAsync();
    await FileSystem.deleteAsync(
      `${FileSystem.documentDirectory}SQLite/odyssey.db`,
      { idempotent: true },
    );
    await FileSystem.deleteAsync(`${FileSystem.documentDirectory}odyssey/`, {
      idempotent: true,
    });
    await eraseDatabaseKey();
  },
};
