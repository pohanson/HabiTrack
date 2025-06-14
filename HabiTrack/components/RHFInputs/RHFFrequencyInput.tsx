import { Controller } from 'react-hook-form';
import { RHFToggleInput } from './RHFToggleInput';
import { daysOfWeekArray } from '@/types/DaysOfWeek';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';

export function RHFFrequencyInput({ control, name }: { control: any; name: string; rules?: any }) {
  return (
    <>
      <ThemedText type="defaultSemiBold">Frequency</ThemedText>
      <Controller
        name={name}
        control={control}
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
    </>
  );
}
