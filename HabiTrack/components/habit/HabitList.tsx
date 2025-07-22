import { Habit, HabitCompletion, HabitMilestone } from '@/db/localSchema';
import { ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { HabitCard } from './HabitCard';

export function HabitList({
  data,
  isEditable = false,
  isCompletable = false,
  today = null,
}: {
  data: {
    habit: Habit;
    habitCompletion?: HabitCompletion | null;
    habitMilestone?: HabitMilestone | null;
  }[];
  isEditable?: boolean;
  isCompletable?: boolean;
  today?: string | null;
}) {
  return data?.length === 0 ? (
    <ThemedView testID="habit-list-no-habits" style={{ flex: 1, padding: 8 }}>
      <ThemedText testID="habit-list-no-habits-text">No habits</ThemedText>
    </ThemedView>
  ) : (
    <ThemedView testID="habit-list-container" style={{ flex: 1 }}>
      <ScrollView testID="habit-list-scrollview">
        <ThemedView testID="habit-list-subcontainer" style={{ padding: 10, gap: 10 }}>
          {data.map(({ habit: habitItem, habitCompletion, habitMilestone }) => (
            <HabitCard
              key={habitItem.id}
              habit={habitItem}
              habit_completion={habitCompletion || null}
              isEditable={isEditable}
              isCompletable={isCompletable}
              habit_milestone={habitMilestone || null}
              today={today}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
