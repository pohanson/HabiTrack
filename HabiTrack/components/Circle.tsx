import { View, ViewStyle } from 'react-native';
import React from 'react';

export const Circle = ({
  size = 50,
  color = 'blue',
  style,
}: {
  size?: number;
  color?: string;
  style?: ViewStyle;
}) => {
  return (
    <View
      style={[{ backgroundColor: color, width: size, height: size, borderRadius: size / 2 }, style]}
    />
  );
};
