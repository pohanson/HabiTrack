import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatabaseService } from '@/services';
import { addNetworkStateListener, getNetworkStateAsync, useNetworkState } from 'expo-network';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

export default function SignupPage() {
  const useFormReturn = useForm();
  const databaseService = DatabaseService.instance;
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
          No internet connection detected.
          <br /> Please connect to internet for the signin and signup. The rest of the app could be
          used without wifi
        </ThemedText>
      </ThemedView>
    );
  }

  const onSubmit = useFormReturn.handleSubmit(
    async (data: any) => {
      setIsLoading(true);
      try {
        console.log('Form submitted:', data);
        const isValid = await databaseService.user.checkValidUsername(data.username);
        console.log('Username validity:', isValid);

        if (!isValid) {
          Toast.show({
            text1: 'Error',
            text2: 'Username is taken! Please choose another.',
            type: 'error',
          });
          return;
        }

        await databaseService.user.signupUser({
          username: data.username,
          name: data.name,
          password: data.password,
        });

        Toast.show({
          text1: 'Account Created',
          text2: `Please sign in with your new account.`,
          type: 'success',
        });
        router.replace('/signin');
        useFormReturn.reset();
      } catch (error) {
        console.error('Error creating user:', error);
        Toast.show({
          text1: 'Failed to create account',
          text2: 'Please try again.',
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
        text2: ' Please check your inputs.',
        type: 'error',
      });
      setIsLoading(false);
    },
  );

  return (
    <ThemedView style={{ padding: 20, height: '100%', justifyContent: 'center' }}>
      <ThemedText type="title" style={{ marginBottom: 20 }}>
        Create Account
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
        label="Name"
        name="name"
        isRequired={true}
        spellCheck={false}
      />
      <RHFTextInput
        useFormReturn={useFormReturn}
        label="Password"
        name="password"
        isRequired={true}
        rules={{
          minLength: { value: 6, message: 'Too Short! Password length must be between 6-18.' },
          maxLength: { value: 18, message: 'Too Long! Password length must be between 6-18.' },
        }}
        spellCheck={false}
      />
      {isLoading ? (
        <ThemedText type="subtitle" style={{ textAlign: 'center', marginTop: 20 }}>
          Creating account...
        </ThemedText>
      ) : (
        <ThemedView>
          <TextButton
            label="Sign Up"
            onPress={() => {
              setIsLoading(true);
              setTimeout(onSubmit, 10); // needed to ensure the state is updated.
            }}
            style={{ marginTop: 20 }}
            disabled={isLoading}
          />
          <TextButton
            label="Go to Sign In"
            onPress={() => router.replace('/signin')}
            style={{ marginTop: 10 }}
            disabled={isLoading}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}
