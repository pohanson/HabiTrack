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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, {
  BaseToastProps,
  ErrorToast,
  InfoToast,
  SuccessToast,
} from 'react-native-toast-message';

const toastConfig = {
  success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <SuccessToast
      {...props}
      text1Style={{ fontSize: 16 }}
      text2Style={{ fontSize: 14 }}
      text1NumberOfLines={2}
      text2NumberOfLines={4}
    />
  ),
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      text1Style={{ fontSize: 16 }}
      text2Style={{ fontSize: 14 }}
      text1NumberOfLines={2}
      text2NumberOfLines={4}
    />
  ),
  info: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <InfoToast
      {...props}
      text1Style={{ fontSize: 16 }}
      text2Style={{ fontSize: 14 }}
      text1NumberOfLines={2}
      text2NumberOfLines={4}
    />
  ),
};

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
  // databaseService;
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
            <RootNavigator />
            <StatusBar style="auto" />
            <Toast config={toastConfig} />
          </SQLiteProvider>
        </Suspense>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const currentUser = DatabaseService.instance.userId;
  return (
    <Stack
      initialRouteName={currentUser == null ? 'signup' : '(app)/(tabs)'}
      screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={currentUser == null}>
        <Stack.Screen name="signup" />
        <Stack.Screen name="signin" />
      </Stack.Protected>
      <Stack.Protected guard={currentUser != null}>
        <Stack.Screen name="(app)/(tabs)" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
