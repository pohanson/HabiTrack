import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { DatabaseService } from '@/services';
import { ThemedView } from '@/components/ThemedView';
import { LeaderboardHeader } from '@/components/LeaderboardHeader';
import { ThemedText } from '@/components/ThemedText';
import { User } from '@/db/localSchema';
import { LeaderboardElement } from '@/components/LeaderboardElement';
import { ScrollView, View } from 'react-native';
import { LeaderboardTopThree } from '@/components/LeaderboardTopThree';

export default function Group() {
  const navigation = useNavigation();
  const { groupId, groupName } = useLocalSearchParams<{ groupId: string; groupName: string }>();
  const [membersRankedByBadgesEarned, setMembersRankedByBadgesEarned] = useState<
    LeaderboardEntry[]
  >([]);
  const [leaderboardMode, setLeaderboardMode] = useState('Completion Rate');

  const databaseService = DatabaseService.instance;

  type LeaderboardEntry = {
    rank: number;
    user: User | null;
    totalBadgesEarned: number;
  };

  useEffect(() => {
    navigation.setOptions({ headerTitle: groupName });
  }, [databaseService.group, groupId, groupName, navigation]);

  useEffect(() => {
    const membersRankedByBadgesEarned = async () => {
      try {
        const members = await databaseService.groupMember.getMembersRankedByBadgesEarned(
          groupId as string,
        );
        setMembersRankedByBadgesEarned(members);
      } catch (error) {
        console.error('Error fetching members ranked by badges:', error);
      }
    };

    membersRankedByBadgesEarned();
  }, [databaseService.groupMember, groupId]);

  const onLeaderboardChange = (selection: string) => {
    console.log('Selected leaderboard mode:', selection);
    setLeaderboardMode(selection);
  };

  return (
    <ThemedView style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ height: '2%' }} />
      <ThemedText style={{ fontWeight: 'bold', fontSize: 24 }}>Leaderboard</ThemedText>

      {/* leaderboard selection top bar */}
      <LeaderboardHeader selectionType={leaderboardMode} onSelectionChange={onLeaderboardChange} />

      {/* leaderboard top three graphic */}
      <View style={{ width: '90%', height: '33%', alignItems: 'center', justifyContent: 'center' }}>
        <LeaderboardTopThree
          user1={
            membersRankedByBadgesEarned.length > 0
              ? membersRankedByBadgesEarned[0]?.user || undefined
              : undefined
          }
          user2={
            membersRankedByBadgesEarned.length > 1
              ? membersRankedByBadgesEarned[1]?.user || undefined
              : undefined
          }
          user3={
            membersRankedByBadgesEarned.length > 2
              ? membersRankedByBadgesEarned[2]?.user || undefined
              : undefined
          }
        />
      </View>

      {/* leaderboard itself */}
      <ScrollView style={{ width: '100%' }}>
        <View style={{ gap: 1, width: '90%', alignSelf: 'center' }}>
          {membersRankedByBadgesEarned.length > 0 ? (
            membersRankedByBadgesEarned
              .filter((item) => item.user !== null)
              .map((item, index) => (
                <LeaderboardElement
                  key={item.rank}
                  rank={item.rank}
                  quantity={item.totalBadgesEarned}
                  selectionType="Badges Earned"
                  user={item.user!}
                  isUser={item.user?.id === databaseService.userId}
                />
              ))
          ) : (
            <ThemedText>No leaderboard data available.</ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
