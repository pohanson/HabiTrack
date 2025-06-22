import React, { useCallback, useState } from 'react';
import { HabitMilestoneCard } from '@/components/HabitMilestoneCard';
import { useSQLiteContext } from 'expo-sqlite';
import { habit, habitMilestone } from '@/db/schema';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { Toast } from 'toastify-react-native';
import { useFocusEffect } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { DimensionValue, ScrollView } from 'react-native';

function decimalToPercentage(decimal: number): DimensionValue {
  return `${Math.min(99, Math.round(decimal * 100))}%`;
}

export default function Milestones() {
  const [refresh, setRefresh] = useState(0);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useFocusEffect(
    useCallback(() => {
      console.log('milestones page refeshed');
      console.log('milestone data loaded:', data);
      setRefresh((prev) => prev + 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const { data, error } = useLiveQuery(
    drizzleDb
      .select({
        habit_id: habitMilestone.habit_id,
        habit_name: habit.name,
        week_streak: habitMilestone.week_streak,
        badges_earned: habitMilestone.badges_earned,
      })
      .from(habitMilestone)
      .leftJoin(habit, eq(habit.id, habitMilestone.habit_id)),
    [refresh],
  );

  if (error) {
    console.error('Error fetching milestones:', error);
    Toast.error('Error fetching milestones.');
  }

  return (
    <ThemedView>
      {data?.length === 0 && (
        <ThemedView>
          <ThemedText>{'No habits yet\nCreate a habit to get started!'}</ThemedText>
        </ThemedView>
      )}
      <ScrollView>
        <ThemedView style={{ gap: 10, padding: 10 }}>
          {data.map(({ habit_name, habit_id, week_streak, badges_earned }) => (
            <HabitMilestoneCard
              key={`${habit_id}-${refresh}`}
              habitName={habit_name || 'No name'}
              badgeCompletions={[
                week_streak >= 1 ? '100%' : decimalToPercentage(week_streak / 1),
                week_streak >= 3 ? '100%' : decimalToPercentage(week_streak / 3),
                week_streak >= 12 ? '100%' : decimalToPercentage(week_streak / 12),
                week_streak >= 26 ? '100%' : decimalToPercentage(week_streak / 26),
                week_streak >= 52 ? '100%' : decimalToPercentage(week_streak / 52),
              ]}
              badgesEarned={badges_earned}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
