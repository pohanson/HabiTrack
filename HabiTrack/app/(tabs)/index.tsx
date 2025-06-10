import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

import { FloatingActionButton } from '@/components/FloatingActionButton';
import ParallaxScrollView from '@/components/ParallaxScrollView';
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontSize: 26 }}>{`Today's Habits`}</ThemedText>
        <FloatingActionButton iconName="plus" onPress={() => router.push('/habit/create')} />
      </ThemedView>
      {data?.length === 0 && <ThemedText>No habits for today.</ThemedText>}
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
