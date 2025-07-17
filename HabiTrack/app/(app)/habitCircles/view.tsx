import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { IconButton } from '@/components/IconButton';
import { ScrollView, View } from 'react-native';
import { DatabaseService } from '@/services';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { GroupCard } from '@/components/GroupCard';

export default function HabitCirclesView() {
  const navigation = useNavigation();

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

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '80%',
          padding: 10,
          alignSelf: 'center',
        }}>
        <ThemedText type="title">Your Groups</ThemedText>
        <IconButton iconName="plus" onPress={() => router.push('/habitCircles/create')} />
      </View>

      <View style={{ width: '100%' }}>
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
    </ScrollView>
  );
}
