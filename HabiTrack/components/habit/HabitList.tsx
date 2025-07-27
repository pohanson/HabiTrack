import { Habit } from '@/db/localSchema';
import { DatabaseService } from '@/services';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { HabitCard } from './HabitCard';

export function HabitList({
  userId = undefined,
  isEditable = false,
}: {
  userId?: string | null;
  isEditable?: boolean;
}) {
  const habitService = DatabaseService.instance.habit;
  const [data, setData] = useState<Habit[]>([]);
  useEffect(() => {
    if (userId === undefined) {
      habitService.getAllHabits().then(setData);
    } else {
      habitService.getAllHabits(userId).then(setData);
    }
  }, [habitService, userId]);

  return data?.length === 0 ? (
    <ThemedView testID="habit-list-no-habits" style={{ flex: 1, padding: 8 }}>
      <ThemedText testID="habit-list-no-habits-text">No habits</ThemedText>
    </ThemedView>
  ) : (
    <ThemedView testID="habit-list-container" style={{ flex: 1 }}>
      <ScrollView testID="habit-list-scrollview">
        <ThemedView testID="habit-list-subcontainer" style={{ padding: 10, gap: 10 }}>
          {data.map((habitItem) => (
            <HabitCard
              key={habitItem.id}
              habit={habitItem}
              habit_completion={null}
              isEditable={isEditable}
              isCompletable={false}
              habit_milestone={null}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
