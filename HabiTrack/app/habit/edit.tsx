import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
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

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const useFormReturn = useForm();
  const { handleSubmit, watch, setValue } = useFormReturn;
  const [showTimePicker, setShowTimePicker] = useState(false);
  const reminderTime: Date = watch('time') || new Date(0);
  const timeZone = getCalendars()[0]?.timeZone || 'Asia/Singapore';

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    const loadHabit = async () => {
      if (!id) return;
      try {
        const result = await drizzleDb
          .select()
          .from(habit)
          .where(eq(habit.id, Number(id)));

        if (result.length > 0) {
          setValue('habit', result[0].name);
          setValue('description', result[0].description ?? '');
        }
      } catch (error) {
        console.error('Error fetching habit:', error);
        Toast.error('Failed to load habit');
      }
      navigation.setOptions({ headerTitle: 'Edit Habit' });
    };

    loadHabit();
  }, [navigation, id, drizzleDb, setValue]);

  const onSubmit = handleSubmit(
    async (data) => {
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
      <RHFTextInput
        name="Change Description"
        label="Change Description"
        useFormReturn={useFormReturn}
      />
      <ThemedText type="defaultSemiBold">Change Reminder Time</ThemedText>
      <View
        style={{ marginVertical: 8, display: 'flex', flexDirection: 'row', gap: 8, width: '100%' }}>
        <ThemedText
          style={{
            flex: 2,
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
          onPress={onSubmit}
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
