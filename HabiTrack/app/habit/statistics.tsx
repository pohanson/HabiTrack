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
import React, { useEffect, useState } from 'react';
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

  // set header title
  useEffect(() => {
    if (!id) return;
    navigation.setOptions({ headerTitle: 'Statistics' });
  }, [id, name, navigation]);

  const { data: createdAtData, error: createdAtError } = useLiveQuery(
    databaseService.habit.getHabitByIdQuery(id),
  );
  if (createdAtError) {
    console.error('Error fetching created_at', createdAtError);
    Toast.error('Error fetching created_at data.');
  }
  const createdAtDate = createdAtData[0]?.createdAt || new Date().toISOString().split('T')[0];

  const { data: completedAtData, error: completedAtError } = useLiveQuery(
    databaseService.habitCompletion.getCompletionsForHabitQuery(id),
  );
  if (completedAtError) {
    console.error('Error fetching created_at', completedAtError);
    Toast.error('Error fetching created_at data.');
  }

  // get frequency array for this habit
  const freq = useLiveQuery(databaseService.reminder.getRemindersForHabitQuery(id))
    .data.map((r) => r.day)
    .sort();

  // DAY STREAK VIEW CALCULATIONS
  databaseService.habitMilestone
    .calculateHabitStreak(id as string, freq, completedAtData)
    .then(setStreakData);
  // CALENDAR VIEW CALCULATIONS

  const todayStr = new Date().toISOString().split('T')[0];

  const yesterdayDate = new Date(new Date().getSeconds() - 24 * 60 * 60 * 1000); // yesterday's date
  const yesterdayStr = yesterdayDate.toJSON().split('T')[0];

  const markedDatesObj: { [key: string]: any } = {};

  // Obtain completed dates:
  const completedAtDatesSinceModified = completedAtData
    .filter(({ completedAt }) => completedAt >= createdAtDate)
    .map(({ completedAt }) => completedAt);

  // mark completed dates in green
  completedAtDatesSinceModified.forEach((dateStr) => {
    markedDatesObj[dateStr] = {
      marked: true,
      dotColor: theme.green,
    };
  });

  // Get expected dates
  const expectedDates = getExpectedDates(createdAtDate, yesterdayStr, freq);

  // for O(1) completedAt lookup:
  const completedDatesSet = new Set(completedAtDatesSinceModified);

  // marked missed dates in red
  expectedDates.forEach((dateStr) => {
    if (!completedDatesSet.has(dateStr)) {
      markedDatesObj[dateStr] = {
        marked: true,
        dotColor: theme.red,
      };
    }
  });

  const calcHabitStats = databaseService.statistic.calcHabitStatistics(
    createdAtDate,
    freq,
    completedAtData,
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
