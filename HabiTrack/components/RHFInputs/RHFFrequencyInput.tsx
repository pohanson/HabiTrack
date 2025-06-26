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
        validate: (value: number[]) => {
          if (value.length === 0) {
            return 'At least one day must be selected';
          }
          return true;
        },
      }}
      render={({
        field: { onChange, value },
      }: {
        field: { onChange: (value: number[]) => void; value: number[] };
      }) => (
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
                  const ithIndex = value.indexOf(i);
                  if (ithIndex !== -1) {
                    value.splice(ithIndex, 1);
                  } else {
                    value.push(i);
                  }
                  onChange(value);
                }}
                selected={value.includes(i)}
              />
            ))}
          </View>
        </ThemedView>
      )}
    />
  );
}
