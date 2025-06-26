import { getProgressBarColorForPercentage } from '@/utils/colorUtils';
import { Image, Text, useColorScheme, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Shadows } from '../constants/Shadows';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export function HabitMilestoneCard({
  habitName,
  weekStreak,
  badgesEarned,
}: {
  habitName: string;
  weekStreak: number;
  badgesEarned: number;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView
      style={[
        {
          alignItems: 'center',
          backgroundColor: theme.card,
          borderRadius: 20,
          padding: 5,
          overflow: 'hidden',
        },
        Shadows.large,
      ]}>
      <ThemedText style={{ fontSize: 22, fontWeight: 'bold', padding: 10 }}>{habitName}</ThemedText>
      <RowOfBadges weekStreak={weekStreak} badgesEarned={badgesEarned} />
    </ThemedView>
  );
}

type BadgeProps = {
  badgeType: number;
  color: string;
  completed: boolean;
  weekStreak: number;
  weeksRequired: number;
};

function getBadgeImage(badgeType: number, completed: boolean) {
  if (completed) {
    if (badgeType === 1) return require('../assets/images/badges/colored/msb1.png');
    if (badgeType === 2) return require('../assets/images/badges/colored/msb2.png');
    if (badgeType === 3) return require('../assets/images/badges/colored/msb3.png');
    if (badgeType === 4) return require('../assets/images/badges/colored/msb4.png');
    if (badgeType === 5) return require('../assets/images/badges/colored/msb5.png');
  } else {
    if (badgeType === 1) return require('../assets/images/badges/greyscale/gmsb1.png');
    if (badgeType === 2) return require('../assets/images/badges/greyscale/gmsb2.png');
    if (badgeType === 3) return require('../assets/images/badges/greyscale/gmsb3.png');
    if (badgeType === 4) return require('../assets/images/badges/greyscale/gmsb4.png');
    if (badgeType === 5) return require('../assets/images/badges/greyscale/gmsb5.png');
  }
}

function Badge(props: BadgeProps) {
  const opacity = props.completed ? 1 : 0.5; // set incomplete badge opacity here

  const badgeImage = getBadgeImage(props.badgeType, props.completed);

  return (
    <View style={{ rowGap: 5, alignItems: 'center' }}>
      <Image
        source={badgeImage}
        style={{
          width: 70,
          height: 70,
          resizeMode: 'contain',
          opacity: opacity,
        }}
      />
      <View>
        <ProgressBar
          weekStreak={props.weekStreak}
          weeksRequired={props.weeksRequired}
          completed={props.completed}
        />
      </View>
    </View>
  );
}

function RowOfBadges({ weekStreak, badgesEarned }: { weekStreak: number; badgesEarned: number }) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView
      style={{
        backgroundColor: theme.card,
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        justifyContent: 'space-between',
      }}>
      <Badge
        badgeType={1}
        color={theme.tint}
        weekStreak={weekStreak}
        weeksRequired={1}
        completed={badgesEarned >= 1}
      />
      <Badge
        badgeType={2}
        color={theme.tint}
        weekStreak={weekStreak}
        weeksRequired={3}
        completed={badgesEarned >= 2}
      />
      <Badge
        badgeType={3}
        color={theme.tint}
        weekStreak={weekStreak}
        weeksRequired={12}
        completed={badgesEarned >= 3}
      />
      <Badge
        badgeType={4}
        color={theme.tint}
        weekStreak={weekStreak}
        weeksRequired={26}
        completed={badgesEarned >= 4}
      />
      <Badge
        badgeType={5}
        color={theme.tint}
        weekStreak={weekStreak}
        weeksRequired={52}
        completed={badgesEarned >= 5}
      />
    </ThemedView>
  );
}

function ProgressBar({
  weekStreak,
  weeksRequired,
  completed,
}: {
  weekStreak: number;
  weeksRequired: number;
  completed: boolean;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const progressBarWidth = 64;
  const progressBarHeight = 6;

  const completion = weekStreak / weeksRequired;
  const completionWidth = completion * progressBarWidth;

  const progressBarColor = getProgressBarColorForPercentage(completion * 100);

  const message = completed
    ? 'Completed!'
    : weeksRequired <= 1
      ? `${weekStreak}/${weeksRequired} Week`
      : `${weekStreak}/${weeksRequired} Weeks`;

  return (
    <View>
      <View
        style={{
          position: 'relative',
          width: progressBarWidth,
          height: progressBarHeight,
          borderRadius: 10,
          backgroundColor: theme.lightGray,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: completionWidth,
            height: progressBarHeight,
            backgroundColor: progressBarColor,
            alignSelf: 'flex-start',
          }}
        />
      </View>

      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 10,
          color: theme.text,
          textAlign: 'left',
        }}>
        {message}
      </Text>
    </View>
  );
}
