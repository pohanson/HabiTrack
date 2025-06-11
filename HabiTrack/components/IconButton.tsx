import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable, View } from 'react-native';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';
export function IconButton({
  onPress,
  iconName,
  iconSize = 24,
}: {
  onPress: () => void;
  iconName: IconSymbolName;
  iconSize?: number;
}) {
  const backgroundColor = useThemeColor({}, 'tint');
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={(isPressed) => [
          {
            opacity: isPressed.pressed ? 0.7 : 1,
          },
          { elevation: 6, backgroundColor: backgroundColor, borderRadius: '50%', padding: 10 },
        ]}>
        <IconSymbol name={iconName} color={useThemeColor({}, 'icon')} size={iconSize} />
      </Pressable>
    </View>
  );
}
