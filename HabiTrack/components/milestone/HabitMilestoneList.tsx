import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { HabitMilestoneCard } from './HabitMilestoneCard';
import { HabitMilestoneHeader } from './HabitMilestoneHeader';

export function HabitMilestoneList({
  data,
}: {
  data: { habit_id: string; habit_name: string; week_streak: number; badges_earned: number }[];
}) {
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

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView
          style={{ gap: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText style={{ fontSize: 22, fontWeight: 'bold' }}>Rank</ThemedText>
          <HabitMilestoneHeader
            totalMilestoneBadges={Number(totalMilestoneBadges)}
            totalCompleteHabits={Number(totalCompleteHabits)}
          />
        </ThemedView>

        <ThemedView style={{ gap: 10, padding: 10 }}>
          {data?.length === 0 && (
            <ThemedText
              type="title"
              style={{
                textAlign: 'center',
                verticalAlign: 'middle',
                height: '100%',
              }}>
              No Habits
            </ThemedText>
          )}
          {data.map(({ habit_name, habit_id, week_streak, badges_earned }) => (
            <HabitMilestoneCard
              key={`${habit_id}`}
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
