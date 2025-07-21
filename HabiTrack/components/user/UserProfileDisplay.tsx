import { User } from '@/db/localSchema';
import { View, Image } from 'react-native';
import { ThemedText } from '../ThemedText';

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
      {user.profilePicture ? (
        <Image
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
          style={{
            width: profileSize,
            height: profileSize,
            borderRadius: 100,
            backgroundColor: '#ccc',
            marginBottom: 4,
            justifyContent: 'center',
          }}>
          <ThemedText
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
      <ThemedText style={{ fontWeight: 'bold', fontSize: nameSize, textAlign: 'center' }}>
        {user.name}
      </ThemedText>
      <ThemedText style={{ fontSize: usernameSize, color: '#888', textAlign: 'center' }}>
        @{user.username}
      </ThemedText>
    </View>
  );
}
