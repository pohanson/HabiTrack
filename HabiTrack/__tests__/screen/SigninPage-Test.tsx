import SigninPage from '@/app/signin';
import { render, waitFor } from '@testing-library/react-native';
import { setIsInternetReachableJest } from '../setup';

describe('<SigninPage />', () => {
  afterEach(() => {
    setIsInternetReachableJest(true);
  });

  it('should render signin form when internet is available', async () => {
    const { getByText, queryAllByText } = render(<SigninPage />);
    await waitFor(() => {
      expect(queryAllByText('No internet connection', { exact: false })).toHaveLength(0);
      expect(queryAllByText('Name', { exact: false })).toHaveLength(1); // for the username only
      getByText('Username', { exact: false });
      getByText('Password', { exact: false });
      expect(queryAllByText('Login', { exact: false })).not.toHaveLength(0);
    });
  });

  it('should render no internet message when offline', async () => {
    setIsInternetReachableJest(false);

    const { getByText, queryByText } = render(<SigninPage />);
    await waitFor(() => {
      getByText('No internet connection', { exact: false });
      expect(queryByText('Username', { exact: false })).toBeNull();
      expect(queryByText('Password', { exact: false })).toBeNull();
    });
  });
});
