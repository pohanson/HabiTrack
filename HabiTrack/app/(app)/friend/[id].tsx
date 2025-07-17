import { HabitList } from '@/components/HabitList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserInformation } from '@/components/UserInformation';
import { User } from '@/db/schema';
import { DatabaseService } from '@/services';
import { useLocalSearchParams } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';

const FriendContext = createContext<User | null>(null);

export default function FriendPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const databaseService = DatabaseService.instance;
  const [friend, setFriend] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      databaseService.user
        .getUserById(id)
        .then(setFriend)
        .finally(() => setIsLoading(false));
    }
  }, [id, databaseService.user]);

  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading friend...</ThemedText>
      </ThemedView>
    );
  } else if (!friend) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Friend not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FriendContext.Provider value={friend}>
      <FriendTabs />
    </FriendContext.Provider>
  );
}

function FriendTabs() {
  const friend = useContext(FriendContext);
  const renderHeader = useCallback(() => {
    return (
      <View style={{ padding: 4 }}>
        <UserInformation user={friend} />
      </View>
    );
  }, [friend]);
  return (
    <Tabs.Container renderHeader={renderHeader}>
      <Tabs.Tab name="FriendHabit" label="Habit">
        <Tabs.ScrollView>
          <FriendHabitScreen />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="FriendMilestone" label="Milestone">
        <Tabs.ScrollView>
          <FriendMilestoneScreen />
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  );
}

function FriendHabitScreen() {
  const friend = useContext(FriendContext);
  return (
    <ThemedView style={{ height: '100%' }}>
      {friend == null ? (
        <ThemedText>Invalid Friend Selected</ThemedText>
      ) : (
        <HabitList userId={friend.id} />
      )}
    </ThemedView>
  );
}

function FriendMilestoneScreen() {
  const friend = useContext(FriendContext);
  return (
    <ThemedView style={{ height: '100%' }}>
      {friend == null ? (
        <ThemedText>Invalid Friend Selected</ThemedText>
      ) : (
        <ThemedText>Friend Milestone for {friend.name}</ThemedText>
      )}
    </ThemedView>
  );
}
