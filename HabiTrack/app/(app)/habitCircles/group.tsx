import React, { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { DatabaseService } from '@/services';
import { ThemedView } from '@/components/ThemedView';
import { LeaderboardHeader } from '@/components/leaderboard/LeaderboardHeader';
import { ThemedText } from '@/components/ThemedText';
import { User } from '@/db/localSchema';
import { LeaderboardElement } from '@/components/leaderboard/LeaderboardElement';
import { ScrollView, View, Pressable, Alert } from 'react-native';
import { LeaderboardTopThree } from '@/components/leaderboard/LeaderboardTopThree';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function GroupPage() {
  const navigation = useNavigation();
  const { groupId, groupName } = useLocalSearchParams<{ groupId: string; groupName: string }>();

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [leaderboardMode, setLeaderboardMode] = useState('Completion Rate');
  const [isLoading, setIsLoading] = useState(false);

  const databaseService = DatabaseService.instance;

  const iconColor = useThemeColor({}, 'text');

  const handleLeaveGroup = useCallback(async () => {
    try {
      console.log('Leaving group:', groupId);
      databaseService.groupMember.leaveGroup(groupId, databaseService.userId);
      navigation.goBack();
    } catch (error) {
      console.error('Error leaving group:', error);
      Alert.alert('Error', 'Failed to leave group. Please try again.');
    }
  }, [databaseService.groupMember, databaseService.userId, groupId, navigation]);

  const handleMenuPress = useCallback(() => {
    Alert.alert('Leave Group', 'Are you sure you want to leave this group?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: () => {
          handleLeaveGroup();
        },
      },
    ]);
  }, [handleLeaveGroup]);

  type LeaderboardEntry = {
    rank: number;
    user: User | null;
    totalBadgesEarned?: number;
    totalCompletionRateStats?: { totalNoOfActualDays: number; totalNoOfExpectedDays: number };
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: groupName,
      headerRight: () => (
        <Pressable onPress={handleMenuPress} style={{ padding: 10 }}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={iconColor} />
        </Pressable>
      ),
    });
  }, [databaseService.group, groupId, groupName, navigation, handleMenuPress, iconColor]);

  const getLeaderboardData = async (leaderboardMode: string) => {
    setIsLoading(true);
    try {
      let data: LeaderboardEntry[] = [];

      switch (leaderboardMode) {
        case 'Completion Rate':
          data = await databaseService.groupMember.getMembersRankedByCompletionRate(groupId);
          break;
        case 'Badges Earned':
          data = await databaseService.groupMember.getMembersRankedByBadgesEarned(groupId);
      }
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard mode: ' + leaderboardMode + ': ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      getLeaderboardData(leaderboardMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, leaderboardMode]);

  const onLeaderboardChange = (selection: string) => {
    console.log('Selected leaderboard mode:', selection);
    setLeaderboardMode(selection);
  };

  function getDisplayedQuantity(obj: LeaderboardEntry): number {
    switch (leaderboardMode) {
      case 'Completion Rate':
        if (
          !obj.totalCompletionRateStats ||
          obj.totalCompletionRateStats.totalNoOfExpectedDays === 0
        ) {
          return 0;
        } else {
          // percentage in __._ number
          const adjustedPercentage =
            Math.round(
              (obj.totalCompletionRateStats?.totalNoOfActualDays /
                obj.totalCompletionRateStats?.totalNoOfExpectedDays) *
                1000,
            ) / 10;
          return adjustedPercentage;
        }
      case 'Badges Earned':
        return obj.totalBadgesEarned || 0;
      default:
        return -1;
    }
  }

  return (
    <ThemedView style={{ flex: 1, alignItems: 'center' }}>
      <Pressable
        onPress={handleMenuPress}
        style={{ height: 0, width: 0 }}
        testID="leaveGroupButton"
      />
      <View style={{ height: '2%' }} />

      {/* leaderboard selection top bar */}
      <LeaderboardHeader selectionType={leaderboardMode} onSelectionChange={onLeaderboardChange} />
      <ThemedText style={{ fontWeight: 'bold', fontSize: 24 }}>
        {leaderboardMode} Leaderboard
      </ThemedText>
      {/* loading */}
      {isLoading ? (
        <ThemedView>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      ) : (
        <>
          {/* leaderboard top three graphic */}
          <View
            style={{ width: '90%', height: '33%', alignItems: 'center', justifyContent: 'center' }}>
            <LeaderboardTopThree
              user1={leaderboardData.length > 0 ? leaderboardData[0].user || undefined : undefined}
              user2={leaderboardData.length > 1 ? leaderboardData[1].user || undefined : undefined}
              user3={leaderboardData.length > 2 ? leaderboardData[2].user || undefined : undefined}
            />
          </View>

          {/* leaderboard itself */}
          <ScrollView style={{ width: '100%' }}>
            <View style={{ gap: 1, width: '90%', alignSelf: 'center' }}>
              {leaderboardData.length > 0 ? (
                leaderboardData
                  .filter((item) => item.user !== null)
                  .map((item, index) => (
                    <LeaderboardElement
                      key={item.rank}
                      rank={item.rank}
                      quantity={getDisplayedQuantity(item)}
                      selectionType={leaderboardMode}
                      user={item.user!}
                      isUser={item.user?.id === databaseService.userId}
                    />
                  ))
              ) : (
                <ThemedText>No leaderboard data available.</ThemedText>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </ThemedView>
  );
}
