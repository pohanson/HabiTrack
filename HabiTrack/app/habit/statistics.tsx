import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import * as schema from '@/db/schema';
import { habit, habitCompletion, reminder } from '@/db/schema';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { eq, sql } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Toast } from 'toastify-react-native';
import { CompletionRateView } from '@/components/CompletionRateView';

export default function StatisticsScreen() {
  const { id, name } = useLocalSearchParams();
  const navigation = useNavigation();

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  // helper functions
  function getHabitFrequencyArray(habitId: number) {
    try {
      const result = drizzleDb
        .select({
          day_frequency: sql`json_group_array(DISTINCT ${reminder.day})`,
        })
        .from(reminder)
        .where(eq(reminder.habit_id, habitId))
        .get();
      if (!result || !result.day_frequency) {
        return [];
      } else {
        const freq = JSON.parse(result.day_frequency as string);
        return freq.sort((a: number, b: number) => a - b);
      }
    } catch (error) {
      console.error('Error in getHabitFrequencyArray:', error);
      return [];
    }
  }

  function calculateExpectedDays(createdAtDate: string, freq: number[]): number {
    const createdAtDay = new Date(createdAtDate).getDay();
    const today = new Date();
    const todayDay = today.getDay();

    // edge case: createdAtDate and todayDate fall within the same calendar week
    // find the following sunday after createdAt date
    const startOfWeeksBetweenDate = new Date(createdAtDate);
    const daysUntilFollowingSunday = createdAtDay === 0 ? 7 : 7 - createdAtDay;
    startOfWeeksBetweenDate.setDate(startOfWeeksBetweenDate.getDate() + daysUntilFollowingSunday);
    // if today's date < startOfWeeksBetweenDate, then createdAtDate and todayDate fall within the same calendar week
    const sameCalendarWeek =
      today?.toJSON()?.split('T')[0] < startOfWeeksBetweenDate?.toJSON()?.split('T')[0];
    if (sameCalendarWeek) {
      let expectedNoOfDays = 0;
      // if in same calendar week, only count days b/w createdAt and today
      for (let i = 0; i < freq.length; i++) {
        if (freq[i] >= createdAtDay && freq[i] <= todayDay) {
          expectedNoOfDays++;
        }
      }
      return expectedNoOfDays;
    }
    // 1. Calculate expectedDays (createdWeekExpectedDays + thisWeekExpectedDays + weeksBetweenExpectedDays)

    // 1.1 createdWeekExpectedDays calculation
    let createdWeekExpectedDays = 0;
    for (let i = 0; i < freq.length; i++) {
      if (freq[i] >= createdAtDay) {
        createdWeekExpectedDays++;
      }
    }

    // 1.2 thisWeekExpectedDays calculation
    let thisWeekExpectedDays = 0;
    for (let i = 0; i < freq.length; i++) {
      if (freq[i] <= todayDay) {
        thisWeekExpectedDays++;
      }
    }

    // 1.3 weeksBetweenExpectedDays calculation
    // find the saturday preceding today's date
    const endOfWeeksBetweenDate = new Date(today);
    const daysSincePreviousSaturday = todayDay === 6 ? 7 : todayDay + 1;
    endOfWeeksBetweenDate.setDate(endOfWeeksBetweenDate.getDate() - daysSincePreviousSaturday);
    // calculate no. of weeks b/w these 2 dates
    const weeksBetween = Math.ceil(
      (endOfWeeksBetweenDate.getTime() - startOfWeeksBetweenDate.getTime()) /
        (1000 * 60 * 60 * 24 * 7),
    );

    // 1.4 calculate expectedDays
    const expectedNoOfDays =
      createdWeekExpectedDays + weeksBetween * freq.length + thisWeekExpectedDays;
    return expectedNoOfDays;
  }

  // set header title
  useEffect(() => {
    if (!id) return;
    navigation.setOptions({ headerTitle: 'Statistics [' + name + ']' });
  }, [id, name, navigation]);

  // get created_at data
  const { data: createdAtData, error: createdAtError } = useLiveQuery(
    drizzleDb
      .select({
        created_at: habit.createdAt,
      })
      .from(habit)
      .where(eq(habit.id, Number(id))),
  );
  if (createdAtError) {
    console.error('Error fetching created_at', createdAtError);
    Toast.error('Error fetching created_at data.');
  }

  // get completed_at data
  const { data: completedAtData, error: completedAtError } = useLiveQuery(
    drizzleDb
      .select({
        completed_at: habitCompletion.completedAt,
      })
      .from(habitCompletion)
      .where(eq(habitCompletion.habit_id, Number(id))),
  );
  if (completedAtError) {
    console.error('Error fetching created_at', completedAtError);
    Toast.error('Error fetching created_at data.');
  }

  // get created at date as a string
  const createdAtDate = createdAtData?.[0]?.created_at || '';

  // get frequency array for this habit
  const freq = getHabitFrequencyArray(Number(id));

  // get expectedNoOfDays for this habit (calculated since createdAtDate)
  const expectedNoOfDays = calculateExpectedDays(createdAtDate, freq);
  console.log(completedAtData);
  const actualNoOfDays = completedAtData.filter(
    (entry) => String(entry.completed_at) >= createdAtDate,
  ).length;

  return (
    <ScrollView style={{ flex: 1, gap: 10, padding: 10 }}>
      <CalendarView />
      <CompletionRateView
        createdAt={createdAtDate}
        actualNoOfDays={actualNoOfDays}
        expectedNoOfDays={expectedNoOfDays}
        pieChartSize={85}
      />
      <DayStreakView />
    </ScrollView>
  );
}

const CalendarView = () => {
  return (
    <ThemedView>
      <ThemedText>Calendar View</ThemedText>
    </ThemedView>
  );
};

const DayStreakView = () => {
  return (
    <ThemedView>
      <ThemedText>Day Streak View</ThemedText>
    </ThemedView>
  );
};
