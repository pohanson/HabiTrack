import { Shadows } from '@/constants/Shadows';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export function LeaderboardHeader({
  selectionType,
  onSelectionChange,
}: {
  selectionType: string;
  onSelectionChange: (selection: string) => void;
}) {
  const selectedColor = useThemeColor({}, 'blue');
  const deselectedColor = 'gray';

  const selectedTextColor = 'white';
  const deselectedTextColor = 'black';

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
            borderColor:
              selectionType === 'Completion Rate' ? selectedTextColor : deselectedTextColor,
            borderWidth: 2,
            borderTopLeftRadius: 15,
          },
          Shadows.large,
        ]}
        onPress={() => onSelectionChange('Completion Rate')}>
        <ThemedText
          style={{
            color: selectionType === 'Completion Rate' ? selectedTextColor : deselectedTextColor,
            fontSize: 13,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Completion Rate
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          {
            height: '50%',
            backgroundColor: selectionType === 'Badges Earned' ? selectedColor : deselectedColor,
            width: '33%',
            borderColor:
              selectionType === 'Badges Earned' ? selectedTextColor : deselectedTextColor,
            borderWidth: 2,
            borderBottomRightRadius: 15,
          },
          Shadows.large,
        ]}
        onPress={() => onSelectionChange('Badges Earned')}>
        <ThemedText
          style={{
            color: selectionType === 'Badges Earned' ? selectedTextColor : deselectedTextColor,
            fontSize: 13,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Badges Earned
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
