import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScenicScreen } from '@/components/ScenicScreen';
import { resolveProofUri } from '@/data/media/proofStore';
import { colors, radii, spacing } from '@/design/tokens';
import { useHistory } from '@/features/queries';

export default function JournalScreen() {
  const router = useRouter();
  const history = useHistory();
  return (
    <ScenicScreen scroll={false} contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View>
          <AppText variant="label">PRIVATE HISTORY</AppText>
          <AppText variant="h1">Proof Journal</AppText>
        </View>
        <Button label="Close" variant="quiet" onPress={() => router.back()} />
      </View>
      <FlashList
        data={history.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card style={styles.empty}>
            <AppText variant="h2">Your postcards begin here.</AppText>
            <AppText>
              Complete or partially complete a Quest to create the first journal
              entry.
            </AppText>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={styles.entry}>
            {item.thumbnailPath ? (
              <Image
                source={resolveProofUri(item.thumbnailPath)}
                style={styles.image}
                contentFit="cover"
                accessibilityLabel={`Private proof for ${item.title}`}
              />
            ) : (
              <View style={styles.placeholder}>
                <AppText variant="small">TEXT-ONLY ENTRY</AppText>
              </View>
            )}
            <View style={styles.copy}>
              <AppText variant="label">
                {item.localDate} · {item.outcome.toUpperCase()}
              </AppText>
              <AppText variant="h3">{item.title}</AppText>
              <AppText>
                {item.targetIntensity
                  ? `${item.actualIntensity ?? 0} of ${item.targetIntensity} ${item.unit}`
                  : 'Unmeasured completion'}
              </AppText>
              {item.note && <AppText variant="small">{item.note}</AppText>}
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      />
    </ScenicScreen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: { paddingBottom: 40 },
  empty: { gap: spacing.sm },
  entry: { overflow: 'hidden', paddingHorizontal: 0, paddingTop: 0 },
  image: { width: '100%', aspectRatio: 4 / 3, backgroundColor: colors.sand },
  placeholder: {
    height: 96,
    backgroundColor: colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
  },
  copy: { gap: spacing.xs, padding: spacing.lg },
});
