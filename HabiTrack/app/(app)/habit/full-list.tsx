import { HabitList } from '@/components/habit/HabitList';
import { Habit } from '@/db/localSchema';
import { DatabaseService } from '@/services';
import { useState, useEffect } from 'react';

export default function FullHabitListScreen() {
  const habitService = DatabaseService.instance.habit;
  const [data, setData] = useState<Habit[]>([]);

  useEffect(() => {
    habitService.getAllHabits().then(setData);
  }, [habitService]);

  return <HabitList data={data.map((habit) => ({ habit }))} isEditable={true} />;
}
