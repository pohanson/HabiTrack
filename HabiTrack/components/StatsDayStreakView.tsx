import { useColorScheme, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Shadows } from '@/constants/Shadows';
import { Colors } from '@/constants/Colors';

export const StatsDayStreakView = ({
  activeStreak,
  bestStreak,
}: {
  activeStreak: number;
  bestStreak: number;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}>
      <ThemedView
        style={[
          {
            alignItems: 'center',
            backgroundColor: theme.card,
            borderRadius: 20,
            padding: 12,
            overflow: 'hidden',
            flex: 1,
            marginRight: 5,
          },
          Shadows.large,
        ]}>
        <ThemedText style={{ color: theme.header, fontWeight: 'bold', fontSize: 22, padding: 5 }}>
          Active Streak
        </ThemedText>
        <ThemedText style={{ fontSize: 24 }}>{getStreakEmoji(activeStreak)}</ThemedText>
        <ThemedText style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>
          {activeStreak} day{activeStreak !== 1 && 's'}
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={[
          {
            alignItems: 'center',
            backgroundColor: theme.card,
            borderRadius: 20,
            padding: 12,
            overflow: 'hidden',
            flex: 1,
            marginLeft: 5,
          },
          Shadows.large,
        ]}>
        <ThemedText style={{ color: theme.header, fontWeight: 'bold', fontSize: 22, padding: 5 }}>
          Best Streak
        </ThemedText>
        <ThemedText style={{ fontSize: 24 }}>{getStreakEmoji(bestStreak)}</ThemedText>
        <ThemedText style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>
          {bestStreak} day{bestStreak !== 1 && 's'}
        </ThemedText>
      </ThemedView>
    </View>
  );
};

function getStreakEmoji(activeStreak: number): string {
  if (activeStreak <= 0) return '😴';
  if (activeStreak === 1) return '🌱';
  if (activeStreak <= 3) return '⚡';
  if (activeStreak <= 7) return '⚡⚡';
  if (activeStreak <= 14) return '⚡⚡⚡';
  if (activeStreak <= 30) return '🔥';
  if (activeStreak <= 60) return '🔥🔥';
  if (activeStreak <= 90) return '🔥🔥🔥';
  if (activeStreak <= 120) return '🏆';
  if (activeStreak <= 150) return '🏆🏆';
  if (activeStreak <= 180) return '🏆🏆🏆';
  if (activeStreak <= 210) return '⭐';
  if (activeStreak <= 240) return '⭐⭐';
  if (activeStreak <= 270) return '⭐⭐⭐';
  if (activeStreak <= 300) return '💎';
  if (activeStreak <= 330) return '💎💎';
  if (activeStreak <= 365) return '💎💎💎';
  return '👑👑👑';
}
