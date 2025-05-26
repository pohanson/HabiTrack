import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import ToastManager, { Toast } from 'toastify-react-native';

export default function CreateHabitScreen() {
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerTitle: 'Create Habit' }), [navigation]);
  const useFormReturn = useForm();
  const { handleSubmit, watch } = useFormReturn;
  const [showTimePicker, setShowTimePicker] = useState(false);
  const reminderTime: Date = watch('time');

  const onSubmit = handleSubmit(
    (data) => {
      Toast.success('Habit Created');
      useFormReturn.reset();
      console.log('Form Submitted:\n', data);
    },
    (errors) => {
      Toast.error('Ensure required inputs are filled in');
      console.log('Form submission errors:\n', errors);
    },
  );

  const zeroPad = (num: number) => (num < 10 ? `0${num}` : num);

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
      {/* <RHFTextInput name="frequency" label="Frequency" useFormReturn={useFormReturn} /> */}
      <ThemedText type="defaultSemiBold">Reminder Time</ThemedText>
      <View
        style={{ marginVertical: 8, display: 'flex', flexDirection: 'row', gap: 8, width: '100%' }}>
        <ThemedText
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
            backgroundColor: '#cacaca',
            padding: 8,
            textAlign: 'center',
          }}>
          {reminderTime === undefined
            ? 'No Reminder'
            : `${zeroPad(reminderTime.getHours())}:${zeroPad(reminderTime.getMinutes())}`}
        </ThemedText>
        <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
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
            />
          )}
        />
      )}
      <Button title="Submit" onPress={onSubmit} />
      <ToastManager />
    </View>
  );
}
