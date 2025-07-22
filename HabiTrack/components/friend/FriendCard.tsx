import { Shadows } from '@/constants/Shadows';
import { User } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable, View } from 'react-native';
import { IconButton } from '../IconButton';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { ProfilePicture } from '../user/ProfilePicture';

export function FriendCard({
  testID = 'friend-card',
  friend,
  onReject = undefined,
  onAccept = undefined,
  onAdd = undefined,
  onPress = undefined,
}: {
  testID?: string;
  friend: User;
  onReject?: () => void;
  onAccept?: () => void;
  onAdd?: () => void;
  onPress?: () => void;
}) {
  // Call useThemeColor unconditionally at the top
  const cardColor = useThemeColor({}, 'card');
  const greenColor = useThemeColor({}, 'green');
  const redColor = useThemeColor({}, 'red');
  const tabIconDefaultColor = useThemeColor({}, 'tabIconDefault');

  return (
    <Pressable
      testID={testID}
      style={{ width: '100%' }}
      disabled={onPress === undefined}
      onPress={onPress}>
      <ThemedView
        testID={`friend-card-container-${friend.id}`}
        style={[
          {
            display: 'flex',
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: cardColor,
            borderRadius: 15,
            padding: 14,
          },
          Shadows.large,
        ]}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <ProfilePicture user={friend} />
          <View testID={`friend-text-info-${friend.id}`}>
            <ThemedText testID={`friend-name-${friend.id}`}>{friend.name}</ThemedText>
            <ThemedText testID={`friend-username-${friend.id}`}>@{friend.username}</ThemedText>
          </View>
        </View>
        <View testID={`friend-buttons-${friend.id}`} style={{ flexDirection: 'row', gap: 10 }}>
          {onAccept && (
            <IconButton
              testID={`friend-accept-button-${friend.id}`}
              iconName="checkmark"
              onPress={onAccept}
              transparentBackground={true}
              iconColor={greenColor}
            />
          )}
          {onReject && (
            <IconButton
              testID={`friend-reject-button-${friend.id}`}
              iconName="xmark"
              onPress={onReject}
              transparentBackground={true}
              iconColor={redColor}
            />
          )}
          {onAdd && (
            <IconButton
              testID={`friend-add-button-${friend.id}`}
              iconName="plus"
              onPress={onAdd}
              transparentBackground={true}
              iconColor={tabIconDefaultColor}
            />
          )}
        </View>
      </ThemedView>
    </Pressable>
  );
}
