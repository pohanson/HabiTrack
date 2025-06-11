import { HabitCard } from '@/components/HabitCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as schema from '@/db/schema';
import { habit } from '@/db/schema';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function FullHabitListScreen() {
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { data, error } = useLiveQuery(drizzleDb.select().from(habit));

  if (error) {
    console.error('Error fetching habits:', error);
    Toast.error('Error fetching habits.');
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'All Habits' });
  }, [navigation]);

  return data?.length === 0 ? (
    <View>
      <ThemedText>No habits yet</ThemedText>
      <ThemedText>Create a habit to get started!</ThemedText>
    </View>
  ) : (
    <ScrollView>
      <ThemedView style={{ padding: 10, gap: 10 }}>
        {data.map((habitItem) => (
          <HabitCard key={habitItem.id} habit={habitItem} habit_completion={null} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}
