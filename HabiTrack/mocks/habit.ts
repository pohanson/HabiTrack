import { Habit } from '@/db/schema';

export const mockHabit1: Habit = {
  id: '1',
  name: 'Exercise',
  description: 'This is a test habit.',
  user_id: 'asdfqwertyuizxcv',
  frequencyModifiedAt: new Date(2025, 7, 7).toISOString(),
  createdAt: '2025-08-26T19:16:14.823Z',
  modifiedAt: '2025-08-28T19:16:14.823Z',
  isDeleted: false,
};
