import { useColorScheme, View, Text, DimensionValue } from 'react-native';
import { Colors } from '../constants/Colors';
import { Shadows } from '../constants/Shadows';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export function HabitMilestoneCard({
  habitName,
  badgeCompletions,
  badgesEarned,
}: {
  habitName: string;
  badgeCompletions: DimensionValue[];
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
          padding: 12,
          overflow: 'hidden',
        },
        Shadows.large,
      ]}>
      <ThemedText style={{ fontSize: 22, fontWeight: 'bold', padding: 10 }}>{habitName}</ThemedText>
      <RowOfBadges badgeCompletions={badgeCompletions} badgesEarned={badgesEarned} />
    </ThemedView>
  );
}

type BadgeProps = {
  title: string;
  color: string;
  completed: boolean;
  completion: DimensionValue | undefined; // percentage as string e.g. "80%"
};

const Badge = (props: BadgeProps) => {
  return (
    <View style={{ rowGap: 5 }}>
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: props.color,
          borderRadius: 100,
          justifyContent: 'center',
          opacity: (props.completed ?? false) ? 1 : 0.65, // set opacity for incomplete badges here
        }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'white',
            padding: 5,
          }}>
          {props.title}
        </Text>
      </View>
      <View>
        <ProgressBar completion={props.completion} completed={props.completed} />
      </View>
    </View>
  );
};

const RowOfBadges = ({
  badgeCompletions,
  badgesEarned,
}: {
  badgeCompletions: DimensionValue[];
  badgesEarned: number;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const firstBadgeCompletion = badgeCompletions[0];
  const secondBadgeCompletion = badgeCompletions[1];
  const thirdBadgeCompletion = badgeCompletions[2];
  const fourthBadgeCompletion = badgeCompletions[3];
  const fifthBadgeCompletion = badgeCompletions[4];

  return (
    <ThemedView
      style={{
        backgroundColor: theme.card,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        justifyContent: 'space-between',
      }}>
      <Badge
        title={'1\nweek'}
        color={theme.tint}
        completion={firstBadgeCompletion}
        completed={badgesEarned >= 1}
      />
      <Badge
        title={'3\nweeks'}
        color={theme.tint}
        completion={secondBadgeCompletion}
        completed={badgesEarned >= 2}
      />
      <Badge
        title={'12\nweeks'}
        color={theme.tint}
        completion={thirdBadgeCompletion}
        completed={badgesEarned >= 3}
      />
      <Badge
        title={'26\nweeks'}
        color={theme.tint}
        completion={fourthBadgeCompletion}
        completed={badgesEarned >= 4}
      />
      <Badge
        title={'52\nweeks'}
        color={theme.tint}
        completion={fifthBadgeCompletion}
        completed={badgesEarned >= 5}
      />
    </ThemedView>
  );
};

const ProgressBar = ({
  completion,
  completed,
}: {
  completion: DimensionValue | undefined;
  completed: boolean;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const progressBarWidth = 50;
  const progressBarHeight = 10;

  return !completed ? (
    // incomplete progress bar
    <View
      style={{
        position: 'relative',
        width: progressBarWidth,
        height: progressBarHeight,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
        overflow: 'hidden',
      }}>
      <View
        style={{
          position: 'absolute',
          width: completion,
          height: progressBarHeight,
          borderRadius: 10,
          backgroundColor: theme.tint,
        }}
      />
    </View>
  ) : (
    // complete progress bar
    <View style={{ width: progressBarWidth, height: progressBarHeight, alignItems: 'center' }}>
      <Text style={{ fontSize: 8 }}>Completed!</Text>
    </View>
  );
};
