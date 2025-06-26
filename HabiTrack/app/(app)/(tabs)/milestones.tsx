import { HabitMilestoneCard } from '@/components/HabitMilestoneCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatabaseService } from '@/services';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';
import { HabitMilestoneHeader } from '@/components/HabitMilestoneHeader';

export default function Milestones() {
  const [refresh, setRefresh] = useState(0);

  const databaseService = DatabaseService.instance;
  const { data, error } = useLiveQuery(databaseService.habitMilestone.getAllMilestonesQuery(), [
    refresh,
  ]);

  // extra calcs for active badges. Define complete habits as habits with all 5 milestone badges
  const totalMilestoneBadges =
    data?.reduce((acc: number, item: any) => Number(acc) + Number(item.badges_earned), 0) || 0;
  const totalCompleteHabits = data?.filter((item) => Number(item.badges_earned) >= 5).length;

  if (error) {
    console.error('Error fetching milestones:', error);
    Toast.error('Error fetching milestones.');
  }

  useFocusEffect(
    useCallback(() => {
      console.log('milestones page refeshed');
      setRefresh((prev) => prev + 1);
    }, []),
  );

  // for console log testing
  useEffect(() => {
    if (data) {
      console.log('milestone data loaded:', data);
    }
  }, [data]);

  return (
    <ThemedView style={{ flex: 1 }}>
      {data?.length === 0 && (
        <ThemedView>
          <ThemedText>{'No habits yet\nCreate a habit to get started!'}</ThemedText>
        </ThemedView>
      )}

      <ScrollView>
        <ThemedView
          style={{ gap: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText style={{ fontSize: 22, fontWeight: 'bold' }}>Your Ranks</ThemedText>
          <HabitMilestoneHeader
            totalMilestoneBadges={Number(totalMilestoneBadges)}
            totalCompleteHabits={Number(totalCompleteHabits)}
          />
        </ThemedView>

        <ThemedView style={{ gap: 10, padding: 10 }}>
          {data.map(({ habit_name, habit_id, week_streak, badges_earned }) => (
            <HabitMilestoneCard
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
