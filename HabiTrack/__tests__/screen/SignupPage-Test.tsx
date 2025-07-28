import SignupPage from '@/app/signup';
import { mockUser1 } from '@/mocks/user';
import { DatabaseService } from '@/services';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { setIsInternetReachableJest } from '../setup';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      user: {
        checkValidUsername: jest.fn(),
        signupUser: jest.fn(),
      },
    },
  },
}));

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setIsInternetReachableJest(true);
    DatabaseService.instance.user.checkValidUsername = jest.fn().mockResolvedValue(true);
    DatabaseService.instance.user.signupUser = jest.fn().mockResolvedValue(mockUser1);
  });
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

  it('should signup successfully', async () => {
    const { getByTestId } = render(<SignupPage />);
    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-username'), '123456789012');
      fireEvent.changeText(getByTestId('RHFTextInput-name'), 'name');
      fireEvent.changeText(getByTestId('RHFTextInput-password'), 'password');
      fireEvent.press(getByTestId('Sign Up-button'));
    });

    await waitFor(() => {
      expect(DatabaseService.instance.user.checkValidUsername).toHaveBeenCalledWith('123456789012');
      expect(DatabaseService.instance.user.signupUser).toHaveBeenCalledWith({
        username: '123456789012',
        name: 'name',
        password: 'password',
      });
    });
    expect(router.replace).toHaveBeenCalledWith('/signin');
  });

  it('should show error when input is missing', async () => {
    DatabaseService.instance.user.checkValidUsername = jest.fn().mockResolvedValue(false);
    const { getByText, getByTestId } = render(<SignupPage />);

    await act(async () => {
      fireEvent.press(getByTestId('Sign Up-button'));
    });

    await waitFor(() => {
      getByText('Username (Case Sensitive) is required');
      getByText('Name is required');
      getByText('Password is required');
    });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('should show error when username is taken', async () => {
    const spiedToastShow = jest.spyOn(Toast, 'show');
    DatabaseService.instance.user.checkValidUsername = jest.fn().mockResolvedValue(false);

    const { getByTestId } = render(<SignupPage />);

    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-username'), 'a');
      fireEvent.changeText(getByTestId('RHFTextInput-name'), 'name');
      fireEvent.changeText(getByTestId('RHFTextInput-password'), 'password');
      fireEvent.press(getByTestId('Sign Up-button'));
    });
    await waitFor(() => {
      expect(spiedToastShow).toHaveBeenCalledWith({
        text1: 'Error',
        text2: 'Username is taken! Please choose another.',
        type: 'error',
      });
    });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('should show error when username is too long', async () => {
    const { getByTestId, getByText } = render(<SignupPage />);
    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-username'), '1234567890123');
      fireEvent.changeText(getByTestId('RHFTextInput-name'), 'name');
      fireEvent.changeText(getByTestId('RHFTextInput-password'), 'password');
      fireEvent.press(getByTestId('Sign Up-button'));
    });

    await waitFor(() => {
      getByText('Too Long! Username length must be less than 12.');
      expect(DatabaseService.instance.user.checkValidUsername).not.toHaveBeenCalled();
      expect(DatabaseService.instance.user.signupUser).not.toHaveBeenCalled();
    });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('should show error when password is too short', async () => {
    DatabaseService.instance.user.checkValidUsername = jest.fn().mockResolvedValue(false);

    const { getByText, getByTestId } = render(<SignupPage />);

    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-username'), 'a');
      fireEvent.changeText(getByTestId('RHFTextInput-name'), 'name');
      fireEvent.changeText(getByTestId('RHFTextInput-password'), 'pas');
      fireEvent.press(getByTestId('Sign Up-button'));
    });
    await waitFor(() => {
      getByText('Too Short! Password length must be between 6-18.');
    });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('should show error when password is too long', async () => {
    DatabaseService.instance.user.checkValidUsername = jest.fn().mockResolvedValue(false);

    const { getByText, getByTestId } = render(<SignupPage />);

    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-username'), 'a');
      fireEvent.changeText(getByTestId('RHFTextInput-name'), 'name');
      fireEvent.changeText(getByTestId('RHFTextInput-password'), '1235678901234567890');
      fireEvent.press(getByTestId('Sign Up-button'));
    });
    await waitFor(() => {
      getByText('Too Long! Password length must be between 6-18.');
    });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('should show both error', async () => {
    const { getByTestId, getByText } = render(<SignupPage />);
    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-username'), '1234567890123');
      fireEvent.changeText(getByTestId('RHFTextInput-name'), 'name');
      fireEvent.changeText(getByTestId('RHFTextInput-password'), 'pas');
      fireEvent.press(getByTestId('Sign Up-button'));
    });

    await waitFor(() => {
      getByText('Too Long! Username length must be less than 12.');
      getByText('Too Short! Password length must be between 6-18.');
    });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('should register navigation to signup page', async () => {
    const { getByText } = render(<SignupPage />);
    await act(async () => {
      fireEvent.press(getByText('Sign In', { exact: false }));
    });
    expect(router.replace).toHaveBeenCalledWith('/signin');
  });
});
