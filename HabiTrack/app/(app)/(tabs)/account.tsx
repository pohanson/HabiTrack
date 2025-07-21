import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserInformation } from '@/components/user/UserInformation';
import { useUserContext } from '@/context/UserContext';
import { User } from '@/db/schema';
import { DatabaseService } from '@/services';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function AccountPage() {
  const databaseService = DatabaseService.instance;
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser: setCurrentUserId } = useUserContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      databaseService.user
        .getCurrentUser()
        .then(setCurrentUser)
        .finally(() => setIsLoading(false));
    }, [databaseService.user]),
  );

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <ThemedText type="defaultSemiBold" style={{ fontSize: 24 }}>
        User Profile
      </ThemedText>
      <ThemedView
        style={{
          gap: 10,
          padding: 4,
          width: '90%',
          flex: 1,
        }}>
        {isLoading ? <ThemedText>Loading...</ThemedText> : <UserInformation user={currentUser} />}

        {/* spacer */}
        <View style={{ flex: 1 }} />

        <TextButton
          label="Edit Profile"
          onPress={() => {
            if (!currentUser) {
              Toast.show({
                type: 'error',
                text1: 'No user found.',
                text2: 'Unknown Error',
              });
              return;
            }
            router.push(`/account/edit/${currentUser?.id}`);
          }}
          style={{ width: '100%' }}
        />
        <TextButton
          label="Log Out"
          onPress={() =>
            databaseService.user.signoutUser().then(() => {
              setCurrentUserId(null);
              router.push('/signin');
            })
          }
          style={{ width: '100%' }}
        />
      </ThemedView>
    </ThemedView>
  );
}
