import { HabitList } from '@/components/habit/HabitList';
import { HabitMilestoneList } from '@/components/milestone/HabitMilestoneList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserInformation } from '@/components/user/UserInformation';
import { Habit, User } from '@/db/schema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DatabaseService } from '@/services';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
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
  const habitService = DatabaseService.instance.habit;
  const [data, setData] = useState<Habit[]>([]);
  useEffect(() => {
    if (!friend) return;
    habitService.getAllHabits(friend.id).then(setData);
  }, [habitService, friend]);

  return (
    <ThemedView style={{ height: '100%', paddingBottom: bottomInset }}>
      {friend == null ? (
        <ThemedText>Invalid Friend Selected</ThemedText>
      ) : (
        <HabitList data={data.map((habit) => ({ habit }))} />
      )}
    </ThemedView>
  );
}

function FriendMilestoneScreen() {
  const friend = useContext(FriendContext);
  const { bottom: bottomInset } = useSafeAreaInsets();

  const [data, setData] = useState<
    { habit_id: string; habit_name: string; week_streak: number; badges_earned: number }[]
  >([]);
  const [refresh, setRefresh] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setRefresh((prev) => prev + 1);
    }, []),
  );
  const databaseService = DatabaseService.instance;
  useEffect(() => {
    databaseService.habitMilestone.getAllMilestonesQuery(friend?.id).then(setData);
  }, [databaseService.habitMilestone, friend?.id, refresh]);

  return (
    <ThemedView style={{ height: '100%', paddingBottom: bottomInset }}>
      {friend == null ? (
        <ThemedText>Invalid Friend Selected</ThemedText>
      ) : (
        <HabitMilestoneList data={data} />
      )}
    </ThemedView>
  );
}
