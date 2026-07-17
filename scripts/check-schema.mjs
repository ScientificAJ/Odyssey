import { readFileSync } from 'node:fs';

const migration = readFileSync(
  'src/data/db/migrations/0000_odyssey_v1.sql',
  'utf8',
);
const required = [
  'local_profiles',
  'final_bosses',
  'milestones',
  'quest_templates',
  'occurrences',
  'completions',
  'proof_assets',
  'xp_ledger',
  'settings',
  'reminders',
  'daily_reflections',
  'voyages',
];
const missing = required.filter(
  (table) => !migration.includes(`CREATE TABLE IF NOT EXISTS ${table}`),
);
if (missing.length)
  throw new Error(`Schema migration is missing: ${missing.join(', ')}`);
if (!migration.includes('UNIQUE(template_id, local_date)'))
  throw new Error('Occurrence idempotency constraint is missing.');
if (!migration.includes('one_active_boss'))
  throw new Error('One-active-boss constraint is missing.');
if (!migration.includes('PRAGMA user_version = 1'))
  throw new Error('Schema version is missing.');
process.stdout.write(
  `Schema check passed: ${required.length} required tables and integrity constraints.\n`,
);
