import { useColorScheme } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Shadows } from '@/constants/Shadows';
import { Colors } from '@/constants/Colors';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Circle } from '@/components/Circle';

export const StatsCalendarView = ({
  today,
  createdAt,
  completedAtDates,
}: {
  today: string;
  createdAt: string;
  completedAtDates: any;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView
      style={[
        {
          width: '100%',
          borderRadius: 20,
          backgroundColor: theme.card,
          padding: 12,
          overflow: 'hidden',
        },
        Shadows.large,
      ]}>
      <Calendar
        markedDates={completedAtDates}
        style={{
          width: '100%',
          backgroundColor: theme.card,
        }}
        theme={{
          backgroundColor: theme.card,
          calendarBackground: theme.card,
          monthTextColor: theme.header,
          textSectionTitleColor: theme.header,
          selectedDayBackgroundColor: theme.card,
          selectedDayTextColor: theme.background,
          todayTextColor: theme.blue,
          dayTextColor: theme.text,
          textDisabledColor: theme.lightGray,
          arrowColor: theme.header,
        }}
        minDate={createdAt}
        maxDate={today}
      />

      <ThemedView
        style={{
          backgroundColor: theme.card,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
        }}>
        <ThemedView
          style={{ backgroundColor: theme.card, flexDirection: 'row', alignItems: 'center' }}>
          <Circle color={theme.green} size={6} style={{ margin: 10 }} />
          <ThemedText style={{ fontSize: 14 }}>Completed days</ThemedText>
        </ThemedView>
        <ThemedView
          style={{ backgroundColor: theme.card, flexDirection: 'row', alignItems: 'center' }}>
          <Circle color={theme.red} size={6} style={{ margin: 10 }} />
          <ThemedText style={{ fontSize: 14 }}>Missed days</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};
