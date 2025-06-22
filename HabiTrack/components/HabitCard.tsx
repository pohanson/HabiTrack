import {
  Habit,
  habitCompletion,
  HabitCompletion,
  HabitMilestone,
  habitMilestone,
  reminder,
} from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DatabaseService } from '@/services';
import { calculateDaysBetweenDates } from '@/utils/dateUtils';
import { and, eq, gte, sql } from 'drizzle-orm';
import { router } from 'expo-router';
import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { Shadows } from '../constants/Shadows';
import { IconButton } from './IconButton';
import { ThemedText } from './ThemedText';
import { ToggleInput } from './ToggleInput';

export function HabitCard({
  habit,
  habit_completion,
  habit_milestone,
  today = null,
  isCompletable = true,
  setRefresh = () => {},
}: {
  habit: Habit;
  habit_completion: HabitCompletion | null;
  habit_milestone: HabitMilestone | null;
  today?: string | null;
  isCompletable?: boolean;
  setRefresh?: Dispatch<SetStateAction<number>>;
}) {
  const databaseService = DatabaseService.instance;
  const drizzleDb = databaseService.db;

  const onEditButtonPressed = (habitId: string) => {
    router.push({
      pathname: '/habit/edit',
      params: { id: habitId },
    });
  };

  const onStatsButtonPressed = (habitId: string, habitName: string) => {
    router.push({
      pathname: '/habit/statistics',
      params: { id: habitId, name: habitName },
    });
  };

  // get the completedAt dates for a habit since Sunday as an array of date strings
  async function getCompletionsThisWeek(habitId: string): Promise<string[]> {
    try {
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
      return complete.map((obj) => obj.completed_at as string);
    } catch (error) {
      console.error('Error in getCompletionsThisWeek:', error);
      return [];
    }
  }

  // get the frequency array of a habit
  async function getHabitFrequencyArray(habitId: string) {
    try {
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
        const freq = JSON.parse(result.day_frequency as string);
        return freq.sort((e: number, f: number) => e - f);
      }
    } catch (error) {
      console.error('Error in getHabitFrequencyArray:', error);
      return [];
    }
  }

  // calculate the badges_earned for a given week_streak
  function getBadgesEarned(weekStreak: number) {
    try {
      if (weekStreak >= 0 && weekStreak < 1) {
        return 0;
      } else if (weekStreak >= 1 && weekStreak < 3) {
        return 1;
      } else if (weekStreak >= 3 && weekStreak < 12) {
        return 2;
      } else if (weekStreak >= 12 && weekStreak < 26) {
        return 3;
      } else if (weekStreak >= 26 && weekStreak < 52) {
        return 4;
      } else if (weekStreak >= 52) {
        return 5;
      } else {
        return -1;
      }
    } catch (error) {
      console.error('Error in getBadgesEarned:', error);
      return -1;
    }
  }

  const toggleHabitCompletion = async () => {
    if (today == null) {
      return;
    }

    const frequencyArray = await getHabitFrequencyArray(habit.id);
    const todayDOW = new Date(today).getDay();
    const todayDateStr = new Date().toJSON().split('T')[0];

    if (habit_completion === null) {
      // TICKING HABIT (1. Completion data handling, 2. Milestone data handling, 3. Daily streaks data handling)

      // 1. Completion data handling
      databaseService.habitCompletion.toggleTodayHabitCompletion(habit.id);

      // 2. Milestone data handling

      // Then check if all habits for the week are completed
      const completionsThisWeek = await getCompletionsThisWeek(habit.id);
      const noOfCompletionsThisWeek = completionsThisWeek.length;
      // If so, increment week_streak and update badges_earned
      if (noOfCompletionsThisWeek >= frequencyArray.length) {
        const newWeekStreak = (habit_milestone?.week_streak || 0) + 1;
        const calculatedBadges = Number(getBadgesEarned(newWeekStreak));
        const newBadgesEarned = Math.max(calculatedBadges, habit_milestone?.badges_earned || 0);

        await drizzleDb
          .update(habitMilestone)
          .set({
            week_streak: newWeekStreak,
            badges_earned: newBadgesEarned,
          })
          .where(eq(habitMilestone.habit_id, habit.id))
          .execute();
        console.log('Badges_earned for habit.id', habit.id, ':', newBadgesEarned);
      }

      // 3. Daily streaks data handling

      const updatedStreakStartedAt =
        String(habit_milestone?.streak_started_at) === 'inactive'
          ? todayDateStr
          : String(habit_milestone?.streak_started_at);
      const currentStreak =
        String(habit_milestone?.streak_started_at) === 'inactive'
          ? 1
          : calculateDaysBetweenDates(String(habit_milestone?.streak_started_at), todayDateStr) + 1;
      const updatedPrevBestDayStreak = Number(habit_milestone?.best_day_streak);
      const updatedBestDayStreak = Math.max(
        currentStreak,
        Number(habit_milestone?.best_day_streak),
      );
      await drizzleDb
        .update(habitMilestone)
        .set({
          streak_started_at: updatedStreakStartedAt,
          best_day_streak: updatedBestDayStreak,
          prev_best_day_streak: updatedPrevBestDayStreak,
        })
        .where(eq(habitMilestone.habit_id, habit.id))
        .execute();
    } else {
      // UNTICKING HABIT (1. Milestone data handling, 2. Daily streaks data handling, 3. Completion data handling)

      // 1. Milestone data handling

      // get current completions (all completions since Sunday)
      const currentCompletions = await getCompletionsThisWeek(habit.id);

      // check if today's DOW is the habit frequency's last DOW && reached full week completion
      const lastDOW = frequencyArray[frequencyArray.length - 1];
      if (todayDOW === lastDOW && currentCompletions.length >= frequencyArray.length) {
        // decrement week_streak and update badges_earned (if necessary)

        // but first make sure badges_earned DOES decrement on days of potentially earning new badge when unticked,
        // (i.e. when user accidentally ticks that habit then unticks it),
        // but does not decrement on any other day

        // Check if today is a potential week (i.e. week where ticking habit would trigger badges_earned increment)
        const oldWeekStreak = habit_milestone?.week_streak || 0;
        const newWeekStreak = Math.max(0, (habit_milestone?.week_streak || 0) - 1);
        const oldBadgesEarned = getBadgesEarned(oldWeekStreak);
        const newBadgesEarned = getBadgesEarned(newWeekStreak);
        const currentBadgesEarned = habit_milestone?.badges_earned || 0;
        const isPotentialWeek = oldBadgesEarned !== newBadgesEarned;

        let UpdatedBadgesEarned = -1;

        if (isPotentialWeek) {
          // If it IS a potential week, check if current badges_earned > potential badges_earned
          if (currentBadgesEarned > oldBadgesEarned) {
            // If current badges_earned > potential badges_earned, don't decrease badges_earned
            UpdatedBadgesEarned = currentBadgesEarned;
          } else {
            // else current badges_earned < potential badges_earned, decrease badges_earned in this case
            UpdatedBadgesEarned = newBadgesEarned;
          }
        } else {
          // If it is NOT a potential week, dont decrease badges_earned (new badges_earned === currentBadgesEarned)
          UpdatedBadgesEarned = currentBadgesEarned;
        }

        await drizzleDb
          .update(habitMilestone)
          .set({
            week_streak: newWeekStreak,
            badges_earned: UpdatedBadgesEarned,
          })
          .where(eq(habitMilestone.habit_id, habit.id))
          .execute();
        console.log('Badges_earned for habit.id', habit.id, ':', UpdatedBadgesEarned);
      }

      // 2. Daily streaks data handling

      const updatedStreakStartedAt =
        String(habit_milestone?.streak_started_at) === todayDateStr
          ? 'inactive'
          : String(habit_milestone?.streak_started_at);
      const currentStreak =
        String(habit_milestone?.streak_started_at) === 'inactive'
          ? 0
          : calculateDaysBetweenDates(String(habit_milestone?.streak_started_at), todayDateStr); // Don't include today into current streak (since today is an expected day)
      const updatedBestDayStreak = Math.max(
        currentStreak,
        Number(habit_milestone?.prev_best_day_streak),
      );

      await drizzleDb
        .update(habitMilestone)
        .set({
          streak_started_at: updatedStreakStartedAt,
          best_day_streak: updatedBestDayStreak,
          prev_best_day_streak: -1,
        })
        .where(eq(habitMilestone.habit_id, habit.id))
        .execute();

      // 3. Completion data handling

      // refresh UI
      setRefresh((prev) => prev + 1);
    }
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
        <IconButton
          iconName="chart.bar"
          onPress={() => onStatsButtonPressed(habit.id, habit.name)}
        />
        {isCompletable && (
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
