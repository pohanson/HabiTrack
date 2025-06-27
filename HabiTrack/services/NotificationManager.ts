import { Habit, Reminder } from '@/db/schema';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DatabaseService } from './DatabaseService';

export namespace NotificationManager {
  export function init(notificationHandler: Notifications.NotificationHandler | null = null) {
    Notifications.setNotificationHandler(
      notificationHandler || {
        handleNotification: async () => ({
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowBanner: false,
          shouldShowList: true,
        }),
      },
    );
    return;
  }

  export async function scheduleWeeklyPushNotification(habit: Habit, reminder: Reminder) {
    let hour, minute;
    if (reminder.time == null) {
      hour = 9; // Default hour
      minute = 0; // Default minute
    } else {
      hour = parseInt(reminder.time.slice(0, 2));
      minute = parseInt(reminder.time.slice(2, 4));
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: habit.name,
        body: habit.description,
        data: { reminderId: reminder.id, habitId: habit.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: reminder.day + 1, // Adjusting to match expo weekday numbering (1 = Sunday, 2 = Monday, etc.)
        hour: hour,
        minute: minute,
      },
    });
  }

  export async function regeneratePushNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const databaseService = DatabaseService.instance;
    const data = await databaseService.habit.getAllHabitsWithReminder();
    await Promise.all(
      data.map(({ habit, reminder }) => scheduleWeeklyPushNotification(habit, reminder)),
    );
  }

  export async function upsertPushNotificationForHabit(habitId: string) {
    const databaseService = DatabaseService.instance;
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    const existingNotifications = notifications.filter((n) => n.content.data?.habitId === habitId);
    // Cancel all existing notification for that habit
    if (existingNotifications.length > 0) {
      await Promise.all(
        existingNotifications.map((notification) =>
          Notifications.cancelScheduledNotificationAsync(notification.identifier),
        ),
      );
    }
    const data = await databaseService.habit.getHabitWithReminders(habitId);
    if (data == null) {
      console.warn(`No habit found with id ${habitId}`);
      return;
    }
    await Promise.all(
      data.reminders.map((reminder) => scheduleWeeklyPushNotification(data.habit, reminder)),
    );
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
}
