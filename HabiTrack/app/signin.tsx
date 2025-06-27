import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUserContext } from '@/context/UserContext';
import { DatabaseService } from '@/services';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

export default function SigninPage() {
  const useFormReturn = useForm();
  const databaseService = DatabaseService.instance;
  const setCurrentUser = useUserContext().setCurrentUser;
  const isLoading = useFormReturn.formState.isSubmitting;
  const onSubmit = useFormReturn.handleSubmit(
    async (data: any) => {
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
    },
    () => {
      console.log('Form submission failed');
      Toast.show({
        text1: 'Form submission failed.',
        text2: 'Please check your inputs.',
        type: 'error',
      });
    },
  );

  return (
    <ThemedView style={{ padding: 20, height: '100%', justifyContent: 'center' }}>
      <ThemedText type="title" style={{ marginBottom: 20 }}>
        Login
      </ThemedText>
      <RHFTextInput
        useFormReturn={useFormReturn}
        label="Username"
        name="username"
        isRequired={true}
        textInputProps={{ spellCheck: false }}
      />
      <RHFTextInput
        useFormReturn={useFormReturn}
        label="Password"
        name="password"
        isRequired={true}
        textInputProps={{ spellCheck: false }}
      />
      {isLoading ? (
        <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
          Loading...
        </ThemedText>
      ) : (
        <ThemedView>
          <TextButton
            label="Login"
            onPress={onSubmit}
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
