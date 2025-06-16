import { Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { RHFToggleInput } from './RHFToggleInput';
import { daysOfWeekArray } from '@/types/DaysOfWeek';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

export function RHFFrequencyInput({
  control,
  name,
  errorState,
}: {
  control: any;
  name: string;
  errorState: FieldErrors<FieldValues>;
}) {
  const errorMessage = errorState[name]?.message?.toString() || null;
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value: Set<number>) => {
          if (value.size === 0) {
            return 'At least one day must be selected';
          }
          return true;
        },
      }}
      render={({ field: { onChange, value } }) => (
        <ThemedView
          style={[
            errorMessage && { borderColor: 'red', borderWidth: 1, borderRadius: 10 },
            { padding: 2, marginVertical: 4 },
          ]}>
          <ThemedText type="defaultSemiBold">
            Frequency <ThemedText style={{ color: 'red' }}>*</ThemedText>
          </ThemedText>
          {errorMessage && (
            <ThemedText type="error" style={{ color: 'red' }}>
              {errorMessage}
            </ThemedText>
          )}
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
        </ThemedView>
      )}
    />
  );
}
