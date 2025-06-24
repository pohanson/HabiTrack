import { Reminder } from '@/db/schema';
import { ReminderRepository } from '@/repositories/ReminderRepository';
import { paddedTimeFromDate } from '@/utils';
import { DatabaseService } from './DatabaseService';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';

export class ReminderService extends BaseSyncableRepoService {
  static #instance: ReminderService;
  private dbService: DatabaseService;
  private _reminderRepository: ReminderRepository;

  private constructor(dbService: DatabaseService) {
    const reminderRepo = new ReminderRepository(dbService.db);
    super(reminderRepo, 'reminder');
    this._reminderRepository = reminderRepo;
    this.dbService = dbService;
  }

  public static get instance() {
    return ReminderService.#instance;
  }

  public static init(dbService: DatabaseService): ReminderService {
    if (!ReminderService.#instance) {
      ReminderService.#instance = new ReminderService(dbService);
    }
    return ReminderService.#instance;
  }

  /**
   * Retrieves all reminders for a habit.
   */
  public getRemindersForHabit(
    habitId: string,
    includeDeleted: boolean = false,
  ): Promise<Reminder[]> {
    return this._reminderRepository.getRemindersForHabit(habitId, includeDeleted);
  }

  /**
   * Creates reminders for a habit on specified days at a given time.
   * @param habitId - The ID of the habit to create reminders for.
   * @param days - An array of days (0-6, where 0 is Sunday) to create reminders on.
   * @param time - The time of day to set for the reminders. If null, no time is set.
   */
  public createRemindersForHabit(habitId: string, days: number[], time: Date | null) {
    const paddedTime = paddedTimeFromDate(time);
    return this._reminderRepository.createMany(
      days.map((day) => ({
        day: day,
        time: paddedTime,
        habit_id: habitId,
      })),
    );
  }

  /**
   * Updates reminders for a habit.
   * @param habitId - The ID of the habit to update reminders for.
   * @param days - An array of days (0-6, where 0 is Sunday) to set reminders on.
   * @param time - The time of day to set for the reminders. If null, no time is set.
   */
  public updateRemindersForHabit(habitId: string, days: number[], time: Date | null) {
    const paddedTime = paddedTimeFromDate(time);
    this.getRemindersForHabit(habitId, true).then((reminders) => {
      // get the deleted, updated, and new reminders
      const deletedReminders = reminders.filter(
        (reminder) => !days.includes(reminder.day) && !reminder.isDeleted,
      );
      const updatedReminders = reminders.filter(
        (reminder) =>
          days.includes(reminder.day) && (reminder.time !== paddedTime || reminder.isDeleted),
      );
      const newReminders = days.filter(
        (day) => !reminders.some((reminder) => reminder.day === day),
      );
      // perform updates, deletions and creation of reminders
      for (const reminder of deletedReminders) {
        this._reminderRepository.delete(reminder.id);
      }
      for (const reminder of updatedReminders) {
        this._reminderRepository.update({
          ...reminder,
          isDeleted: false,
          time: paddedTime,
        });
      }
      for (const reminder of newReminders) {
        this._reminderRepository.create({
          day: reminder,
          time: paddedTime,
          habit_id: habitId,
        });
      }
    });
  }

  /**
   * Soft deletes all reminders for a given habit.
   */
  public deleteRemindersForHabit(habitId: string) {
    return this._reminderRepository.deleteRemindersForHabit(habitId);
  }
}
