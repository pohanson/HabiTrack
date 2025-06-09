import { View, useColorScheme, Pressable } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '../ui/IconSymbol';

export function RHFToggleInput({
  label,
  selected,
  toggleSelected,
}: {
  label: string;
  selected: boolean;
  toggleSelected: () => void;
}) {
  const colorScheme = useColorScheme() || 'light';
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <ThemedText>{label}</ThemedText>
      <Pressable
        pressRetentionOffset={50}
        hitSlop={8}
        style={{
          padding: 8,
          borderWidth: 2,
          borderColor: selected ? Colors[colorScheme].tabIconSelected : Colors[colorScheme].text,
          backgroundColor: selected
            ? Colors[colorScheme].tabIconSelected
            : Colors[colorScheme].background,
          borderRadius: 50,
        }}
        onPress={() => {
          toggleSelected();
        }}>
        <IconSymbol
          color={Colors[colorScheme].background}
          style={{ opacity: selected ? 1 : 0 }}
          name="checkmark"
        />
      </Pressable>
    </View>
  );
}
