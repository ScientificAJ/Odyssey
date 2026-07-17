import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

const timestamps = {
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
};

export const localProfiles = sqliteTable('local_profiles', {
  id: text('id').primaryKey(),
  locale: text('locale').notNull(),
  timeZone: text('time_zone').notNull(),
  dayBoundary: text('day_boundary').notNull().default('04:00'),
  createdAt: text('created_at').notNull(),
});

export const finalBosses = sqliteTable(
  'final_bosses',
  {
    id: text('id').primaryKey(),
    profileId: text('profile_id')
      .notNull()
      .references(() => localProfiles.id),
    name: text('name').notNull(),
    motivation: text('motivation'),
    targetDate: text('target_date'),
    coverColor: text('cover_color').notNull().default('#62E5E0'),
    status: text('status', {
      enum: ['draft', 'active', 'defeated', 'archived'],
    }).notNull(),
    ...timestamps,
  },
  (table) => [index('final_boss_profile_idx').on(table.profileId)],
);

export const milestones = sqliteTable(
  'milestones',
  {
    id: text('id').primaryKey(),
    bossId: text('boss_id')
      .notNull()
      .references(() => finalBosses.id),
    name: text('name').notNull(),
    note: text('note'),
    targetDate: text('target_date'),
    sortOrder: integer('sort_order').notNull(),
    status: text('status', {
      enum: ['not_started', 'in_progress', 'complete'],
    }).notNull(),
    completedAt: text('completed_at'),
    ...timestamps,
  },
  (table) => [index('milestone_boss_idx').on(table.bossId)],
);

export const questTemplates = sqliteTable('quest_templates', {
  id: text('id').primaryKey(),
  bossId: text('boss_id').references(() => finalBosses.id),
  milestoneId: text('milestone_id').references(() => milestones.id),
  kind: text('kind', { enum: ['habit', 'task'] }).notNull(),
  title: text('title').notNull(),
  priority: text('priority', {
    enum: ['low', 'medium', 'high', 'critical'],
  }).notNull(),
  targetIntensity: real('target_intensity'),
  minimumWin: real('minimum_win'),
  unit: text('unit'),
  proofRule: text('proof_rule', {
    enum: ['not_needed', 'optional', 'required'],
  }).notNull(),
  notes: text('notes'),
  recurrence: text('recurrence'),
  reminderEnabled: integer('reminder_enabled', { mode: 'boolean' })
    .notNull()
    .default(true),
  archivedAt: text('archived_at'),
  ...timestamps,
});

export const occurrences = sqliteTable(
  'occurrences',
  {
    id: text('id').primaryKey(),
    templateId: text('template_id')
      .notNull()
      .references(() => questTemplates.id),
    localDate: text('local_date').notNull(),
    startTime: text('start_time'),
    deadlineTime: text('deadline_time'),
    timeZone: text('time_zone').notNull(),
    state: text('state').notNull(),
    titleSnapshot: text('title_snapshot').notNull(),
    prioritySnapshot: text('priority_snapshot').notNull(),
    targetSnapshot: real('target_snapshot'),
    minimumWinSnapshot: real('minimum_win_snapshot'),
    unitSnapshot: text('unit_snapshot'),
    proofRuleSnapshot: text('proof_rule_snapshot').notNull(),
    milestoneSnapshot: text('milestone_snapshot'),
    userOrder: integer('user_order').notNull().default(0),
    startedAt: text('started_at'),
    rescheduledFrom: text('rescheduled_from'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('occurrence_series_date_unique').on(
      table.templateId,
      table.localDate,
    ),
    index('occurrence_date_idx').on(table.localDate),
  ],
);

export const completions = sqliteTable('completions', {
  id: text('id').primaryKey(),
  occurrenceId: text('occurrence_id')
    .notNull()
    .unique()
    .references(() => occurrences.id),
  outcome: text('outcome', {
    enum: ['complete', 'partial', 'skipped'],
  }).notNull(),
  actualIntensity: real('actual_intensity'),
  note: text('note'),
  calculationVersion: integer('calculation_version').notNull().default(1),
  ...timestamps,
});

export const proofAssets = sqliteTable('proof_assets', {
  id: text('id').primaryKey(),
  completionId: text('completion_id').references(() => completions.id),
  originalPath: text('original_path').notNull(),
  thumbnailPath: text('thumbnail_path').notNull(),
  mediaType: text('media_type').notNull(),
  byteSize: integer('byte_size').notNull(),
  checksum: text('checksum').notNull(),
  saveState: text('save_state').notNull(),
  altText: text('alt_text').notNull(),
  createdAt: text('created_at').notNull(),
});

export const xpLedger = sqliteTable('xp_ledger', {
  id: text('id').primaryKey(),
  completionId: text('completion_id')
    .notNull()
    .references(() => completions.id),
  base: integer('base').notNull(),
  factor: real('factor').notNull(),
  delta: integer('delta').notNull(),
  calculationVersion: integer('calculation_version').notNull().default(1),
  createdAt: text('created_at').notNull(),
});

export const settings = sqliteTable('settings', {
  profileId: text('profile_id')
    .primaryKey()
    .references(() => localProfiles.id),
  plainLanguage: integer('plain_language', { mode: 'boolean' })
    .notNull()
    .default(false),
  reducedMotion: integer('reduced_motion', { mode: 'boolean' })
    .notNull()
    .default(false),
  soundEnabled: integer('sound_enabled', { mode: 'boolean' })
    .notNull()
    .default(false),
  hapticsEnabled: integer('haptics_enabled', { mode: 'boolean' })
    .notNull()
    .default(true),
  privacyShield: integer('privacy_shield', { mode: 'boolean' })
    .notNull()
    .default(true),
  notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' })
    .notNull()
    .default(false),
  quietStart: text('quiet_start').notNull().default('21:00'),
  quietEnd: text('quiet_end').notNull().default('07:00'),
  dailyCapacityMinutes: integer('daily_capacity_minutes')
    .notNull()
    .default(180),
  updatedAt: text('updated_at').notNull(),
});

export const reminders = sqliteTable('reminders', {
  id: text('id').primaryKey(),
  occurrenceId: text('occurrence_id')
    .notNull()
    .references(() => occurrences.id),
  notificationId: text('notification_id'),
  stage: text('stage').notNull(),
  triggerAt: text('trigger_at').notNull(),
  state: text('state').notNull(),
  cancellationReason: text('cancellation_reason'),
  createdAt: text('created_at').notNull(),
});

export const dailyReflections = sqliteTable('daily_reflections', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => localProfiles.id),
  localDate: text('local_date').notNull(),
  text: text('text'),
  loadRealistic: integer('load_realistic', { mode: 'boolean' }),
  createdAt: text('created_at').notNull(),
});

export const voyages = sqliteTable('voyages', {
  id: text('id').primaryKey(),
  bossId: text('boss_id')
    .notNull()
    .references(() => finalBosses.id),
  bossNameSnapshot: text('boss_name_snapshot').notNull(),
  motivationSnapshot: text('motivation_snapshot'),
  summaryJson: text('summary_json').notNull(),
  reflection: text('reflection'),
  finalState: text('final_state', { enum: ['defeated', 'archived'] }).notNull(),
  startedAt: text('started_at').notNull(),
  completedAt: text('completed_at').notNull(),
});
