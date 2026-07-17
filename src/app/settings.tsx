import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScenicScreen } from '@/components/ScenicScreen';
import {
  cancelAllReminders,
  requestReminderPermission,
} from '@/data/notifications/scheduler';
import { odysseyRepository } from '@/data/repositories/odysseyRepository';
import { colors, spacing } from '@/design/tokens';
import { useRefreshOdyssey, useSettings } from '@/features/queries';

function SettingRow({
  label,
  detail,
  value,
  onChange,
}: {
  label: string;
  detail: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.setting}>
      <View style={{ flex: 1 }}>
        <AppText variant="h3">{label}</AppText>
        <AppText variant="small">{detail}</AppText>
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.line, true: colors.aqua }}
        thumbColor={colors.foam}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const settings = useSettings();
  const refresh = useRefreshOdyssey();
  const data = settings.data ?? {};
  async function update(key: string, value: boolean) {
    await odysseyRepository.updateSetting(key, value);
    await refresh();
  }
  async function notifications(value: boolean) {
    if (value && !(await requestReminderPermission())) return;
    if (!value) await cancelAllReminders();
    await update('notifications_enabled', value);
  }
  async function exportData() {
    const uri = await odysseyRepository.exportData();
    if (await Sharing.isAvailableAsync())
      await Sharing.shareAsync(uri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Odyssey data',
      });
    else Alert.alert('Export created', uri);
  }
  function erase() {
    Alert.alert(
      'Erase every local Voyage?',
      'This permanently removes the encrypted database, proof photos, thumbnails, exports, reminders, and encryption key. It cannot be undone without your own export.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase everything',
          style: 'destructive',
          onPress: async () => {
            await cancelAllReminders();
            await odysseyRepository.eraseAllData();
            router.replace('/onboarding');
          },
        },
      ],
    );
  }
  return (
    <ScenicScreen>
      <View style={styles.header}>
        <View>
          <AppText variant="label">CONTROL THE EXPERIENCE</AppText>
          <AppText variant="h1">Settings & data</AppText>
        </View>
        <Button label="Close" variant="quiet" onPress={() => router.back()} />
      </View>
      <Card style={styles.group}>
        <AppText variant="h2">Reminders</AppText>
        <SettingRow
          label="Local reminders"
          detail="Schedules on this device only. No push token."
          value={Boolean(data.notifications_enabled)}
          onChange={notifications}
        />
      </Card>
      <Card style={styles.group}>
        <AppText variant="h2">Access & atmosphere</AppText>
        <SettingRow
          label="Plain language"
          detail="Pairs Quest and Final Boss with familiar labels."
          value={Boolean(data.plain_language)}
          onChange={(value) => update('plain_language', value)}
        />
        <SettingRow
          label="Reduce motion further"
          detail="Stops ambient scenery and simplifies transitions."
          value={Boolean(data.reduced_motion)}
          onChange={(value) => update('reduced_motion', value)}
        />
        <SettingRow
          label="Haptics"
          detail="Optional local feedback for meaningful actions."
          value={Boolean(data.haptics_enabled)}
          onChange={(value) => update('haptics_enabled', value)}
        />
      </Card>
      <Card style={styles.group}>
        <AppText variant="h2">Privacy</AppText>
        <SettingRow
          label="Privacy Shield"
          detail="Obscures private proof previews in sensitive contexts."
          value={Boolean(data.privacy_shield)}
          onChange={(value) => update('privacy_shield', value)}
        />
        <AppText variant="small">
          Proof photos are private, app-sandboxed local files. Odyssey does not
          claim file-level photo encryption.
        </AppText>
      </Card>
      <Card style={styles.group}>
        <AppText variant="h2">Your data</AppText>
        <Button
          label="Export my data"
          variant="secondary"
          onPress={exportData}
        />
        <Button label="Erase all local data" variant="danger" onPress={erase} />
        <AppText variant="small">
          Uninstalling or clearing app data can permanently remove your Voyage
          unless you create an export.
        </AppText>
      </Card>
      <Card>
        <AppText variant="small">
          Odyssey is a planning tool, not medical advice. Lower or pause targets
          whenever the route stops being healthy.
        </AppText>
      </Card>
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  group: { gap: spacing.lg },
  setting: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    paddingBottom: spacing.md,
  },
});
