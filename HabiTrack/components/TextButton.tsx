import { STYLES } from '@/components/Styles';
import { ThemedText } from '@/components/ThemedText';
import { Pressable, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Shadows } from '../constants/Shadows';

interface TextButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: 'primary' | 'delete';
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export function TextButton({
  label,
  variant = 'primary',
  textStyle,
  style,
  ...pressableProps
}: TextButtonProps) {
  const buttonStyle = variant === 'delete' ? STYLES.deleteButton : STYLES.button;

  return (
    <Pressable
      hitSlop={4}
      pressRetentionOffset={50}
      style={[buttonStyle, style, Shadows.large]}
      {...pressableProps}>
      <ThemedText type="defaultSemiBold" style={[{ textAlign: 'center' }, textStyle]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}
