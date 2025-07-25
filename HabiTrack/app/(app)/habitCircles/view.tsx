import { GroupCard } from '@/components/GroupCard';
import { IconButton } from '@/components/IconButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { DatabaseService } from '@/services';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HabitCirclesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [groupsData, setGroupsData] = useState<
    {
      group: {
        id: string;
        name: string;
        admin_id: string;
        createdAt: string;
        modifiedAt: string;
        isDeleted: boolean;
      };
    }[]
  >([]);

  const databaseService = DatabaseService.instance;

  const [refresh, setRefresh] = useState(0);
  useFocusEffect(useCallback(() => setRefresh((prev) => prev + 1), []));

  useEffect(() => {
    const fetchGroups = async () => {
      const groups = await databaseService.group.getGroupsByUserIdQuery(databaseService.userId);
      setGroupsData(groups);
    };

    setIsLoading(true);
    fetchGroups().finally(() => setIsLoading(false));
  }, [databaseService.group, databaseService.userId, refresh]);

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const bottomPadding = useSafeAreaInsets().bottom;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.background,
        marginBottom: bottomPadding,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '80%',
          padding: 10,
          alignSelf: 'center',
          backgroundColor: theme.background,
        }}>
        <ThemedText type="title">Your Groups</ThemedText>
        <IconButton iconName="plus" onPress={() => router.push('/habitCircles/create')} />
      </View>

      {!isLoading ? (
        <View style={{ width: '100%', backgroundColor: theme.background }}>
          <ThemedView style={{ gap: 10, padding: 10 }}>
            {groupsData?.length === 0 ? (
              <ThemedText>
                {'You have no Habit Circles yet.\nCreate your first group to get started!'}
              </ThemedText>
            ) : (
              groupsData?.map((groupRow) => (
                <GroupCard key={groupRow.group.id} group={groupRow.group} />
              ))
            )}
          </ThemedView>
        </View>
      ) : (
        <View>
          <ThemedText>Loading...</ThemedText>
        </View>
      )}
    </ScrollView>
  );
}
