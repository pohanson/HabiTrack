import { Shadows } from '@/constants/Shadows';
import { getProgressBarColorForPercentage } from '@/utils/colorUtils';
import { Image, Text, useColorScheme, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Colors } from '@/constants/Colors';

export function HabitMilestoneCard({
  testID,
  habitName,
  weekStreak,
  badgesEarned,
}: {
  testID?: string;
  habitName: string;
  weekStreak: number;
  badgesEarned: number;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView
      testID="habit-milestone-card"
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
      <ThemedText testID="habit-name" style={{ fontSize: 22, fontWeight: 'bold', padding: 10 }}>
        {habitName}
      </ThemedText>
      <RowOfBadges weekStreak={weekStreak} badgesEarned={badgesEarned} />
    </ThemedView>
  );
}

type BadgeProps = {
  testID: string;
  badgeType: number;
  color: string;
  completed: boolean;
  weekStreak: number;
  weeksRequired: number;
};

function getBadgeImage(badgeType: number, completed: boolean) {
  if (completed) {
    if (badgeType === 1) return require('@/assets/images/badges/colored/msb1.png');
    if (badgeType === 2) return require('@/assets/images/badges/colored/msb2.png');
    if (badgeType === 3) return require('@/assets/images/badges/colored/msb3.png');
    if (badgeType === 4) return require('@/assets/images/badges/colored/msb4.png');
    if (badgeType === 5) return require('@/assets/images/badges/colored/msb5.png');
  } else {
    if (badgeType === 1) return require('@/assets/images/badges/greyscale/gmsb1.png');
    if (badgeType === 2) return require('@/assets/images/badges/greyscale/gmsb2.png');
    if (badgeType === 3) return require('@/assets/images/badges/greyscale/gmsb3.png');
    if (badgeType === 4) return require('@/assets/images/badges/greyscale/gmsb4.png');
    if (badgeType === 5) return require('@/assets/images/badges/greyscale/gmsb5.png');
  }
}

function Badge(props: BadgeProps) {
  const opacity = props.completed ? 1 : 0.5; // set incomplete badge opacity here

  const badgeImage = getBadgeImage(props.badgeType, props.completed);

  return (
    <View testID={props.testID} style={{ rowGap: 5, alignItems: 'center' }}>
      <Image
        testID={`${props.testID}-image`}
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
          testID={`${props.testID}-progress-bar`}
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
      testID="row-of-badges"
      style={{
        backgroundColor: theme.card,
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        justifyContent: 'space-between',
      }}>
      <Badge
        testID="badge-1"
        badgeType={1}
        color={theme.tint}
        weekStreak={weekStreak}
        weeksRequired={1}
        completed={badgesEarned >= 1}
      />
      <Badge
        testID="badge-2"
        badgeType={2}
        color={theme.tint}
        weekStreak={weekStreak}
        weeksRequired={3}
        completed={badgesEarned >= 2}
      />
      <Badge
        testID="badge-3"
        badgeType={3}
        color={theme.tint}
        weekStreak={weekStreak}
        weeksRequired={12}
        completed={badgesEarned >= 3}
      />
      <Badge
        testID="badge-4"
        badgeType={4}
        color={theme.tint}
        weekStreak={weekStreak}
        weeksRequired={26}
        completed={badgesEarned >= 4}
      />
      <Badge
        testID="badge-5"
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
  testID,
  weekStreak,
  weeksRequired,
  completed,
}: {
  testID: string;
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

  const incompleteProgressBarColor = getProgressBarColorForPercentage(completion * 100);
  const completeProgressBarColor = getProgressBarColorForPercentage(100);

  const message = completed
    ? 'Completed!'
    : weeksRequired <= 1
      ? `${weekStreak}/${weeksRequired} Week`
      : `${weekStreak}/${weeksRequired} Weeks`;

  return completed ? (
    // completed progress bar + message
    <View testID={testID}>
      <View
        testID={`${testID}-complete-bar`}
        style={{
          position: 'relative',
          width: progressBarWidth,
          height: progressBarHeight,
          borderRadius: 10,
          backgroundColor: completeProgressBarColor,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}></View>
      <Text
        testID={`${testID}-complete-message`}
        style={{
          fontWeight: 'bold',
          fontSize: 10,
          color: theme.text,
          textAlign: 'left',
        }}>
        {message}
      </Text>
    </View>
  ) : (
    // incomplete progress bar + message
    <View>
      <View
        testID={`${testID}-incomplete-bar`}
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
          testID={`${testID}-incomplete-progress`}
          style={{
            width: completionWidth,
            height: progressBarHeight,
            backgroundColor: incompleteProgressBarColor,
            alignSelf: 'flex-start',
          }}
        />
      </View>
      <Text
        testID={`${testID}-incomplete-message`}
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
