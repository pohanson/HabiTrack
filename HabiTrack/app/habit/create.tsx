import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import ToastManager, { Toast } from 'toastify-react-native';
import { habit, reminder } from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';
import { Colors } from '@/constants/Colors';
import { getCalendars } from 'expo-localization';
import { RHFToggleInput } from '@/components/RHFInputs/RHFToggleInput';
import { daysOfWeekArray } from '@/types/DaysOfWeek';

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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const reminderTime: Date = watch('time') || new Date(0);
  const timeZone = getCalendars()[0]?.timeZone || 'Asia/Singapore';

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
  const colors = Colors[useColorScheme() || 'light'];

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

      <ThemedText type="defaultSemiBold">Reminder Time</ThemedText>
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
          <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Select Time</ThemedText>
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
