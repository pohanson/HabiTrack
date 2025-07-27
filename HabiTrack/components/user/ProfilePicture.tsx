import { Image, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { User } from '@/db/schema';

export function ProfilePicture({
  user,
  profileSize = 50,
}: {
  user: User | { id: string; profilePicture: string | null; name: string; username: string } | null;
  profileSize?: number;
}) {
  const bgColor = user?.username
    ? [
        '#9e0142',
        '#d53e4f',
        '#f46d43',
        '#fdae61',
        '#fee08b',
        '#e6f598',
        '#abdda4',
        '#66c2a5',
        '#3288bd',
        '#5e4fa2',
      ][
        user.username
          .split('')
          .reduce(
            (acc, c, index) => acc ^ (c.charCodeAt(0) * index),
            user.username.charCodeAt(0) * user.username.length,
          ) % 10
      ]
    : 'gray';
  return user == null ? (
    <View testID={`friend-info-null`}>
      <ThemedText
        type="default"
        style={{
          width: profileSize,
          height: profileSize,
          borderWidth: 1,
          borderRadius: 50,
          textAlignVertical: 'center',
          textAlign: 'center',
        }}>
        No profile picture
      </ThemedText>
    </View>
  ) : user.profilePicture ? (
    <Image
      testID={`profile-picture-${user.id}`}
      source={{
        uri: `data:image/jpeg;base64,${user.profilePicture}`,
      }}
      style={{ width: profileSize, height: profileSize, borderRadius: profileSize / 2 }}
    />
  ) : (
    <View
      testID={`placeholder-profile-picture-text-${user.id}`}
      style={{
        width: profileSize,
        height: profileSize,
        borderRadius: profileSize / 2,
        backgroundColor: bgColor,
      }}>
      <ThemedText
        testID={`profile-initial-${user.id}`}
        style={{
          textAlign: 'center',
          verticalAlign: 'middle',
          color: 'black',
          fontSize: Math.floor(profileSize / 2),
          height: profileSize,
          width: profileSize,
        }}>
        {user.name.charAt(0).toUpperCase()}
      </ThemedText>
    </View>
  );
}
