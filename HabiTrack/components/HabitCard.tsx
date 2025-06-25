import { Habit, HabitCompletion, HabitMilestone } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DatabaseService } from '@/services';
import { calculateDaysBetweenDates } from '@/utils/dateUtils';
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

    const frequencyArray = await databaseService.reminder
      .getRemindersForHabit(habit.id)
      .then((reminder) => reminder.map((r) => r.day).sort());
    const todayDOW = new Date(today).getDay();
    const todayDateStr = new Date().toJSON().split('T')[0];

    databaseService.habitCompletion.toggleTodayHabitCompletion(habit.id);
    if (habit_completion === null) {
      // TICKING HABIT (1. Milestone data handling, 2. Daily streaks data handling)

      // 1. Milestone data handling

      // Then check if all habits for the week are completed
      const completionsThisWeek = await databaseService.habitCompletion.getCompletionsThisWeek(
        habit.id,
      );
      const noOfCompletionsThisWeek = completionsThisWeek.length;
      // If so, increment week_streak and update badges_earned
      if (noOfCompletionsThisWeek >= frequencyArray.length) {
        const newWeekStreak = (habit_milestone?.week_streak || 0) + 1;
        const calculatedBadges = Number(getBadgesEarned(newWeekStreak));
        const newBadgesEarned = Math.max(calculatedBadges, habit_milestone?.badges_earned || 0);

        databaseService.habitMilestone.updateMilestoneByHabitId(habit.id, {
          week_streak: newWeekStreak,
          badges_earned: newBadgesEarned,
        });
      }

      // 2. Daily streaks data handling

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
      databaseService.habitMilestone.updateMilestoneByHabitId(habit.id, {
        streak_started_at: updatedStreakStartedAt,
        best_day_streak: updatedBestDayStreak,
        prev_best_day_streak: updatedPrevBestDayStreak,
      });
    } else {
      // UNTICKING HABIT (1. Milestone data handling, 2. Daily streaks data handling)

      // 1. Milestone data handling

      // get current completions (all completions since Sunday)
      const currentCompletions = await databaseService.habitCompletion.getCompletionsThisWeek(
        habit.id,
      );

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

        let updatedBadgesEarned = -1;

        if (isPotentialWeek) {
          // If it IS a potential week, check if current badges_earned > potential badges_earned
          if (currentBadgesEarned > oldBadgesEarned) {
            // If current badges_earned > potential badges_earned, don't decrease badges_earned
            updatedBadgesEarned = currentBadgesEarned;
          } else {
            // else current badges_earned < potential badges_earned, decrease badges_earned in this case
            updatedBadgesEarned = newBadgesEarned;
          }
        } else {
          // If it is NOT a potential week, dont decrease badges_earned (new badges_earned === currentBadgesEarned)
          updatedBadgesEarned = currentBadgesEarned;
        }

        databaseService.habitMilestone.updateMilestoneByHabitId(habit.id, {
          week_streak: newWeekStreak,
          badges_earned: updatedBadgesEarned,
        });
        console.log('Badges_earned for habit.id', habit.id, ':', updatedBadgesEarned);
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
      databaseService.habitMilestone.updateMilestoneByHabitId(habit.id, {
        streak_started_at: updatedStreakStartedAt,
        best_day_streak: updatedBestDayStreak,
        prev_best_day_streak: -1,
      });
    }
    // refresh UI
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
