import { ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useFocusEffect } from 'expo-router';

import { IconButton } from '@/components/IconButton';
import * as schema from '@/db/schema';
import { habit, habitCompletion, habitMilestone, reminder } from '@/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Toast } from 'toastify-react-native';
import { HabitCard } from '@/components/HabitCard';

export default function HomeScreen() {
  const [refresh, setRefresh] = useState(0);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const today = new Date().toJSON().split('T')[0];
  const dayOfWeek = new Date().getDay();
  // const colors = Colors[useColorScheme() || 'light'];
  const { data, error } = useLiveQuery(
    drizzleDb
      .select({
        habit: habit,
        habit_completion: habitCompletion,
        reminder: reminder,
        habit_milestone: habitMilestone,
      })
      .from(reminder)
      .where(eq(reminder.day, dayOfWeek))
      .innerJoin(habit, eq(reminder.habit_id, habit.id))
      .leftJoin(
        habitCompletion,
        and(eq(habit.id, habitCompletion.habit_id), eq(habitCompletion.completedAt, today)),
      )
      // added for habitMilestone
      .leftJoin(habitMilestone, eq(habit.id, habitMilestone.habit_id))
      .orderBy(asc(habitCompletion.completedAt), asc(reminder.time)),
    [refresh],
  );
  if (error) {
    console.error('Error fetching habits:', error);
    Toast.error('Error fetching habits.');
  }

  useFocusEffect(useCallback(() => setRefresh((prev) => prev + 1), []));

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <ThemedText type="title" style={{ fontSize: 26 }}>
          Today&apos;s Habits
        </ThemedText>
        <IconButton
          iconName="list.bullet"
          onPress={() => {
            router.push('/habit/full-list');
          }}
        />
        <IconButton iconName="plus" onPress={() => router.push('/habit/create')} />
      </ThemedView>
      {data?.length === 0 && <ThemedText>No habits for today.</ThemedText>}
      <ScrollView>
        <ThemedView style={{ gap: 10, padding: 10 }}>
          {data.map(({ habit, habit_completion, habit_milestone }) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              habit_completion={habit_completion}
              habit_milestone={habit_milestone}
              today={today}
              setRefresh={setRefresh}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
