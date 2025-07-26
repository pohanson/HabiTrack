import { User } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { View, Image } from 'react-native';
import { ThemedText } from '../ThemedText';

export function UserInformation({ user }: { user: User | null }) {
  const borderColor = useThemeColor({}, 'border');

  return (
    <View testID="user-information" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {user?.profilePicture ? (
        <Image
          testID="user-information-profile-picture"
          source={{
            uri: user.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : undefined,
          }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      ) : (
        <ThemedText
          testID="user-information-no-profile-picture"
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
      <View testID="user-information-details" style={{ flex: 1 }}>
        <ThemedText testID="user-information-name" type="defaultSemiBold" style={{ fontSize: 20 }}>
          {user?.name || 'Loading...'}
        </ThemedText>
        <ThemedText
          testID="user-information-username"
          style={{
            fontSize: 14,
            marginTop: -2,
            marginBottom: 8,
            color: '#999', // Can contrast with both dark and light backgrounds
            fontWeight: '700',
          }}>
          {user?.username ? '@' + user.username : 'Loading...'}
        </ThemedText>
        <ThemedText testID="user-information-bio" type="default" style={{ textAlign: 'justify' }}>
          {user?.bio || 'No bio available.'}
        </ThemedText>
      </View>
    </View>
  );
}
