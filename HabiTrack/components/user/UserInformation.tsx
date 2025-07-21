import { User } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { View, Image } from 'react-native';
import { ThemedText } from '../ThemedText';

export function UserInformation({ user }: { user: User | null }) {
  const borderColor = useThemeColor({}, 'border');

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {user?.profilePicture ? (
        <Image
          source={{
            uri: user.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : undefined,
          }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      ) : (
        <ThemedText
          type="default"
          style={{
            width: 100,
            height: 100,
            borderColor: borderColor,
            borderWidth: 1,
            borderRadius: 50,
            textAlignVertical: 'center',
            textAlign: 'center',
          }}>
          No profile picture
        </ThemedText>
      )}
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
          {user?.name || 'Loading...'}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 14,
            marginTop: -2,
            marginBottom: 8,
            color: '#999', // Can contrast with both dark and light backgrounds
            fontWeight: '700',
          }}>
          {user?.username ? '@' + user.username : 'loading...'}
        </ThemedText>
        <ThemedText type="default" style={{ textAlign: 'justify' }}>
          {user?.bio || 'No bio available.'}
        </ThemedText>
      </View>
    </View>
  );
}
