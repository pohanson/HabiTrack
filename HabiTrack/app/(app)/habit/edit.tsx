import { RHFFrequencyInput } from '@/components/RHFInputs/RHFFrequencyInput';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { RHFTimeInput } from '@/components/RHFInputs/RHFTimeInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatabaseService } from '@/services';
import { HabitInsertionData } from '@/services/HabitService';
import { dateFromPaddedTime } from '@/utils';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Toast } from 'toastify-react-native';
import { NotificationManager } from '@/services/NotificationManager';
import ToastManager from 'toastify-react-native/components/ToastManager';

export default function EditHabitScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const navigation = useNavigation();

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
    navigation.setOptions({ headerTitle: 'Edit Habit' });
    const loadHabit = async () => {
      // get habit and reminder data from db
      try {
        const data = await databaseService.habit.getHabitWithReminders(id);
        if (!data) {
          Toast.error('Habit not found');
          navigation.goBack();
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
  }, [id, navigation]);

  const onSaveChanges = handleSubmit(
    async (data) => {
      try {
        databaseService.habit.updateHabitWithReminders({ ...(data as HabitInsertionData), id: id });
        Toast.success('Habit Updated');
        NotificationManager.upsertPushNotificationForHabit(id);
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
      // TODO: add soft delete of milestone too!
      // Soft delete habit, associated reminders, and completions
      databaseService.habit.deleteHabit(id);
      Toast.success('Habit Deleted');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting habit:', error);
      Toast.error('Failed to delete habit');
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
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
