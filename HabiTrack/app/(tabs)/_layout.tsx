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
import { calculateDaysBetweenDates, calculateDaysBetweenDOW } from '@/utils/dateUtils';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const dayOfWeek = new Date().getDay();
  const yesterdayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  // fetch latest completedAt for each habit
  const { data, error } = useLiveQuery(
    drizzleDb
      .select({
        habit_id: habit.id,
        last_completed_at: max(habitCompletion.completedAt),
        day_frequency: sql`json_group_array(DISTINCT ${reminder.day} ORDER BY ${reminder.day} ASC)`,

        // here for testing for now
        week_streak: habitMilestone.week_streak,

        streak_started_at: habitMilestone.streak_started_at,
        best_day_streak: habitMilestone.best_day_streak,
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

  // WEEK STREAK HANDLING
  useEffect(() => {
    try {
      console.log('ALL WEEK STREAKS RECALCULATED');
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

          // check if week Streak has been broken
          const lastCompletedStr = last_completed_at.split('T')[0];
          const lastExpectedStr = lastExpectedCompletedDate.toJSON().split('T')[0];
          const weekStreakBroken = lastCompletedStr < lastExpectedStr;

          // if week streak is broken, reset week_streak to 0
          if (weekStreakBroken) {
            try {
              drizzleDb
                .update(habitMilestone)
                .set({
                  week_streak: 0,
                })
                .where(eq(habitMilestone.habit_id, habit_id))
                .execute();

              console.log(`Reset week_streak for habit ${habit_id}`);
            } catch (error) {
              console.error(`Failed to reset streak for habit ${habit_id}:`, error);
            }
          }
        }
      });
    } catch (error) {
      console.error('Error processing habit data:', error);
    }
    // might want to change the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // DAY STREAK HANDLING
  useEffect(() => {
    try {
      console.log('ALL DAY STREAKS RECALCULATED');
      data.forEach(
        ({ habit_id, last_completed_at, day_frequency, streak_started_at, best_day_streak }) => {
          if (last_completed_at !== null) {
            // define 'safe-zone' as the days after a habit is marked completed
            // up until (but not including) the next expected date. Let this next expected date be nextExpectedDate.
            // day streak is broken on the DAY FOLLOWING nextExpectedDate (if the habit wasn't marked as complete on nextExpectedDate).

            const lastCompletedStr = last_completed_at.split('T')[0];
            const lastCompletedAtDOW = new Date(lastCompletedStr).getDay();

            // find DOW of nextExpectedDate
            const frequencyArray = JSON.parse(day_frequency as string);
            let lastCompletedAtIndex = -1;
            for (let i = 0; i < frequencyArray.length; i++) {
              if (frequencyArray[i] === lastCompletedAtDOW) {
                lastCompletedAtIndex = i;
                break;
              }
            }
            const nextExpectedDateIndex =
              lastCompletedAtIndex === frequencyArray.length - 1 ? 0 : lastCompletedAtIndex + 1;
            const nextExpectedDateDOW = frequencyArray[nextExpectedDateIndex];

            // calculate no. of days till nextExpectedDate
            const noOfDaysTillNextExpectedDate = calculateDaysBetweenDOW(
              lastCompletedAtDOW,
              nextExpectedDateDOW,
            );

            // find nextExpectedDate
            const nextExpectedDate = new Date(lastCompletedStr);
            nextExpectedDate.setDate(nextExpectedDate.getDate() + noOfDaysTillNextExpectedDate);

            // define safeZoneEndDate as the day before nextExpectedDate
            const safeZoneEndDate = new Date(nextExpectedDate);
            safeZoneEndDate.setDate(nextExpectedDate.getDate() - 1);

            // get yyyy-mm-dd strings for nextExpectedDate and safeZoneEndDate
            const nextExpectedStr = nextExpectedDate.toJSON().split('T')[0];
            const safeZoneEndStr = safeZoneEndDate.toJSON().split('T')[0];
            const todayStr = new Date().toJSON().split('T')[0];

            // handle day streak logic
            if (todayStr > nextExpectedStr) {
              // streak broken case, set streak_started_at to 'inactive' and update best_day_streak if necessary
              // (outside of nextExpectedDate)

              // find new best_day_streak
              const latestStreak =
                String(streak_started_at) === 'inactive'
                  ? calculateDaysBetweenDates(lastCompletedStr, safeZoneEndStr) + 1
                  : calculateDaysBetweenDates(String(streak_started_at), safeZoneEndStr) + 1;
              const updatedBestDayStreak = Math.max(Number(best_day_streak), latestStreak);

              // update table row
              drizzleDb
                .update(habitMilestone)
                .set({
                  streak_started_at: 'inactive',
                  best_day_streak: updatedBestDayStreak,
                })
                .where(eq(habitMilestone.habit_id, habit_id))
                .execute();
              console.log(`Reset streak_started_at for habit ${habit_id}`);
            } else if (todayStr < nextExpectedStr) {
              // within safeZone, don't change streak_started_at, just update best_day_streak if necessary

              const latestStreak =
                String(streak_started_at) === 'inactive'
                  ? calculateDaysBetweenDates(lastCompletedStr, todayStr) + 1
                  : calculateDaysBetweenDates(String(streak_started_at), todayStr) + 1;
              const updatedBestDayStreak = Math.max(Number(best_day_streak), latestStreak);

              drizzleDb
                .update(habitMilestone)
                .set({
                  best_day_streak: updatedBestDayStreak,
                })
                .where(eq(habitMilestone.habit_id, habit_id))
                .execute();
            } else {
              // case where (todayStr === nextExpectedStr)
              // don't change streak_started_at, just update best_day_streak if necessary

              const latestStreak =
                String(streak_started_at) === 'inactive'
                  ? calculateDaysBetweenDates(lastCompletedStr, safeZoneEndStr) + 1
                  : calculateDaysBetweenDates(String(streak_started_at), safeZoneEndStr) + 1;
              const updatedBestDayStreak = Math.max(Number(best_day_streak), latestStreak);

              drizzleDb
                .update(habitMilestone)
                .set({
                  best_day_streak: updatedBestDayStreak,
                })
                .where(eq(habitMilestone.habit_id, habit_id))
                .execute();
            }
          }
        },
      );
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
