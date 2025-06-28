import { StatsCalendarView } from '@/components/StatsCalendarView';
import { StatsCompletionRateView } from '@/components/StatsCompletionRateView';
import { StatsDayStreakView } from '@/components/StatsDayStreakView';
import { StatsHeader } from '@/components/StatsHeader';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { DatabaseService } from '@/services';
import { getExpectedDates } from '@/utils/dateUtils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function StatisticsScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const navigation = useNavigation();
  const [streakData, setStreakData] = useState<{
    badgesEarned: number;
    bestStreak: number;
    activeStreak: number;
  } | null>(null);

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const databaseService = DatabaseService.instance;

  let renderCount = useRef(0);
  renderCount.current++;
  console.log('Stats page render count: ' + renderCount.current);

  // set header title
  useEffect(() => {
    if (!id) return;
    navigation.setOptions({ headerTitle: 'Statistics' });
  }, [id, name, navigation]);

  // get createdAt data for this habit
  const { data: createdAtData, error: createdAtError } = useLiveQuery(
    databaseService.habit.getHabitByIdQuery(id),
  );

  const createdAtDate = useMemo(
    () => createdAtData[0]?.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    [createdAtData],
  );

  // get completedAt data for this habit
  const { data: completedAtData, error: completedAtError } = useLiveQuery(
    databaseService.habitCompletion.getCompletionsForHabitQuery(id, {}, false),
  );

  // get frequency array for this habit
  const { data: freqData } = useLiveQuery(databaseService.reminder.getRemindersForHabitQuery(id));
  const freq = useMemo(() => (freqData || []).map((r) => r.day).sort(), [freqData]);

  // handle errors
  useEffect(() => {
    if (createdAtError) {
      console.error('Error fetching created_at', createdAtError);
      Toast.error('Error fetching created_at data.');
    }

    if (completedAtError) {
      console.error('Error fetching completions', completedAtError);
      Toast.error('Error fetching completion data.');
    }
  }, [createdAtError, completedAtError]);

  // DAY STREAK VIEW CALCULATIONS
  useEffect(() => {
    databaseService.habitMilestone
      .calculateHabitStreak(id as string, freq, completedAtData)
      .then(setStreakData)
      .catch((error) => console.error('Error calculating streak:', error));
  }, [id, freq, completedAtData, databaseService.habitMilestone]);

  // CALENDAR VIEW CALCULATIONS
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const yesterdayStr = useMemo(() => {
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    return yesterdayDate.toJSON().split('T')[0];
  }, []);

  const { markedDatesObj } = useMemo(() => {
    const markedDates: { [key: string]: any } = {};

    // Obtain completed dates:
    const completedDates = completedAtData
      .map((completion) => completion.completedAt.split('T')[0])
      .filter((completedAt) => completedAt >= createdAtDate);

    // mark completed dates in green
    completedDates.forEach((dateStr) => {
      markedDates[dateStr] = {
        marked: true,
        dotColor: theme.green,
      };
    });

    // Get expected dates
    const expectedDates = getExpectedDates(createdAtDate, yesterdayStr, freq);

    // marked missed dates in red
    // but make completedDates a set for O(1) completedAt lookup:
    const completedDatesSet = new Set(completedDates);
    expectedDates.forEach((dateStr) => {
      if (!completedDatesSet.has(dateStr)) {
        markedDates[dateStr] = {
          marked: true,
          dotColor: theme.red,
        };
      }
    });

    return {
      completedAtDatesSinceModified: completedDates,
      markedDatesObj: markedDates,
      expectedDatesSinceModified: expectedDates,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedAtData, createdAtDate, yesterdayStr, freq]);

  // COMPLETION RATE CALCULATIONS
  const calcHabitStats = useMemo(
    () => databaseService.statistic.calcHabitStatistics(createdAtDate, freq, completedAtData),
    [createdAtDate, freq, completedAtData, databaseService.statistic],
  );

  return (
    <ScrollView>
      <ThemedView style={{ gap: 10, padding: 10 }}>
        <StatsHeader
          habitName={String(name)}
          todayDate={todayStr}
          createdAt={createdAtDate}
          badgesEarned={streakData?.badgesEarned || 0}
          reminderTime="hello"
          lastModifiedAt="placeholder"
        />
        <StatsCalendarView
          today={todayStr}
          createdAt={createdAtDate}
          completedAtDates={markedDatesObj}
        />
        <StatsCompletionRateView calcHabitStatsisticsByMode={calcHabitStats} pieChartSize={85} />
        <StatsDayStreakView
          activeStreak={streakData?.activeStreak || 0}
          bestStreak={streakData?.bestStreak || 0}
        />
      </ThemedView>
    </ScrollView>
  );
}
