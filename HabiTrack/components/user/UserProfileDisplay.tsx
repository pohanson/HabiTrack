import { User } from '@/db/localSchema';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ProfilePicture } from './ProfilePicture';

export function UserProfileDisplay({
  testID = 'user-profile-display',
  user,
  profileSize = 70,
  nameSize = 16,
  usernameSize = 12,
  marginBottom = 4,
}: {
  testID?: string;
  user: User;
  profileSize?: number;
  nameSize?: number;
  usernameSize?: number;
  marginBottom?: number;
}) {
  return (
    <View testID={testID} style={{ marginBottom }}>
      <ProfilePicture user={user} profileSize={profileSize} />
      <ThemedText
        testID={testID + '-name'}
        style={{ fontWeight: 'bold', fontSize: nameSize, textAlign: 'center' }}>
        {user.name}
      </ThemedText>
      <ThemedText
        testID={`${testID}-username`}
        style={{ fontSize: usernameSize, color: '#888', textAlign: 'center' }}>
        @{user.username}
      </ThemedText>
    </View>
  );
}
