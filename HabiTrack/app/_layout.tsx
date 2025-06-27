import { DATABASE_NAME } from '@/constants';
import { UserProvider, useUserContext } from '@/context/UserContext';
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
NotificationManager.init();
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
      <UserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Suspense fallback={<ActivityIndicator size="large" />}>
            <SQLiteProvider
              databaseName={DATABASE_NAME}
              options={{ enableChangeListener: true }}
              useSuspense>
              <RootNavigator />
              <StatusBar style="auto" hidden={true} />
              <Toast config={toastConfig} />
            </SQLiteProvider>
          </Suspense>
        </ThemeProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  console.log(useUserContext(), databaseService.userId);
  return (
    <Stack initialRouteName={useUserContext().currentUserId == null ? 'signup' : '(app)/(tabs)'}>
      <Stack.Protected guard={useUserContext().currentUserId == null}>
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={useUserContext().currentUserId != null}>
        <Stack.Screen name="(app)/(tabs)" options={{ headerTransparent: true, headerTitle: '' }} />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
