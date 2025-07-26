import { TextButton } from '@/components/TextButton';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { Image, StyleProp, ViewStyle } from 'react-native';
const buttonStyle: StyleProp<ViewStyle> = { width: '100%' };

export default function SocialsPage() {
  const imageSize = 250;

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedView
        style={{
          gap: 10,
          padding: 20,
          width: '80%',
        }}>
        <Image
          source={require('@/assets/images/socials4.png')}
          style={{ width: imageSize, height: imageSize, alignSelf: 'center' }}
        />
        <TextButton
          label="Your Friends"
          style={buttonStyle}
          onPress={() => router.push('/friend/view')}
        />
        <TextButton
          label="Habit Circles"
          style={buttonStyle}
          onPress={() => router.push('/habitCircles/view')}
        />
      </ThemedView>
    </ThemedView>
  );
}
