import { useThemeColor } from '@/hooks/useThemeColor';
import { paddedTimeFromDate } from '@/utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCalendars } from 'expo-localization';
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { IconButton } from '../IconButton';
import { STYLES } from '../Styles';
import { ThemedText } from '../ThemedText';
import { Shadows } from '@/constants/Shadows';

export function RHFTimeInput({
  control,
  label = 'Reminder Time',
}: {
  control: Control<any>;
  label?: string;
}) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timeZone = getCalendars()[0]?.timeZone || 'Asia/Singapore';
  const cardColor = useThemeColor({}, 'card');
  // const textColor = useThemeColor({}, 'text');
  return (
    <Controller
      name="time"
      control={control}
      render={({ field: { onChange, value: reminderTime } }) => (
        <>
          <ThemedText type="defaultSemiBold">{label}</ThemedText>
          <View
            style={{
              marginVertical: 8,
              display: 'flex',
              flexDirection: 'row',
              gap: 8,
              width: '100%',
            }}>
            <View
              style={[
                {
                  display: 'flex',
                  flexDirection: 'row',
                  flex: 1,
                  borderRadius: 10,
                  backgroundColor: cardColor,
                  paddingHorizontal: 16,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
                Shadows.medium,
              ]}>
              <ThemedText>
                {reminderTime == null ? 'No Reminder' : paddedTimeFromDate(reminderTime)}
              </ThemedText>
              <IconButton iconName="xmark" onPress={() => onChange(null)} />
            </View>

            <Pressable
              onPress={() => setShowTimePicker(true)}
              style={[STYLES.button]}
              pressRetentionOffset={60}
              hitSlop={5}>
              <ThemedText style={{ color: '#f2f2f2', fontWeight: 'bold' }}>Select Time</ThemedText>
            </Pressable>
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={reminderTime || new Date('2000-01-01T04:00:00Z')}
              onChange={(event, selectedDate) => {
                setShowTimePicker(false);
                onChange(selectedDate);
              }}
              mode="time"
              timeZoneName={timeZone === 'Asia/Singapore' ? 'UTC' : timeZone}
              // 8*60=480 SG is UTC+8, required because Locale is not properly working.
              timeZoneOffsetInMinutes={timeZone === 'Asia/Singapore' ? 480 : undefined}
            />
          )}
        </>
      )}
    />
  );
}
