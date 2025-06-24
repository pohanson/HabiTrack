import { RHFFrequencyInput } from '@/components/RHFInputs/RHFFrequencyInput';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { RHFTimeInput } from '@/components/RHFInputs/RHFTimeInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as schema from '@/db/schema';
import { habit, habitMilestone, reminder } from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import ToastManager, { Toast } from 'toastify-react-native';

export default function CreateHabitScreen() {
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerTitle: 'Create Habit' }), [navigation]);

  const useFormReturn = useForm<FieldValues>({
    values: {
      habit: '',
      description: '',
      frequency: new Set<number>(),
      time: new Date(0),
    },
  });
  const { handleSubmit, watch } = useFormReturn;
  const reminderTime: Date = watch('time') || new Date(0);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const onSubmit = handleSubmit(
    async (data) => {
      console.log('Submitting Form:\n', data);
      try {
        const today = new Date();
        const habitResult = await drizzleDb.insert(habit).values({
          name: data.habit,
          description: data.description || '',
          createdAt: today.toJSON().split('T')[0],
        });
        (data.frequency as Set<number>).forEach((day) =>
          drizzleDb
            .insert(reminder)
            .values({
              day: day,
              time: reminderTime
                ? `${zeroPad(reminderTime.getHours())}${zeroPad(reminderTime.getMinutes())}`
                : null,
              habit_id: habitResult.lastInsertRowId,
            })
            .execute(),
        );

        // add milestone row to habitMilestone table
        await drizzleDb.insert(habitMilestone).values({
          habit_id: habitResult.lastInsertRowId,
          week_streak: 0,
          badges_earned: 0,

          // new columns for streak tracking
          streak_started_at: 'inactive',
          best_day_streak: 0,
          prev_best_day_streak: -1,
        });

        Toast.success('Habit Created');
        useFormReturn.reset();
      } catch (error) {
        console.error('Error inserting habit:', error);
        Toast.error('Failed to create habit');
      }
    },
    (errors) => {
      Toast.error('Ensure required inputs are filled in');
      console.log('Form submission errors:\n', errors);
    },
  );

  const zeroPad = (num: number) => (num < 10 ? `0${num}` : num.toString());

  return (
    <ThemedView style={{ flex: 1, padding: 8 }}>
      <ThemedText type="title">Create Habit</ThemedText>
      <RHFTextInput
        name="habit"
        isRequired={true}
        label="Habit Name"
        useFormReturn={useFormReturn}
      />
      <RHFTextInput name="description" label="Description" useFormReturn={useFormReturn} />

      <RHFFrequencyInput
        control={useFormReturn.control}
        name="frequency"
        errorState={useFormReturn.formState.errors}
      />
      <RHFTimeInput control={useFormReturn.control} />
      <TextButton label="Submit" onPress={onSubmit} style={{ marginTop: 30, width: '100%' }} />
      <ToastManager />
    </ThemedView>
  );
}
