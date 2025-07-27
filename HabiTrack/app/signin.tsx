import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUserContext } from '@/context/UserContext';
import { DatabaseService } from '@/services';
import { addNetworkStateListener, getNetworkStateAsync, useNetworkState } from 'expo-network';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

export default function SigninPage() {
  const useFormReturn = useForm();
  const databaseService = DatabaseService.instance;
  const setCurrentUser = useUserContext().setCurrentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [networkState, setNetworkState] = useState(useNetworkState());

  useEffect(() => {
    getNetworkStateAsync().then((state) => setNetworkState(state));

    addNetworkStateListener((networkState) => {
      setNetworkState(networkState);
    });
  }, []);
  if (!networkState.isInternetReachable) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <ThemedText style={{ textAlign: 'center' }}>
          No internet connection detected. Please connect to internet for the signin and signup. The
          rest of the app could be used without wifi
        </ThemedText>
      </ThemedView>
    );
  }

  const onSubmit = useFormReturn.handleSubmit(
    async (data: any) => {
      try {
        const user = await databaseService.user.signinUser(data.username, data.password);
        if (user) {
          Toast.show({ text1: `Welcome ${user.name}!`, type: 'success' });
          setCurrentUser(user.id);
          router.replace('/'); // Redirect to home page after successful login
          useFormReturn.reset();
        } else {
          Toast.show({
            text1: 'Login Failed',
            text2: 'Invalid username or password.',
            type: 'error',
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        Toast.show({
          text1: 'Login Failed',
          text2: 'An error occurred during login.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    (error) => {
      console.log('Form submission failed', error);
      Toast.show({
        text1: 'Form submission failed.',
        text2: 'Please check your inputs.',
        type: 'error',
      });
      setIsLoading(false);
    },
  );

  return (
    <ThemedView style={{ padding: 20, height: '100%', justifyContent: 'center' }}>
      <ThemedText type="title" style={{ marginBottom: 20 }}>
        Login
      </ThemedText>
      <RHFTextInput
        useFormReturn={useFormReturn}
        label="Username (Case Sensitive)"
        name="username"
        isRequired={true}
        spellCheck={false}
      />
      <RHFTextInput
        useFormReturn={useFormReturn}
        label="Password"
        name="password"
        isRequired={true}
        spellCheck={false}
      />
      {isLoading ? (
        <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
          Signing in...
        </ThemedText>
      ) : (
        <ThemedView>
          <TextButton
            label="Login"
            onPress={() => {
              setIsLoading(true);
              setTimeout(onSubmit, 10); // needed to ensure the state is updated.
            }}
            style={{ marginTop: 20 }}
            disabled={isLoading}
          />
          <TextButton
            label="Go to Sign Up"
            onPress={() => router.replace('/signup')}
            style={{ marginTop: 10 }}
            disabled={isLoading}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}
