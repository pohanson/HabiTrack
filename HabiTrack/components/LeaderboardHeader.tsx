import { Shadows } from '@/constants/Shadows';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export function LeaderboardHeader({
  selectionType,
  onSelectionChange,
}: {
  selectionType: string;
  onSelectionChange: (selection: string) => void;
}) {
  const selectedColor = useThemeColor({}, 'blue');
  const deselectedColor = 'dimgray';
  return (
    <View
      style={{
        height: '7.5%',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <TouchableOpacity
        style={[
          {
            height: '50%',
            backgroundColor: selectionType === 'Completion Rate' ? selectedColor : deselectedColor,
            width: '33%',
            borderColor: useThemeColor({}, 'border'),
            borderWidth: 2,
          },
          Shadows.large,
        ]}
        onPress={() => onSelectionChange('Completion Rate')}>
        <ThemedText
          style={{ color: 'white', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>
          Completion Rate
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          {
            height: '50%',
            backgroundColor: selectionType === 'Badges Earned' ? selectedColor : deselectedColor,
            width: '33%',
            borderColor: useThemeColor({}, 'border'),
            borderWidth: 2,
          },
          Shadows.large,
        ]}
        onPress={() => onSelectionChange('Badges Earned')}>
        <ThemedText
          style={{ color: 'white', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>
          Badges Earned
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          {
            height: '50%',
            backgroundColor: selectionType === 'Active Streak' ? selectedColor : deselectedColor,
            width: '33%',
            borderColor: useThemeColor({}, 'border'),
            borderWidth: 2,
          },
          Shadows.large,
        ]}
        onPress={() => onSelectionChange('Active Streak')}>
        <ThemedText
          style={{ color: 'white', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>
          Active Streak
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
