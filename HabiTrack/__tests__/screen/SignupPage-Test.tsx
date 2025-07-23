import SignupPage from '@/app/signup';
import { render, waitFor } from '@testing-library/react-native';
import { setIsInternetReachableJest } from '../setup';

describe('<SignupPage />', () => {
  afterEach(() => {
    setIsInternetReachableJest(true);
  });

  it('should render signup form when internet is available', async () => {
    const { getByText, queryAllByText } = render(<SignupPage />);
    await waitFor(() => {
      expect(queryAllByText('No internet connection', { exact: false })).toHaveLength(0);
      expect(queryAllByText('Name', { exact: false })).toHaveLength(2); // for the name and username
      getByText('Username', { exact: false });
      getByText('Password', { exact: false });
      expect(queryAllByText('Create Account', { exact: false })).not.toHaveLength(0);
    });
  });

  it('should render no internet message when offline', async () => {
    setIsInternetReachableJest(false);

    const { getByText, queryByText } = render(<SignupPage />);
    await waitFor(() => {
      getByText('No internet connection', { exact: false });
      expect(queryByText('Username', { exact: false })).toBeNull();
      expect(queryByText('Password', { exact: false })).toBeNull();
    });
  });
});
