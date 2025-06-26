import { HabitCard } from '@/components/HabitCard';
import { IconButton } from '@/components/IconButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatabaseService } from '@/services';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';
import ToastManager from 'toastify-react-native/components/ToastManager';

export default function HomeScreen() {
  const [refresh, setRefresh] = useState(0);

  const databaseService = DatabaseService.instance;

  const { data, error } = useLiveQuery(databaseService.habit.getAllHabitsTodayQuery(), [refresh]);
  if (error) {
    console.error('Error fetching habits:', error);
    Toast.error('Error fetching habits.');
  }

  useFocusEffect(useCallback(() => setRefresh((prev) => prev + 1), []));
  Toast.success('Welcome to HabiTrack! Here are your habits for today.');

  return (
    <ThemedView style={{ flex: 1 }}>
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
