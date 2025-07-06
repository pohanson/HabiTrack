import { Shadows } from '@/constants/Shadows';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { IconButton } from '../IconButton';
import { View } from 'react-native';

export function FriendCard({
  //   friend,
  onReject = undefined,
  onAccept = undefined,
  onAdd = undefined,
}: {
  //   friend: Friend;
  onReject?: () => void;
  onAccept?: () => void;
  onAdd?: () => void;
}) {
  // Call useThemeColor unconditionally at the top
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const greenColor = useThemeColor({}, 'green');
  const redColor = useThemeColor({}, 'red');
  const tabIconDefaultColor = useThemeColor({}, 'tabIconDefault');

  return (
    <ThemedView
      style={[
        {
          display: 'flex',
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: cardColor,
          borderColor: borderColor,
          borderWidth: 0,
          borderRadius: 15,
          padding: 14,
        },
        Shadows.large,
      ]}>
      <ThemedText>Friend</ThemedText>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {onAccept && (
          <IconButton
            iconName="checkmark"
            onPress={onAccept}
            transparentBackground={true}
            iconColor={greenColor}
          />
        )}
        {onReject && (
          <IconButton
            iconName="xmark"
            onPress={onReject}
            transparentBackground={true}
            iconColor={redColor}
          />
        )}
        {onAdd && (
          <IconButton
            iconName="plus"
            onPress={onAdd}
            transparentBackground={true}
            iconColor={tabIconDefaultColor}
          />
        )}
      </View>
    </ThemedView>
  );
}
