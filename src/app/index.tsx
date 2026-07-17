import { useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { odysseyRepository } from '@/data/repositories/odysseyRepository';
import { colors } from '@/design/tokens';

export default function Index() {
  const boss = useQuery({
    queryKey: ['active-boss'],
    queryFn: () => odysseyRepository.hasActiveBoss(),
  });
  if (boss.isLoading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.coral} />
      </View>
    );
  return <Redirect href={boss.data ? '/(tabs)/today' : '/onboarding'} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sky,
  },
});
