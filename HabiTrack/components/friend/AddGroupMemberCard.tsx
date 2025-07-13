import { Colors } from '@/constants/Colors';
import { Shadows } from '@/constants/Shadows';
import { User } from '@/db/localSchema';
import { Pressable, useColorScheme, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { IconSymbol } from '../ui/IconSymbol';

export function AddGroupMemberCard({
  friend,
  selected,
  onToggle,
}: {
  friend: User;
  selected: boolean;
  onToggle: () => void;
}) {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  return (
    <View
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
        {/* profile pic placeholder: */}
        <View
          style={{
            height: 50,
            width: 50,
            backgroundColor: theme.card,
            borderRadius: 1000,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ThemedText>{friend.username.charAt(0).toUpperCase()}</ThemedText>
        </View>
        <View>
          <ThemedText style={{ fontSize: 14 }}>{friend.name}</ThemedText>
          <ThemedText style={{ fontSize: 14 }}>@{friend.username}</ThemedText>
        </View>
      </View>

      <Pressable
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
