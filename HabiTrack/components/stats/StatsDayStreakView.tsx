import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SingleStatsDayStreakCard } from './SingleStatsDayStreakCard';

export function StatsDayStreakView({
  activeStreak,
  bestStreak,
}: {
  activeStreak: number;
  bestStreak: number;
}) {
  const bottomPadding = useSafeAreaInsets().bottom;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
        paddingBottom: bottomPadding,
      }}>
      <SingleStatsDayStreakCard label="Active Streak" streak={activeStreak} />
      <SingleStatsDayStreakCard label="Best Streak" streak={bestStreak} />
    </View>
  );
}
