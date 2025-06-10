import { Image } from 'expo-image';
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useFocusEffect } from 'expo-router';

import { ToggleInput } from '@/components/ToggleInput';
import * as schema from '@/db/schema';
import { reminder, habit, habitCompletion } from '@/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { Toast } from 'toastify-react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  const [refresh, setRefresh] = useState(0);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const today = new Date().toJSON().split('T')[0];
  const dayOfWeek = new Date().getDay();
  const colors = Colors[useColorScheme() || 'light'];
  const { data, error } = useLiveQuery(
    drizzleDb
      .select({ habit: habit, habit_completion: habitCompletion, reminder: reminder })
      .from(reminder)
      .where(eq(reminder.day, dayOfWeek))
      .innerJoin(habit, eq(reminder.habit_id, habit.id))
      .leftJoin(
        habitCompletion,
        and(eq(habit.id, habitCompletion.habit_id), eq(habitCompletion.completedAt, today)),
      )
      .orderBy(asc(habitCompletion.completedAt), asc(reminder.time)),
    [refresh],
  );
  if (error) {
    console.error('Error fetching habits:', error);
    Toast.error('Error fetching habits.');
  }

  useFocusEffect(useCallback(() => setRefresh((prev) => prev + 1), []));

  const EditButtonPressed = (habitId: number) => {
    const habitToEdit = data.find(({ habit }) => habit.id === habitId)?.habit;
    router.push({
      pathname: '/habit/edit',
      params: { id: habitId },
    });
    console.log(`Editing Habit: ${habitToEdit?.name}`);
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedView
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.tint,
            borderRadius: 20,
            padding: 8,
            marginRight: 8,
          }}
          onPress={() => {
            router.push('/habit/full-list');
          }}>
          <IconSymbol name="list.bullet" color="white" />
        </TouchableOpacity>
        <ThemedText type="title" style={{ fontSize: 26 }}>
          Today's Habits
        </ThemedText>
        <FloatingActionButton iconName="plus" onPress={() => router.push('/habit/create')} />
      </ThemedView>
      {data?.length === 0 && <ThemedText>No habits for today.</ThemedText>}
      <ScrollView>
        <ThemedView style={{ gap: 10, padding: 10 }}>
          {data.map(({ habit, habit_completion }, idx) => (
            <View
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 2,
                borderRadius: 15,
                padding: 10,
              }}>
              <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>{habit.name}</ThemedText>
              <TouchableOpacity onPress={() => EditButtonPressed(habit.id)}>
                <Image
                  source={require('@/assets/images/edit-icon.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
              <ToggleInput
                label=""
                iconName="checkmark"
                selected={habit_completion !== null}
                iconSize={24}
                toggleSelected={function (): void {
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
                }}
              />
            </View>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 8,
  },
});
