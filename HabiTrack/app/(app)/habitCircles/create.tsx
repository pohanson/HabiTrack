import { RHFMembersInput } from '@/components/RHFInputs/RHFMembersInput';
import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatabaseService } from '@/services';
import { GroupInsertionData } from '@/services/GroupService';
import { router } from 'expo-router';
import { FieldValues, useForm } from 'react-hook-form';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function CreateGroupPage() {
  const databaseService = DatabaseService.instance;

  const useFormReturn = useForm<FieldValues>({
    values: {
      name: '',
      memberIds: [],
    },
  });
  const { handleSubmit } = useFormReturn;

  const onSubmit = handleSubmit(
    async (data) => {
      console.log('Submitting Form:\n', data);
      try {
        await databaseService.group.createGroup(data as GroupInsertionData);
        Toast.show({
          text1: 'Group Created',
          type: 'success',
        });
        useFormReturn.reset();
        router.back();
      } catch (error) {
        console.error('Error inserting group:', error);
        Toast.show({
          text1: 'Failed to create group',
          type: 'error',
        });
      }
    },
    (errors) => {
      Toast.show({
        text1: 'Invalid/Missing Input',
        type: 'error',
      });
      console.log('Form submission errors:\n', errors);
    },
  );

  return (
    <ThemedView style={{ flex: 1, padding: 8 }}>
      <View style={{ paddingBottom: 15 }}>
        <ThemedText type="title">Create Group</ThemedText>
        <RHFTextInput
          name="name"
          isRequired={true}
          label="Group Name"
          useFormReturn={useFormReturn}
        />
      </View>

      <View style={{ flex: 1, marginBottom: 15 }}>
        <RHFMembersInput
          control={useFormReturn.control}
          name="memberIds"
          errorState={useFormReturn.formState.errors}
        />
      </View>

      <View
        style={{
          paddingBottom: 40,
        }}>
        <TextButton label="Create Group" onPress={onSubmit} style={{ width: '100%' }} />
      </View>
    </ThemedView>
  );
}
