import { HabitMilestoneList } from '@/components/milestone/HabitMilestoneList';
import { DatabaseService } from '@/services';
import { useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';

export default function Milestones() {
  const [refresh, setRefresh] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setRefresh((prev) => prev + 1);
    }, []),
  );

  const [data, setData] = useState<
    { habit_id: string; habit_name: string; week_streak: number; badges_earned: number }[]
  >([]);
  const databaseService = DatabaseService.instance;
  useEffect(() => {
    databaseService.habitMilestone.getAllMilestonesQuery().then(setData);
  }, [databaseService.habitMilestone, refresh]);
  return <HabitMilestoneList data={data} />;
}
