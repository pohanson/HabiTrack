import { Colors } from '@/constants/Colors';
import { Shadows } from '@/constants/Shadows';
import { useColorScheme } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

export function SingleStatsDayStreakCard({ label, streak }: { label: string; streak: number }) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView
      style={[
        {
          alignItems: 'center',
          backgroundColor: theme.card,
          borderRadius: 20,
          padding: 12,
          overflow: 'hidden',
          flex: 1,
        },
        Shadows.large,
      ]}>
      <ThemedText style={{ color: theme.header, fontWeight: 'bold', fontSize: 22, padding: 5 }}>
        {label}
      </ThemedText>
      <ThemedText style={{ fontSize: 24 }}>{getStreakEmoji(streak)}</ThemedText>
      <ThemedText style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>
        {streak} day{streak !== 1 && streak !== 0 && 's'}
      </ThemedText>
    </ThemedView>
  );
}
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
