import { User } from '@/db/schema';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ProfilePicture } from './ProfilePicture';

export function UserInformation({ user }: { user: User | null }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <ProfilePicture user={user} profileSize={100} />

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
