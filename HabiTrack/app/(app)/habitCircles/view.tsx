import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { IconButton } from '@/components/IconButton';
import { ScrollView, useColorScheme, View } from 'react-native';
import { DatabaseService } from '@/services';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { GroupCard } from '@/components/GroupCard';
import { Colors } from '@/constants/Colors';

export default function HabitCirclesView() {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

  const databaseService = DatabaseService.instance;

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Habit Circles' });
  }, [navigation]);

  const { data: groupsData, error: groupsError } = useLiveQuery(
    databaseService.group.getGroupsByUserIdQuery(databaseService.userId),
  );

  if (groupsError) {
    console.error('Error fetching groups:', groupsError);
  }

  useEffect(() => {
    if (groupsData !== undefined) {
      setIsLoading(false);
    }
  }, [groupsData]);

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
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
