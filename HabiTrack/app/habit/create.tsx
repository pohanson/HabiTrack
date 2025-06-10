import { RHFFrequencyInput } from '@/components/RHFInputs/RHFFrequencyInput';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { RHFTimeInput } from '@/components/RHFInputs/RHFTimeInput';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import * as schema from '@/db/schema';
import { habit, reminder } from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
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
        const habitResult = await drizzleDb.insert(habit).values({
          name: data.habit,
          description: data.description || '',
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
      <Pressable
        style={[styles.button, { marginTop: 30, width: '100%' }]}
        onPress={onSubmit}
        hitSlop={5}
        pressRetentionOffset={50}>
        <ThemedText type="defaultSemiBold" style={{ color: 'white', textAlign: 'center' }}>
          Submit
        </ThemedText>
      </Pressable>
      <ToastManager />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    padding: 16,
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
  },
});
