import { User } from '@/db/localSchema';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ProfilePicture } from './ProfilePicture';

export function UserProfileDisplay({
  user,
  profileSize = 70,
  nameSize = 16,
  usernameSize = 12,
  marginBottom = 4,
}: {
  user: User;
  profileSize?: number;
  nameSize?: number;
  usernameSize?: number;
  marginBottom?: number;
}) {
  return (
    <View style={{ marginBottom }}>
      <ProfilePicture user={user} profileSize={profileSize} />
      <ThemedText style={{ fontWeight: 'bold', fontSize: nameSize, textAlign: 'center' }}>
        {user.name}
      </ThemedText>
      <ThemedText style={{ fontSize: usernameSize, color: '#888', textAlign: 'center' }}>
        @{user.username}
      </ThemedText>
    </View>
  );
}
