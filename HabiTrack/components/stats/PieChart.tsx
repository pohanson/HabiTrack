import * as React from 'react';
import { View } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';

export default function PieChart({
  testID = 'pie-chart',
  actualNoOfDays,
  expectedNoOfDays,
  radius = 30,
  color = '#4CAF50',
  textColor = '#4CAF50',
}: {
  testID?: string;
  actualNoOfDays: number;
  expectedNoOfDays: number;
  radius?: number;
  color?: string;
  textColor?: string;
}) {
  const percentage =
    expectedNoOfDays === 0 ? 0 : Math.round((actualNoOfDays / expectedNoOfDays) * 1000) / 10;
  const strokeWidth = radius / 4.5;
  const half = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const adjustedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = (circumference * (100 - adjustedPercentage)) / 100;

  return (
    <View testID={testID}>
      <Svg
        testID="pie-chart-svg"
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${half * 2} ${half * 2}`}>
        <G testID="pie-chart-group" rotation="-90" origin={`${half}, ${half}`}>
          <Circle
            testID="pie-chart-circle-background"
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeOpacity={0.25}
          />
          <Circle
            testID="pie-chart-circle-foreground"
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
          />
        </G>
        <SvgText
          testID="pie-chart-percentage-text"
          x={half}
          y={half}
          fontSize={radius / 2.25}
          fontWeight="bold"
          fill={textColor}
          textAnchor="middle"
          alignmentBaseline="central">
          {adjustedPercentage + '%'}
        </SvgText>
      </Svg>
    </View>
  );
}
