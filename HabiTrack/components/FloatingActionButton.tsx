import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';
export function FloatingActionButton({
  onPress,
  iconName,
  color,
}: {
  onPress: () => void;
  iconName: IconSymbolName;
  color?: string;
}) {
  const colorScheme = useColorScheme() || 'light';
  const backgroundColor = color || Colors[colorScheme].tint;
  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <Pressable
        onPress={onPress}
        style={(isPressed) => [
          {
            backgroundColor: backgroundColor,
            opacity: isPressed.pressed ? 0.7 : 1,
            position: 'absolute',
            alignSelf: 'flex-end',
          },
          styles.fab,
        ]}>
        <IconSymbol name={iconName} color={Colors[colorScheme].text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    elevation: 6,
    borderRadius: '50%',
    padding: 10,
  },
});
