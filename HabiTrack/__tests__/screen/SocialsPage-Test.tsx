import SocialsPage from '@/app/(app)/(tabs)/socials';
import { act, render, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

describe('SocialsPage', () => {
  it('should render the SocialsPage with buttons', () => {
    const { getByText } = render(<SocialsPage />);
    getByText('Your Friends');
    getByText('Habit Circles');
  });

  it('should navigate to /friend/view when pressed', async () => {
    const { getByText } = render(<SocialsPage />);
    await act(async () => {
      const button = getByText('Your Friends');
      await userEvent.press(button);
    });
    expect(router.push).toHaveBeenCalledWith('/friend/view');
  });

  it('should navigate to /habitCircles/view when pressed', async () => {
    const { getByText } = render(<SocialsPage />);
    await act(async () => {
      const button = getByText('Habit Circles');
      await userEvent.press(button);
    });
    expect(router.push).toHaveBeenCalledWith('/habitCircles/view');
  });
});
