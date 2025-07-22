import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DatabaseService } from '@/services';
import { calculateDaysBetweenDates, calculateDaysBetweenDOW } from '@/utils/dateUtils';
import { getBadgesEarned } from '@/utils/milestoneUtils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const databaseService = DatabaseService.instance;

  // fetch latest completedAt for each habit
  const { data, error } = useLiveQuery(databaseService.habit.getHabitStatsWithRemindersQuery());

  if (error) {
    console.error('Error fetching habits:', error);
    Toast.error('Error fetching habits.');
  }

  // DAY STREAK HANDLING
  useEffect(() => {
    try {
      if (process.env.NODE_ENV === 'development') console.log('ALL DAY STREAKS RECALCULATED');
      data.forEach(
        async ({
          habit_id,
          last_completed_at,
          day_frequency,
          streak_started_at,
          best_day_streak,
          frequency_modified_at,
        }) => {
          const frequencyArray = JSON.parse(day_frequency as string);
          let lastCompletedAt = last_completed_at;
          const frequencyModifiedAt = frequency_modified_at.split('T')[0];

          // filter out the 'phantom completed at' (where last_completed_at is today but frequency does not include today)
          if (
            String(last_completed_at) === String(frequencyModifiedAt) &&
            !frequencyArray.includes(new Date(String(last_completed_at)).getDay())
          ) {
            lastCompletedAt = null;
            console.log('Filtered out phantom completedAt');
          }

          if (lastCompletedAt !== null) {
            // define 'safe-zone' as the days after a habit is marked completed
            // up until (but not including) the next expected date. Let this next expected date be nextExpectedDate.
            // day streak is broken on the DAY FOLLOWING nextExpectedDate (if the habit wasn't marked as complete on nextExpectedDate).

            const lastCompletedStr = lastCompletedAt.split('T')[0];
            const lastCompletedAtDOW = new Date(lastCompletedStr).getDay();

            // find DOW of nextExpectedDate
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

            if (process.env.NODE_ENV === 'development')
              console.log('nextExpectedDate calculated as', nextExpectedDate);

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
              if (process.env.NODE_ENV === 'development')
                console.log(habit_id, 'Streak Broken, streak_started_at reset to inactive');
              // find new best_day_streak
              const latestStreak =
                String(streak_started_at) === 'inactive'
                  ? calculateDaysBetweenDates(lastCompletedStr, safeZoneEndStr) + 1
                  : calculateDaysBetweenDates(String(streak_started_at), safeZoneEndStr) + 1;

              const updatedBestDayStreak = Math.max(Number(best_day_streak), latestStreak);

              // update badges earned (based on best day streak)
              const updatedBadgesEarned = getBadgesEarned(Math.floor(updatedBestDayStreak / 7));

              // update table row
              databaseService.habitMilestone.updateMilestoneByHabitId(habit_id, {
                streak_started_at: 'inactive',
                best_day_streak: updatedBestDayStreak,

                // reset week_streak to 0 too
                week_streak: 0,
                badges_earned: updatedBadgesEarned,
              });
            } else if (todayStr < nextExpectedStr) {
              // within safeZone, don't change streak_started_at, just update best_day_streak if necessary
              if (process.env.NODE_ENV === 'development')
                console.log(habit_id, 'In Safezone, streak_started_at unchanged');
              const latestStreak =
                String(streak_started_at) === 'inactive'
                  ? calculateDaysBetweenDates(lastCompletedStr, todayStr) + 1
                  : calculateDaysBetweenDates(String(streak_started_at), todayStr) + 1;
              const updatedBestDayStreak = Math.max(Number(best_day_streak), latestStreak);

              // handling week_streak (using current streak data)
              const updatedWeekStreak = Math.floor(latestStreak / 7);

              // update badges earned (based on best day streak)
              const updatedBadgesEarned = getBadgesEarned(Math.floor(updatedBestDayStreak / 7));

              databaseService.habitMilestone.updateMilestoneByHabitId(habit_id, {
                best_day_streak: updatedBestDayStreak,

                week_streak: updatedWeekStreak,
                badges_earned: updatedBadgesEarned,
              });
            } else {
              // case where (todayStr === nextExpectedStr)
              // don't change streak_started_at, just update best_day_streak if necessary
              if (process.env.NODE_ENV === 'development')
                console.log(
                  habit_id,
                  'is on next expected day (since last completedAt), streak_started_at unchanged',
                );
              const latestStreak =
                streak_started_at === 'inactive'
                  ? calculateDaysBetweenDates(lastCompletedStr, safeZoneEndStr) + 1
                  : calculateDaysBetweenDates(String(streak_started_at), safeZoneEndStr) + 1;
              const updatedBestDayStreak = Math.max(Number(best_day_streak), latestStreak);

              // handling week_streak (using current streak data)
              const updatedWeekStreak = Math.floor(latestStreak / 7);

              // update badges earned (based on best day streak)
              const updatedBadgesEarned = getBadgesEarned(Math.floor(updatedBestDayStreak / 7));

              databaseService.habitMilestone.updateMilestoneByHabitId(habit_id, {
                best_day_streak: updatedBestDayStreak,

                week_streak: updatedWeekStreak,
                badges_earned: updatedBadgesEarned,
              });
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
      <Tabs.Screen
        name="socials"
        options={{
          title: 'Socials',
          headerTitle: 'Socials',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerTitle: 'Account',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.crop.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
