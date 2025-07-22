import { User } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DatabaseService } from '@/services';
import { useEffect, useState } from 'react';
import { Modal, ModalProps, TextInput, View } from 'react-native';
import { TextButton } from '../TextButton';
import { ThemedText } from '../ThemedText';
import { FriendCard } from './FriendCard';
import { SyncService } from '@/services/SyncService';

export function AddFriendModal({
  setIsAddModalVisible,
  ...props
}: {
  setIsAddModalVisible: (visible: boolean) => void;
} & ModalProps) {
  const [searchStr, setSearchStr] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [friendSuggestions, setFriendSuggestion] = useState<User[]>([]);
  const databaseService = DatabaseService.instance;

  useEffect(() => {
    SyncService.syncRepoService(databaseService.friend);
  }, [databaseService.friend]);

  useEffect(() => {
    databaseService.friend
      .getUserFriends()
      .then((friends) => new Set(friends.map((friend) => friend.id)))
      .then((userFriendId) => {
        databaseService.user
          .searchUser(searchStr)
          .then((users) =>
            users
              .filter((user) => !userFriendId.has(user.id) && user.id !== databaseService.userId)
              .slice(0, 5),
          )
          .then(setFriendSuggestion);
      });
  }, [databaseService.friend, databaseService.user, databaseService.userId, searchStr]);
  return (
    <Modal {...props} onRequestClose={() => setIsAddModalVisible(false)}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'gray',
          opacity: 0.95,
        }}>
        <View
          style={{
            alignItems: 'center',
            width: '80%',
            gap: 10,
            padding: 30,
            borderRadius: 20,
            backgroundColor: useThemeColor({}, 'card'),
          }}>
          <ThemedText type="title">Add Friend</ThemedText>

          <TextInput
            style={{
              width: '100%',
              padding: 10,
              margin: 4,
              borderWidth: 1,
              borderColor: useThemeColor({}, 'border'),
              borderRadius: 5,
              color: useThemeColor({}, 'text'),
            }}
            placeholder="Enter friend's username"
            value={searchStr}
            onChangeText={setSearchStr}
          />
          {errorMessage && <ThemedText type="error">{errorMessage}</ThemedText>}
          {friendSuggestions?.map((friendData) => (
            <FriendCard
              key={friendData.id}
              friend={friendData}
              onAdd={() => {
                databaseService.friend
                  .addFriend(friendData.id)
                  .then(() => {
                    SyncService.syncRepoService(databaseService.friend);
                  })
                  .then(() => {
                    setIsAddModalVisible(false);
                  })
                  .catch((error) => {
                    console.error('Error adding friend:', error);
                    setErrorMessage(error.message || 'Failed to add friend.');
                  });
              }}
            />
          ))}
          <TextButton
            label="Close"
            onPress={() => setIsAddModalVisible(false)}
            style={{
              backgroundColor: useThemeColor({}, 'red'),
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
