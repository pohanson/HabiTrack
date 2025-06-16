import { Habit, habit, Reminder, reminder } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

export namespace NotificationManager {
  let sqliteDb: ExpoSQLiteDatabase<Record<string, never>> & {
    $client: SQLiteDatabase;
  };

  export function init(
    db: ExpoSQLiteDatabase<Record<string, never>> & {
      $client: SQLiteDatabase;
    },
    notificationHandler: Notifications.NotificationHandler | null = null,
  ) {
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
    sqliteDb = db;
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
    const data = await sqliteDb
      .select()
      .from(habit)
      .innerJoin(reminder, eq(habit.id, reminder.habit_id));
    await Promise.all(
      data.map(({ habit, reminder }) => scheduleWeeklyPushNotification(habit, reminder)),
    );
  }

  export async function upsertPushNotificationForHabit(habitId: number) {
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
    const data = await sqliteDb
      .select()
      .from(habit)
      .innerJoin(reminder, eq(habit.id, reminder.habit_id))
      .where(eq(habit.id, habitId));
    await Promise.all(
      data.map(({ habit, reminder }) => scheduleWeeklyPushNotification(habit, reminder)),
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
