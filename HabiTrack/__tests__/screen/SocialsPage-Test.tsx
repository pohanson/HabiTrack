import SocialsPage from '@/app/(app)/(tabs)/socials';
import { render } from '@testing-library/react-native';

describe('SocialsPage', () => {
  it('should render the SocialsPage with buttons', () => {
    const { getByText } = render(<SocialsPage />);

    // Ensure the buttons are rendered
    getByText('Your Friends');
    getByText('Habit Circles');
  });
});
