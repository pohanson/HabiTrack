import { useColorScheme, View, Text, DimensionValue } from 'react-native';
import { Colors } from '../constants/Colors';
import { Shadows } from '../constants/Shadows';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export function HabitMilestoneCard() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView
      style={[
        { alignItems: 'center', backgroundColor: theme.card, borderRadius: 20, padding: 10 },
        Shadows.large,
      ]}>
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold', padding: 15 }}>Habit Name</ThemedText>
      <RowOfBadges />
    </ThemedView>
  );
}

type BadgeProps = {
  title: string;
  color: string;
  completion: DimensionValue | undefined;
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
        <ProgressBar completion={props.completion} />
      </View>
    </View>
  );
};

const RowOfBadges = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
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
      <Badge title={'1\nweek'} color={theme.tint} completion="100%" />
      <Badge title="3 weeks" color={theme.tint} completion="70%" />
      <Badge title="12 weeks" color={theme.tint} completion="50%" />
      <Badge title="26 weeks" color={theme.tint} completion="20%" />
      <Badge title="52 weeks" color={theme.tint} completion="10%" />
    </ThemedView>
  );
};

const ProgressBar = ({ completion }: { completion: DimensionValue | undefined }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  return (
    <View
      style={{
        position: 'relative',
        width: 50,
        height: 10,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
        overflow: 'hidden',
      }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: completion,
          height: 10,
          borderRadius: 10,
          backgroundColor: theme.tint,
        }}
      />
    </View>
  );
};
