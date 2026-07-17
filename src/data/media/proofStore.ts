import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { getDatabase } from '../db/client';

const ROOT = `${FileSystem.documentDirectory}odyssey/`;
const ORIGINALS = `${ROOT}proofs/originals/`;
const THUMBNAILS = `${ROOT}proofs/thumbnails/`;
const TEMP = `${ROOT}temp/`;

async function ensureDirectories() {
  for (const directory of [ORIGINALS, THUMBNAILS, TEMP])
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
}

async function pick(source: 'camera' | 'library') {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted)
    throw new Error(
      `Odyssey can still work without ${source === 'camera' ? 'camera' : 'photo library'} access.`,
    );
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.9,
          exif: false,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.9,
          exif: false,
        });
  return result.canceled ? null : (result.assets[0]?.uri ?? null);
}

export const proofStore = {
  pick,
  async save(
    sourceUri: string,
    altText: string,
  ): Promise<{ id: string; thumbnailUri: string }> {
    await ensureDirectories();
    const proofId = Crypto.randomUUID();
    const tempUri = `${TEMP}${proofId}.jpg`;
    const originalUri = `${ORIGINALS}${proofId}.jpg`;
    const thumbnailUri = `${THUMBNAILS}${proofId}.jpg`;
    const original = await ImageManipulator.manipulateAsync(
      sourceUri,
      [{ resize: { width: 1800 } }],
      { compress: 0.84, format: ImageManipulator.SaveFormat.JPEG },
    );
    await FileSystem.copyAsync({ from: original.uri, to: tempUri });
    const verified = await FileSystem.getInfoAsync(tempUri, { md5: true });
    if (!verified.exists || !verified.size)
      throw new Error('The proof file could not be verified. Try again.');
    await FileSystem.moveAsync({ from: tempUri, to: originalUri });
    const thumbnail = await ImageManipulator.manipulateAsync(
      originalUri,
      [{ resize: { width: 480 } }],
      { compress: 0.76, format: ImageManipulator.SaveFormat.JPEG },
    );
    await FileSystem.copyAsync({ from: thumbnail.uri, to: thumbnailUri });
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO proof_assets (id, original_path, thumbnail_path, media_type, byte_size, checksum, save_state, alt_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      proofId,
      originalUri.replace(ROOT, ''),
      thumbnailUri.replace(ROOT, ''),
      'image/jpeg',
      verified.size,
      verified.md5 ?? '',
      'staged',
      altText,
      new Date().toISOString(),
    );
    return { id: proofId, thumbnailUri };
  },
};

export function resolveProofUri(relativePath: string): string {
  return `${ROOT}${relativePath}`;
}
