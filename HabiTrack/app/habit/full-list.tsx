import { Image } from 'expo-image';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { habit } from '@/db/schema';
import * as schema from '@/db/schema';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function FullHabitListScreen() {
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const colors = Colors[useColorScheme() || 'light'];

  const { data, error } = useLiveQuery(drizzleDb.select().from(habit));

  if (error) {
    console.error('Error fetching habits:', error);
    Toast.error('Error fetching habits.');
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'All Habits' });
  }, [navigation]);

  const EditButtonPressed = (habitId: number) => {
    const habitToEdit = data?.find((habit) => habit.id === habitId);
    router.push({
      pathname: '/habit/edit',
      params: { id: habitId },
    });
    console.log(`Editing Habit: ${habitToEdit?.name}`);
  };

  return (
    <ScrollView style={{ margin: 20 }}>
      {data?.length === 0 && (
        <View>
          <ThemedText>No habits yet</ThemedText>
          <ThemedText>Create a habit to get started!</ThemedText>
        </View>
      )}
      {data.map((habitItem, idx) => (
        <ThemedView
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 2,
            borderRadius: 15,
            padding: 10,
            margin: 10,
          }}>
          <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>{habitItem.name}</ThemedText>
          <TouchableOpacity onPress={() => EditButtonPressed(habitItem.id)}>
            <Image
              source={require('@/assets/images/edit-icon.png')}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </ThemedView>
      ))}
    </ScrollView>
  );
}
