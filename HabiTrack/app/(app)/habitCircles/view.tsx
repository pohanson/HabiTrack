import { ThemedText } from '@/components/ThemedText';
import React, { useEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { IconButton } from '@/components/IconButton';
import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function HabitCirclesView() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Habit Circles' });
  }, [navigation]);

  return (
    <ThemedView style={{ flex: 1, alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '80%',
          padding: 10,
        }}>
        <ThemedText type="title">Your Groups</ThemedText>
        <IconButton iconName="plus" onPress={() => router.push('/habitCircles/create')} />
      </View>
    </ThemedView>
  );
}
