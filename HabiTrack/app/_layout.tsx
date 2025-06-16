import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { DATABASE_NAME } from '@/constants';
import migrations from '@/drizzle/migrations';
import { useColorScheme } from '@/hooks/useColorScheme';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import React, { Suspense, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from '@/services/notification';
import { habit, reminder } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync().catch(console.log);
  }, []);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { error } = useMigrations(db, migrations);

  if (error) {
    console.log('Database migration failed:', error);
    return null;
  }

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  db.select({ reminder: reminder, habit: habit })
    .from(reminder)
    .innerJoin(habit, eq(reminder.habit_id, habit.id))
    .where(eq(reminder.day, new Date().getDay()))
    .then((data) => {
      for (const { reminder, habit } of data) {
        let hour, minute;
        if (reminder.time == null) {
          hour = 9; // Default hour
          minute = 0; // Default minute
        } else {
          hour = parseInt(reminder.time.slice(0, 2));
          minute = parseInt(reminder.time.slice(2, 4));
        }
        schedulePushNotification(reminder.day, hour, minute, habit?.name, habit?.description || '');
      }
    })
    .catch(console.error);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Suspense fallback={<ActivityIndicator size="large" />}>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </SQLiteProvider>
        </Suspense>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
