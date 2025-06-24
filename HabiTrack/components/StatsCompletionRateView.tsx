import { useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { ThemedView } from './ThemedView';
import { Shadows } from '@/constants/Shadows';
import { ThemedText } from './ThemedText';
import { Picker } from '@react-native-picker/picker';
import PieChart from './PieChart';

export const StatsCompletionRateView = ({
  createdAt,
  actualNoOfDays,
  expectedNoOfDays,

  firstOfThisMonthDate,
  monthExpectedNoOfDays,
  monthActualNoOfDays,

  startOfThisWeekDate,
  weekExpectedNoOfDays,
  weekActualNoOfDays,

  pieChartSize = 75,
}: {
  createdAt: string;
  actualNoOfDays: number;
  expectedNoOfDays: number;

  firstOfThisMonthDate: string;
  monthExpectedNoOfDays: number;
  monthActualNoOfDays: number;

  startOfThisWeekDate: string;
  weekExpectedNoOfDays: number;
  weekActualNoOfDays: number;

  pieChartSize?: number;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [timeframe, setTimeframe] = useState('all');

  let startDate = createdAt;
  let expected = expectedNoOfDays;
  let actual = actualNoOfDays;

  if (timeframe === 'month') {
    startDate = firstOfThisMonthDate;
    expected = monthExpectedNoOfDays;
    actual = monthActualNoOfDays;
  } else if (timeframe === 'week') {
    startDate = startOfThisWeekDate;
    expected = weekExpectedNoOfDays;
    actual = weekActualNoOfDays;
  } else {
  }

  const percentage = expected === 0 ? 0 : Math.round((actual / expected) * 1000) / 10;
  const adjustedPercentage = Math.min(100, Math.max(0, percentage));
  const pieChartColorForPercentage = getColorForPercentage(adjustedPercentage);

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
      <Picker
        style={{
          padding: 0,
          flex: 1,
          width: '50%',
          color: theme.text,
          height: 50,
          alignSelf: 'flex-start',
        }}
        selectedValue={timeframe}
        onValueChange={(itemValue) => setTimeframe(itemValue)}
        dropdownIconColor={theme.text}>
        <Picker.Item label="All Time" value="all" />
        <Picker.Item label="This Month" value="month" />
        <Picker.Item label="This Week" value="week" />
      </Picker>
      <ThemedText style={{ fontWeight: 'bold', fontSize: 24, padding: 10, color: theme.header }}>
        Completion Rate
        {timeframe === 'all' && ' [Lifetime]'}
        {timeframe === 'month' && ' [Month]'}
        {timeframe === 'week' && ' [Week]'}
      </ThemedText>
      <ThemedText style={{ fontSize: 15, padding: 0 }}>Evaluated since: {startDate}</ThemedText>
      <PieChart
        actualNoOfDays={actual}
        expectedNoOfDays={expected}
        radius={pieChartSize}
        color={pieChartColorForPercentage}
        textColor={pieChartColorForPercentage}
      />
      <ThemedText style={{ fontSize: 14, padding: 5, textAlign: 'center', width: '100%' }}>
        You completed{' '}
        <ThemedText style={{ color: pieChartColorForPercentage, fontWeight: 'bold' }}>
          {actual} / {expected}
        </ThemedText>{' '}
        scheduled days
        {timeframe === 'all' && ' in total'}
        {timeframe === 'month' && ' since the start of the month'}
        {timeframe === 'week' && ' since the start of the week'}
      </ThemedText>
      <ThemedText style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>
        {getProgressMessage(adjustedPercentage, timeframe)}
      </ThemedText>
    </ThemedView>
  );
};

function getProgressMessage(adjustedPercentage: number, timeframe: string) {
  // base messages for all time (and fallback)
  const baseMessages = {
    m0: 'Time to begin your journey! 🏁',
    m0to10: 'Small steps lead to big changes! 🌱',
    m10to20: "Room for growth, don't give up! 🔍",
    m20to30: 'Making some progress, but aim higher! 📈',
    m30to40: 'Decent effort, but consistency is key! 🔑',
    m40to50: 'Getting there, keep on moving! 🚴',
    m50to60: 'Halfway to full consistency! 🏁',
    m60to70: 'Strong consistency shown! 💪',
    m70to80: 'Solid habit formation! ⭐',
    m80to90: 'Impressive dedication! 🌟',
    m90to100: 'So close to perfection! 🙌',
    m100: 'Perfect completion rate! 🎯',
  };

  // month-specific messages
  const monthMessages = {
    m0: "Don't give up! 📅",
    m0to10: "Let's try harder this month! 🌱",
    m10to20: 'More consistency needed this month! 📝',
    m20to30: 'Slow progress, but you will get there! 📊',
    m30to40: 'Good effort, but you can do better! 🛠️',
    m40to50: 'Decent progress this month! 📌',
    m50to60: 'Good effort this month! 👍',
    m60to70: "You're quite consistent this month! 📆",
    m70to80: 'Solid monthly routine! ✨',
    m80to90: 'Excellent consistency this month! 🌟',
    m90to100: 'Outstanding dedication! 💪',
    m100: 'Perfect month so far! 🏆',
  };

  // week-specific messages
  const weekMessages = {
    m0: 'Time to get the week started! 🌅',
    m0to10: 'This week could use more work! 🌱',
    m10to20: 'More effort needed this week! 🔍',
    m20to30: 'You can work harder this week! 🛠️',
    m30to40: 'Not a bad week, but you could aim higher! 📊',
    m40to50: 'Decent weekly progress! 👏',
    m50to60: 'Solid week so far! 📈',
    m60to70: 'Great week ahead! 🌟',
    m70to80: 'Excellent week in progress! 🔥',
    m80to90: 'Outstanding weekly routine! 💯',
    m90to100: 'Nearly perfect week! Keep it up! 💪',
    m100: 'Perfect week so far! 🏆',
  };

  let messages;
  switch (timeframe) {
    case 'all':
      messages = baseMessages;
      break;
    case 'month':
      messages = monthMessages;
      break;
    case 'week':
      messages = weekMessages;
      break;
    default:
      messages = baseMessages;
  }

  // Return message based on percentage
  if (adjustedPercentage <= 0) return messages.m0;
  if (adjustedPercentage < 10) return messages.m0to10;
  if (adjustedPercentage < 20) return messages.m10to20;
  if (adjustedPercentage < 30) return messages.m20to30;
  if (adjustedPercentage < 40) return messages.m30to40;
  if (adjustedPercentage < 50) return messages.m40to50;
  if (adjustedPercentage < 60) return messages.m50to60;
  if (adjustedPercentage < 70) return messages.m60to70;
  if (adjustedPercentage < 80) return messages.m70to80;
  if (adjustedPercentage < 90) return messages.m80to90;
  if (adjustedPercentage < 100) return messages.m90to100;
  return messages.m100;
}

function getColorForPercentage(adjustedPercentage: number) {
  // red rgb: 255 0 0
  // green rgb: 0 180 60

  const r = Math.round(255 - 255 * (adjustedPercentage / 100));
  const g = Math.round(180 * (adjustedPercentage / 100));
  const b = Math.round(60 * (adjustedPercentage / 100));

  const rx = isNaN(r) ? '00' : Math.max(0, Math.min(255, r)).toString(16).padStart(2, '0');
  const gx = isNaN(g) ? '00' : Math.max(0, Math.min(255, g)).toString(16).padStart(2, '0');
  const bx = isNaN(b) ? '00' : Math.max(0, Math.min(255, b)).toString(16).padStart(2, '0');

  return `#${rx}${gx}${bx}`;
}
