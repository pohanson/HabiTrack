import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import ToastManager, { Toast } from 'toastify-react-native';
import { habit, reminder, habitCompletion } from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';
import { RHFFrequencyInput } from '@/components/RHFInputs/RHFFrequencyInput';
import { RHFTimeInput } from '@/components/RHFInputs/RHFTimeInput';
import { zeroPad } from '@/utils/zeroPad';

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const useFormReturn = useForm<FieldValues>({
    values: {
      habit: '',
      description: '',
      frequency: new Set<number>(),
      time: null,
    },
  });

  const { handleSubmit, setValue } = useFormReturn;

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    if (!id) return;
    navigation.setOptions({ headerTitle: 'Edit Habit' });
    const loadHabit = async () => {
      // get habit and reminder data from db
      try {
        const fetchedHabit = await drizzleDb
          .select()
          .from(habit)
          .where(eq(habit.id, Number(id)));

        if (fetchedHabit[0]) {
          setValue('habit', fetchedHabit[0].name);
          setValue('description', fetchedHabit[0].description || '');

          const fetchedReminder = await drizzleDb
            .select()
            .from(reminder)
            .where(eq(reminder.habit_id, Number(id)));

          if (fetchedReminder[0]) {
            const timeString = fetchedReminder[0].time;
            if (timeString) {
              const hours = parseInt(timeString.slice(0, 2), 10);
              const minutes = parseInt(timeString.slice(2, 4), 10);
              const reminderDate = new Date();
              reminderDate.setHours(hours, minutes, 0, 0);
              setValue('time', reminderDate);
            }
            const frequencySet = new Set<number>();
            fetchedReminder.forEach((reminder) => {
              frequencySet.add(reminder.day);
            });
            setValue('frequency', frequencySet);
          }
        }
      } catch (error) {
        console.error('Error fetching habit:', error);
        Toast.error('Failed to load habit');
      }
    };
    loadHabit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigation]);

  const onSaveChanges = handleSubmit(
    async (data) => {
      try {
        // Updata habit name and desc
        await drizzleDb
          .update(habit)
          .set({
            name: data.habit,
            description: data.description || '',
          })
          .where(eq(habit.id, Number(id)));

        // delete current reminders
        await drizzleDb.delete(reminder).where(eq(reminder.habit_id, Number(id)));

        // add in new reminders
        (data.frequency as Set<number>).forEach((day) => {
          drizzleDb
            .insert(reminder)
            .values({
              day: day,
              time:
                data.time != null
                  ? `${zeroPad(data.time.getHours())}${zeroPad(data.time.getMinutes())}`
                  : null,
              habit_id: Number(id),
            })
            .execute();
        });

        Toast.success('Habit Updated');
        navigation.goBack();
      } catch (error) {
        console.error('Error updating habit:', error);
        Toast.error('Failed to update habit');
      }
    },
    (errors) => {
      Toast.error('Ensure required inputs are filled in');
      console.log('Form submission errors:\n', errors);
    },
  );

  const onDelete = async () => {
    try {
      // delete all instances of this habit from habit, reminder, habitCompletion tables
      await drizzleDb.delete(reminder).where(eq(reminder.habit_id, Number(id)));
      await drizzleDb.delete(habitCompletion).where(eq(habitCompletion.habit_id, Number(id)));
      await drizzleDb.delete(habit).where(eq(habit.id, Number(id)));
      Toast.success('Habit Deleted');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting habit:', error);
      Toast.error('Failed to delete habit');
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 8 }}>
      <ThemedText type="title">Edit Habit</ThemedText>
      <RHFTextInput name="habit" label="Rename Habit" useFormReturn={useFormReturn} />

      <RHFTextInput name="description" label="Change Description" useFormReturn={useFormReturn} />
      <RHFFrequencyInput name="frequency" control={useFormReturn.control} />
      <RHFTimeInput control={useFormReturn.control} label="Change Reminder Time" />

      <ThemedView>
        <TextButton
          label="Save Changes"
          onPress={onSaveChanges}
          style={{ marginTop: 30, width: '100%' }}
        />

        <TextButton
          label="Delete Habit"
          variant="delete"
          onPress={onDelete}
          style={{ marginTop: 10, width: '100%' }}
        />
      </ThemedView>

      <ToastManager />
    </ThemedView>
  );
}
