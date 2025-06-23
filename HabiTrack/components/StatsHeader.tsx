import { getNiceDateString, reorderDateString } from '@/utils/dateUtils';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export const StatsHeader = ({
  habitName,
  todayDate,
  createdAt,
  lastModifiedAt,
  reminderTime,
}: {
  habitName: string;
  todayDate: string;
  createdAt: string;
  lastModifiedAt: string;
  reminderTime: string;
}) => {
  return (
    <ThemedView style={{ flexDirection: 'row' }}>
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
          {reorderDateString(createdAt)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};
