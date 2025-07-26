import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable, View } from 'react-native';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';
import { Shadows } from '../constants/Shadows';

export function IconButton({
  testID = 'icon-button',
  onPress,
  iconName,
  iconSize = 24,
  iconColor = null,
  transparentBackground = false,
}: {
  testID?: string;
  onPress: () => void;
  iconName: IconSymbolName;
  iconSize?: number;
  iconColor?: string | null;
  transparentBackground?: boolean;
}) {
  const backgroundColor = useThemeColor({}, 'tint');
  const defaultIconColor = useThemeColor({}, 'icon');
  return (
    <View testID={testID}>
      <Pressable
        testID={`${testID}-pressable`}
        onPress={onPress}
        style={(isPressed) => [
          {
            opacity: isPressed.pressed ? 0.7 : 1,
            borderRadius: '50%',
            padding: 10,
          },
          transparentBackground ? {} : { backgroundColor: backgroundColor, ...Shadows.medium },
        ]}>
        <IconSymbol name={iconName} color={iconColor || defaultIconColor} size={iconSize} />
      </Pressable>
    </View>
  );
}
