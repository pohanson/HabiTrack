import { View, Text, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { Shadows } from '../constants/Shadows';

export function HabitMilestoneCard() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  return (
    <View
      style={[
        { alignItems: 'center', backgroundColor: theme.card, borderRadius: 20 },
        Shadows.large,
      ]}>
      <Text style={{ fontSize: 32 }}>Habit</Text>
    </View>
  );
}
