import { Colors } from '@/constants/Colors';
import { User } from '@/db/localSchema';
import { DatabaseService } from '@/services';
import { useEffect, useState } from 'react';
import { Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { ScrollView, TextInput, useColorScheme, View } from 'react-native';
import { AddGroupMemberCard } from '../friend/AddGroupMemberCard';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { ProfilePicture } from '../user/ProfilePicture';

export function RHFMembersInput({
  control,
  name,
  errorState,
}: {
  control: any;
  name: string;
  errorState: FieldErrors<FieldValues>;
}) {
  const [searchStr, setSearchStr] = useState('');
  const [friends, setFriends] = useState<User[]>([]);
  const databaseService = DatabaseService.instance;

  const errorMessage = errorState[name]?.message?.toString() || null;

  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  // get user's friends
  useEffect(() => {
    databaseService.friend
      .getUserFriends()
      .then((friends) => {
        setFriends(friends || []);
      })
      .catch((error) => {
        console.error('Error loading friends:', error);
      });
  }, [databaseService.friend]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value: string[]) => {
          if (value.length === 0) {
            return 'At least one friend must be selected';
          }
          return true;
        },
      }}
      render={({
        field: { onChange, value },
      }: {
        field: { onChange: (value: string[]) => void; value: string[] };
      }) => (
        <ThemedView
          style={[
            errorMessage && { borderColor: 'red', borderWidth: 1, borderRadius: 10 },
            { marginVertical: 4, flex: 1 },
          ]}>
          {/* header */}
          <ThemedText type="defaultSemiBold">
            Group Members <ThemedText style={{ color: 'red' }}>*</ThemedText>
          </ThemedText>

          {/* card section */}
          <ThemedView
            style={{ backgroundColor: theme.card, padding: 10, borderRadius: 10, flex: 1 }}>
            <TextInput
              style={{
                width: '100%',
                padding: 10,
                borderWidth: 1,
                borderColor: theme.border,
                color: theme.text,
                borderRadius: 5,
                alignSelf: 'center',
              }}
              value={searchStr}
              onChangeText={setSearchStr}
              placeholder="Search for friends..."
            />

            {/* horizontal scroll preview bar showing currently selected friends (stickied at top) */}
            {value && value.length > 0 && (
              <View>
                <ThemedText
                  style={{ textAlign: 'center' }}>{`${value.length} selected`}</ThemedText>
                <ScrollView horizontal={true} persistentScrollbar={true}>
                  <View style={{ flexDirection: 'row', gap: 7 }}>
                    {value.map((friendId) => {
                      const friend = friends.find((f) => f.id === friendId);
                      if (!friend) return null;
                      return (
                        <View
                          key={friendId}
                          style={{ alignItems: 'center' }}
                          testID={`friend-card-${friend.id}`}>
                          <ProfilePicture user={friend} />

                          {/* username below profile pic: */}
                          <ThemedText style={{ fontSize: 12, textAlign: 'center' }}>
                            @{friend?.username}
                          </ThemedText>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            {errorMessage && (
              <ThemedText type="error" style={{ color: 'red', marginBottom: 8 }}>
                {errorMessage}
              </ThemedText>
            )}

            {/* vertical scroll list of addable members (user's friends) */}
            <ThemedView style={{ backgroundColor: theme.card, flex: 1 }}>
              {friends && friends.length === 0 && (
                <ThemedText>
                  {'You have no friends to add.\nAdd friends to start creating groups!'}
                </ThemedText>
              )}
              <ScrollView persistentScrollbar={true}>
                <View style={{ gap: 10, padding: 10 }}>
                  {friends
                    .filter(
                      (friend) =>
                        friend.username.toLowerCase().includes(searchStr.toLowerCase()) ||
                        friend.name.toLowerCase().includes(searchStr.toLowerCase()),
                    )
                    .map((friend, idx) => (
                      <AddGroupMemberCard
                        key={friend.id}
                        friend={friend}
                        selected={value?.includes(friend.id) || false}
                        onToggle={() => {
                          const currValue = value || [];
                          const friendIndex = currValue.indexOf(friend.id);

                          if (friendIndex === -1) {
                            const updatedValue = [...currValue, friend.id];
                            onChange(updatedValue);
                          } else {
                            const updatedValue = currValue.filter((id) => id !== friend.id);
                            onChange(updatedValue);
                          }
                        }}
                      />
                    ))}
                </View>
              </ScrollView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      )}
    />
  );
}
