import { HabitCard } from '@/components/habit/HabitCard';
import { IconButton } from '@/components/IconButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Habit, HabitCompletion, HabitMilestone, Reminder } from '@/db/schema';
import { DatabaseService } from '@/services';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';
import ToastManager from 'toastify-react-native/components/ToastManager';

export default function HomeScreen() {
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<
    {
      habit: Habit;
      habit_completion: HabitCompletion | null;
      reminder: Reminder | null;
      habit_milestone: HabitMilestone | null;
    }[]
  >([]);

  const databaseService = DatabaseService.instance;

  useEffect(() => {
    databaseService.habit.getAllHabitsToday().then(setData);
  }, [databaseService.habit, refresh]);

  useFocusEffect(useCallback(() => setRefresh((prev) => prev + 1), []));
  Toast.success('Welcome to HabiTrack! Here are your habits for today.');

  return (
    <ThemedView style={{ flex: 1, padding: 8 }}>
      <ThemedView
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <ThemedText type="title" style={{ fontSize: 26 }}>
          Today&apos;s Habits
        </ThemedText>
        <IconButton
          iconName="list.bullet"
          onPress={() => {
            router.push('/habit/full-list');
          }}
        />
        <IconButton iconName="plus" onPress={() => router.push('/habit/create')} />
      </ThemedView>
      {data?.length === 0 && <ThemedText>No habits for today.</ThemedText>}
      <ScrollView>
        <ThemedView style={{ gap: 10, padding: 10 }}>
          {data.map(({ habit, habit_completion, habit_milestone }) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              habit_completion={habit_completion}
              habit_milestone={habit_milestone}
              today={new Date().toISOString().split('T')[0]}
              isCompletable={true}
              setRefresh={setRefresh}
            />
          ))}
        </ThemedView>
      </ScrollView>
      <ToastManager />
    </ThemedView>
  );
}
