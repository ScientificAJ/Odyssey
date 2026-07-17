import { useRouter } from 'expo-router';
import {
  BookHeart,
  ChevronRight,
  Settings,
  ShieldCheck,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { ScenicScreen } from '@/components/ScenicScreen';
import { colors, spacing } from '@/design/tokens';
import { useHistory } from '@/features/queries';

export default function MeScreen() {
  const router = useRouter();
  const history = useHistory();
  return (
    <ScenicScreen>
      <AppText variant="label">PRIVATE BY DEFAULT</AppText>
      <AppText variant="h1">Your record</AppText>
      <Card style={styles.profile}>
        <View style={styles.avatar}>
          <ShieldCheck color={colors.ink} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Device-local profile</AppText>
          <AppText variant="small">
            No account · no sync · no cloud analytics
          </AppText>
        </View>
      </Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open Proof Journal"
        onPress={() => router.push('/journal')}
      >
        <Card style={styles.row}>
          <BookHeart color={colors.coral} />
          <View style={{ flex: 1 }}>
            <AppText variant="h3">Proof Journal</AppText>
            <AppText variant="small">
              {history.data?.length ?? 0} honest outcomes
            </AppText>
          </View>
          <ChevronRight color={colors.muted} />
        </Card>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open settings and data controls"
        onPress={() => router.push('/settings')}
      >
        <Card style={styles.row}>
          <Settings color={colors.blue} />
          <View style={{ flex: 1 }}>
            <AppText variant="h3">Settings & data</AppText>
            <AppText variant="small">
              Privacy, reminders, access, export, erase
            </AppText>
          </View>
          <ChevronRight color={colors.muted} />
        </Card>
      </Pressable>
      <Card style={styles.note}>
        <AppText variant="h3">Rest is part of progress.</AppText>
        <AppText>
          Odyssey does not reward unsafe intensity, public comparison, or
          pretending a missed day was complete.
        </AppText>
      </Card>
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.aqua,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  note: { gap: spacing.sm, backgroundColor: 'rgba(255,240,199,0.94)' },
});
