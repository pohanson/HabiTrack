import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { DatabaseService } from '@/services';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function Group() {
  const navigation = useNavigation();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const databaseService = DatabaseService.instance;

  useEffect(() => {
    navigation.setOptions({ headerTitle: name });
  }, [databaseService.group, id, name, navigation]);

  return (
    <ThemedView>
      <ThemedText>{id}</ThemedText>
    </ThemedView>
  );
}
