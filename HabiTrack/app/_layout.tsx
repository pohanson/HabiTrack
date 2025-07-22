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
import { addNetworkStateListener, useNetworkState } from 'expo-network';
import { Stack } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
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

const screenConfigs = {
  unauthenticated: [
    { name: 'signup', options: { headerShown: false } },
    { name: 'signin', options: { headerShown: false } },
  ],
  authenticated: [
    { name: '(app)/(tabs)', options: { headerTransparent: true, headerTitle: '' } },
    { name: '(app)/habit/full-list', options: { headerTitle: 'All Habits' } },
    { name: '(app)/friend/view', options: { headerTitle: 'Friends' } },
    { name: '(app)/account/edit/[id]', options: { headerTitle: 'Edit Account' } },
    { name: '(app)/friend/[id]', options: { headerTitle: 'Friend Profile' } },
    { name: '(app)/habitCircles/view', options: { headerTitle: 'Habit Circles' } },
    { name: '(app)/habitCircles/create', options: { headerTitle: 'Create Habit Circle' } },
    { name: '(app)/habit/create', options: { headerTitle: 'Create Habit' } },
    { name: '(app)/habit/edit', options: { headerTitle: 'Edit Habit' } },
    { name: '(app)/habit/statistics', options: { headerTitle: 'Statistics' } },
  ],
};

const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
const databaseService = DatabaseService.init(expoDb);
const db = databaseService.db;
NotificationManager.init();
SyncService.init();
export default function RootLayout() {
  const networkState = useNetworkState();
  useEffect(() => {
    NotificationManager.registerForPushNotificationsAsync().catch(console.error);
    NotificationManager.regeneratePushNotifications().catch(console.error);
  }, []);

  useEffect(() => {
    // sync every minute if internet is reachable
    const syncInterval = setInterval(() => {
      if (networkState.isInternetReachable) {
        SyncService.instance.syncAll();
      }
    }, 60000);
    return () => {
      clearInterval(syncInterval);
    };
  }, [networkState, networkState.isInternetReachable]);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
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
  addNetworkStateListener((networkState) => {
    if (networkState.isInternetReachable) {
      Toast.show({
        text1: 'Connected to Internet',
        text2: 'Syncing data...',
        type: 'info',
      });
      SyncService.init().syncAll();
    }
  });

  if (!networkState.isInternetReachable) {
    Toast.show({
      text1: 'No Internet Connection',
      text2: 'No syncing done',
      type: 'info',
    });
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Suspense fallback={<ActivityIndicator size="large" />}>
            <RootNavigator />
            <StatusBar style="auto" hidden={true} />
            <Toast config={toastConfig} />
          </Suspense>
        </ThemeProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  return (
    <Stack initialRouteName={useUserContext().currentUserId == null ? 'signup' : '(app)/(tabs)'}>
      <Stack.Protected guard={useUserContext().currentUserId == null}>
        {screenConfigs.unauthenticated.map((screen) => (
          <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
        ))}
      </Stack.Protected>
      <Stack.Protected guard={useUserContext().currentUserId != null}>
        {screenConfigs.authenticated.map((screen) => (
          <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
        ))}
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
