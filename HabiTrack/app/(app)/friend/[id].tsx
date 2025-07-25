import { HabitList } from '@/components/habit/HabitList';
import { HabitMilestoneList } from '@/components/milestone/HabitMilestoneList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserInformation } from '@/components/user/UserInformation';
import { User } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DatabaseService } from '@/services';
import { useLocalSearchParams } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const backgroundColor = useThemeColor({}, 'background');
  const inactiveTextColor = useThemeColor({}, 'text');
  const activeTextColor = useThemeColor({ dark: '#FFF', light: '#000' }, 'text');

  const friend = useContext(FriendContext);
  const [headerHeight, setHeaderHeight] = useState(0);
  const renderHeader = useCallback(() => {
    return (
      <View
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        style={{ padding: 4, backgroundColor: backgroundColor }}>
        <UserInformation user={friend} />
      </View>
    );
  }, [backgroundColor, friend]);
  return (
    <Tabs.Container
      renderHeader={renderHeader}
      containerStyle={{ backgroundColor: backgroundColor }}
      minHeaderHeight={headerHeight}
      renderTabBar={(props) => (
        <MaterialTabBar
          {...props}
          tabStyle={{ backgroundColor: backgroundColor }}
          inactiveColor={inactiveTextColor}
          activeColor={activeTextColor}
        />
      )}>
      <Tabs.Tab name="FriendHabit" label="Habits">
        <Tabs.ScrollView>
          <FriendHabitScreen />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="FriendMilestone" label="Milestones">
        <Tabs.ScrollView>
          <FriendMilestoneScreen />
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  );
}

function FriendHabitScreen() {
  const friend = useContext(FriendContext);
  const { bottom: bottomInset } = useSafeAreaInsets();
  return (
    <ThemedView style={{ height: '100%', paddingBottom: bottomInset }}>
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
  const { bottom: bottomInset } = useSafeAreaInsets();
  return (
    <ThemedView style={{ height: '100%', paddingBottom: bottomInset }}>
      {friend == null ? (
        <ThemedText>Invalid Friend Selected</ThemedText>
      ) : (
        <HabitMilestoneList userId={friend.id} />
      )}
    </ThemedView>
  );
}
