import SigninPage from '@/app/signin';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { setIsInternetReachableJest } from '../setup';
import { DatabaseService } from '@/services';
import { mockUser1 } from '@/mocks/user';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      user: {
        signinUser: jest.fn(),
      },
    },
  },
}));

describe('SigninPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setIsInternetReachableJest(true);
    DatabaseService.instance.user.signinUser = jest.fn().mockResolvedValue(mockUser1);
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

  it('should signin successfully', async () => {
    const { getByTestId } = render(<SigninPage />);

    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-username'), 'a');
      fireEvent.changeText(getByTestId('RHFTextInput-password'), 'password');
      fireEvent.press(getByTestId('Login-button'));
    });

    await waitFor(() => {
      expect(DatabaseService.instance.user.signinUser).toHaveBeenCalledWith('a', 'password');
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });

  it('should not signin, missing inputs', async () => {
    const { getByText, getByTestId } = render(<SigninPage />);

    await act(async () => {
      fireEvent.press(getByTestId('Login-button'));
    });
    await waitFor(() => {
      getByText('Username (Case Sensitive) is required');
      getByText('Password is required');
    });

    expect(DatabaseService.instance.user.signinUser).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('should not signin, invalid credentials', async () => {
    DatabaseService.instance.user.signinUser = jest.fn().mockResolvedValue(null);
    const { getByTestId } = render(<SigninPage />);

    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-username'), 'a');
      fireEvent.changeText(getByTestId('RHFTextInput-password'), 'password');
      fireEvent.press(getByTestId('Login-button'));
    });

    await waitFor(() => {
      expect(DatabaseService.instance.user.signinUser).toHaveBeenCalledWith('a', 'password');
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  it('should register navigation to signup page', async () => {
    const { getByText } = render(<SigninPage />);

    await act(async () => {
      fireEvent.press(getByText('Sign up', { exact: false }));
    });

    expect(router.replace).toHaveBeenCalledWith('/signup');
  });
});
