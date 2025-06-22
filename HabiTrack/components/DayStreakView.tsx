import { useColorScheme } from 'react-native';
import React from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Shadows } from '@/constants/Shadows';
import { Colors } from '@/constants/Colors';

export const DayStreakView = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  return (
    <ThemedView
      style={[
        {
          alignItems: 'center',
          backgroundColor: theme.card,
          borderRadius: 20,
          padding: 12,
          overflow: 'hidden',
        },
        Shadows.large,
      ]}>
      <ThemedText>DayStreakView</ThemedText>
    </ThemedView>
  );
};
