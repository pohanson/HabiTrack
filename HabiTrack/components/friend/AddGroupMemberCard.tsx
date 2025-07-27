import { Colors } from '@/constants/Colors';
import { Shadows } from '@/constants/Shadows';
import { User } from '@/db/localSchema';
import { Pressable, useColorScheme, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { IconSymbol } from '../ui/IconSymbol';
import { ProfilePicture } from '../user/ProfilePicture';

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
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <ProfilePicture user={friend} />
        <View>
          <ThemedText style={{ fontSize: 14 }} testID={`friend-name-${friend.id}`}>
            {friend.name}
          </ThemedText>
          <ThemedText style={{ fontSize: 14 }} testID={`friend-username-${friend.id}`}>
            @{friend.username}
          </ThemedText>
        </View>
      </View>

      <Pressable
        testID={`${friend.id}-${selected ? 'remove' : 'add'}`}
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
