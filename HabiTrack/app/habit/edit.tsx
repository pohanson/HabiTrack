import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import ToastManager, { Toast } from 'toastify-react-native';
import { habit, reminder, habitCompletion } from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';
import { Colors } from '@/constants/Colors';
import { getCalendars } from 'expo-localization';
import { RHFFrequencyInput } from '@/components/RHFInputs/RHFFrequencyInput';
import { RHFTimeInput } from '@/components/RHFInputs/RHFTimeInput';

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const useFormReturn = useForm<FieldValues>({
    values: {
      habit: '',
      description: '',
      frequency: new Set<number>(),
      time: new Date(0),
    },
  });

  const { handleSubmit, setValue, watch } = useFormReturn;
  const [showTimePicker, setShowTimePicker] = useState(false);
  const reminderTime: Date = watch('time') || new Date(0);
  const timeZone = getCalendars()[0]?.timeZone || 'Asia/Singapore';

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
          console.log('Loaded habit:', fetchedHabit[0]);
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
            } else {
              setValue('time', new Date(0));
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
      console.log('Saving Changes:\n', data);
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
              time: reminderTime
                ? `${zeroPad(reminderTime.getHours())}${zeroPad(reminderTime.getMinutes())}`
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
      console.log('Deleted habit');
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

  const zeroPad = (num: number) => (num < 10 ? `0${num}` : num.toString());
  const colors = Colors[useColorScheme() || 'light'];

  return (
    <View style={{ padding: 8 }}>
      <ThemedText type="title">Edit Habit</ThemedText>
      <RHFTextInput name="habit" label="Rename Habit" useFormReturn={useFormReturn} />

      <RHFTextInput name="description" label="Change Description" useFormReturn={useFormReturn} />
      <RHFFrequencyInput name="frequency" control={useFormReturn.control} />
      <RHFTimeInput
        control={useFormReturn.control}
        label="Change Reminder Time"
        reminderTime={reminderTime}
      />

      <View>
        <Pressable
          style={[styles.button, { marginTop: 30, width: '100%' }]}
          onPress={onSaveChanges}
          hitSlop={5}
          pressRetentionOffset={50}>
          <ThemedText type="defaultSemiBold" style={{ color: 'white', textAlign: 'center' }}>
            Save Changes
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.deleteButton, { marginTop: 10, width: '100%' }]}
          onPress={onDelete}
          hitSlop={5}
          pressRetentionOffset={50}>
          <ThemedText type="defaultSemiBold" style={{ color: 'white', textAlign: 'center' }}>
            Delete Habit
          </ThemedText>
        </Pressable>
      </View>

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
  deleteButton: {
    alignSelf: 'center',
    padding: 16,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
  },
});
