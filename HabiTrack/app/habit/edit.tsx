import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import ToastManager, { Toast } from 'toastify-react-native';
import { habit } from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';
import { Colors } from '@/constants/Colors';
import { getCalendars } from 'expo-localization';
import { RHFToggleInput } from '@/components/RHFInputs/RHFToggleInput';
import { daysOfWeekArray } from '@/types/DaysOfWeek';

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const useFormReturn = useForm<FieldValues>({ defaultValues: { frequency: new Set<number>() } });
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
      try {
        const result = await drizzleDb
          .select()
          .from(habit)
          .where(eq(habit.id, Number(id)));
        const freq = await drizzleDb
          .select({ frequency: schema.reminder.day })
          .from(schema.reminder)
          .where(eq(schema.reminder.habit_id, Number(id)))
          .then((r) => r.map((f) => f.frequency));

        if (result[0]) {
          console.log('Loaded habit:', result[0]);
          setValue('habit', result[0].name);
          setValue('description', result[0].description || '');
          setValue('frequency', new Set<number>(freq));
          // Check if 'reminderTime' exists on the result object
          if ('reminderTime' in result[0]) {
            setValue('time', new Date(result[0].reminderTime as string));
          }
        }
      } catch (error) {
        console.error('Error fetching habit:', error);
        Toast.error('Failed to load habit');
      }
    };

    loadHabit();
  }, [id, drizzleDb, navigation, setValue]);

  const onSaveChanges = handleSubmit(
    async (data) => {
      console.log('Saving Changes:\n', data);
      try {
        await drizzleDb
          .update(habit)
          .set({
            name: data.habit,
            description: data.description || '',
          })
          .where(eq(habit.id, Number(id)));
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
      <RHFTextInput
        name="habit"
        isRequired={true}
        label="Rename Habit"
        useFormReturn={useFormReturn}
      />
      <RHFTextInput name="description" label="Change Description" useFormReturn={useFormReturn} />
      <ThemedText type="defaultSemiBold">Frequency</ThemedText>
      <Controller
        name={'frequency'}
        control={useFormReturn.control}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 8,
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
            }}>
            {daysOfWeekArray.map((val, i) => (
              <RHFToggleInput
                key={val}
                label={val.slice(0, 3)}
                toggleSelected={() => {
                  if (value.has(i)) {
                    value.delete(i);
                  } else {
                    value.add(i);
                  }
                  onChange(value);
                }}
                selected={value.has(i)}
              />
            ))}
          </View>
        )}
      />
      <ThemedText type="defaultSemiBold">Change Reminder Time</ThemedText>
      <View
        style={{ marginVertical: 8, display: 'flex', flexDirection: 'row', gap: 8, width: '100%' }}>
        <ThemedText
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            backgroundColor: 'gray',
            padding: 8,
            textAlign: 'center',
            textAlignVertical: 'center',
          }}>
          {reminderTime === undefined
            ? 'No Reminder'
            : `${zeroPad(reminderTime.getHours())}:${zeroPad(reminderTime.getMinutes())}`}
        </ThemedText>
        <Pressable
          onPress={() => setShowTimePicker(true)}
          style={[styles.button, { zIndex: 10 }]}
          pressRetentionOffset={60}
          hitSlop={5}>
          <ThemedText style={{ color: 'white' }}>Select Time</ThemedText>
        </Pressable>
      </View>

      {showTimePicker && (
        <Controller
          name="time"
          control={useFormReturn.control}
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              value={value || new Date(0)}
              onChange={(event, selectedDate) => {
                setShowTimePicker(false);
                onChange(selectedDate);
              }}
              mode="time"
              timeZoneName={timeZone === 'Asia/Singapore' ? 'UTC' : timeZone}
              // 8*60=480 SG is UTC+8, required because Locale is not properly working.
              timeZoneOffsetInMinutes={timeZone === 'Asia/Singapore' ? 480 : undefined}
            />
          )}
        />
      )}

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
    backgroundColor: 'red',
    borderRadius: 10,
  },
});
