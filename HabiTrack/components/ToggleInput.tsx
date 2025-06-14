import { Colors } from '@/constants/Colors';
import { Pressable, View, useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';

export function ToggleInput({
  label,
  iconName,
  selected,
  toggleSelected,
  iconSize = 32,
}: {
  label: string;
  iconName: IconSymbolName;
  selected: boolean;
  toggleSelected: () => void;
  iconSize: number;
}) {
  const colorScheme = useColorScheme() || 'light';
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      {label && <ThemedText>{label}</ThemedText>}
      <Pressable
        pressRetentionOffset={50}
        hitSlop={8}
        style={{
          padding: iconSize * 0.1,
          borderWidth: 2,
          borderColor: selected ? Colors[colorScheme].tabIconSelected : Colors[colorScheme].text,
          backgroundColor: selected
            ? Colors[colorScheme].tabIconSelected
            : Colors[colorScheme].background,
          borderRadius: iconSize,
        }}
        onPress={() => {
          toggleSelected();
        }}>
        <IconSymbol
          color={Colors[colorScheme].background}
          style={{ opacity: selected ? 1 : 0 }}
          name={iconName}
          size={iconSize * 0.6}
        />
      </Pressable>
    </View>
  );
}
