import * as schema from '@/db/schema';
import { Habit, habitCompletion, HabitCompletion } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { IconButton } from './IconButton';
import { ThemedText } from './ThemedText';
import { ToggleInput } from './ToggleInput';

export function HabitCard({
  habit,
  habit_completion,
  today = null,
  setRefresh = () => {},
}: {
  habit: Habit;
  habit_completion: HabitCompletion | null;
  today?: string | null;
  setRefresh?: Dispatch<SetStateAction<number>>;
}) {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const onEditButtonPressed = (habitId: number) => {
    router.push({
      pathname: '/habit/edit',
      params: { id: habitId },
    });
  };

  const toggleHabitCompletion = () => {
    if (today == null) {
      return;
    }
    if (habit_completion === null) {
      // habit is not completed today, so add completion
      drizzleDb
        .insert(habitCompletion)
        .values({
          habit_id: habit.id,
          completedAt: today,
        })
        .execute();
    } else {
      // habit is already completed today, remove completion
      drizzleDb
        .delete(habitCompletion)
        .where(eq(habitCompletion.id, habit_completion.id))
        .execute();
    }
    setRefresh((prev) => prev + 1);
  };
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: useThemeColor({}, 'background'),
        borderColor: useThemeColor({}, 'border'),
        borderWidth: 2,
        borderRadius: 15,
        padding: 14,
      }}>
      <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>{habit.name}</ThemedText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <IconButton iconName="pencil" onPress={() => onEditButtonPressed(habit.id)} />

        {today == null || (
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
