import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { habit, habitCompletion, reminder, habitMilestone } from '@/db/schema';
import { eq, max, sql } from 'drizzle-orm';
import { Toast } from 'toastify-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const dayOfWeek = new Date().getDay();
  const yesterdayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  // fetch latest completedAt for each habits
  const { data, error } = useLiveQuery(
    drizzleDb
      .select({
        habit_id: habit.id,
        last_completed_at: max(habitCompletion.completedAt),
        day_frequency: sql`json_group_array(DISTINCT ${reminder.day})`,

        // here for testing for now
        week_streak: habitMilestone.week_streak,
      })
      .from(habit)
      .leftJoin(habitMilestone, eq(habit.id, habitMilestone.habit_id))
      .innerJoin(reminder, eq(habit.id, reminder.habit_id))

      // here for testing for now
      .leftJoin(habitCompletion, eq(habit.id, habitCompletion.habit_id))

      .groupBy(habit.id),
  );

  if (error) {
    console.error('Error fetching habits:', error);
    Toast.error('Error fetching habits.');
  }

  useEffect(() => {
    try {
      data.forEach(({ habit_id, last_completed_at, day_frequency }) => {
        if (last_completed_at !== null) {
          // calculate the no. of days since last expected habit day
          const frequencyArray = JSON.parse(day_frequency as string);
          let backTrackCount = 1;
          for (let i = yesterdayOfWeek; ; i = i === 0 ? 6 : i - 1) {
            if (frequencyArray.includes(i)) {
              break;
            }
            backTrackCount++;
            if ((i === 0 ? 6 : i - 1) === yesterdayOfWeek) {
              break;
            }
          }

          // calculate the last expected date of completion
          const daysBack = backTrackCount > 7 ? 1 : backTrackCount;
          const todayDate = new Date();
          const lastExpectedCompletedDate = new Date();
          lastExpectedCompletedDate.setDate(todayDate.getDate() - daysBack);

          // check if streak has been broken
          const lastCompletedStr = last_completed_at.split('T')[0];
          const lastExpectedStr = lastExpectedCompletedDate.toJSON().split('T')[0];
          console.log('last expected date of completion', lastExpectedStr);
          const streakBroken = lastCompletedStr < lastExpectedStr;
          console.log('streak broken?:', streakBroken);

          // if streak is broken, reset week_streak to 0
          if (streakBroken) {
            try {
              drizzleDb
                .update(habitMilestone)
                .set({ week_streak: 0 })
                .where(eq(habitMilestone.habit_id, habit_id))
                .execute();

              console.log(`Reset streak for habit ${habit_id}`);
            } catch (error) {
              console.error(`Failed to reset streak for habit ${habit_id}:`, error);
            }
          }
        }
        console.log(data);
      });
    } catch (error) {
      console.error('Error processing habit data:', error);
    }
    // might want to change the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.card,
        },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: theme.card,
          },
          default: {
            backgroundColor: theme.card,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Habits',
          headerTitle: 'Your Habits',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="milestones"
        options={{
          title: 'Milestones',
          headerTitle: 'Milestones',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="star" color={color} />,
        }}
      />
    </Tabs>
  );
}
