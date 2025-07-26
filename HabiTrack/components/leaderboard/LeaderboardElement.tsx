import { useColorScheme, View } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { User } from '@/db/localSchema';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Shadows } from '@/constants/Shadows';
import { Colors } from '@/constants/Colors';

export function LeaderboardElement({
  selectionType,
  rank,
  user,
  quantity,
  isUser,
}: {
  selectionType: string;
  rank: number;
  user: User;
  quantity: number;
  isUser: boolean;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const quantifiedText =
    selectionType === 'Completion Rate'
      ? quantity + '%'
      : selectionType === 'Badges Earned'
        ? quantity + ' Badges'
        : quantity + ' Unknown Type';

  function getRankProps() {
    switch (rank) {
      case 1:
        return {
          icon: '🥇',
          backgroundColor: '#fff700ff',
          shadows: Shadows.firstPlace,
        };
      case 2:
        return {
          icon: '🥈',
          backgroundColor: '#ffd900ff',
          shadows: Shadows.secondPlace,
        };
      case 3:
        return {
          icon: '🥉',
          backgroundColor: '#ffb700ff',
          shadows: Shadows.thirdPlace,
        };
      default:
        return {
          icon: '',
          backgroundColor: theme.card,
          shadows: Shadows.large,
        };
    }
  }

  const rankStyle = getRankProps();
  const themeTextColor = useThemeColor({}, 'text');
  const textColor = rank <= 3 ? 'black' : themeTextColor;

  return (
    <ThemedView
      testID={`leaderboard-element-${rank}`}
      style={[
        {
          backgroundColor: rankStyle.backgroundColor,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          borderRadius: 15,
          padding: 8,
          borderWidth: isUser ? 3 : 0,
          // set border color for the current user here
          borderColor: 'white',
        },
        rankStyle.shadows,
      ]}>
      <View
        testID={`leaderboard-element-${rank}-rank-container`}
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {/* ranking number */}
        <ThemedText
          testID={`leaderboard-element-${rank}-rank-icon`}
          style={{ fontWeight: 'bold', color: useThemeColor({}, 'blue'), padding: 5 }}>
          {rankStyle.icon}
        </ThemedText>
        <ThemedText
          testID={`leaderboard-element-${rank}-rank-number`}
          style={{ fontWeight: 'bold', color: useThemeColor({}, 'blue'), padding: 5 }}>
          {rank}
        </ThemedText>

        {/* name, username, profile pic */}
        <View testID={`leaderboard-element-${rank}-user-profile`} style={{ marginLeft: 8 }}>
          <ThemedText
            testID={`leaderboard-element-${rank}-user-name`}
            style={{ color: rank <= 3 ? 'black' : textColor, fontWeight: 'bold', fontSize: 16 }}>
            {user.name}
          </ThemedText>
          <ThemedText
            testID={`leaderboard-element-${rank}-username`}
            style={{ color: '#888', fontSize: 12 }}>
            @{user.username}
          </ThemedText>
        </View>
      </View>

      {/* quantity based on selectionType */}
      <View
        testID={`leaderboard-element-${rank}-quantity-container`}
        style={[
          {
            borderRadius: 10,
            backgroundColor: useThemeColor({}, 'blue'),
            padding: 8,
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: 'white',
          },
          Shadows.large,
        ]}>
        <ThemedText
          testID={`leaderboard-element-${rank}-quantity-text`}
          style={{ fontWeight: 'bold', alignSelf: 'center', fontSize: 12, color: 'white' }}>
          {quantifiedText}
        </ThemedText>
      </View>
    </ThemedView>
  );
}
