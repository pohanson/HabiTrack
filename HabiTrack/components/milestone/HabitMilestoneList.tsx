import { DatabaseService } from '@/services';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { HabitMilestoneCard } from './HabitMilestoneCard';
import { HabitMilestoneHeader } from './HabitMilestoneHeader';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

export function HabitMilestoneList({ userId = undefined }: { userId?: string | null }) {
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<
    { habit_id: string; habit_name: string; week_streak: number; badges_earned: number }[]
  >([]);

  const databaseService = DatabaseService.instance;

  useEffect(() => {
    databaseService.habitMilestone.getAllMilestonesQuery(userId).then(setData);
  }, [databaseService.habitMilestone, userId, refresh]);

  // extra calcs for active badges. Define complete habits as habits with all 5 milestone badges
  const totalMilestoneBadges = useMemo(
    () =>
      data?.reduce((acc: number, item: any) => Number(acc) + Number(item.badges_earned), 0) || 0,
    [data],
  );
  const totalCompleteHabits = useMemo(
    () => data?.filter((item) => Number(item.badges_earned) >= 5).length,
    [data],
  );

  useFocusEffect(
    useCallback(() => {
      setRefresh((prev) => prev + 1);
    }, []),
  );

  return (
    <ThemedView testID="habit-milestone-list" style={{ flex: 1 }}>
      {data?.length === 0 && (
        <ThemedView testID="no-habits-container">
          <ThemedText testID="no-habits-text">No habits</ThemedText>
        </ThemedView>
      )}

      <ScrollView testID="habit-milestone-scrollview">
        <ThemedView
          testID="habit-milestone-ranks-section"
          style={{ gap: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText testID="ranks-title" style={{ fontSize: 22, fontWeight: 'bold' }}>
            Ranks
          </ThemedText>
          <HabitMilestoneHeader
            testID="habit-milestone-header"
            totalMilestoneBadges={Number(totalMilestoneBadges)}
            totalCompleteHabits={Number(totalCompleteHabits)}
          />
        </ThemedView>

        <ThemedView testID="milestone-list-container" style={{ gap: 10, padding: 10 }}>
          {data.map(({ habit_name, habit_id, week_streak, badges_earned }) => (
            <HabitMilestoneCard
              testID={`habit-milestone-card-${habit_id}`}
              key={`${habit_id}-${refresh}`}
              habitName={habit_name || 'No name'}
              weekStreak={week_streak}
              badgesEarned={badges_earned}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
