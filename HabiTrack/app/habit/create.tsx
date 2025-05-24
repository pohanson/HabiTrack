import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function CreateHabitScreen() {
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerTitle: 'Create Habit' }), [navigation]);
  return (
    <View>
      <ThemedText type="title">Create Habit</ThemedText>
    </View>
  );
}
