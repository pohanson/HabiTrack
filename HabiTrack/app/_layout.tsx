import { DATABASE_NAME } from '@/constants';
import migrations from '@/drizzle/local/migrations';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DatabaseService } from '@/services';
import { NotificationManager } from '@/services/NotificationManager';
import { SyncService } from '@/services/SyncService';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
const databaseService = DatabaseService.init(expoDb);
const db = databaseService.db;
NotificationManager.init(db as any);
export default function RootLayout() {
  useEffect(() => {
    NotificationManager.registerForPushNotificationsAsync().catch(console.error);
    NotificationManager.regeneratePushNotifications().catch(console.error);
  }, []);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { error } = useMigrations(db, migrations);

  if (error) {
    console.log('Database migration failed:', error);
    return null;
  }

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  SyncService.init();
  SyncService.instance.syncAll();

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
