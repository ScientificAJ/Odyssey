import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';

import { initialMigration } from './migrations';

const DATABASE_NAME = 'odyssey.db';
const KEY_NAME = 'odyssey.database.key.v1';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDatabaseKey(): Promise<string> {
  const existing = await SecureStore.getItemAsync(KEY_NAME);
  if (existing) return existing;
  const bytes = await Crypto.getRandomBytesAsync(32);
  const key = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  await SecureStore.setItemAsync(KEY_NAME, key, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return key;
}

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const key = await getDatabaseKey();
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync(
    `PRAGMA key = '${key}'; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL;`,
  );
  const version = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  if ((version?.user_version ?? 0) < 1) await db.execAsync(initialMigration);
  return db;
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  databasePromise ??= openDatabase();
  return databasePromise;
}

export async function eraseDatabaseKey(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_NAME);
  databasePromise = null;
}
