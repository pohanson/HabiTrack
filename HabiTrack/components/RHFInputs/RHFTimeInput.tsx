import { Colors } from '@/constants/Colors';
import { zeroPad } from '@/utils/zeroPad';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCalendars } from 'expo-localization';
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Pressable, useColorScheme, View } from 'react-native';
import { STYLES } from '../Styles';
import { ThemedText } from '../ThemedText';

export function RHFTimeInput({
  control,
  label = 'Reminder Time',
  reminderTime = undefined,
}: {
  control: Control<any>;
  label?: string;
  reminderTime?: Date | undefined;
}) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const colors = Colors[useColorScheme() || 'light'];
  const timeZone = getCalendars()[0]?.timeZone || 'Asia/Singapore';
  return (
    <>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <View
        style={{ marginVertical: 8, display: 'flex', flexDirection: 'row', gap: 8, width: '100%' }}>
        <ThemedText
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            backgroundColor: 'dimgray',
            padding: 8,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: 'white',
          }}>
          {reminderTime === undefined
            ? 'No Reminder'
            : `${zeroPad(reminderTime.getHours())}:${zeroPad(reminderTime.getMinutes())}`}
        </ThemedText>
        <Pressable
          onPress={() => setShowTimePicker(true)}
          style={[STYLES.button]}
          pressRetentionOffset={60}
          hitSlop={5}>
          <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Select Time</ThemedText>
        </Pressable>
      </View>
      {showTimePicker && (
        <Controller
          name="time"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              value={value || new Date(0)}
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
        />
      )}
    </>
  );
}
