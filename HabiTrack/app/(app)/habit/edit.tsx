import { RHFFrequencyInput } from '@/components/RHFInputs/RHFFrequencyInput';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { RHFTimeInput } from '@/components/RHFInputs/RHFTimeInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatabaseService } from '@/services';
import { HabitInsertionData } from '@/services/HabitService';
import { NotificationManager } from '@/services/NotificationManager';
import { dateFromPaddedTime } from '@/utils/dateUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { Toast } from 'toastify-react-native';
import ToastManager from 'toastify-react-native/components/ToastManager';

export default function EditHabitScreen() {
  const { id }: { id: string } = useLocalSearchParams();

  const databaseService = DatabaseService.instance;

  const useFormReturn = useForm<FieldValues>({
    values: {
      name: '',
      description: '',
      frequency: [],
      time: null,
    },
  });

  const { handleSubmit } = useFormReturn;

  useEffect(() => {
    if (!id) return;
    const loadHabit = async () => {
      // get habit and reminder data from db
      try {
        const data = await databaseService.habit.getHabitWithReminders(id);
        if (!data) {
          Toast.error('Habit not found');
          router.back();
          return;
        }

        const time = data.reminders.length > 0 ? data.reminders[0].time : null;
        useFormReturn.reset({
          name: data.habit.name,
          description: data.habit.description || '',
          frequency: data.reminders.map((reminder) => reminder.day),
          time: dateFromPaddedTime(time),
        });
      } catch (error) {
        console.error('Error fetching habit:', error);
        Toast.error('Failed to load habit');
      }
    };
    loadHabit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSaveChanges = handleSubmit(
    async (data) => {
      console.log('Form data submitted:', data);
      try {
        databaseService.reminder.getRemindersForHabit(id).then((reminders) => {
          // checking if there is a change in date for frequency
          const oldFrequency = reminders.map((r) => r.day).sort();
          const newFrequency = data.frequency.sort();
          let freqHasNotBeenEdited = true;
          if (oldFrequency.length !== newFrequency.length) {
            freqHasNotBeenEdited = false;
          } else {
            for (let i = 0; i < oldFrequency.length; i++) {
              freqHasNotBeenEdited = freqHasNotBeenEdited && oldFrequency[i] === newFrequency[i];
            }
          }

          const executeUpdate = () => {
            // Proceed with updating the habit
            databaseService.habit.updateHabitWithReminders({
              ...(data as HabitInsertionData),
              id: id,
            });
            Toast.success('Habit Updated');
            NotificationManager.upsertPushNotificationForHabit(id);
            router.back();
          };

          if (!freqHasNotBeenEdited) {
            Alert.alert(
              'Past Data Deletion',
              "Your Habit's Statistics and Milestones will reset when you change the frequency days.\n\nAre you sure you want to proceed?",
              [
                {
                  text: 'Cancel',
                  onPress: () => Toast.error('Habit not updated'),
                },
                {
                  text: 'OK',
                  onPress: executeUpdate,
                },
              ],
              { cancelable: true, onDismiss: () => {} },
            );
          } else {
            executeUpdate();
          }
        });
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
      // Soft delete habit, associated reminders, and completions
      databaseService.habit.deleteHabit(id);
      Toast.success('Habit Deleted');
      router.back();
    } catch (error) {
      console.error('Error deleting habit:', error);
      Toast.error('Failed to delete habit');
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 8 }}>
      <ThemedText type="title">Edit Habit</ThemedText>
      <RHFTextInput
        name="name"
        label="Rename Habit"
        isRequired={true}
        useFormReturn={useFormReturn}
      />

      <RHFTextInput name="description" label="Change Description" useFormReturn={useFormReturn} />
      <RHFFrequencyInput
        name="frequency"
        control={useFormReturn.control}
        errorState={useFormReturn.formState.errors}
      />
      <RHFTimeInput control={useFormReturn.control} label="Change Reminder Time" />

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
      <ToastManager />
    </ThemedView>
  );
}
