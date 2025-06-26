import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatabaseService } from '@/services';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';

export default function SigninPage() {
  const useFormReturn = useForm();
  const databaseService = DatabaseService.instance;
  const onSubmit = useFormReturn.handleSubmit(
    async (data: any) => {
      console.log('Form submitted:', data);
      const user = await databaseService.user.signinUser(data.username, data.password);
      if (user) {
        Toast.show({ text1: `Welcome ${user.name}!`, type: 'success' });
        useFormReturn.reset();
        router.replace('/'); // Redirect to home page after successful login
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
    <SafeAreaView>
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
        <TextButton label="Login" onPress={onSubmit} style={{ marginTop: 20 }} />
        <TextButton
          label="Go to Sign Up"
          onPress={() => router.replace('/signup')}
          style={{ marginTop: 10 }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
