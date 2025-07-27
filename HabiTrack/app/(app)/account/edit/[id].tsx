import { RHFTextInput } from '@/components/RHFInputs/RHFTextInput';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DatabaseService } from '@/services';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Image, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function EditAccountPage() {
  const { id: userId } = useLocalSearchParams<{ id: string }>();
  const borderColor = useThemeColor({}, 'border');
  const databaseService = DatabaseService.instance;
  const useFormReturn = useForm<FieldValues>();
  useEffect(() => {
    databaseService.user.getUserById(userId).then((user) => useFormReturn.reset({ ...user }));
  }, [databaseService.user, useFormReturn, userId]);

  const onSubmit = useFormReturn.handleSubmit(async (data) => {
    Toast.hide();
    if (!userId) {
      console.error('User ID is not defined');
      return;
    }
    try {
      await databaseService.user
        .updateUser({ id: userId, ...data })
        .then(() => Toast.show({ text1: 'User updated successfully!' }));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  });

  if (!userId) {
    Toast.show({ text1: 'Unknown Error', text2: 'Please try again', type: 'error' });
    router.back();
    return;
  }
  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Edit Account</ThemedText>

      <Controller
        name="profilePicture"
        control={useFormReturn.control}
        render={({ field: { onChange, value: image } }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              gap: 10,
              marginVertical: 20,
            }}>
            {image ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${image}` }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <ThemedText
                type="default"
                style={{
                  width: 100,
                  height: 100,
                  borderColor: borderColor,
                  borderWidth: 1,
                  borderRadius: 50,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}>
                No profile picture
              </ThemedText>
            )}
            <TextButton
              label="Edit Profile Picture"
              onPress={() =>
                launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.5,
                  base64: true,
                  selectionLimit: 1,
                }).then((r) => {
                  console.log('ImagePicker result:', r);
                  if (r.canceled) {
                    console.log('Image selection was canceled');
                    return;
                  }
                  onChange(r.assets[0].base64 || null);
                })
              }
            />
          </View>
        )}
      />
      <RHFTextInput label="Name" name="name" isRequired={true} useFormReturn={useFormReturn} />
      <RHFTextInput
        label="Bio"
        name="bio"
        placeholder={useFormReturn.getValues('bio') || 'no bio yet'}
        useFormReturn={useFormReturn}
        multiline={true}
        numberOfLines={5}
      />
      <TextButton label="Update" style={{ width: '100%', marginTop: 20 }} onPress={onSubmit} />
    </ThemedView>
  );
}
