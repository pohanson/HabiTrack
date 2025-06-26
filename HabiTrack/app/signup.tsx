import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatabaseService } from '@/services';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function SignupPage() {
  const useFormReturn = useForm();
  const databaseService = DatabaseService.instance;

  const onSubmit = useFormReturn.handleSubmit(
    (data: any) => {
      console.log('Form submitted:', data);
      databaseService.user.checkValidUsername(data.username).then((isValid) => {
        console.log('Username validity:', isValid);
        if (!isValid) {
          Toast.show({
            text1: 'Error',
            text2: 'Username is taken! Please choose another.',
            type: 'error',
          });
          return;
        }
        databaseService.user
          .signupUser({
            username: data.username,
            name: data.name,
            password: data.password,
          })
          .then(() => {
            Toast.show({
              text1: 'Account Created',
              text2: `Please sign in with your new account.`,
              type: 'success',
            });
            router.replace('/signin');
            useFormReturn.reset();
          })
          .catch((error) => {
            console.error('Error creating user:', error);
            Toast.show({
              text1: 'Failed to create account',
              text2: 'Please try again.',
              type: 'error',
            });
          });
      });
    },
    () => {
      console.log('Form submission failed');
      Toast.show({
        text1: 'Form submission failed.',
        text2: ' Please check your inputs.',
        type: 'error',
      });
    },
  );

  return (
    <SafeAreaView>
      <ThemedView style={{ padding: 20, height: '100%', justifyContent: 'center' }}>
        <ThemedText type="title" style={{ marginBottom: 20 }}>
          Create Account
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
          label="Name"
          name="name"
          isRequired={true}
          textInputProps={{ spellCheck: false }}
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
          textInputProps={{ spellCheck: false }}
        />
        <TextButton label="Sign Up" onPress={onSubmit} style={{ marginTop: 20 }} />
        <TextButton
          label="Go to Sign In"
          onPress={() => router.replace('/signin')}
          style={{ marginTop: 10 }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
