import { getNiceDateString, reorderDateString } from '@/utils/dateUtils';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Image } from 'react-native';

export function StatsHeader({
  habitName,
  todayDate,
  createdAt,
  badgesEarned,
  startDate,
}: {
  habitName: string;
  todayDate: string;
  createdAt: string;
  badgesEarned: number;
  startDate: string;
}) {
  function getBadgeImageFromBadgesEarned(badgesEarned: number) {
    if (badgesEarned === 1) return require('@/assets/images/badges/colored/msb1.png');
    if (badgesEarned === 2) return require('@/assets/images/badges/colored/msb2.png');
    if (badgesEarned === 3) return require('@/assets/images/badges/colored/msb3.png');
    if (badgesEarned === 4) return require('@/assets/images/badges/colored/msb4.png');
    if (badgesEarned === 5) return require('@/assets/images/badges/colored/msb5.png');
    return null;
  }

  const badgeImage = getBadgeImageFromBadgesEarned(badgesEarned);

  return (
    <ThemedView style={{ flexDirection: 'row' }}>
      {badgesEarned > 0 && (
        <ThemedView style={{ justifyContent: 'center' }}>
          <Image
            source={badgeImage}
            style={{
              height: 70,
              width: 70,
              marginRight: 10,
            }}
          />
        </ThemedView>
      )}

      <ThemedView style={{ flex: 3 }}>
        <ThemedText
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            height: 50,
            textAlign: 'left',
            textAlignVertical: 'center',
          }}>
          {habitName}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 18,
          }}>
          {getNiceDateString(todayDate)}
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            fontSize: 12,
            marginBottom: -8,
            fontWeight: 'bold',
          }}>
          {'Created on'}
        </ThemedText>
        <ThemedText
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            fontSize: 11,
          }}>
          {reorderDateString(createdAt)}
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            fontSize: 12,
            marginBottom: -8,
            fontWeight: 'bold',
          }}>
          {'Last reset'}
        </ThemedText>
        <ThemedText
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            fontSize: 11,
          }}>
          {reorderDateString(startDate)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
