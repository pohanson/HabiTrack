import Milestones from '@/app/(app)/(tabs)/milestones';
import { DatabaseService } from '@/services';
import { act, render, waitFor } from '@testing-library/react-native';
import { useFocusEffect } from 'expo-router';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      habitMilestone: {
        getAllMilestonesQuery: jest.fn().mockResolvedValue([
          { habit_id: '1', habit_name: 'Exercise', week_streak: 5, badges_earned: 2 },
          { habit_id: '2', habit_name: 'Reading', week_streak: 3, badges_earned: 2 },
        ]),
      },
    },
  },
}));
// Minimal testing, the heavy testing should be done for the HabitMilestoneList component.
describe('MilestonesPage', () => {
  it('should render HabitMilestoneList with data', async () => {
    const { getByText, getAllByText } = render(<Milestones />);

    act(() => {
      const mockUseFocusEffect = useFocusEffect as jest.Mock;
      mockUseFocusEffect.mock.calls[0][0]();
    });
    await waitFor(() => {
      getByText('Exercise');
      getByText('Reading');
      getByText('SKILLED'); // for the rank, have 4 badges total
      getByText('LOCKED'); // for the rank, didn't complete all milestone for a habit
      expect(getAllByText('Completed!')).toHaveLength(4);
    });
  });

  it("should show 'No Habits' when no data", async () => {
    (DatabaseService.instance.habitMilestone.getAllMilestonesQuery as jest.Mock).mockResolvedValue(
      [],
    );

    const { getByText } = render(<Milestones />);

    await waitFor(() => {
      getByText('No Habits');
    });
  });
});
