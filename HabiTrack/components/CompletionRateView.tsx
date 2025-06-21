import { useColorScheme } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { ThemedView } from './ThemedView';
import { Shadows } from '@/constants/Shadows';
import { ThemedText } from './ThemedText';
import PieChart from './PieChart';

export const CompletionRateView = ({
  createdAt,
  actualNoOfDays,
  expectedNoOfDays,
  pieChartSize = 75,
}: {
  createdAt: string;
  actualNoOfDays: number;
  expectedNoOfDays: number;
  pieChartSize: number;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const percentage =
    expectedNoOfDays === 0 ? 0 : Math.round((actualNoOfDays / expectedNoOfDays) * 1000) / 10;
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
      <ThemedText style={{ fontWeight: 'bold', fontSize: 24, padding: 10 }}>
        Completion Rate
      </ThemedText>
      <ThemedText style={{ fontSize: 14, padding: 0 }}>Evaluated since: {createdAt}</ThemedText>
      <PieChart
        actualNoOfDays={actualNoOfDays}
        expectedNoOfDays={expectedNoOfDays}
        radius={pieChartSize}
        color={pieChartColorForPercentage}
        textColor={pieChartColorForPercentage}
      />
      <ThemedText style={{ fontSize: 16, padding: 5 }}>
        <ThemedText style={{ fontWeight: 'bold' }}>{actualNoOfDays}</ThemedText> of{' '}
        <ThemedText style={{ fontWeight: 'bold' }}>{expectedNoOfDays}</ThemedText> days completed
      </ThemedText>
      <ThemedText style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
        {getProgressMessage(adjustedPercentage)}
      </ThemedText>
    </ThemedView>
  );
};

function getProgressMessage(adjustedPercentage: number) {
  if (adjustedPercentage <= 0) {
    return 'Begin your journey! 🏁';
  } else if (adjustedPercentage > 0 && adjustedPercentage < 10) {
    return "Don't give up! 🏋️‍♂️";
  } else if (adjustedPercentage >= 10 && adjustedPercentage < 20) {
    return 'Building consistency takes time! 🕰️';
  } else if (adjustedPercentage >= 20 && adjustedPercentage < 30) {
    return 'Showing up matters! 💫';
  } else if (adjustedPercentage >= 30 && adjustedPercentage < 40) {
    return 'Consistency is key! 🔑';
  } else if (adjustedPercentage >= 40 && adjustedPercentage < 50) {
    return 'Approaching the halfway point! 🚴';
  } else if (adjustedPercentage >= 50 && adjustedPercentage < 60) {
    return 'Over halfway there! 🏁';
  } else if (adjustedPercentage >= 60 && adjustedPercentage < 70) {
    return 'Strong consistency shown! 💪';
  } else if (adjustedPercentage >= 70 && adjustedPercentage < 80) {
    return 'Solid habit formation! ⭐';
  } else if (adjustedPercentage >= 80 && adjustedPercentage < 90) {
    return 'Impressive consistency! 🌟';
  } else if (adjustedPercentage >= 90 && adjustedPercentage < 100) {
    return 'Nearly perfect completion! 🙌';
  } else if (adjustedPercentage >= 100) {
    return 'Perfect completion rate! 🎯';
  }
}

function getColorForPercentage(adjustedPercentage: number) {
  // red rgb: 255 0 0
  // green rgb: 0 180 80

  const r = Math.round(255 - 255 * (adjustedPercentage / 100));
  const g = Math.round(185 * (adjustedPercentage / 100));
  const b = Math.round(80 * (adjustedPercentage / 100));

  const rx = isNaN(r) ? '00' : Math.max(0, Math.min(255, r)).toString(16).padStart(2, '0');
  const gx = isNaN(g) ? '00' : Math.max(0, Math.min(255, g)).toString(16).padStart(2, '0');
  const bx = isNaN(b) ? '00' : Math.max(0, Math.min(255, b)).toString(16).padStart(2, '0');
  return `#${rx}${gx}${bx}`;
}
