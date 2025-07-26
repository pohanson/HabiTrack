import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import '@testing-library/jest-native/extend-expect';
import React from 'react';

// Suppress console output during test
const originalConsoleWarn = console.warn;
console.warn = jest.fn((...args) => {
  if (
    args[0].includes('bcrypt.setRandomFallback') ||
    args[0].includes('[Reanimated] Reading from `value` during component render.')
  ) {
    return;
  }
  originalConsoleWarn(...args);
});

// Mock the UserContext
jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(() => ({
    currentUserId: null,
    setCurrentUser: jest.fn(),
  })),
}));

// Mock SyncService
jest.mock('@/services/SyncService', () => ({
  SyncService: {
    syncRepoService: jest.fn().mockResolvedValue(() => {}),
    syncAll: jest.fn().mockResolvedValue(() => {}),
  },
}));

// Mock Notification
jest.mock('@/services/NotificationManager', () => ({
  NotificationManager: {
    scheduleWeeklyPushNotification: jest.fn().mockResolvedValue(null),
    regeneratePushNotification: jest.fn().mockResolvedValue(null),
    upsertPushNotificationForHabit: jest.fn().mockResolvedValue(null),
    registerForPushNotificationAsync: jest.fn().mockResolvedValue(null),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

// Mock Expo network
jest.mock('expo-network', () => ({
  useNetworkState: jest.fn(() => ({ isInternetReachable: mockIsInternetReachable })),
  getNetworkStateAsync: jest.fn(() =>
    Promise.resolve({ isInternetReachable: mockIsInternetReachable }),
  ),
  addNetworkStateListener: jest.fn(() => jest.fn()), // Return cleanup function
}));
// Allow the mock network state to be controlled
let mockIsInternetReachable = true;
export function setIsInternetReachableJest(value: boolean) {
  mockIsInternetReachable = value;
}

// Mock Expo router
jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
  useLocalSearchParams: jest.fn(),
  router: { push: jest.fn(), back: jest.fn() },
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

expect.extend({
  toBeCloseInTime(received, expected) {
    const receivedTimeInMins = received.getHours() * 60 + received.getMinutes();
    const expectedTimeInMins = expected.getHours() * 60 + expected.getMinutes();
    const pass = Math.abs(receivedTimeInMins - expectedTimeInMins) < 1;
    return {
      pass,
      message: () => `expected ${received} to be close in time to ${expected}`,
    };
  },
});
