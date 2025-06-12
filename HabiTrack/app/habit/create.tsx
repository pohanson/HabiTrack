import { RHFFrequencyInput } from '@/components/RHFInputs/RHFFrequencyInput';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { RHFTimeInput } from '@/components/RHFInputs/RHFTimeInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import * as schema from '@/db/schema';
import { habit, reminder } from '@/db/schema';
import { zeroPad } from '@/utils/zeroPad';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { View } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';

export default function CreateHabitScreen() {
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerTitle: 'Create Habit' }), [navigation]);
  // ^ Not sure if need useEffect here, can move navigation.setOptions outside maybe?

  const useFormReturn = useForm<FieldValues>({
    values: {
      habit: '',
      description: '',
      frequency: new Set<number>(),
      time: null,
    },
  });
  const { handleSubmit } = useFormReturn;

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        const habitResult = await drizzleDb.insert(habit).values({
          name: data.habit,
          description: data.description || '',
        });
        (data.frequency as Set<number>).forEach((day) =>
          drizzleDb
            .insert(reminder)
            .values({
              day: day,
              time:
                data.time != null
                  ? `${zeroPad(data.time.getHours())}${zeroPad(data.time.getMinutes())}`
                  : null,
              habit_id: habitResult.lastInsertRowId,
            })
            .execute(),
        );

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

  return (
    <View style={{ padding: 8 }}>
      <ThemedText type="title">Create Habit</ThemedText>
      <RHFTextInput
        name="habit"
        isRequired={true}
        label="Habit Name"
        useFormReturn={useFormReturn}
      />
      <RHFTextInput name="description" label="Description" useFormReturn={useFormReturn} />

      <RHFFrequencyInput control={useFormReturn.control} name="frequency" />
      <RHFTimeInput control={useFormReturn.control} />
      <TextButton label="Submit" onPress={onSubmit} style={{ marginTop: 30, width: '100%' }} />
      <ToastManager />
    </View>
  );
}
