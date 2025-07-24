import { AddFriendModal } from '@/components/friend/AddFriendModal';
import { FriendCard } from '@/components/friend/FriendCard';
import { IconButton } from '@/components/IconButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DatabaseService } from '@/services';
import { SyncService } from '@/services/SyncService';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

export default function FriendView() {
  const [refresh, setRefresh] = useState(0);
  useFocusEffect(useCallback(() => setRefresh((prev) => prev + 1), []));
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [userFriends, setUserFriends] = useState<User[]>([]);
  const [searchStr, setSearchStr] = useState('');
  const databaseService = DatabaseService.instance;

  const filteredFriend = userFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchStr) ||
      friend.username.toLowerCase().includes(searchStr),
  );

  useEffect(() => {
    SyncService.syncRepoService(databaseService.friend).then(() => {
      databaseService.friend
        .getIncomingPendingRequests()
        .then((result) => setPendingRequests(result || []));
      databaseService.friend.getUserFriends().then((result) => setUserFriends(result));
    });
  }, [databaseService.friend, refresh]);

  return (
    <ThemedView style={{ flex: 1, alignItems: 'center' }}>
      {pendingRequests.length > 0 && (
        <View style={{ gap: 10 }}>
          <ThemedText type="subtitle">Pending Requests</ThemedText>
          {pendingRequests.map((user) => (
            <FriendCard
              key={user.id}
              friend={user}
              onAccept={() =>
                databaseService.friend
                  .acceptFriendRequest(user.id)
                  .then(() => setRefresh((prev) => prev + 1))
              }
              onReject={() =>
                databaseService.friend
                  .rejectFriendRequest(user.id)
                  .then(() => setRefresh((prev) => prev + 1))
              }
            />
          ))}
        </View>
      )}
      <AddFriendModal
        visible={isAddModalVisible}
        setIsAddModalVisible={setIsAddModalVisible}
        transparent={true}
        animationType="slide"
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '80%',
          padding: 10,
        }}>
        <ThemedText type="title">Your Friends</ThemedText>
        <IconButton
          iconName="plus"
          onPress={() => setIsAddModalVisible(true)}
          testID="add-friend-button"
        />
      </View>
      <TextInput
        style={{
          width: '80%',
          padding: 10,
          borderWidth: 1,
          color: useThemeColor({}, 'text'),
          borderColor: useThemeColor({}, 'border'),
          borderRadius: 5,
        }}
        value={searchStr}
        onChangeText={(text) => setSearchStr(text.toLowerCase())}
        placeholder="Search for friends..."
      />
      <View style={{ gap: 10, marginTop: 20 }}>
        {filteredFriend.length === 0 ? (
          <ThemedText type="default">No friends found.</ThemedText>
        ) : (
          filteredFriend.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onPress={() => router.push(`/friend/${friend.id}`)}
            />
          ))
        )}
      </View>
    </ThemedView>
  );
}
