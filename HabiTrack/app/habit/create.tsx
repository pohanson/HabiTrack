import { RHFFrequencyInput } from '@/components/RHFInputs/RHFFrequencyInput';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { RHFTimeInput } from '@/components/RHFInputs/RHFTimeInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NotificationManager } from '@/services/NotificationManager';
import { DatabaseService } from '@/services';
import { HabitInsertionData } from '@/services/HabitService';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import ToastManager, { Toast } from 'toastify-react-native';

export default function CreateHabitScreen() {
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerTitle: 'Create Habit' }), [navigation]);
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

  const onSubmit = handleSubmit(
    async (data) => {
      console.log('Submitting Form:\n', data);
      try {
        databaseService.habit
          .createHabitWithReminders(data as HabitInsertionData)
          .then((habitId) => {
            databaseService.habitMilestone.createMilestone({
              habit_id: habitId,
              week_streak: 0,
              badges_earned: 0,
              streak_started_at: 'inactive',
              best_day_streak: 0,
              prev_best_day_streak: -1,
            });
            NotificationManager.upsertPushNotificationForHabit(habitId);
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

  return (
    <ThemedView style={{ flex: 1, padding: 8 }}>
      <ThemedText type="title">Create Habit</ThemedText>
      <RHFTextInput
        name="name"
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
