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
  const [isLoading, setIsLoading] = useState(true);
  const cardBackgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const redColor = useThemeColor({}, 'red');

  useEffect(() => {
    SyncService.syncRepoService(databaseService.friend);
  }, [databaseService.friend]);

  useEffect(() => {
    setIsLoading(true);
    // get user's friend list which is then used to filter out already added friends from search
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
          .then(setFriendSuggestion)
          .finally(() => setIsLoading(false));
      });
  }, [databaseService.friend, databaseService.user, databaseService.userId, searchStr]);

  return (
    <Modal testID="add-friend-modal" {...props} onRequestClose={() => setIsAddModalVisible(false)}>
      <View
        testID="add-friend-modal-outer-container"
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'gray',
          opacity: 0.95,
        }}>
        <View
          testID="add-friend-modal-inner-container"
          style={{
            alignItems: 'center',
            backgroundColor: cardBackgroundColor,
            gap: 10,
            padding: 30,
            borderRadius: 20,
          }}>
          <ThemedText testID="add-friend-modal-title" type="title">
            Add Friend
          </ThemedText>

          <TextInput
            testID="add-friend-modal-search-input"
            style={{
              borderColor: borderColor,
              borderRadius: 5,
              borderWidth: 1,
              color: textColor,
            }}
            placeholder="Enter friend's username"
            value={searchStr}
            onChangeText={setSearchStr}
          />
          {errorMessage && (
            <ThemedText testID="add-friend-modal-error-message" type="error">
              {errorMessage}
            </ThemedText>
          )}
          {isLoading ? (
            <ThemedText>Loading...</ThemedText>
          ) : (
            friendSuggestions?.map((friendData) => (
              <FriendCard
                testID={`friend-card-${friendData.id}`}
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
                      setErrorMessage(error.message || 'Failed to add friend.');
                    });
                }}
              />
            ))
          )}
          <TextButton
            testID="add-friend-modal-close-button"
            label="Close"
            onPress={() => setIsAddModalVisible(false)}
            style={{
              backgroundColor: redColor,
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
