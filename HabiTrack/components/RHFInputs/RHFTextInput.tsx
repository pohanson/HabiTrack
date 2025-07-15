import { Colors } from '@/constants/Colors';
import { Controller, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { TextInput, TextInputProps, useColorScheme, View } from 'react-native';
import { ThemedText } from '../ThemedText';

/**
 * Default autoComplete and autoCorrect are set to false.
 */
export function RHFTextInput({
  name,
  label,
  useFormReturn,
  isRequired = false,
  rules = {},
  ...textInputProps
}: {
  name: string;
  label: string;
  useFormReturn: UseFormReturn;
  isRequired?: boolean;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled' | 'isRequired'
  >;
} & TextInputProps) {
  const colors = Colors[useColorScheme() || 'light'];
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
        rules={{ required: isRequired ? `${label} is required` : false, ...rules }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            autoComplete="off"
            autoCorrect={false}
            {...textInputProps}
            onChangeText={onChange}
            value={value}
            style={{
              borderStyle: 'solid',
              color: colors.text,
              backgroundColor: colors.background,
              marginBottom: 2,
              borderWidth: 2,
              borderRadius: 10,
              borderColor: errorMessage ? 'red' : colors.border,
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
