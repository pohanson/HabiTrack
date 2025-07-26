import { User } from '@/db/localSchema';
import { View, Image } from 'react-native';
import { ThemedText } from '../ThemedText';

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
      {user.profilePicture ? (
        <Image
          testID={`${testID}-profile-picture`}
          source={{ uri: `data:image/png;base64,${user.profilePicture}` }}
          style={{
            width: profileSize,
            height: profileSize,
            borderRadius: 100,
            marginBottom: 4,
          }}
        />
      ) : (
        <View
          testID={`${testID}-placeholder-profile-picture`}
          style={{
            width: profileSize,
            height: profileSize,
            borderRadius: 100,
            backgroundColor: '#ccc',
            marginBottom: 4,
            justifyContent: 'center',
          }}>
          <ThemedText
            testID={`${testID}-placeholder-profile-picture-text`}
            style={{
              fontWeight: 'bold',
              fontSize: profileSize * 0.4,
              textAlign: 'center',
              color: 'black',
            }}>
            {user.username.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}
      <ThemedText
        testID={`${testID}-name`}
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
