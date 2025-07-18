import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { DatabaseService } from '@/services';
import { ThemedView } from '@/components/ThemedView';
import { LeaderboardHeader } from '@/components/LeaderboardHeader';
import { ThemedText } from '@/components/ThemedText';

export default function Group() {
  const navigation = useNavigation();
  const { groupId, groupName } = useLocalSearchParams<{ groupId: string; groupName: string }>();
  const [noOfBadges, setNoOfBadges] = useState(0);
  const [leaderboardMode, setLeaderboardMode] = useState('Completion Rate');

  const databaseService = DatabaseService.instance;

  useEffect(() => {
    navigation.setOptions({ headerTitle: groupName });
  }, [databaseService.group, groupId, groupName, navigation]);

  useEffect(() => {
    const getTotalNoOfBadges = async () => {
      try {
        const badges = await databaseService.user.getTotalBadgesEarnedByUserId(
          databaseService.userId as string,
        );
        console.log(badges);
        setNoOfBadges(badges);
      } catch (error) {
        console.error('Error fetching total badges:', error);
      }
    };
    getTotalNoOfBadges();
  }, [databaseService.user, databaseService.userId, setNoOfBadges]);

  const onLeaderboardChange = (selection: string) => {
    console.log('Selected leaderboard mode:', selection);
    setLeaderboardMode(selection);
  };

  return (
    <ThemedView style={{ flex: 1, alignItems: 'center' }}>
      {/* leaderboard selection top bar */}
      <ThemedText>{noOfBadges}</ThemedText>
      <LeaderboardHeader selectionType={leaderboardMode} onSelectionChange={onLeaderboardChange} />
    </ThemedView>
  );
}
