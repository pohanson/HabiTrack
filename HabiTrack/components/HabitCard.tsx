import * as schema from '@/db/schema';
import {
  Habit,
  habitCompletion,
  HabitCompletion,
  habitMilestone,
  HabitMilestone,
  reminder,
} from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { eq, sql, and, gte } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { IconButton } from './IconButton';
import { ThemedText } from './ThemedText';
import { ToggleInput } from './ToggleInput';
import { Shadows } from '../constants/Shadows';

export function HabitCard({
  habit,
  habit_completion,
  habit_milestone,
  today = null,
  setRefresh = () => {},
}: {
  habit: Habit;
  habit_completion: HabitCompletion | null;
  habit_milestone: HabitMilestone | null;
  today?: string | null;
  setRefresh?: Dispatch<SetStateAction<number>>;
}) {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const onEditButtonPressed = (habitId: number) => {
    router.push({
      pathname: '/habit/edit',
      params: { id: habitId },
    });
  };

  // get the completedAt dates for a habit since Sunday as an array of date strings
  async function getCompletionsThisWeek(habitId: number): Promise<string[]> {
    const todayDate = new Date();
    const lastSundayDate = new Date();
    lastSundayDate.setDate(todayDate.getDate() - todayDate.getDay());
    const lastSundayDateStr = lastSundayDate.toJSON().split('T')[0];
    const complete = await drizzleDb
      .select({ completed_at: habitCompletion.completedAt })
      .from(habitCompletion)
      .where(
        and(
          eq(habitCompletion.habit_id, habitId),
          gte(habitCompletion.completedAt, lastSundayDateStr),
        ),
      )
      .all();
    return complete.map((obj) => obj.completed_at);
  }

  // get the frequency array of a habit
  async function getHabitFrequencyArray(habitId: number) {
    const result = await drizzleDb
      .select({
        day_frequency: sql`json_group_array(DISTINCT ${reminder.day})`,
      })
      .from(reminder)
      .where(eq(reminder.habit_id, habitId))
      .get();
    if (!result || !result.day_frequency) {
      return [];
    } else {
      return JSON.parse(result.day_frequency as string);
    }
  }

  const toggleHabitCompletion = async () => {
    if (today == null) {
      return;
    }
    if (habit_completion === null) {
      // habit is not completed today, so add completion
      drizzleDb
        .insert(habitCompletion)
        .values({
          habit_id: habit.id,
          completedAt: today,
        })
        .execute();

      // Then check if all habits for the week are completed. If so, increment week_streak
      const completionsThisWeek = getCompletionsThisWeek(habit.id);
      const noOfCompletionsThisWeek = (await completionsThisWeek).length;
      const frequencyArray = getHabitFrequencyArray(habit.id);
      if (noOfCompletionsThisWeek >= (await frequencyArray).length) {
        drizzleDb
          .update(habitMilestone)
          .set({
            week_streak: (habit_milestone?.week_streak || 0) + 1,
          })
          .where(eq(habitMilestone.habit_id, habit.id))
          .execute();
      }
    } else {
      // habit is already completed today, remove completion
      drizzleDb
        .delete(habitCompletion)
        .where(eq(habitCompletion.id, habit_completion.id))
        .execute();
    }
    setRefresh((prev) => prev + 1);
  };

  return (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: useThemeColor({}, 'card'),
          borderColor: useThemeColor({}, 'border'),
          borderWidth: 0,
          borderRadius: 15,
          padding: 14,
        },
        Shadows.large,
      ]}>
      <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>{habit.name}</ThemedText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <IconButton iconName="pencil" onPress={() => onEditButtonPressed(habit.id)} />

        {today == null || (
          <ToggleInput
            label=""
            iconName="checkmark"
            selected={habit_completion !== null}
            iconSize={48}
            toggleSelected={toggleHabitCompletion}
          />
        )}
      </View>
    </View>
  );
}
