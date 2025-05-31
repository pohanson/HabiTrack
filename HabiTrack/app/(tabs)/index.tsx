import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { router } from 'expo-router';

import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { data } = useLiveQuery(drizzleDb.query.habit.findMany());

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Habit List</ThemedText>
        <FloatingActionButton iconName="plus" onPress={() => router.push('/habit/create')} />
      </ThemedView>
      {data.map((habit, idx) => (
        <View key={idx} style={{ borderWidth: 2, borderRadius: 15, padding: 10 }}>
          <ThemedText>{habit.name}</ThemedText>
        </View>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
