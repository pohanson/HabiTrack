import { HabitCard } from '@/components/HabitCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Habit } from '@/db/schema';
import { DatabaseService } from '@/services';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function FullHabitListScreen() {
  const navigation = useNavigation();

  const habitService = DatabaseService.instance.habit;
  const liveQueryResult = useLiveQuery(habitService.getAllHabitsQuery());
  const data = (liveQueryResult.data ?? []) as Habit[];
  const error = liveQueryResult.error as Error | undefined;

  if (error) {
    console.error('Error fetching habits:', error);
    Toast.error('Error fetching habits.');
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'All Habits' });
  }, [navigation]);

  return data?.length === 0 ? (
    <ThemedView>
      <ThemedText>No habits yet</ThemedText>
      <ThemedText>Create a habit to get started!</ThemedText>
    </ThemedView>
  ) : (
    <ScrollView>
      <ThemedView style={{ padding: 10, gap: 10 }}>
        {data.map((habitItem) => (
          <HabitCard
            key={habitItem.id}
            habit={habitItem}
            habit_completion={null}
            isCompletable={false}
            habit_milestone={null}
          />
        ))}
      </ThemedView>
    </ScrollView>
  );
}
