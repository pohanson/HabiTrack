import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
import { TextInput, View } from 'react-native';
import { ThemedText } from '../ThemedText';

export function RHFTextInput({
  name,
  label,
  useFormReturn,
  isRequired = false,
}: {
  name: string;
  label: string;
  useFormReturn: UseFormReturn<FieldValues>;
  isRequired?: boolean;
}) {
  const errorMessage = useFormReturn.formState.errors[name]?.message?.toString() || null;
  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <ThemedText type={'defaultSemiBold'}>{label}</ThemedText>
        <ThemedText type={'default'} style={{ color: 'red' }}>
          {isRequired && '*'}
        </ThemedText>
      </View>
      <Controller
        control={useFormReturn.control}
        name={name}
        rules={{ required: isRequired ? `${label} is required` : false }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            onChangeText={onChange}
            value={value}
            style={{
              borderStyle: 'solid',
              marginBottom: 2,
              borderWidth: 2,
              borderRadius: 10,
              borderColor: errorMessage ? 'red' : 'black',
            }}
          />
        )}
      />
      {errorMessage && (
        <ThemedText type={'default'} style={{ color: 'red' }}>
          {errorMessage}
        </ThemedText>
      )}
    </View>
  );
}
