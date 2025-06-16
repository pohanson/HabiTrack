import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: true,
  }),
});

export async function schedulePushNotification(
  weekday: number, // Follows js getDay() convention (0 = Sunday, 1 = Monday, etc.)
  hour: number,
  minute: number,
  title: string,
  body: string,
) {
  weekday = weekday + 1; // Adjusting to match expo weekday numbering (1 = Sunday, 2 = Monday, etc.)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      hour: hour,
      minute: minute,
      weekday: weekday, // Weekdays are specified with a number from 1 through 7, with 1 indicating Sunday.
    },
  });
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [250, 250, 250, 250],
      lightColor: '#FFFFFF',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission not granted for push notification!');
        return;
      }
    }
  }
}
