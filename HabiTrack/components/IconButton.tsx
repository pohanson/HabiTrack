import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable, View } from 'react-native';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';
import { Shadows } from '../constants/Shadows';

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
          { backgroundColor: backgroundColor, borderRadius: '50%', padding: 10 },
          Shadows.medium,
        ]}>
        <IconSymbol name={iconName} color={useThemeColor({}, 'icon')} size={iconSize} />
      </Pressable>
    </View>
  );
}
