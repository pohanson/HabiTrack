import { Habit, HabitCompletion, HabitMilestone } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DatabaseService } from '@/services';
import { calculateDaysBetweenDates } from '@/utils/dateUtils';
import { router } from 'expo-router';
import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { getBadgesEarned } from '@/utils/milestoneUtils';
import { Shadows } from '@/constants/Shadows';
import { IconButton } from '../IconButton';
import { ThemedText } from '../ThemedText';
import { ToggleInput } from '../ToggleInput';

/**
 * Display a habit card.
 *
 * @param habit - The habit to display.
 * @param habit_completion - The completion status of the habit.
 * @param habit_milestone - The milestone associated with the habit.
 * @param today - ISO format. This should not be null if habit_completion or habit_milestone is needed.
 * @param isEditable - Whether the card is editable. Defaults to true.
 * @param isCompletable - Whether the habit can be marked as complete. Defaults to true.
 */
export function HabitCard({
  habit,
  habit_completion,
  habit_milestone,
  today = null,
  isEditable = true,
  isCompletable = true,
  setRefresh = () => {},
}: {
  habit: Habit;
  habit_completion: HabitCompletion | null;
  habit_milestone: HabitMilestone | null;
  today?: string | null;
  isEditable?: boolean;
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

  const toggleHabitCompletion = async () => {
    if (today == null) {
      return;
    }

    // REFETCH THE FRESHEST MILESTONE DATA WHEN HABIT TICK/UNTICK
    const latestMilestone = await databaseService.habitMilestone.getMilestonesByHabitIdQuery(
      habit.id,
    );

    // Use latestMilestone instead of habit_milestone prop
    const todayDateStr = new Date().toJSON().split('T')[0];

    if (habit_completion === null) {
      // TICKING HABIT (1. Completion data handling, 2. Daily streaks data handling)
      // THIS ORDER IS NECESSARY

      // 1. Completion data handling
      await databaseService.habitCompletion.toggleTodayHabitCompletion(habit.id);

      // 2. Daily streaks data handling
      const updatedStreakStartedAt =
        String(latestMilestone[0]?.streak_started_at) === 'inactive'
          ? todayDateStr
          : String(latestMilestone[0]?.streak_started_at);
      const currentStreak =
        String(latestMilestone[0]?.streak_started_at) === 'inactive'
          ? 1
          : calculateDaysBetweenDates(String(latestMilestone[0]?.streak_started_at), todayDateStr) +
            1;
      const updatedPrevBestDayStreak = Number(latestMilestone[0]?.best_day_streak);
      const updatedBestDayStreak = Math.max(
        currentStreak,
        Number(latestMilestone[0]?.best_day_streak),
      );

      // handling week_streak (using current streak data)
      const updatedWeekStreak = Math.floor(currentStreak / 7);

      // handling badges_earned (using updated best_day_streak data)
      const updatedBadgesEarned = getBadgesEarned(Math.floor(updatedBestDayStreak / 7));

      console.log('badges_earned for', habit.name + ': ' + updatedBadgesEarned);

      databaseService.habitMilestone.updateMilestoneByHabitId(habit.id, {
        streak_started_at: updatedStreakStartedAt,
        best_day_streak: updatedBestDayStreak,
        prev_best_day_streak: updatedPrevBestDayStreak,

        week_streak: updatedWeekStreak,
        badges_earned: updatedBadgesEarned,
      });
    } else {
      // UNTICKING HABIT (1. Daily streaks data handling, 2. Completion data handling)
      // THIS ORDER IS NECESSARY

      // 1. Daily streaks data handling
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

      // handling week_streak (using current streak data)
      const updatedWeekStreak = Math.floor(currentStreak / 7);

      // handling badges_earned (using updated best_day_streak data)
      const updatedBadgesEarned = getBadgesEarned(Math.floor(updatedBestDayStreak / 7));
      console.log('badges_earned for', habit.name + ': ' + updatedBadgesEarned);

      databaseService.habitMilestone.updateMilestoneByHabitId(habit.id, {
        streak_started_at: updatedStreakStartedAt,
        best_day_streak: updatedBestDayStreak,
        prev_best_day_streak: -1,

        week_streak: updatedWeekStreak,
        badges_earned: updatedBadgesEarned,
      });

      // 2. Completion data handling
      await databaseService.habitCompletion.toggleTodayHabitCompletion(habit.id);
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
      <ThemedText
        style={[
          { flex: 1, fontWeight: 'bold' },
          isCompletable && habit_completion != null
            ? { color: '#888', textDecorationLine: 'line-through' }
            : {},
        ]}>
        {habit.name}
      </ThemedText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {isEditable && (
          <IconButton iconName="pencil" onPress={() => onEditButtonPressed(habit.id)} />
        )}

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
