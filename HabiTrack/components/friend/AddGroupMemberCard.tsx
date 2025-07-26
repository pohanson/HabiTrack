import { Colors } from '@/constants/Colors';
import { Shadows } from '@/constants/Shadows';
import { User } from '@/db/localSchema';
import { Pressable, useColorScheme, View, Image } from 'react-native';
import { ThemedText } from '../ThemedText';
import { IconSymbol } from '../ui/IconSymbol';

export function AddGroupMemberCard({
  testID = 'add-group-member-card',
  friend,
  selected,
  onToggle,
}: {
  testID?: string;
  friend: User;
  selected: boolean;
  onToggle: () => void;
}) {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  return (
    <View
      testID={`${testID}-${friend.id}`}
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.background,
          borderColor: theme.border,
          borderWidth: 0,
          borderRadius: 15,
          padding: 14,
        },
        Shadows.large,
      ]}>
      <View testID={`friend-info-${friend.id}`} style={{ flexDirection: 'row', gap: 10 }}>
        {friend.profilePicture ? (
          /* profile pic: */
          <Image
            testID={`profile-picture-${friend.id}`}
            source={{ uri: `data:image/jpeg;base64,${friend.profilePicture}` }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
        ) : (
          /* profile pic placeholder: */
          <View
            testID={`placeholder-profile-picture-${friend.id}`}
            style={{
              height: 50,
              width: 50,
              backgroundColor: theme.card,
              borderRadius: 1000,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ThemedText testID={`placeholder-profile-picture-text-${friend.id}`}>
              {friend.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
        )}

        <View testID={`friend-text-info-${friend.id}`} style={{ flexDirection: 'column' }}>
          <ThemedText testID={`friend-name-${friend.id}`} style={{ fontSize: 14 }}>
            {friend.name}
          </ThemedText>
          <ThemedText testID={`friend-username-${friend.id}`} style={{ fontSize: 14 }}>
            @{friend.username}
          </ThemedText>
        </View>
      </View>

      <Pressable
        testID={`friend-toggle-${friend.id}`}
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
        onPress={onToggle}>
        <IconSymbol
          color={Colors[colorScheme].background}
          style={{ opacity: selected ? 1 : 0 }}
          name="checkmark"
        />
      </Pressable>
    </View>
  );
}
